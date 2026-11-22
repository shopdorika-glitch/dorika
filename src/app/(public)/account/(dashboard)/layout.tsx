import { requireCustomerSession } from "@/lib/auth";
import { getAccountProfile } from "@/lib/account-queries";
import { AccountNav } from "@/components/account/account-nav";
import { signOutCustomer } from "../actions";

export const dynamic = "force-dynamic";

export default async function AccountDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireCustomerSession();
  const profile = await getAccountProfile(session.userId, session.email);

  return (
    <div className="min-h-[70vh] bg-paper">
      <div className="shell py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[248px_1fr] lg:gap-10">
          <aside>
            <AccountNav
              name={profile.full_name}
              email={profile.email ?? session.email ?? ""}
              signOut={signOutCustomer}
            />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
