"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import Link from "next/link";

/**
 * The shop assistant.
 *
 * Answers stream in, so the first words appear in well under a second rather
 * than the visitor watching a spinner for the whole reply.
 *
 * The transcript lives in component state only — it is never written to
 * localStorage and never reaches our database. What the visitor typed goes to
 * Google to answer the question and nowhere else, which is what the privacy
 * notice says, and keeping it out of storage is what makes that true.
 */

type Msg = { role: "user" | "model"; text: string };

const OPENERS = [
  "Which printer for a home office?",
  "Cheapest running cost?",
  "What ink fits a Smart Tank?",
];

/** Enough to tell one browser tab from another for rate limiting. Not identity. */
const newConversationId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Renders the model's markdown links and bold as HTML, and nothing else.
 *
 * Escapes first, then re-introduces exactly two constructs. The model is told
 * to emit markdown links, but its output is still untrusted text arriving over
 * the network — so this never uses dangerouslySetInnerHTML on raw output, and
 * only same-site paths become links.
 */
function Rendered({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\((\/[^)\s]*)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      nodes.push(
        <Link key={key++} href={m[2]} className="font-medium text-jet-primary underline underline-offset-2">
          {m[1]}
        </Link>,
      );
    } else if (m[3]) {
      nodes.push(<strong key={key++}>{m[3]}</strong>);
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const convoId = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!convoId.current) convoId.current = newConversationId();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || busy) return;

      const next: Msg[] = [...messages, { role: "user", text }];
      setMessages([...next, { role: "model", text: "" }]);
      setInput("");
      setBusy(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: next, conversationId: convoId.current }),
        });

        if (!res.ok || !res.body) {
          const { error } = (await res.json().catch(() => ({}))) as { error?: string };
          setMessages([
            ...next,
            { role: "model", text: error ?? "Something went wrong. Please call +91 98149 58295." },
          ]);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          // Replace the trailing placeholder each tick so the text grows.
          setMessages([...next, { role: "model", text: acc }]);
        }
        if (!acc.trim()) {
          setMessages([...next, { role: "model", text: "Sorry — I didn't catch that. Try again?" }]);
        }
      } catch {
        setMessages([
          ...next,
          { role: "model", text: "Couldn't reach the assistant. Please call +91 98149 58295." },
        ]);
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [messages, busy],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close the assistant" : "Ask about our products"}
        // Sits directly above the WhatsApp button, which owns bottom-6/right-6
        // on most pages. Same right edge so the two read as one stack.
        className="fixed bottom-24 right-6 z-[80] grid h-14 w-14 place-items-center rounded-full bg-jet-primary text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-jet-primary md:bottom-28 md:right-8"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label="Product assistant"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-44 right-4 z-[80] flex h-[min(560px,calc(100dvh-14rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-jet-border bg-jet-bg-card shadow-2xl md:bottom-48 md:right-8"
          >
            <header className="shrink-0 border-b border-jet-border bg-jet-primary px-5 py-4">
              <h2 className="font-bold text-white">Ask Jetage</h2>
              <p className="text-xs text-white/80">
                Answers come from our own catalogue and prices.
              </p>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.length === 0 ? (
                <div>
                  <p className="text-sm leading-relaxed text-jet-text-dim">
                    Hello — I can help you pick a printer or cartridge, and explain how ordering
                    works. What are you looking for?
                  </p>
                  <ul className="mt-4 space-y-2">
                    {OPENERS.map((q) => (
                      <li key={q}>
                        <button
                          type="button"
                          onClick={() => send(q)}
                          className="w-full rounded-xl border border-jet-border px-3.5 py-2.5 text-left text-sm text-jet-text-dim transition-colors hover:border-jet-primary/40 hover:text-jet-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jet-primary"
                        >
                          {q}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-jet-primary text-white"
                          : "bg-jet-bg-elevated text-jet-text"
                      }`}
                    >
                      {m.role === "model" && !m.text ? (
                        <Loader2 className="h-4 w-4 animate-spin text-jet-text-muted" aria-label="Thinking" />
                      ) : m.role === "model" ? (
                        <Rendered text={m.text} />
                      ) : (
                        m.text
                      )}
                    </div>
                  </div>
                ))
              )}
              {/* Announces streamed replies to a screen reader, which would
                  otherwise never be told the text arrived. */}
              <div aria-live="polite" className="sr-only">
                {busy ? "Assistant is replying" : messages.at(-1)?.role === "model" ? messages.at(-1)?.text : ""}
              </div>
            </div>

            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                send(input);
              }}
              className="shrink-0 border-t border-jet-border p-3"
            >
              <div className="flex gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Your question
                </label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={1000}
                  placeholder="Ask about a product…"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-xl border border-jet-border bg-jet-bg px-3.5 py-2.5 text-sm text-jet-text placeholder:text-jet-text-muted focus:border-jet-primary focus:outline-none focus:ring-2 focus:ring-jet-primary"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-jet-primary text-white transition-colors hover:bg-jet-primary-dim disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-jet-primary"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              {/* Said plainly and up front, because it is true and because a
                  visitor cannot consent to something they were not told. */}
              <p className="mt-2 px-1 text-[11px] leading-snug text-jet-text-muted">
                An AI assistant — it can be wrong, so check anything important with us. Your
                messages go to Google to generate the reply. Don&rsquo;t type card details or
                personal information.{" "}
                <Link href="/privacy/" className="underline hover:text-jet-primary">
                  Privacy
                </Link>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
