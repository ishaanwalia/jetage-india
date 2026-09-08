"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Send, Loader2, Phone, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * Every floating contact action, in one component.
 *
 * It is one component because the previous arrangement was two — a WhatsApp
 * button imported separately into thirteen pages, and a chat button mounted
 * globally — each positioning itself against the same corner with no knowledge
 * of the other. They drifted out of alignment, they opened two competing
 * panels, and the WhatsApp one was missing from checkout, compare and the
 * finder because those pages never imported it. One owner for the corner fixes
 * all three at once.
 *
 * Each action does one thing: WhatsApp opens WhatsApp, Call dials, Ask opens
 * the assistant. The old WhatsApp panel offered a menu of canned messages,
 * which is friction in front of a link — and the assistant now answers those
 * questions properly.
 */

const PHONE = "+919814958295";
const WHATSAPP = "919814958295";

type Msg = { role: "user" | "model"; text: string };

const OPENERS = [
  "Which printer for a home office?",
  "Cheapest running cost?",
  "What ink fits a Smart Tank?",
];

/** Enough to tell one browser tab from another for rate limiting. Not identity. */
const newConversationId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** The real WhatsApp glyph. Lucide has no brand marks, and the MessageCircle
 *  that stood in for it read as a generic speech bubble. */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  );
}

/**
 * Renders the model's markdown links and bold, and nothing else.
 *
 * Built as React nodes rather than an HTML string: the model's output is
 * untrusted text off the network, so it never goes near
 * dangerouslySetInnerHTML, and only same-site paths are allowed to be links.
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

/**
 * A dock action. Collapsed to a circle; the label grows out to the left on
 * hover or keyboard focus, so the icon alone never has to carry the meaning.
 */
function DockAction({
  label, href, onClick, tone, children, delay, external,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  tone: "whatsapp" | "phone" | "ask";
  children: React.ReactNode;
  delay: number;
  external?: boolean;
}) {
  const reduce = useReducedMotion();
  const tones = {
    whatsapp: "bg-jet-whatsapp text-white hover:bg-[#1da851]",
    // A ring, not a border: these buttons are sized by their inner icon box,
    // so a 1px border makes this one 58px in a stack of 56s.
    phone: "bg-jet-bg-card text-jet-primary ring-1 ring-inset ring-jet-border hover:ring-jet-primary/50",
    ask: "bg-gradient-to-br from-jet-primary to-jet-primary-dim text-white hover:from-jet-accent hover:to-jet-primary",
  }[tone];

  const inner = (
    <>
      {/* max-w drives the reveal, so there is nothing to lay out when closed
          and the label never widens the tap target on touch.
          aria-hidden because the control carries the same text as an
          aria-label — a clipped, zero-opacity span is not a name to rely on. */}
      <span
        aria-hidden
        className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width,opacity,padding] duration-300 ease-out opacity-0 group-hover:max-w-[12rem] group-hover:pl-4 group-hover:opacity-100 group-focus-visible:max-w-[12rem] group-focus-visible:pl-4 group-focus-visible:opacity-100"
      >
        {label}
      </span>
      <span className="grid h-14 w-14 shrink-0 place-items-center">{children}</span>
    </>
  );

  const className =
    `group flex items-center justify-end rounded-full shadow-lg transition-all duration-300 ` +
    `active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ` +
    `focus-visible:ring-jet-primary ${tones}`;

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      // Drops toward the toggle on the way out, so opening the chat reads as
      // these folding back into it rather than blinking off.
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.8 }}
      // Staggered, bottom-up. The set reads as one object arriving rather than
      // three things appearing at once.
      transition={{ delay: reduce ? 0 : delay, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-end"
    >
      {href ? (
        <a
          href={href}
          aria-label={label}
          className={className}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} aria-label={label} className={className}>
          {inner}
        </button>
      )}
    </motion.li>
  );
}

export function ContactDock() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const convoId = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

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
        // Trailing slash matters: next.config sets trailingSlash, so the bare
        // path 308s and the stream pays an extra round trip to get here.
        const res = await fetch("/api/chat/", {
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
      {/* One stack, one right edge, one z-index. */}
      <ul className="fixed bottom-6 right-4 z-[80] flex flex-col items-end gap-3 md:right-6">
        {/* Both step aside while the chat is open: the panel wants that column,
            and a stack of call-to-actions competing with an open conversation
            is just clutter. They come straight back on close. */}
        <AnimatePresence>
          {!open && (
            <>
              <DockAction
                key="phone"
                label="Call the showroom"
                href={`tel:${PHONE}`}
                tone="phone"
                delay={0.05}
              >
                <Phone className="h-5 w-5" aria-hidden />
              </DockAction>

              <DockAction
                key="whatsapp"
                label="Chat on WhatsApp"
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Jetage, I'd like some help choosing a product.")}`}
                tone="whatsapp"
                delay={0.12}
                external
              >
                <WhatsAppGlyph className="h-6 w-6" />
              </DockAction>
            </>
          )}
        </AnimatePresence>

        <li className="flex justify-end">
          <motion.button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="chat-panel"
            aria-label={open ? "Close the assistant" : "Ask Jetage — AI product assistant"}
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: reduce ? 0 : 0.19, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex items-center justify-end rounded-full bg-gradient-to-br from-jet-primary to-jet-primary-dim text-white shadow-lg transition-all duration-300 hover:from-jet-accent hover:to-jet-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-jet-primary"
          >
            {/* One slow halo, purely to say "this is new". Ring only, so it
                costs no layout, and reduced-motion drops it entirely. */}
            {!open && !reduce && (
              <span className="pointer-events-none absolute right-0 h-14 w-14 animate-ping rounded-full bg-jet-primary/25 [animation-duration:3s]" />
            )}
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width,opacity,padding] duration-300 ease-out opacity-0 group-hover:max-w-[12rem] group-hover:pl-4 group-hover:opacity-100 group-focus-visible:max-w-[12rem] group-focus-visible:pl-4 group-focus-visible:opacity-100">
              {open ? "Close" : "Ask Jetage"}
            </span>
            <span className="relative grid h-14 w-14 shrink-0 place-items-center">
              {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
            </span>
          </motion.button>
        </li>
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            id="chat-panel"
            role="dialog"
            aria-label="Product assistant"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            // Only the toggle is left below it now (56px + gap + bottom
            // offset), so the panel takes the column the other two vacated
            // and gets that height back.
            className="fixed bottom-[6.25rem] right-4 z-[80] flex h-[min(620px,calc(100dvh-9rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-jet-border bg-jet-bg-card shadow-2xl md:right-6"
          >
            <header className="shrink-0 bg-gradient-to-br from-jet-primary to-jet-primary-dim px-5 py-4">
              <h2 className="flex items-center gap-2 font-bold text-white">
                <Sparkles className="h-4 w-4" aria-hidden /> Ask Jetage
              </h2>
              <p className="mt-0.5 text-xs text-white/80">
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
                  <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
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
              {/* Streamed text is invisible to a screen reader otherwise. */}
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
                <label htmlFor="chat-input" className="sr-only">Your question</label>
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
              <p className="mt-2 px-1 text-[11px] leading-snug text-jet-text-muted">
                An AI assistant — it can be wrong, so check anything important with us. Your
                messages go to Google to generate the reply. Don&rsquo;t type card details or
                personal information.{" "}
                <Link href="/privacy/" className="underline hover:text-jet-primary">Privacy</Link>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
