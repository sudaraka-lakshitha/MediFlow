// Receives the web requests for the small counters on the side menu (how many items need
// attention), calls the matching service, writes the audit log entry and sends the reply.
// The real rules are in services/navigationAttention.service.js. To trace a button: route -> this
// controller -> service.

import { navigationAttentionService } from '../services/navigationAttention.service.js';

export const navigationAttentionController = {
  summary: async (req, res) => {
    res.json({ data: await navigationAttentionService.get(req.user) });
  },
};
