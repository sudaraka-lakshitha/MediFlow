export const ageOnDate = (dateOfBirth, onDate) => {
  const birth = new Date(dateOfBirth);
  const date = new Date(onDate);
  let age = date.getUTCFullYear() - birth.getUTCFullYear();
  if (date.getUTCMonth() < birth.getUTCMonth() || (date.getUTCMonth() === birth.getUTCMonth() && date.getUTCDate() < birth.getUTCDate())) age -= 1;
  return age;
};
