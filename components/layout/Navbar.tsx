"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchBox from "@/components/layout/SearchBox";
import LanguageToggle from "@/components/layout/LanguageToggle";
import ModelsMegaMenu from "@/components/layout/ModelsMegaMenu";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function Navbar() {
  const { dict } = useLocale();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileModelsOpen, setMobileModelsOpen] = useState(false);
  const [mobileDiscoverOpen, setMobileDiscoverOpen] = useState(false);
  const [modelsMenuOpen, setModelsMenuOpen] = useState(false);
  const [discoverMenuOpen, setDiscoverMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openModelsMenu = () => {
    clearCloseTimeout();
    setModelsMenuOpen(true);
  };

  const scheduleCloseModelsMenu = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => setModelsMenuOpen(false), 200);
  };

  const modelsLinks = [
    { label: dict.nav.modelsLinks.model1, href: "/models/mhero-1" },
    { label: dict.nav.modelsLinks.model2, href: "/models/mhero-2" },
    { label: dict.nav.modelsLinks.model2Terrain, href: "/models/mhero-2-terrain" },
    { label: dict.nav.bookTestDrive, href: "/models/test-drive" },
    { label: dict.nav.compareModels, href: "/models/compare" },
    { label: dict.nav.financeCalculator, href: "/models/finance-calculator" },
  ];

  const discoverLinks = [
    { label: dict.nav.discoverLinks.about, href: "/discover/about" },
    { label: dict.nav.discoverLinks.news, href: "/discover/news" },
    { label: dict.nav.discoverLinks.blog, href: "/discover/blog" },
  ];

  const topLevelLinks = [
    { label: dict.nav.offers, href: "/offers" },
    { label: dict.nav.afterSales, href: "/after-sales" },
    { label: dict.nav.preOwned, href: "/pre-owned" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => clearCloseTimeout, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!modelsMenuOpen && !discoverMenuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-nav-dropdown]")) {
        setModelsMenuOpen(false);
        setDiscoverMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [modelsMenuOpen, discoverMenuOpen]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-mhero-black/95 backdrop-blur-md transition-shadow duration-500 ease-premium ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="container-mhero flex h-20 items-center justify-between">
        {/* Logo top-left */}
        <Link href="/" className="shrink-0" aria-label="MHERO home">
          <Image
            src="/images/mhero-logo.png"
            alt="MHERO"
            width={392}
            height={79}
            priority
            className="h-9 w-auto sm:h-11 md:h-12"
          />
        </Link>

        {/* Nav links (right) */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          <div
            className="group relative flex h-20 items-center"
            data-nav-dropdown
            onMouseEnter={openModelsMenu}
            onMouseLeave={scheduleCloseModelsMenu}
          >
            <button
              onClick={() => setModelsMenuOpen((v) => !v)}
              aria-expanded={modelsMenuOpen}
              aria-current={isActive("/models") ? "page" : undefined}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white ${
                isActive("/models") ? "text-white" : "text-white/90"
              }`}
            >
              {dict.nav.models}
              <ChevronDown open={modelsMenuOpen} />
            </button>
            <span
              className={`absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-[#8fb5a6] transition-transform duration-300 group-hover:scale-x-100 ${
                isActive("/models") ? "scale-x-100" : ""
              }`}
            />
            <ModelsMegaMenu
              open={modelsMenuOpen}
              onNavigate={() => setModelsMenuOpen(false)}
              onMouseEnter={openModelsMenu}
              onMouseLeave={scheduleCloseModelsMenu}
            />
          </div>

          {topLevelLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`group relative flex h-20 items-center text-sm font-medium hover:text-white ${
                isActive(link.href) ? "text-white" : "text-white/90"
              }`}
            >
              {link.label}
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-[#8fb5a6] transition-transform duration-300 group-hover:scale-x-100 ${
                  isActive(link.href) ? "scale-x-100" : ""
                }`}
              />
            </Link>
          ))}

          <div
            className="group relative flex h-20 items-center"
            data-nav-dropdown
          >
            <button
              onClick={() => setDiscoverMenuOpen((v) => !v)}
              aria-expanded={discoverMenuOpen}
              aria-current={isActive("/discover") ? "page" : undefined}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-white ${
                isActive("/discover") ? "text-white" : "text-white/90"
              }`}
            >
              {dict.nav.discover}
              <ChevronDown open={discoverMenuOpen} />
            </button>
            <span
              className={`absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 bg-[#8fb5a6] transition-transform duration-300 group-hover:scale-x-100 ${
                isActive("/discover") ? "scale-x-100" : ""
              }`}
            />
            <DropdownPanel
              links={discoverLinks}
              open={discoverMenuOpen}
              onNavigate={() => setDiscoverMenuOpen(false)}
            />
          </div>
        </nav>

        {/* Right cluster: search, language, book a test drive */}
        <div className="hidden items-center gap-4 lg:flex">
          <SearchBox />
          <LanguageToggle />
          <Link href="/models/test-drive" className="btn-primary">
            {dict.nav.bookTestDrive}
          </Link>
        </div>

        {/* Mobile menu button (right on mobile) */}
        <div className="flex items-center gap-1 lg:hidden">
          <SearchBox />
          <button
            className="flex items-center gap-2 p-2 text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="hidden text-sm font-semibold uppercase tracking-widest2 sm:inline">
              {dict.nav.menu}
            </span>
            <BurgerIcon />
          </button>
        </div>
      </div>
    </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-mhero-black lg:hidden"
          >
            <div className="container-mhero flex h-20 items-center justify-between">
              <Image
                src="/images/mhero-logo.png"
                alt="MHERO"
                width={392}
                height={79}
                className="h-9 w-auto"
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-sm font-semibold uppercase tracking-widest2 text-white"
              >
                {dict.nav.close} ✕
              </button>
            </div>
            <nav className="container-mhero flex flex-col gap-2 pb-10 pt-4">
              <MobileAccordion
                label={dict.nav.models}
                open={mobileModelsOpen}
                setOpen={setMobileModelsOpen}
                links={modelsLinks}
                onNavigate={() => setMobileOpen(false)}
              />
              {topLevelLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-white/10 py-4 text-lg font-medium text-white"
                >
                  {link.label}
                </Link>
              ))}
              <MobileAccordion
                label={dict.nav.discover}
                open={mobileDiscoverOpen}
                setOpen={setMobileDiscoverOpen}
                links={discoverLinks}
                onNavigate={() => setMobileOpen(false)}
              />
              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="/models/test-drive"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-center"
                >
                  {dict.nav.bookTestDrive}
                </Link>
                <LanguageToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DropdownPanel({
  links,
  open,
  onNavigate,
}: {
  links: { label: string; href: string }[];
  open: boolean;
  onNavigate: () => void;
}) {
  if (!open) return null;

  return (
    <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-3 rounded-2xl border border-white/10 bg-mhero-charcoal p-2 shadow-2xl">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="block rounded-xl px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function MobileAccordion({
  label,
  open,
  setOpen,
  links,
  onNavigate,
}: {
  label: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  links: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-lg font-medium text-white"
      >
        {label}
        <span
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDown />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pb-4 ps-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className="py-2 text-base text-white/70 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronDown({ open = false }: { open?: boolean }) {
  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <path d="M0 1H22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M0 13H22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
