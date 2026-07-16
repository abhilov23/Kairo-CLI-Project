"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  History,
  BarChart3,
  User,
  Menu,
  X,
  Terminal,
  ChevronLeft,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/theme-toggle";

const SIDEBAR_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { label: "Sessions", href: "/dashboard/sessions", icon: History },
  { label: "Usage", href: "/dashboard/usage", icon: BarChart3 },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-3 top-[calc(0.625rem+env(safe-area-inset-top))] z-50 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground md:hidden"
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-border bg-background transition-transform duration-300 ease-out md:sticky md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
            <Terminal className="h-4 w-4 text-violet-500" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Kairo
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {SIDEBAR_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-violet-500"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-violet-500/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <link.icon
                  className={cn(
                    "relative z-10 h-4 w-4 shrink-0 transition-transform duration-200",
                    isActive ? "text-violet-500" : "group-hover:scale-110",
                  )}
                />

                {/* Label */}
                <span className="relative z-10">{link.label}</span>

                {/* Active dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-violet-500"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User area */}
        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-[10px] font-bold text-white">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {session?.user?.name ?? "User"}
              </p>
              {session?.user?.email && (
                <p className="truncate text-[10px] text-muted-foreground/60">
                  {session.user.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-3 py-3">
          <div className="flex items-center justify-between rounded-lg px-3 py-1.5">
            <span className="text-xs text-muted-foreground/40">Theme</span>
            <ThemeToggle />
          </div>
          <Link
            href="/"
            className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground/40 transition-colors hover:text-muted-foreground"
          >
            <ChevronLeft className="h-3 w-3" />
            <span>Back to site</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-1 flex w-full items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground/40 transition-colors hover:text-destructive hover:bg-destructive/5"
          >
            <LogOut className="h-3 w-3" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
