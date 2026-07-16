import Image from "next/image";
import Link from "next/link";

const FOOTER_LINKS = [
  {
    label: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Docs", href: "/docs" },
      { label: "About", href: "/about" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Commands", href: "/docs/commands" },
      { label: "Configuration", href: "/docs/config" },
      { label: "Providers", href: "/docs/providers" },
      { label: "FAQ", href: "/docs#faq" },
    ],
  },
  {
    label: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/abhilov23/Kairo-CLI-Project" },
      { label: "NPM", href: "https://www.npmjs.com/package/@abhilov/kairo" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/logo.png"
                alt="Kairo"
                width={36}
                height={36}
                className="rounded-lg transition-all duration-200 group-hover:opacity-80 invert dark:invert-0"
                style={{ width: "auto", height: "auto" }}
              />
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Kairo
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-[200px]">
              Your AI teammate in the terminal.
            </p>
            <p className="mt-4 text-xs text-muted-foreground/50">
              MIT License &middot; {new Date().getFullYear()}
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.label}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </h4>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
