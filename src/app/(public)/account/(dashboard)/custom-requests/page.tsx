import type { Metadata } from "next";
import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";
import { requireCustomerSession } from "@/lib/auth";
import { getAccountCustomRequests } from "@/lib/account-queries";
import { PanelHeader, EmptyPanel } from "@/components/account/ui";
import { StatusBadge, PaymentBadge } from "@/components/admin/ui";
import { formatDate, formatNPR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Custom Art Requests",
  robots: { index: false, follow: false },
};

export default async function AccountCustomRequestsPage() {
  const session = await requireCustomerSession();
  const requests = await getAccountCustomRequests(session.userId);

  return (
    <>
      <PanelHeader
        title="Custom art requests"
        subtitle="Photo-based String Face Art, hand-woven on a 45cm round plank."
        action={
          <Link href="/custom-art" className="btn-primary btn-sm">
            <Plus className="h-4 w-4" /> New request
          </Link>
        }
      />

      {requests.length === 0 ? (
        <EmptyPanel
          title="No custom requests yet"
          hint="Upload a photo and we'll design it in thread. Requests you send while signed in appear here."
          actionLabel="Start a custom piece"
          actionHref="/custom-art"
        />
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="card p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{request.request_no}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Requested {formatDate(request.created_at)} · {request.plank_size}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <PaymentBadge status={request.payment_status} />
                  <StatusBadge status={request.status} />
                  <span className="text-sm font-normal text-ink">
                    {formatNPR(request.price)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-soft">
                {request.preferred_date && (
                  <span>
                    <span className="font-semibold text-ink-soft">Wanted by:</span>{" "}
                    {request.preferred_date}
                  </span>
                )}
                {request.background_pref && (
                  <span>
                    <span className="font-semibold text-ink-soft">Background:</span>{" "}
                    {request.background_pref}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5 text-clay" />
                  Photo received — visible to the studio only
                </span>
              </div>

              {request.special_instructions && (
                <p className="mt-3 rounded-xs bg-paper-2 p-3 text-xs leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">Instructions:</span>{" "}
                  {request.special_instructions}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs leading-relaxed text-ink-muted">
        Your uploaded photo stays private: it is stored in a locked bucket and only opened by the
        Dorika studio while your piece is being made.
      </p>
    </>
  );
}
