const { Pool } = require("pg")

const db = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    password: "root",
    database: "wheather"
})

module.exports = db