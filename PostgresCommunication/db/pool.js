const { Pool } = require("pg")
require("dotenv").config()

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
module.exports = new Pool({
  connectionString: `postgresql://${process.env.ROLENAME}:${process.env.ROLEPASSWORD}@${process.env.IP}:${process.env.PORT}/${process.env.DATABASE}`
});