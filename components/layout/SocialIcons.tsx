import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaTiktok } from "react-icons/fa";

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/mherouae", Icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com/mherouae/", Icon: FaInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/alghurair-mobility/", Icon: FaLinkedinIn },
  { label: "YouTube", href: "https://www.youtube.com/@mherouae", Icon: FaYoutube },
  { label: "TikTok", href: "https://www.tiktok.com/@mherouae", Icon: FaTiktok },
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
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-[#8fb5a6] hover:text-[#8fb5a6]"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
