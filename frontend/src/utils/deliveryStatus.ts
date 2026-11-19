// One customer-friendly name for every delivery status, used on every screen.
export const deliveryStatusLabels: Record<string, string> = {
  REQUESTED: "Processing",
  AWAITING_FEE: "Awaiting payment",
  DISPATCHED: "Shipped",
  DELIVERY_FAILED: "Delivery attempt failed — parcel with courier",
  RETURNING: "Returning to pharmacy — not yet received",
  DELIVERED: "Delivered",
  RETURNED: "Returned to pharmacy",
  RESHIP_REQUESTED: "Free reshipment requested — awaiting pharmacist inspection",
  RESHIP_READY: "Reshipment approved — awaiting courier handover",
  CANCELLED: "Cancelled",
};
export const deliveryStatusLabel = (status?: string | null) =>
  status ? deliveryStatusLabels[status] || status.replaceAll("_", " ").toLowerCase() : "";
