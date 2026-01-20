/** this file will receive the data form the frotned
 * then rest od the file like table name and parsing
 * will be added in this file only
 *
 * then create a file for the sql database and add there
 *
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import Papa from "papaparse";
import XLSX from "xlsx";
import path from "path";
import { createTableFromRows } from "./CreateTable.js";
import { insertRows } from "./insertRow.js";
import { client } from "./db.js";
import { insertDatasetMetadata } from "../MetadataSql/Insertquery.js";
import { finalizeDatasetMetadata } from "../MetadataSql/finalizequery.js";

function sanitizeTableName(filename) {
  return filename
    .replace(/\.[^/.]+$/, "") // remove extension
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_");
}

//csv parsing
function parseCSV(filePath) {
  console.log(filePath);
  const fileContent = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  console.log({
    columns: parsed.meta.fields,
    rows: parsed.data,
  });

  return {
    columns: parsed.meta.fields,
    rows: parsed.data,
  };
}

//excel parsing
function parseExcel(filePath) {
  console.log(filePath);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: null, // keeps empty cells
  });

  const columns = Object.keys(rows[0] || {});
  console.log(columns, rows);

  return { columns, rows };
}

//on reciving the file parse it
export const reciever = asyncHandler(async (req, res) => {
  const file = req.file;

  console.log(file.originalname); // example: sales_data.csv
  console.log(file.path); // temp file path

  //now here we parse the file by selecting the type
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;
  let parsed;

  // ---- CSV ----
  if (mime === "text/csv" || ext === ".csv") {
    parsed = parseCSV(file.path);
  }

  // ---- EXCEL ----
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mime === "application/vnd.ms-excel" ||
    ext === ".xlsx" ||
    ext === ".xls"
  ) {
    parsed = parseExcel(file.path);
  } else {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  const datasetId = randomUUID();
  const tablename = `ds_${datasetId.replace(/-/g, "")}`;
  console.log(tablename);
  const schemaName = "dataset";
  ////   create the usere and find it here in the
  // mongodb and tehn give the userId here to

  await insertDatasetMetadata({
    tablename,
    userId,
    datasetName: file.originalname,
    originalFilename: file.originalname,
    table,
    schemaName,
  });

  //connecting the reciever file with insertrow file
  const schema = await createTableFromRows(tablename, parsed.rows);

  //insert data
  await insertRows(tablename, schema, parsed.rows);

  await finalizeDatasetMetadata({
    datasetId,
    rowCount:parsed.rows.length,
    columnCount: Object.keys(schema).length
  })

  res.json({
    success: true,
    table: tablename,
    columns: Object.keys(schema),
    rowCount: parsed.rows.length,
    DatasetId:datasetId
  });
});
