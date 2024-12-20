const { Pool } = require("pg")
require("@dotenvx/dotenvx").config()

module.exports = new Pool({
  connectionString: `postgresql://${process.env.ROLENAME}:${process.env.ROLEPASSWORD}@${process.env.DBIP}:${process.env.DBPORT}/${process.env.DATABASE}`
});