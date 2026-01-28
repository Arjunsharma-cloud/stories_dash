//this file is updataind the details of the ffile not the parsed data inside it 
import { client } from "../DataSetSql/db.js";

export async function insertDatasetMetadata({
  datasetId,
  userId,
  datasetName,
  originalFilename,
  tableName,
  schemaName,
}) {
  const query = `
    INSERT INTO metadata.datasets (
      dataset_id,
      user_id,
      dataset_name,
      original_filename,
      table_name,
      schema_name,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, 'PARSING')
  `;

  await client.query(query, [
    datasetId,
    userId,
    datasetName,
    originalFilename,
    tableName,
    schemaName,
  ]);
}
