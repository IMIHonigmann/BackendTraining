const pool = require("./pool");
const dotenv = require("@dotenvx/dotenvx");
dotenv.config();

async function getThreadPosts(threadId) {
  const { rows } = await pool.query(
    `SELECT * FROM userposts WHERE id = ANY(SELECT unnest(message_ids) FROM threads WHERE id = $1)`,
    [threadId]
  );
  return rows;
}

// TODO: rewrite it to use pg
async function getThreadById(threadId) {
  const { rows } = await pool.query(`SELECT * FROM threads where id = $1`, [
    threadId,
  ]);

  const posts = await getThreadPosts(threadId);
  return [rows, posts];
}

async function getAll() {
  const { rows } = await pool.query(`SELECT * FROM threads`);
  return rows;
}

async function addThread(title, description) {
  try {
    const { rows } = await pool.query(`INSERT INTO threads (title, description) VALUES ($1, $2)`, [title, description]);
    console.log('successfully inserted elements')
  } catch (error) {
    console.error(`Error occured while inserting elements: ${error}`)
  }
}

module.exports = { getThreadById, getAll, addThread };
