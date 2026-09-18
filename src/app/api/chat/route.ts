import { after } from "next/server";
import { buildChatContext, systemInstruction } from "@/lib/chat-context";
import { allow } from "@/lib/rate-limit";

/**
 * The shop assistant, backed by Gemini.
 *
 * No SDK: this is one POST and an SSE stream to parse. `@google/genai` would
 * add a dependency to wrap `fetch`.
 *
 * The conversation is sent in full on every turn rather than using
 * `previous_interaction_id`. That keeps the transcript stateless on our side
 * and, more to the point, means Google is not asked to retain a conversation
 * against an id — which would be another store of visitor data to disclose
 * under the DPDP notice and to reason about deleting.
 *
 * Degrades to a 503 with a readable message when no key is set, so the widget
 * can tell the visitor to phone the showroom instead of failing silently.
 */

// Node, not edge: `chat-context` reads Neon through the same cached helpers
// the rest of the site uses.
export const runtime = "nodejs";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse";

/** Long enough for a real question, short enough that nobody pastes a novel. */
const MAX_CHARS = 1000;
/** Turns kept. Older ones fall off — the catalogue, not the chat, is the context. */
const MAX_TURNS = 12;

type Msg = { role: "user" | "model"; text: string };

const isMsg = (v: unknown): v is Msg =>
  !!v &&
  typeof v === "object" &&
  (v as Msg).role !== undefined &&
  ["user", "model"].includes((v as Msg).role) &&
  typeof (v as Msg).text === "string";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "Chat isn't switched on yet. Please call +91 98149 58295." },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | { messages?: unknown; conversationId?: unknown }
    | null;

  const raw = Array.isArray(body?.messages) ? body.messages : [];
  const messages = raw.filter(isMsg).slice(-MAX_TURNS);
  const last = messages.at(-1);

  if (!last || last.role !== "user" || !last.text.trim()) {
    return Response.json({ error: "No question was sent." }, { status: 400 });
  }
  if (last.text.length > MAX_CHARS) {
    return Response.json(
      { error: `That's a bit long — please keep it under ${MAX_CHARS} characters.` },
      { status: 400 },
    );
  }

  // Two limits, doing different jobs.
  //
  // The per-conversation one is courtesy: the id comes from the browser so a
  // determined abuser rotates it, but it stops a runaway loop or a bored
  // visitor. The global one is the real protection — it is the only thing
  // standing between a scripted client and the whole day's Gemini quota, and
  // it holds no matter how many conversation ids someone invents.
  const convo = typeof body?.conversationId === "string" ? body.conversationId.slice(0, 64) : "anon";
  if (!(await allow(`chat:convo:${convo}`, 60, 30))) {
    return Response.json(
      { error: "That's a lot of questions. Give it a minute, or call +91 98149 58295." },
      { status: 429 },
    );
  }
  // 500 was a guess, and it was 25x the real ceiling: the free tier allows 20
  // requests per day for this model, so this limiter never once fired and the
  // quota was always spent by Gemini rather than guarded by us. The difference
  // matters to a visitor — tripping this returns the counter's phone number,
  // where running into Google's limit returned an apology for a failure we had
  // not noticed.
  //
  // Note the CMS's "Draft with AI" spends from the same 20, on the same key and
  // model, so a busy afternoon in /admin can close the chat for the day.
  const dailyCap = Number(process.env.GEMINI_DAILY_CAP ?? 20);
  if (!(await allow("chat:global", 1440, dailyCap))) {
    console.warn("[chat] daily cap reached");
    return Response.json(
      { error: "Our assistant is resting for today. Please call +91 98149 58295." },
      { status: 429 },
    );
  }

  // This endpoint has three places it can be slow — the catalogue query, the
  // upstream handshake, and however long Gemini thinks before its first word —
  // and from outside they are indistinguishable. Timing each one costs a log
  // line and is the difference between fixing it and guessing at it.
  const t0 = Date.now();
  const context = await buildChatContext();
  const msContext = Date.now() - t0;

  // The whole exchange as a transcript. `Visitor:` / `Assistant:` labels keep
  // the roles legible to the model without a separate turns array.
  const transcript =
    messages
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.text.trim()}`)
      .join("\n\n") + "\n\nAssistant:";

  let upstream: Response;
  const tUpstream = Date.now();
  try {
    upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        system_instruction: systemInstruction(context),
        input: transcript,
        stream: true,
        // Low temperature on purpose: this quotes prices. Invention is the
        // failure mode that costs money, not dullness.
        //
        // `thinking_level` defaults to "high" on Gemini 3 Flash. This was not
        // what made the widget look dead — that was an unhandled rate-limit
        // event, and setting this changed nothing measurable. It stays on its
        // own merits: the whole catalogue is already in the context window, so
        // answering is retrieval and paraphrase rather than deduction, and deep
        // reasoning is latency bought for nothing.
        generation_config: { temperature: 0.3, thinking_level: "low" },
      }),
    });
  } catch (err) {
    console.error("[chat] could not reach Gemini", err);
    return Response.json({ error: "Couldn't reach the assistant. Please try again." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    // Body is logged, never returned: an upstream error can name the model,
    // the project, or the reason a key was rejected.
    console.error("[chat] Gemini returned", upstream.status, await upstream.text().catch(() => ""));
    return Response.json({ error: "The assistant is unavailable right now." }, { status: 502 });
  }

  // Re-emit as plain text chunks. The browser only needs the words, and
  // forwarding Gemini's event envelope would leak its internals — including
  // thought summaries, which are not for the visitor.
  const msHeaders = Date.now() - tUpstream;
  let msFirstText = -1;
  // Two minutes pass between the headers and the first word. Either Gemini is
  // streaming something we drop on the floor the whole time, or it is sending
  // nothing at all — and those want opposite fixes, so count what arrives.
  let msFirstFrame = -1;
  const seen = new Map<string, number>();

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE frames are separated by a blank line.
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";

          let failed = false;
          for (const frame of frames) {
            const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
            if (!dataLine) continue;
            const payload = dataLine.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            if (msFirstFrame < 0) msFirstFrame = Date.now() - tUpstream;

            try {
              const evt = JSON.parse(payload) as {
                event_type?: string;
                delta?: { type?: string; text?: string };
              };
              if (msFirstText < 0) {
                const k = `${evt.event_type ?? "?"}/${evt.delta?.type ?? "-"}`;
                seen.set(k, (seen.get(k) ?? 0) + 1);
              }

              // Gemini reports mid-stream failures as an event, not as a bad
              // status — the handshake has already succeeded by then. Ignoring
              // it is what produced an empty 200 for the visitor and, when the
              // socket was left open, a function that ran to the 300s ceiling.
              // The payload is logged and never forwarded: it can name the
              // model, the project, or why a key was rejected.
              if (evt.event_type === "error") {
                console.error("[chat] Gemini error event", payload.slice(0, 500));
                if (msFirstText < 0) {
                  controller.enqueue(
                    encoder.encode(
                      "Sorry — I could not reach the assistant just then. Please try again, or call +91 98149 58295.",
                    ),
                  );
                }
                failed = true;
                break;
              }
              // Only the model's actual words. `thought_summary` deltas are
              // the model reasoning aloud and would confuse a shopper.
              if (evt.event_type === "step.delta" && evt.delta?.type === "text" && evt.delta.text) {
                if (msFirstText < 0) msFirstText = Date.now() - tUpstream;
                controller.enqueue(encoder.encode(evt.delta.text));
              }
            } catch {
              // A partial frame at a chunk boundary. Skip it; the next read
              // completes it.
            }
          }
          if (failed) break;
        }
      } catch (err) {
        console.error("[chat] stream broke", err);
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  // after() fires once the response has finished, so msFirstText is settled.
  after(() =>
    console.log(
      `[chat] answered a question (${messages.length} turns) ` +
        `context=${msContext}ms headers=${msHeaders}ms ` +
        `first-frame=${msFirstFrame}ms first-text=${msFirstText}ms ` +
        `before-text=${JSON.stringify(Object.fromEntries(seen))}`,
    ),
  );

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      // Vercel and some proxies buffer otherwise, which turns a stream into
      // one lump arriving at the end.
      "x-accel-buffering": "no",
    },
  });
}
