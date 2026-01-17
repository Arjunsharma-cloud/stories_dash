import { client } from "./db.js";

function inferSQLType(value) {
  if (typeof value === "number")
    return Number.isInteger(value) ? "INTEGER" : "DOUBLE PRECISION";
  if (typeof value === "boolean") return "BOOLEAN";
  if (typeof value === "string" && !isNaN(Date.parse(value)))
    return "TIMESTAMP";
  return "TEXT";
}

function inferSchema(rows) {
  const schema = {};

  for (const row of rows) {
    for (const key in row) {
      if (!schema[key] && row[key] !== null) {
        schema[key] = inferSQLType(row[key]);
      }
    }
  }

  return schema;
}

function createTableSQL(tableName, schema) {
  const columnsSQL = Object.entries(schema)
    .map(([col, type]) => `"${col}" ${type}`)
    .join(", ");

  return `
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      id SERIAL PRIMARY KEY,
      ${columnsSQL}
    );
  `;
}

export async function createTableFromRows(tableName, rows) {
  const schema = inferSchema(rows);
  const createQuery = createTableSQL(tableName, schema);

  await client.query(createQuery);

  return schema;
}
