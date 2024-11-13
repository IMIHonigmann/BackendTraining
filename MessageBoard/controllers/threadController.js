const queries = require("../databases/queries");
const postsDB = require("../databases/userPosts");

const getPrevLink = (req) => {
  const fullLink = req.header("Referer")?.split("/");
  return `/${fullLink[fullLink.length - 2]}`;
};

// TODO: rewrite it to use pg
async function getThreadByIdEJS(req, res) {
  const { threadId } = req.params;
  const targetThread = await queries.getThreadById(Number(threadId));

  if (!targetThread) {
    res.status(404).send("Thread doesn't exist");
    return;
  }

  const thread = targetThread[0][0];
  const posts = targetThread[1];
  const allPosts = await postsDB.getAll();

  console.log(thread);

  res.render("thread", {
    message: "Rebbit",
    targetThread: thread,
    posts,
    allPosts: allPosts,
  });
}

async function getAllThreads(req, res) {
  const allThreads = await queries.getAll();
  res.render("home", { threads: allThreads });
}

function renderForm(req, res) {
  res.render("newthread", {});
}

function showNewUser(req, res) {
  res.render("login", {});
}

function openUser(req, res) {
  const { fullName } = req.body;
  res.redirect(getPrevLink(req));
}

// TODO: rewrite it to use pg
function openThread(req, res) {
  console.log("Form data received:", req.body);
  const { title, threadtext } = req.body;
  queries.addThread(title, threadtext);

  res.redirect(getPrevLink(req));
}

module.exports = {
  getThreadByIdEJS,
  getAllThreads,
  renderForm,
  openThread,
  showNewUser,
  openUser,
};
