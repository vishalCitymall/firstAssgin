const Pool = require("pg").Pool

// create a new connection to the database
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    database: "testdb",
    password: "12345",
    port: 5432
});
 
module.exports = pool;