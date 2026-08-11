import type { Metadata } from "next";
import { Figtree, Almarai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getServerLocale } from "@/lib/i18n/server";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const almarai = Almarai({
  subsets: ["arabic"],
  variable: "--font-almarai",
  display: "swap",
  weight: ["300", "400", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mhero.com"),
  title: {
    default: "MHERO | Engineered for the Extraordinary",
    template: "%s | MHERO",
  },
  description:
    "MHERO is a premium automotive brand engineering the next generation of performance SUVs and sedans.",
  openGraph: {
    title: "MHERO",
    description:
      "MHERO is a premium automotive brand engineering the next generation of performance SUVs and sedans.",
    siteName: "MHERO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getServerLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${figtree.variable} ${almarai.variable}`}>
      <body className={locale === "ar" ? "font-arabic" : "font-sans"}>
        <LocaleProvider locale={locale}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-mhero-accent focus:px-5 focus:py-3 focus:text-mhero-black"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
          <FloatingActions />
        </LocaleProvider>
      </body>
    </html>
  );
}
