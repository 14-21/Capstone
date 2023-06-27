const {Client} = require('pg')

const client = new pg.Client('postgress://localhost:5432/games')

// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/games';

// const client = new Client({
//   connectionString,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
// });

module.exports = client;
