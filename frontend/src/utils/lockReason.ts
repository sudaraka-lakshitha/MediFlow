/** First message whose condition is true; explains why an action is locked. */
export const lockReason = (...checks: Array<[unknown, string]>) => checks.find(([condition]) => Boolean(condition))?.[1] || '';
