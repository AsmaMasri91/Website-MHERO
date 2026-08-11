import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about MHERO vehicles, financing, and service.",
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
