export async function finalizeDatasetMetadata({
  datasetId,
  rowCount,
  columnCount,
}) {
  const query = `
    UPDATE metadata.datasets
    SET
      row_count = $1,
      column_count = $2,
      status = 'READY',
      updated_at = now()
    WHERE dataset_id = $3
  `;

  await client.query(query, [rowCount, columnCount, datasetId]);
}
