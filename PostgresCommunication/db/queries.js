const pool = require("./pool")

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS assholes (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL
    )`;

async function createTable() {
    try {
        await pool.query(createTableQuery);
    } catch (error) {
        console.error('Error initializing database:', error);
    }
    console.log("success")
}

async function getAllUsernames() {
    const { rows } = await pool.query("select * from assholes")
    return rows
}

function convertToSQLFilterString(user, searchType) {
    switch(searchType) {
        case 'starts':
            return `${user}%`
        case 'ends':
            return `%${user}`
        case 'includes':
                return `%${user}%`
    }
    return `${user}`
}

async function searchUsers(user, searchType) {
    user = convertToSQLFilterString(user, searchType)
    console.log(user)
    const { rows } = await pool.query(`SELECT * FROM assholes WHERE username LIKE $1`, [user])
    return rows // variable name has to be 'rows'
}

async function insertUsername(username) {
    try {
        await pool.query(`insert into assholes (username) values ($1)`, [username])
    }
    catch (error){
        return 'Error creating user: ' + error // DONT USE RETURN FOR LOGS, YOU DONT WANT THEM TO KNOW THE ERROR AND POTENTIAL SECURITY VULNURABILITY
    }
    return 'successfully created ' + username
}

async function insertUsernames(usernames) {
    try {
        const addParamCountAppendage = () => {
            let finalString = ''
            usernames.forEach((_, index) => {
                finalString += `($${index+1}), `
            })
            return finalString.slice(0, -2)
        }
        console.log(addParamCountAppendage())
        await pool.query(`insert into assholes (username) values ${addParamCountAppendage()}`, usernames)
    }
    catch (error){
        return 'Error creating user: ' + error // DONT USE RETURN FOR LOGS, YOU DONT WANT THEM TO KNOW THE ERROR AND POTENTIAL SECURITY VULNURABILITY
    }
    return 'successfully created ' + usernames.join(', ')
}

module.exports = {
    getAllUsernames,
    createTable,
    insertUsername,
    insertUsernames,
    searchUsers
}