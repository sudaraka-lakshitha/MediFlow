// Makes sure the person saving a change still holds the "one person at a time" lock for that record
// (see services/workflowLease.service.js).

import { workflowLeaseService, requestResource } from '../services/workflowLease.service.js';
import { logger } from '../config/logger.js';

// Used around mutating controllers after authentication, authorization and validation.
// Existing financial transactions and conditional status updates remain the final
// duplicate-processing defence; this lease also protects time spent editing.
export const withWorkflowLease = controller => async (req, res, next) => {
  const target = requestResource(req);
  if (!target || ['GET', 'HEAD'].includes(req.method)) return controller(req, res, next);
  const owner = workflowLeaseService.owner(req);
  const resource = await workflowLeaseService.resource(target.kind, target.id, req.user);
  const lease = await workflowLeaseService.begin(resource, owner, req.get('X-Workflow-Lease'));
  const heartbeat = setInterval(() => {
    void workflowLeaseService.renewProcessing(resource, owner, lease.token).catch(error => logger.error('Workflow processing lease renewal failed.', { resource, error }));
  }, 20_000);
  heartbeat.unref?.();
  // Send JSON only after releasing the processing flag, so a subsequent step can
  // start immediately without racing the previous controller's cleanup.
  const json = res.json.bind(res);
  let response, hasResponse = false;
  res.json = body => { response = body; hasResponse = true; return res; };
  try {
    await controller(req, res, next);
  } finally {
    clearInterval(heartbeat);
    res.json = json;
    // A completed financial action must not be reported as failed merely because
    // lease cleanup failed; the lease will expire and the business status remains authoritative.
    await workflowLeaseService.finish(lease, owner).catch(error => logger.error('Workflow lease cleanup failed.', { resource, error }));
  }
  if (hasResponse) return json(response);
};
export const protectWorkflowController = controller => Object.fromEntries(Object.entries(controller).map(([name, handler]) => [name, withWorkflowLease(handler)]));
