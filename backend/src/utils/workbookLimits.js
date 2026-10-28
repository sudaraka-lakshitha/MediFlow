export const workbookLimits = {
  delivery: { maxBytes: 1_000_000, maxRows: 1000, maxColumns: 20 },
  stock: { maxBytes: 2_000_000, maxRows: 2000, maxColumns: 30 },
  product: { maxBytes: 2_000_000, maxRows: 3000, maxColumns: 40 },
};
export const base64WorkbookLimit = kind => 4 * Math.ceil(workbookLimits[kind].maxBytes / 3);
