# Backend API Example

This is a simple Node.js/Express backend example for the Event Board application.

## Setup

1. Create a new directory for your backend:
```bash
mkdir event-board-api
cd event-board-api
```

2. Initialize npm and install dependencies:
```bash
npm init -y
npm install express cors uuid body-parser
npm install -D nodemon
```

3. Create the server file (`server.js`):

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (replace with database in production)
let boards = [];
let themes = [
  {
    id: 'birthday',
    name: 'Birthday Party',
    backgroundColor: '#FFF5E6',
    primaryColor: '#FF6B9D',
    secondaryColor: '#C44569',
    textColor: '#333333',
    fontFamily: 'Comic Sans MS, cursive'
  },
  {
    id: 'farewell',
    name: 'Farewell',
    backgroundColor: '#E8F4F8',
    primaryColor: '#4A90E2',
    secondaryColor: '#2E5C8A',
    textColor: '#2C3E50',
    fontFamily: 'Georgia, serif'
  },
  {
    id: 'appreciation',
    name: 'Team Appreciation',
    backgroundColor: '#FFF8DC',
    primaryColor: '#F39C12',
    secondaryColor: '#E67E22',
    textColor: '#34495E',
    fontFamily: 'Verdana, sans-serif'
  },
  {
    id: 'celebration',
    name: 'Celebration',
    backgroundColor: '#F0E6FF',
    primaryColor: '#9B59B6',
    secondaryColor: '#8E44AD',
    textColor: '#2C3E50',
    fontFamily: 'Trebuchet MS, sans-serif'
  }
];

// Helper functions
function generateId() {
  return uuidv4();
}

function generateShareLink() {
  return Math.random().toString(36).substring(2, 15);
}

// Board routes
app.get('/api/boards', (req, res) => {
  res.json(boards);
});

app.get('/api/boards/:id', (req, res) => {
  const board = boards.find(b => b.id === req.params.id);
  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }
  res.json(board);
});

app.get('/api/boards/share/:shareLink', (req, res) => {
  const board = boards.find(b => b.shareLink === req.params.shareLink);
  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }
  res.json(board);
});

app.post('/api/boards', (req, res) => {
  const newBoard = {
    ...req.body,
    id: generateId(),
    createdAt: new Date(),
    shareLink: generateShareLink(),
    messages: []
  };
  
  boards.push(newBoard);
  res.status(201).json(newBoard);
});

app.put('/api/boards/:id', (req, res) => {
  const boardIndex = boards.findIndex(b => b.id === req.params.id);
  if (boardIndex === -1) {
    return res.status(404).json({ error: 'Board not found' });
  }
  
  boards[boardIndex] = { ...boards[boardIndex], ...req.body };
  res.json(boards[boardIndex]);
});

app.delete('/api/boards/:id', (req, res) => {
  const boardIndex = boards.findIndex(b => b.id === req.params.id);
  if (boardIndex === -1) {
    return res.status(404).json({ error: 'Board not found' });
  }
  
  boards.splice(boardIndex, 1);
  res.status(204).send();
});

// Message routes
app.get('/api/boards/:boardId/messages', (req, res) => {
  const board = boards.find(b => b.id === req.params.boardId);
  if (!board) {
    return res.status(404).json({ error: 'Board not found' });
  }
  res.json(board.messages);
});

app.post('/api/boards/:boardId/messages', (req, res) => {
  const boardIndex = boards.findIndex(b => b.id === req.params.boardId);
  if (boardIndex === -1) {
    return res.status(404).json({ error: 'Board not found' });
  }
  
  const newMessage = {
    ...req.body,
    id: generateId(),
    boardId: req.params.boardId,
    createdAt: new Date(),
    // Position is included from the request body if provided
    // The frontend will calculate and send the position
  };
  
  boards[boardIndex].messages.push(newMessage);
  
  // Sort messages by position (with unpositioned messages at the end)
  boards[boardIndex].messages.sort((a, b) => {
    const posA = a.position ?? Number.MAX_SAFE_INTEGER;
    const posB = b.position ?? Number.MAX_SAFE_INTEGER;
    return posA - posB;
  });
  
  res.status(201).json(newMessage);
});

app.delete('/api/boards/:boardId/messages/:messageId', (req, res) => {
  const boardIndex = boards.findIndex(b => b.id === req.params.boardId);
  if (boardIndex === -1) {
    return res.status(404).json({ error: 'Board not found' });
  }
  
  const messageIndex = boards[boardIndex].messages.findIndex(m => m.id === req.params.messageId);
  if (messageIndex === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }
  
  boards[boardIndex].messages.splice(messageIndex, 1);
  res.status(204).send();
});

// Theme routes
app.get('/api/themes', (req, res) => {
  res.json(themes);
});

app.get('/api/themes/:id', (req, res) => {
  const theme = themes.find(t => t.id === req.params.id);
  if (!theme) {
    return res.status(404).json({ error: 'Theme not found' });
  }
  res.json(theme);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

4. Add scripts to `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

5. Run the server:
```bash
npm run dev
```

## Database Integration

For production, replace the in-memory storage with a proper database:

### MongoDB Example:
```bash
npm install mongoose
```

```javascript
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eventboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schemas
const boardSchema = new mongoose.Schema({
  title: String,
  description: String,
  occasion: String,
  recipientName: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  themeId: String,
  shareLink: String,
  isPublic: Boolean,
  messages: [{
    id: String,
    authorName: String,
    content: String,
    mediaUrl: String,
    mediaType: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const Board = mongoose.model('Board', boardSchema);
```

### PostgreSQL Example:
```bash
npm install pg sequelize
```

```javascript
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

const Board = sequelize.define('Board', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  // ... other fields
});

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  authorName: DataTypes.STRING,
  content: DataTypes.TEXT,
  // ... other fields
});

Board.hasMany(Message);
Message.belongsTo(Board);
```

## Security Considerations

For production, consider adding:
- Authentication middleware
- Input validation
- Rate limiting
- HTTPS
- Environment variables for configuration
- Proper error handling
- Logging