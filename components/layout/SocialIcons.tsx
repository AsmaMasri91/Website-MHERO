function Facebook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M15 8.5h-2a1 1 0 00-1 1V12h3l-.4 3H12v7h-3v-7H7v-3h2v-2.2C9 7.9 10.6 6 13.2 6H15v2.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.8" cy="8" r="1.2" fill="currentColor" />
      <path d="M7.8 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M11.5 17v-3.5c0-1.4 1-2.5 2.4-2.5s2.1 1 2.1 2.5V17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11.5 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function YouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="6.5" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" />
    </svg>
  );
}

function TikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M14 4v9.5a2.75 2.75 0 11-2.75-2.75c.26 0 .51.03.75.09V8.4a5.25 5.25 0 105.25 5.25V9.9a6.4 6.4 0 003.5 1.04V8.4a3.6 3.6 0 01-2.75-1.2A3.98 3.98 0 0117 4h-3z"
        fill="currentColor"
      />
    </svg>
  );
}

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/mherouae", Icon: Facebook },
  { label: "Instagram", href: "https://instagram.com/mherouae/", Icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/alghurair-mobility/", Icon: LinkedIn },
  { label: "YouTube", href: "https://www.youtube.com/@mherouae", Icon: YouTube },
  { label: "TikTok", href: "https://www.tiktok.com/@mherouae", Icon: TikTok },
];

export default function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white hover:text-white"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
