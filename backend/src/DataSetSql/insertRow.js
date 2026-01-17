function buildInsertQuery(tableName, schema, rows) {
  const columns = Object.keys(schema);

  const values = [];
  const placeholders = [];

  rows.forEach((row, rowIndex) => {
    const rowPlaceholders = [];

    columns.forEach((col, colIndex) => {
      values.push(row[col]);
      rowPlaceholders.push(`$${rowIndex * columns.length + colIndex + 1}`);
    });

    placeholders.push(`(${rowPlaceholders.join(", ")})`);
  });

  const sql = `
    INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(", ")})
    VALUES ${placeholders.join(", ")};
  `;

  return { sql, values };
}


export async function insertRows(tableName, schema, rows) {
  if (!rows.length) return;

  const { sql, values } = buildInsertQuery(tableName, schema, rows);

  await client.query(sql, values);
}
