"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import RegisterInterestForm from "@/components/forms/RegisterInterestForm";

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

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RegisterInterestDialog({ onClose }: { onClose: () => void }) {
  const { dict } = useLocale();
  const t = dict.registerInterest;
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // showModal() gives focus trapping, Escape to close and an inert page behind.
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // Only a click on the backdrop targets the dialog element itself.
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto bg-white p-0 text-mhero-black shadow-2xl backdrop:bg-black/70"
    >
      <div className="flex min-h-[32rem] flex-col gap-6 p-6 sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 id={titleId} className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t.title}
            </h2>
            <p className="text-sm text-mhero-steel">{t.description}</p>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={t.close}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-mhero-fog text-mhero-black hover:border-mhero-black"
          >
            ✕
          </button>
        </div>
        <RegisterInterestForm />
      </div>
    </dialog>
  );
}

export default function FloatingActions() {
  const { dict } = useLocale();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 end-6 z-40 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          aria-label={dict.registerInterest.title}
          aria-haspopup="dialog"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-mhero-black text-white shadow-lg transition-transform hover:scale-105"
        >
          <MailIcon />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute end-full me-3 whitespace-nowrap bg-mhero-black px-3 py-2 text-xs font-semibold opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            {dict.registerInterest.title}
          </span>
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

      {formOpen && <RegisterInterestDialog onClose={() => setFormOpen(false)} />}
    </>
  );
}
