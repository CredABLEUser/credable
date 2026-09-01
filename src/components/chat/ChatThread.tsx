"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, Gauge, Compass, Microscope } from "lucide-react";
import clsx from "clsx";
import { sendMessage, setRunDepth, startNewQuestionFlow } from "@/lib/actions/runs";
import { Message, Run, StructuredBlock } from "@/lib/types";

const DEPTH_OPTIONS: { key: Run["depth"]; label: string; icon: typeof Gauge }[] = [
  { key: "act", label: "Just tell me", icon: Gauge },
  { key: "explore", label: "Show my options", icon: Compass },
  { key: "deep_dive", label: "Give me the data", icon: Microscope },
];

function Blocks({ blocks }: { blocks?: StructuredBlock[] }) {
  if (!blocks?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {blocks.map((b, i) => {
        if (b.kind === "action") {
          const data = b.data as { label: string; href: string };
          return (
            <Link
              key={i}
              href={data.href}
              className="inline-flex items-center rounded-full bg-brand px-3.5 py-1.5 text-xs font-medium text-white hover:bg-brand-strong"
            >
              {data.label}
            </Link>
          );
        }
        return null;
      })}
    </div>
  );
}

export function ChatThread({ run, initialMessages }: { run: Run; initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [depth, setDepth] = useState(run.depth);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const tmpIdRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    if (!text.trim() || isPending) return;
    tmpIdRef.current += 1;
    const optimistic: Message = {
      id: `tmp_${tmpIdRef.current}`,
      runId: run.id,
      userId: run.userId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setDraft("");
    startTransition(async () => {
      const reply = await sendMessage(run.id, text);
      setMessages((m) => [...m, reply]);
    });
  }

  function changeDepth(next: Run["depth"]) {
    setDepth(next);
    startTransition(async () => {
      await setRunDepth(run.id, next);
    });
  }

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <div className="flex h-[calc(100svh-3rem)] flex-col md:h-svh">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{run.title}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-1 rounded-full border border-border bg-white p-1 sm:flex">
          {DEPTH_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => changeDepth(opt.key)}
              className={clsx(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                depth === opt.key ? "bg-brand text-white" : "text-ink-soft hover:text-ink"
              )}
            >
              <opt.icon size={13} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((m) => (
            <div key={m.id} className={clsx("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={clsx(
                  "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user" ? "bg-brand text-white" : "bg-white border border-border text-ink"
                )}
              >
                {m.content}
                {m.role === "assistant" && <Blocks blocks={m.blocks} />}
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl border border-border bg-white px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/50 [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/50" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/50 [animation-delay:0.2s]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {lastAssistant?.suggestions && lastAssistant.suggestions.length > 0 && !isPending && (
        <div className="mx-auto flex w-full max-w-2xl flex-wrap gap-2 px-5 pb-2">
          {lastAssistant.suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-ink-soft hover:border-brand hover:text-brand-strong"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border bg-white px-5 py-3">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
            rows={1}
            placeholder="Ask a follow-up…"
            className="max-h-32 flex-1 resize-none rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none focus:border-brand"
          />
          <button
            onClick={() => send(draft)}
            disabled={isPending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-strong disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
        <form action={startNewQuestionFlow} className="mx-auto mt-2 max-w-2xl">
          <button type="submit" className="text-xs text-ink-soft underline underline-offset-2 hover:text-ink">
            This is resolved — ask something new
          </button>
        </form>
      </div>
    </div>
  );
}
