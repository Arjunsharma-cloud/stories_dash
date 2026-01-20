import {Client} from "pg"

export const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "uploads",
  password: "DREAM55LPA",
  port: 5432,
});



