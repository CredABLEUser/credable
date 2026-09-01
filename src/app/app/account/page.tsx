import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { logout } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Primitives";
import { Badge } from "@/components/ui/Primitives";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return (
    <div className="mx-auto max-w-xl px-5 py-14 sm:px-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-ink">Account</h1>
      <Card className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70">Email</p>
          <p className="text-ink">{user.email}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft/70">Status</p>
          <Badge tone={user.accountStatus === "member" ? "brand" : "neutral"}>
            {user.accountStatus === "member" ? "Member" : "Free account"}
          </Badge>
        </div>
        {user.accountStatus !== "member" && (
          <Link href="/app/membership" className="inline-block text-sm font-medium text-brand-strong underline underline-offset-2">
            Join the Club
          </Link>
        )}
        <div className="pt-2">
          <form action={logout}>
            <button type="submit" className="text-sm text-ink-soft underline underline-offset-2 hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
