"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DOCS_SECTIONS = [
  {
    label: "Getting Started",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs#installation" },
      { label: "Quick Start", href: "/docs#quick-start" },
    ],
  },
  {
    label: "Commands",
    links: [
      { label: "Overview", href: "/docs/commands" },
      { label: "kairo chat", href: "/docs/commands#chat" },
      { label: "kairo models", href: "/docs/commands#models" },
      { label: "kairo config", href: "/docs/commands#config" },
      { label: "kairo help", href: "/docs/commands#help" },
    ],
  },
  {
    label: "Configuration",
    links: [
      { label: "Overview", href: "/docs/config" },
      { label: "Providers", href: "/docs/config#providers" },
      { label: "Settings", href: "/docs/config#settings" },
      { label: "Environment", href: "/docs/config#environment" },
    ],
  },
  {
    label: "Providers",
    links: [
      { label: "Overview", href: "/docs/providers" },
      { label: "OpenAI", href: "/docs/providers#openai" },
      { label: "Anthropic", href: "/docs/providers#anthropic" },
      { label: "Google", href: "/docs/providers#google" },
      { label: "Local Models", href: "/docs/providers#local" },
    ],
  },
  {
    label: "More",
    links: [
      { label: "FAQ", href: "/docs#faq" },
      { label: "Examples", href: "/docs#examples" },
      { label: "Troubleshooting", href: "/docs#troubleshooting" },
    ],
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-6">
        {DOCS_SECTIONS.map((section) => (
          <div key={section.label}>
            <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.label}
            </h4>
            <ul className="space-y-0.5">
              {section.links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href.endsWith("/docs") && pathname === "/docs");
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={cn(
                        "block rounded-md px-3 py-1 text-sm transition-colors",
                        isActive
                          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
