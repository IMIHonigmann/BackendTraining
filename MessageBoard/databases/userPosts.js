const pool = require('./pool')

  async function getMsgById(messageId) {
    const { rows } = await pool.query(`select * from userposts where id = $1`, [messageId])
    return rows
  };

  async function getAll() {
    const { rows } = await pool.query(`select * from userposts`)
    return rows
  }

module.exports = { getMsgById, getAll };