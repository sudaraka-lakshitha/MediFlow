// Finds close matches even with small typing mistakes (for example "paracetmol" still finds
// Paracetamol).

export type FuzzyOption = {
  value: string | number;
  label: string;
  description?: string;
};

const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const editDistance = (first: string, second: string) => {
  const previous = Array.from(
    { length: second.length + 1 },
    (_, index) => index,
  );
  for (let row = 1; row <= first.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= second.length; column += 1) {
      const above = previous[column];
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + (first[row - 1] === second[column - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[second.length];
};

export const fuzzyMatchScore = (option: FuzzyOption, rawTerm: string) => {
  const term = normalize(rawTerm);
  const label = normalize(option.label);
  const searchable = normalize(
    `${option.label} ${option.description || ""}`,
  );
  if (!term) return 0;
  if (label === term) return 0;
  if (label.startsWith(term)) return 1;
  const position = searchable.indexOf(term);
  if (position >= 0) return 3 + position / 100;
  const words = searchable.split(" ");
  const prefix = words.findIndex((word) => word.startsWith(term));
  if (prefix >= 0) return 5 + prefix / 100;
  const closest = Math.min(
    editDistance(
      term,
      label.slice(0, Math.max(term.length, Math.min(label.length, term.length + 2))),
    ),
    ...words.map((word) => editDistance(term, word)),
  );
  const tolerance = Math.max(1, Math.min(3, Math.ceil(term.length * 0.3)));
  return closest <= tolerance ? 10 + closest : Number.POSITIVE_INFINITY;
};

export const fuzzySuggestions = (
  values: string[],
  term: string,
  limit = 8,
) =>
  values
    .map((label) => ({
      label,
      score: fuzzyMatchScore({ value: label, label }, term),
    }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort(
      (first, second) =>
        first.score - second.score || first.label.localeCompare(second.label),
    )
    .slice(0, limit)
    .map((entry) => entry.label);
