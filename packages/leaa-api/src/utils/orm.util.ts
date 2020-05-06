export function getRealSql(querySql: any, queryParameters: any): string {
  let sql = querySql;
  // let querySql = await qb.getQuery();
  // const queryParameters = await qb.getParameters();

  Object.keys(queryParameters).forEach((i) => {
    if (queryParameters[i] instanceof Array) {
      sql = sql.replace(`:${i}`, JSON.stringify(queryParameters[i]).replace(/^\[(.*)]$/, '$1'));
    } else {
      sql = sql.replace(`:${i}`, queryParameters[i].toString());
    }
  });

  return sql;
}
