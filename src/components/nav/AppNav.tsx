"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, AlertCircle, Target, Wallet, GraduationCap, MessageCircle, User } from "lucide-react";
import { PRIMARY_NAV } from "@/lib/config";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "/app": Home,
  "/app/my-worries": AlertCircle,
  "/app/my-goals": Target,
  "/app/my-stuff": Wallet,
  "/app/school": GraduationCap,
  "/app/ask": MessageCircle,
};

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname.startsWith(href);
}

export function DesktopNav({ email }: { email?: string }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-border md:bg-white/60 md:px-4 md:py-6">
      <Link href="/app" className="mb-8 px-2 text-lg font-semibold tracking-tight text-brand-strong">
        CredABLE
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {PRIMARY_NAV.map((item) => {
          const Icon = ICONS[item.href] ?? Home;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand-soft text-brand-strong" : "text-ink-soft hover:bg-black/5 hover:text-ink"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mb-2 flex flex-col gap-0.5 border-t border-border pt-3">
        <Link href="/app/tools" className="rounded-lg px-3 py-1.5 text-xs text-ink-soft/80 hover:text-ink">
          Tools
        </Link>
        <Link href="/app/resources" className="rounded-lg px-3 py-1.5 text-xs text-ink-soft/80 hover:text-ink">
          Resources
        </Link>
      </div>
      <Link
        href="/app/account"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-black/5 hover:text-ink"
      >
        <User size={18} />
        <span className="truncate">{email ?? "Account"}</span>
      </Link>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-white/95 backdrop-blur md:hidden">
      {PRIMARY_NAV.map((item) => {
        const Icon = ICONS[item.href] ?? Home;
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
              active ? "text-brand-strong" : "text-ink-soft"
            )}
          >
            <Icon size={20} />
            {item.label.replace("CredABLE ", "")}
          </Link>
        );
      })}
    </nav>
  );
}
