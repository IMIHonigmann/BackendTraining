const threads = require('../databases/threads')
const posts = require('../databases/userPosts')

async function getThreadById(req, res) {
    const { threadId } = req.params;
    console.log(threadId);
    const targetPost = await threads.getThreadById(Number(threadId))

    if (!targetPost) {
        res.status(404).send("Thread doesn't exist");
        return;
    }

    res.send(`${targetPost.title} <br> ${targetPost.description}`)
}

async function getThreadByIdEJS(req, res) {
    const { threadId } = req.params;
    const targetPost = await threads.getThreadById(Number(threadId))
    const allPosts = posts.getAll()

    if (!targetPost) {
        res.status(404).send("Thread doesn't exist")
        return
    }

    res.render("threads", { message: "Rebbit", targetPost, allPosts })
}

function getAllThreads(req, res) {
    const allThreads = threads.getAll()
    res.render("home", { threads: allThreads })
}

function renderForm(req, res) {
    res.render("newthread", {})
}

function openThread(req, res) {
    console.log('Form data received:', req.body);
    const { title, threadtext } = req.body
    threads.addThread(title, threadtext)
    
    const fullLink = req.header('Referer')?.split('/')
    const prev = fullLink[fullLink.length-2]

    res.redirect(`/${prev}`)
}

module.exports = { getThreadById, getThreadByIdEJS, getAllThreads, renderForm, openThread }