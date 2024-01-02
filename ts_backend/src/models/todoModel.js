const db = require('../db/db');

// Create the 'todos' table if it does not exist
const createTodoTable = () => {
  return db.none(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT false
    )
  `).then(() => {
    console.log('Table created or already exists');
  }).catch(error => {
    console.error('Error while creating table:', error);
  });
};

module.exports = { createTodoTable };