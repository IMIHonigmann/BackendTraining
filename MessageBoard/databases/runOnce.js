const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
dotenv = require("@dotenvx/dotenvx");
dotenv.config();

const execOnce = fs.readFileSync(
  path.join(__dirname, "seeds", "deleteAll.sql"),
  "utf-8"
);

const readSqlFile = (filename) =>
  fs.readFileSync(path.join(__dirname, "seeds", filename), "utf-8");

const [SQL, SQLQuery2, insertManually] = [
  "initThreads.sql",
  "initUserposts.sql",
  "alter.sql",
].map(readSqlFile);

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.ROLENAME}:${process.env.ROLEPASSWORD}@${process.env.DBIP}:${process.env.DBPORT}/${process.env.DATABASE}`,
  });
  await client.connect();
  // await client.query(execOnce);
  await client.query(SQL);
  await client.query(SQLQuery2);
  await client.query(insertManually);
  await client.end();
  console.log("done");
}

main();
