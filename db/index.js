const pg = require("pg");

// DB2: 
const client = new pg.Client("postgres://localhost:5432/videogames");

// DB3: 
module.exports = client; 