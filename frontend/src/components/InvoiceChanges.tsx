import { formatPharmacyDateTime } from "../utils/pharmacyTime";
const money = (value: unknown) => `Rs. ${Number(value || 0).toFixed(2)}`;

export function InvoiceChanges({ invoice }: { invoice: any }) {
  const events = (invoice.events || []).filter((event: any) =>
    ["INVOICE_REVISED", "INVOICE_NOTE_UPDATED", "PARTIAL_CANCELLATION", "REFUND", "REFUND_REQUESTED", "REFUND_SETTLED", "CANCELLED", "CANCELLATION_REQUESTED", "CANCELLATION_RESOLVED"].includes(event.kind));
  if (!events.length && !invoice.cancellationReason) return null;
  return (
    <div className="alert alert-warning small mt-3">
      <strong>Invoice changes &amp; cancellation history</strong>
      {!events.length && <div>{invoice.cancellationReason}</div>}
      {events.map((event: any) => (
        <div key={event.id} className="border-top pt-2 mt-2">
          <small className="text-secondary">{formatPharmacyDateTime(event.createdAt)} · Revision {event.revision}</small>
          <div>{event.details?.reason || event.kind.replaceAll("_", " ")}</div>
          {event.details?.previousNote !== event.details?.currentNote && event.details?.currentNote !== undefined && (
            <div className="mt-1">Pharmacy note: {event.details.previousNote || "None"} → {event.details.currentNote || "Removed"}</div>
          )}
          {event.details?.removedItems?.map((item: any, index: number) => (
            <div key={index}>Removed: {item.name} × {item.quantity} {item.unit}</div>
          ))}
          {event.details?.previous && event.details?.current && (
            <details className="mt-1">
              <summary>See previous and updated invoice</summary>
              <div className="row g-2 mt-1">
                {["previous", "current"].map((version) => (
                  <div className="col-sm-6" key={version}>
                    <strong>{version === "previous" ? "Previous" : "Updated"}: {money(event.details[version].total)}</strong>
                    {event.details[version].items?.map((item: any, index: number) => (
                      <div key={index}>{item.name} × {Number(item.quantity)} — {money(item.lineTotal)}</div>
                    ))}
                    <div>Discount: {money(event.details[version].discount)} · Tax: {money(event.details[version].tax)} · Container: {money(event.details[version].containerFee)}</div>
                  </div>
                ))}
              </div>
            </details>
          )}
          {event.details?.previousTotal != null && <div>Total: {money(event.details.previousTotal)} → {money(event.details.revisedTotal)}</div>}
          {event.details?.confirmationRetained === true && <div>Previous customer approval retained by the pharmacy; no new customer acknowledgement was recorded.</div>}
          {(event.details?.reconfirmationRequired === true || (event.kind === "INVOICE_REVISED" && event.details?.confirmationRetained === false)) && <div>A new customer acknowledgement was requested for this change.</div>}
          {Number(event.amount) < 0 && <div>Refund recorded: {money(-Number(event.amount))}</div>}
        </div>
      ))}
    </div>
  );
}
