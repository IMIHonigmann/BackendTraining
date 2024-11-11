const db = require("../db/queries");

async function getUsernames(req, res) {
    const users = await db.getAllUsernames()
    res.send("Niggers: " + users.map(user => user.username).join(", "))
}

function test(req, res) {
    res.send("worked")
}

async function createDatabase(req, res) {
    const state = await db.createTable()
    res.send(state)
}

function openSearchPage(req, res) {
    res.render('search')
}

async function searchFor(req, res) {
    const { searchString, searchType } = req.query;
    console.log('searchType:', searchType)
    const matches = await db.searchUsers(searchString, searchType)
    console.log(matches)
    res.render('searchResults', { users: matches })
}

async function createUsernameGet(req, res) {
    const query = await db.insertUsernames(['looksmaxxer', 'sixpack', 'DJ Khaled'])

    res.send(`${query}`)
}

async function createUsernamePost(req, res) {
    const { vars } = req.body
    await db.insertUsername(vars)
    res.redirect("/")
}

module.exports = {
    getUsernames,
    createDatabase,
    createUsernameGet,
    createUsernamePost,
    test,
    searchFor,
    openSearchPage,
  };