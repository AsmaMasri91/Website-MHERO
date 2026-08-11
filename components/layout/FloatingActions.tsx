"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

const WHATSAPP_NUMBER = "971600540045";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M12 3a9 9 0 00-7.75 13.5L3 21l4.65-1.22A9 9 0 1012 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.7 8.4c.15-.35.35-.35.55-.36h.4c.15 0 .33-.02.5.4.2.5.7 1.7.75 1.8.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.3-.36.4-.12.12-.24.24-.1.48.14.24.6 1 1.3 1.6.9.78 1.6 1.02 1.86 1.14.25.12.4.1.55-.06.15-.16.63-.72.8-.98.16-.24.32-.2.53-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.6-.14 1.18-.2.58-1.15 1.12-1.6 1.18-.42.06-.94.08-1.5-.1-.35-.1-.8-.26-1.4-.5-2.4-1.05-3.97-3.4-4.1-3.56-.12-.16-.98-1.3-.98-2.48 0-1.18.62-1.75.84-2z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M4 12a8 8 0 1114.2 5.1L19 20l-3.1-.9A8 8 0 014 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

interface ChatMessage {
  from: "bot" | "user";
  text: string;
}

function ChatWidget({ onClose }: { onClose: () => void }) {
  const { locale, dict } = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text:
        locale === "ar"
          ? "مرحبًا! أنا مساعد MHERO الذكي. كيف يمكنني مساعدتك اليوم؟"
          : "Hi! I'm the MHERO assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            locale === "ar"
              ? "شكرًا لتواصلك! هذا مساعد تجريبي — لأسئلة حقيقية يرجى التواصل مع فريقنا عبر صفحة اتصل بنا."
              : "Thanks for reaching out! This is a demo assistant — for real questions, please contact our team via the Contact Us page.",
        },
      ]);
    }, 900);
  };

  return (
    <div className="flex h-[28rem] w-80 flex-col overflow-hidden border border-mhero-fog bg-white shadow-2xl sm:w-96">
      <div className="flex items-center justify-between bg-mhero-black px-4 py-3 text-white">
        <p className="text-sm font-semibold">{dict.chatbot.title}</p>
        <button
          onClick={onClose}
          aria-label={dict.chatbot.close}
          className="flex h-7 w-7 items-center justify-center text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] px-3 py-2 text-sm ${
              m.from === "bot"
                ? "bg-mhero-fog/60 text-mhero-black"
                : "ms-auto bg-mhero-black text-white"
            }`}
          >
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="max-w-[60%] bg-mhero-fog/60 px-3 py-2 text-sm text-mhero-steel">
            {dict.chatbot.typing}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t border-mhero-fog p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={dict.chatbot.placeholder}
          className="input-field-light flex-1"
        />
        <button
          type="submit"
          aria-label={dict.chatbot.send}
          className="flex h-11 w-11 shrink-0 items-center justify-center bg-mhero-black text-white hover:bg-mhero-charcoal"
        >
          →
        </button>
      </form>
    </div>
  );
}

export default function FloatingActions() {
  const { dict } = useLocale();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="fixed bottom-6 end-6 z-40 flex flex-col items-end gap-3">
      {chatOpen && (
        <div className="mb-1">
          <ChatWidget onClose={() => setChatOpen(false)} />
        </div>
      )}

      <button
        onClick={() => setChatOpen((v) => !v)}
        aria-label={chatOpen ? dict.chatbot.close : dict.chatbot.open}
        aria-expanded={chatOpen}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-mhero-black text-white shadow-lg transition-transform hover:scale-105"
      >
        {!chatOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" aria-hidden="true" />
            <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse" aria-hidden="true" />
          </>
        )}
        <span className="relative">{chatOpen ? <span className="text-xl">✕</span> : <ChatIcon />}</span>
      </button>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.chatbot.whatsapp}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
