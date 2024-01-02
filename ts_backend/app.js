require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const todosRoutes = require('./src/routes/todos');
const usersRoutes = require('./src/routes/users');
const { validateAccessToken} = require('./src/utils/authUtils');
const jwt = require('jsonwebtoken');

const db = require('./src/db/db');
const { createTodoTable } = require('./src/models/todoModel');
const { createUserTable } = require('./src/models/userModel');

const port = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create tables before starting the server
createTodoTable()
  .then(() => {
    console.log('Todos table created or already exists');
    return createUserTable(); 
  })
  .then(() => {
    console.log('Users table created or already exists');
    startServer(); 
  })
  .catch(error => {
    console.error('Error while creating tables:', error);
  });

function startServer() {
  // Use routes
  app.use('/todos', todosRoutes);
  app.use('/users', usersRoutes);

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  app.post('/users/check', validateAccessToken, (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
      if (err) {
        return res.status(401).json(err);
        // return res.status(403).json({ error: 'Invalid access token' });
      } else {
        
        res.json({
          message: "user accessed",
          authData
        });
      }
    });
  });
}

