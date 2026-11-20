// Passes errors from async route code to the error handler, so a failed request always gets a
// proper reply.

export const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
