import { z } from "zod";

export const operationSettingsSchema = z.object({
  allocationMethod: z.enum(["FIFO", "FEFO"]),
  nearExpiryDays: z.coerce.number().int().min(7).max(365),
});
