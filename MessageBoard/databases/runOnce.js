const { Client } = require("pg");
dotenv = require("@dotenvx/dotenvx")
dotenv.config()

const SQL = `
CREATE TABLE IF NOT EXISTS threads (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ),
  description TEXT
);

INSERT INTO threads (title, description) 
VALUES
  ('Can''t write a fucking for loop', 'title'),
  ('JavaScript async/await', 'Can someone explain how async/await works in JavaScript?'),
  ('Best practices for React components', 'What are some best practices for writing React components?'),
  ('Understanding closures in JavaScript', 'Can someone help me understand how closures work in JavaScript?');

  ALTER TABLE threads ADD COLUMN likes INTEGER DEFAULT 0;
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.ROLENAME}:${process.env.ROLEPASSWORD}@${process.env.DBIP}:${process.env.DBPORT}/${process.env.DATABASE}`,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();