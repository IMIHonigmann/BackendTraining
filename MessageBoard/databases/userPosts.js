const pool = require('./pool')

  async function getMsgById(messageId) {
    const { rows } = await pool.query(`SELECT * FROM userposts WHERE id = $1`, [messageId])
    return rows
  }

  async function getAll() {
    const { rows } = await pool.query(`SELECT * FROM userposts`)
    return rows
  }

module.exports = { getMsgById, getAll };