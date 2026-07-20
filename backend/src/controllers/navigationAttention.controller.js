import { navigationAttentionService } from '../services/navigationAttention.service.js';

export const navigationAttentionController = {
  summary: async (req, res) => {
    res.json({ data: await navigationAttentionService.get(req.user) });
  },
};
