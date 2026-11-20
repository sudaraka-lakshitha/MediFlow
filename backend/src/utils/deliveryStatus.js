// Plain words for each delivery status, used on screens and documents.

// Customer-facing delivery status names for printed documents (mirrors the
// frontend's utils/deliveryStatus.ts).
const labels = {
  REQUESTED: 'Processing', AWAITING_FEE: 'Awaiting payment', DISPATCHED: 'Shipped',
  DELIVERY_FAILED: 'Delivery attempt failed', RETURNING: 'Returning to pharmacy', DELIVERED: 'Delivered',
  RETURNED: 'Returned to pharmacy', RESHIP_REQUESTED: 'Free reshipment requested', RESHIP_READY: 'Reshipment approved', CANCELLED: 'Cancelled',
};
export const deliveryStatusLabel = (status) => labels[status] || String(status || '').replaceAll('_', ' ').toLowerCase();
