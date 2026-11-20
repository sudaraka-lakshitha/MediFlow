// Receives the web requests for the drug information search, calls the matching service, writes the
// audit log entry and sends the reply.
// The real rules are in services/drugInformation.service.js. To trace a button: route -> this
// controller -> service.

import { drugInformationService } from '../services/drugInformation.service.js';

export const drugInformationController = {
  search: async (req, res) => res.json({ data: await drugInformationService.search(req.query.q) }),
  suggestions: async (req, res) => res.json({ data: await drugInformationService.suggestions(req.query.q) }),
};
