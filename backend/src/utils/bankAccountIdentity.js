// Formatting differences must not turn one destination account into two ledgers.
export const bankAccountIdentity = account => JSON.stringify([
  account.bankName.trim().replace(/\s+/g, ' ').toUpperCase(),
  account.accountNumber.replace(/[\s-]+/g, '').toUpperCase(),
]);
