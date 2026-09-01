import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { DesktopNav, MobileNav } from "@/components/nav/AppNav";

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const remaining = user.freeRunsAllowed - user.freeRunsCompleted;

  return (
    <div className="flex min-h-svh flex-1">
      <DesktopNav email={user.email} />
      <div className="flex min-w-0 flex-1 flex-col">
        {user.accountStatus === "free" && (
          <div className="flex items-center justify-center gap-2 border-b border-border bg-accent-soft/60 px-4 py-1.5 text-center text-xs text-ink-soft">
            <span>
              {remaining > 0
                ? `${remaining} free conversation${remaining === 1 ? "" : "s"} remaining`
                : "You've used your free conversations"}
            </span>
            <Link href="/app/membership" className="font-medium text-brand-strong underline underline-offset-2">
              Join the Club
            </Link>
          </div>
        )}
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
