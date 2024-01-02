require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const connectionString = 'postgres://postgres:123456@localhost:5432/tododb';
const jwt = require('jsonwebtoken');

const db = pgp(connectionString);

async function testConnection() {
  const c = await db.connect(); 
  c.done(); 
  return c.client.serverVersion
}

testConnection();

const app = express();
app.use(cors());
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create the 'todos' table if it does not exist
db.none(`
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

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const todos = await db.any('SELECT * FROM todos');
    res.json(todos);
  } catch (error) {
    console.error('Error executing PostgreSQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific todo
app.get('/todos/:id', async (req, res) => {
  const todoId = parseInt(req.params.id);

  try {
    const todo = await db.oneOrNone('SELECT * FROM todos WHERE id = $1', [todoId]);

    if (!todo) {
      return res.status(404).json({ error: ' requested task not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error('Error executing PostgreSQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new todo
app.post('/todos', async (req, res) => {
  const { task, completed } = req.body;

  if (!task) {
    return res.status(400).json({ error: 'you must enter task' });
  }

  try {
    const newTodo = await db.one('INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *', [task, completed || false]);
    res.json(newTodo);
  } catch (error) {
    console.error('Error executing PostgreSQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  const todoId = parseInt(req.params.id);
  const { task, completed } = req.body;

  try {
    const updatedTodo = await db.oneOrNone('UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *', [task, completed || false, todoId]);

    if (!updatedTodo) {
      return res.status(404).json({ error: 'requested todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error('Error executing PostgreSQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const todoId = parseInt(req.params.id);
  

  try {
    const result = await db.result('DELETE FROM todos WHERE id = $1', [todoId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'requested todo not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error executing PostgreSQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10); 
    return hash;
  } catch (error) {
    throw error;
  }
};
const comparePassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    throw error;
  }
};

db.none(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    REFRESH_TOKEN VARCHAR(500) NOT NULL
  )
`).then(() => {
  console.log('Table created or already exists');
}).catch(error => {
  console.error('Error creating table:', error);
});
// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await db.any('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    console.error('Error executing PostgreSQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific user
app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [userId]);

    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error executing PostgreSQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  const { username, password } = req.body; 

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'password is required' });
  }
  try {
    const hashedPassword = await hashPassword(password); 
    const refreshToken = generateRefreshToken(); 
    const newTodo = await db.one('INSERT INTO users (username, password, refresh_token) VALUES ($1, $2, $3) RETURNING *', [username, hashedPassword, refreshToken]); 
    res.json(newTodo);
  } catch (error) {
    console.error('Error executing PostgreSQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
app.post('/users/signIn', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userRecord = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

    if (!userRecord) {
      console.log("User not found");
      return res.status(401).json({ error: "Login failed" });
    }

    const isPasswordValid = await comparePassword(password, userRecord.password);

    if (isPasswordValid) {
      const accessToken = jwt.sign({ userId: userRecord.id, username: userRecord.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
      const refreshToken = userRecord.refresh_token;

      console.log("Logged in successfully");
      res.status(200).json({ message: "Logged in successfully", accessToken, refreshToken });
    } else {
      console.log("Login failed");
      res.status(401).json({ error: "Login failed" });
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  const generateRefreshToken = () => {
    return uuidv4();
  };
  
  const validateRefreshToken = async (refreshToken) => {
    try {
      // Check if the refresh token exists in the database
      const result = await db.oneOrNone('SELECT id FROM users WHERE refresh_token = $1', [refreshToken]);
  
      // Return true if the refresh token exists, false otherwise
      return result !== null;
    } catch (error) {
      console.error('Error validating refresh token:', error);
      return false;
    }
  };
  

  const getUserByRefreshToken = async (refreshToken) => {
    try {
      // Retrieve user information based on the refresh token
      const userRecord = await db.oneOrNone('SELECT id FROM users WHERE refresh_token = $1', [refreshToken]);
  
      // Return the user object if found, null otherwise
      return userRecord;
    } catch (error) {
      console.error('Error retrieving user by refresh token:', error);
      return null;
    }
  };

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

  function validateAccessToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Access token missing' });
    }
  
    // Split the token correctly
    const bearer = token.split(" ");
    
    if (bearer.length !== 2) {
      return res.status(401).json({ error: 'Invalid access token format' });
    }
  
    req.token = bearer[1]; // Set the token in the request object
    next();
  }
 
  app.post('/users/refreshToken', async (req, res) => {
    const { refreshToken } = req.body;
    try {
      // Check if the refresh token is valid
      const isValidRefreshToken = await validateRefreshToken(refreshToken);
  
      if (!isValidRefreshToken) {
        return res.status(401).json({ error: 'Invalid refr token' });
      }
  
      // Obtain user information from the refresh token
      const userRecord = await getUserByRefreshToken(refreshToken);
  
      if (!userRecord) {
        return res.status(401).json({ error: 'Invalid user token' });
      }
  
      // Generate a new access token
      //const newAccessToken = jwt.sign({ userId: userRecord.id, username: userRecord.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
      const newAccessToken = jwt.sign(
        { userId: userRecord.id, username: userRecord.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
      );
      console.log("Access token refreshed successfully");
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
