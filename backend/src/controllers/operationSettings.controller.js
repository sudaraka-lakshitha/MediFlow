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
