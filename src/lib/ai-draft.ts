import "server-only";
import { allow } from "@/lib/rate-limit";
import { outputTextOf, type InteractionResponse } from "@/lib/interaction-response";

/**
 * Drafting help for whoever is writing catalogue and blog copy.
 *
 * Non-streaming, unlike the shop assistant: these are short pieces and the
 * editor is going to read the whole thing before accepting it anyway, so
 * streaming would add machinery for no benefit.
 *
 * The hard rule across every prompt is **do not invent facts**. A product
 * description that hallucinates a duplex unit or a page yield ends up on a
 * page a customer buys from, and then in the assistant's grounding context,
 * where it becomes something the chatbot repeats to everyone. Wrong copy here
 * propagates further than wrong copy usually does.
 */

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

export type DraftKind =
  | "product-description"
  | "product-features"
  | "blog-excerpt"
  | "meta-description"
  | "blog-polish"
  | "blog-outline";

const BRIEFS: Record<DraftKind, string> = {
  "product-description":
    "Write a product description of 2–3 sentences. Say what it is, who it suits, " +
    "and the one thing that makes it worth buying. No marketing superlatives, no " +
    "exclamation marks, no 'unleash' or 'elevate'. Plain British-Indian English.",

  "product-features":
    "Write 5–7 short feature bullets, one per line, no bullet characters or " +
    "numbering — just one feature per line. Three to six words each. Concrete " +
    "specifics only, drawn from the details given.",

  "blog-excerpt":
    "Write a single sentence, under 30 words, that says what the reader will get " +
    "from this article. No teasing, no 'read on to discover'.",

  "meta-description":
    "Write a search-result description under 155 characters. State plainly what " +
    "the page is about and include the most likely search term naturally.",

  "blog-polish":
    "Improve the writing without changing the meaning, the facts, the structure " +
    "or the headings. Tighten sentences, cut filler, fix grammar. Keep it in " +
    "markdown. Do not add new claims, new sections, or a conclusion that was not " +
    "already there. Return the full text.",

  "blog-outline":
    "Write a markdown outline: an H2 for each section with one line under it " +
    "saying what that section covers. Six to nine sections. No introduction or " +
    "conclusion boilerplate — sections that answer real questions.",
};

const SYSTEM = `You write copy for Jetage India, an authorised HP dealer in Chandigarh
trading since 1989. The audience is Indian buyers — home users, small offices and
businesses — shopping for printers, ink, toner and computer accessories.

Rules:
- Use ONLY the facts given to you. Never invent a specification, a page yield, a
  price, a warranty length, a speed or a feature. If a detail is missing, write
  around it rather than guessing. Wrong copy here reaches the product page and
  then the site's chatbot, which repeats it.
- Prices are in rupees and include GST. Delivery is free.
- Plain, calm, specific. No superlatives, no hype, no exclamation marks, no
  "unleash", "elevate", "game-changing", "seamless".
- Indian English spelling and conventions.
- Return ONLY the requested text. No preamble, no "Here is", no surrounding
  quotes, no markdown code fences.`;

/**
 * Returns drafted text, or an error message safe to show an editor.
 *
 * Never throws: this is a convenience button in a form, and a failed draft must
 * not lose whatever the editor has already typed.
 */
export async function draft(
  kind: DraftKind,
  facts: string,
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  if (!process.env.GEMINI_API_KEY) {
    return { ok: false, error: "AI drafting needs GEMINI_API_KEY to be set." };
  }
  if (!BRIEFS[kind]) return { ok: false, error: "Unknown draft type." };
  if (!facts.trim()) {
    return { ok: false, error: "Fill in the name and a few details first, then try again." };
  }

  // Shared across the whole admin, not per editor: this spends real quota and
  // there are only ever a couple of people in here.
  if (!(await allow("ai-draft:admin", 60, 120))) {
    return { ok: false, error: "Too many drafts in the last hour. Try again shortly." };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        model: MODEL,
        system_instruction: SYSTEM,
        input: `${BRIEFS[kind]}\n\n--- What you know ---\n${facts.slice(0, 8000)}`,
        generation_config: { temperature: 0.6 },
      }),
    });

    if (!res.ok) {
      console.error("[ai-draft]", res.status, await res.text().catch(() => ""));
      return { ok: false, error: "The AI didn't respond. Try again in a moment." };
    }

    const data = (await res.json()) as InteractionResponse;
    const text = outputTextOf(data);

    if (!text) {
      console.error("[ai-draft] no text in response", JSON.stringify(data).slice(0, 500));
      return { ok: false, error: "The AI returned nothing usable." };
    }

    // Models wrap prose in fences often enough to be worth stripping here
    // rather than making an editor delete them by hand every time.
    return { ok: true, text: text.replace(/^```[a-z]*\n?|\n?```$/g, "").trim() };
  } catch (err) {
    console.error("[ai-draft] request failed", err);
    return { ok: false, error: "Couldn't reach the AI. Check the connection." };
  }
}
