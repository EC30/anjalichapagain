const pgp = require('pg-promise')();
const connectionString = 'postgres://postgres:123456@localhost:5432/tododb';
const db = pgp(connectionString);
module.exports = db;