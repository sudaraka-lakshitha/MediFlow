// Known field paths only; never interpolate client-supplied identifiers.
export const historySearch = (search, paths) => search ? { OR: paths.map(path => path.split('.').reverse().reduce((value, key) => ({ [key]: value }), { contains: search })) } : {};
