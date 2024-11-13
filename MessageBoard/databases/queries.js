const pool = require("./pool");
const dotenv = require("@dotenvx/dotenvx");
dotenv.config();

const threads = [
  {
    title: "Can't write a fucking for loop",
    description: "title.",
  },
  {
    title: "How to center a div?",
    description: "I'm struggling to center a div element in CSS.",
  },
  {
    title: "JavaScript async/await",
    description: "Can someone explain how async/await works in JavaScript?",
  },
  {
    title: "Best practices for React components",
    description: "What are some best practices for writing React components?",
  },
  {
    title: "Understanding closures in JavaScript",
    description:
      "Can someone help me understand how closures work in JavaScript?",
  },
];

let id = 0;
threads.forEach((thread) => {
  thread.likes = Math.floor(Math.random() * 1000);
  thread.id = id;
  id++;
});

async function getThreadPosts(threadId) {
  const { rows } = await pool.query(
    `SELECT * FROM userposts WHERE id = ANY(SELECT unnest(message_ids) FROM threads WHERE id = $1)`,
    [threadId]
  );
  return rows;
}

// TODO: rewrite it to use pg
async function getThreadById(threadId) {
  const { rows } = await pool.query(`select * from threads where id = $1`, [
    threadId,
  ]);

  const posts = await getThreadPosts(threadId);
  return [rows, posts];
}

async function getAll() {
  const { rows } = await pool.query(`select * from threads`);
  return rows;
}

// TODO: rewrite it to use pg
function addThread(title, description) {
  threads.push({
    title: title,
    description: description,
    id: id,
    likes: 0,
  });
  id++;
}

module.exports = { getThreadById, getAll, addThread };
