"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
  {
    label: "GitHub",
    href: "https://github.com/abhilov23/Kairo-CLI-Project",
    external: true,
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-500",
        isScrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="Kairo"
            width={36}
            height={36}
            className="rounded-lg transition-all duration-200 group-hover:opacity-80 group-hover:scale-105 invert dark:invert-0"
            style={{ width: "auto", height: "auto" }}
          />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Kairo
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              {link.external && <ExternalLink className="h-3 w-3" />}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Desktop Auth */}
          <div className="hidden items-center gap-1.5 md:flex">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 rounded-md px-3 text-sm font-normal text-muted-foreground hover:text-foreground"
            >
              <a href="/login">
                Log in
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-8 rounded-md bg-foreground text-background hover:bg-foreground/90 px-3.5 text-sm font-medium shadow-sm"
            >
              <a href="/signup">
                Sign up
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                  {link.external && <ExternalLink className="h-3 w-3" />}
                </a>
              ))}
              <div className="mt-2 border-t border-border pt-3 space-y-2">                  <Button
                    asChild
                    variant="ghost"
                    size="default"
                    className="w-full h-9 rounded-md text-sm font-normal"
                  >
                    <a href="/login">
                      Log in
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="default"
                    className="w-full h-9 rounded-md bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
                  >
                    <a href="/signup">
                      Sign up
                    </a>
                  </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
