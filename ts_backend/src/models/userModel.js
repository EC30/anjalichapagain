const db = require('../db/db');

const createUserTable = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(500) NOT NULL,
        REFRESH_TOKEN VARCHAR(500) NOT NULL
      )
    `);
    console.log('Table created or already exists');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error; // Propagate the error to the caller
  }
};
module.exports = { createUserTable };
