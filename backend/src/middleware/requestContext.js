// Gives each request a reference number (X-Request-Id). It is shown in error messages and logs so
// one problem can be traced end to end.

import crypto from 'node:crypto';

export const requestContext = (req, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
};
