import { drugInformationService } from '../services/drugInformation.service.js';

export const drugInformationController = {
  search: async (req, res) => res.json({ data: await drugInformationService.search(req.query.q) }),
  suggestions: async (req, res) => res.json({ data: await drugInformationService.suggestions(req.query.q) }),
};
