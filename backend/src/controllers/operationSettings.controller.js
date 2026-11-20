// Receives the web requests for the pharmacy settings page, calls the matching service, writes the
// audit log entry and sends the reply.
// The real rules are in services/operationSettings.service.js. To trace a button: route -> this
// controller -> service.

import { operationSettingsService } from "../services/operationSettings.service.js";
import { recordRequestAudit } from "../services/audit.service.js";

export const operationSettingsController = {
  get: async (_req, res) =>
    res.json({ data: await operationSettingsService.get() }),
  update: async (req, res) => {
    const data = await operationSettingsService.update(req.body);
    await recordRequestAudit(req, {
      action: "OPERATION_SETTINGS_UPDATED",
      entityType: "SYSTEM_SETTING",
      details: data,
    });
    res.json({
      data,
      message: "Pharmacy operation settings updated successfully.",
    });
  },
};
