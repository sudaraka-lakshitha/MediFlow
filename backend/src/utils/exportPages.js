// Stable keyset traversal avoids a silent cap and holds only one page in memory.
export async function* exportPages(model, query = {}, map = (row) => row, pageSize = 500) {
  const latest = await model.findFirst({ where: query.where, orderBy: { id: 'desc' }, select: { id: true } });
  if (!latest) return;
  let afterId = 0;
  while (afterId < latest.id) {
    const rows = await model.findMany({ ...query, where: { AND: [query.where || {}, { id: { gt: afterId, lte: latest.id } }] }, orderBy: { id: 'asc' }, take: pageSize });
    if (!rows.length) break;
    afterId = rows.at(-1).id;
    yield rows.map(map);
  }
}
