export const validate = (schemas) => async (req, _res, next) => {
  try {
    if (schemas.body) req.body = await schemas.body.parseAsync(req.body);
    if (schemas.params) req.params = await schemas.params.parseAsync(req.params);
    // Express 5 exposes req.query through a read-only getter. Preserve the parsed
    // result separately so controllers can use coercions, defaults, and transforms.
    if (schemas.query) req.validatedQuery = await schemas.query.parseAsync(req.query);
    next();
  } catch (error) {
    next(error);
  }
};
