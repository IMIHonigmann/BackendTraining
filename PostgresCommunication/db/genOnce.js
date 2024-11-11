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

createTable()