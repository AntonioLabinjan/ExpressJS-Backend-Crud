// index.js
// Minimalistic CRUD To‑Do backend in a single file 
//
// Run:   npm init -y && npm i express cors
// Start: node server.js
//
// For dev auto‑reload install nodemon globally (npm i -g nodemon)
// then run: nodemon server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ────────────────────────────────────────────────────────────
// Middlewares
// ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json()); // parses application/json bodies

// ────────────────────────────────────────────────────────────
// In‑memory “database” (array) – swap with real DB when needed
// ────────────────────────────────────────────────────────────
let todos = [];          // { id:number, title:string, done:boolean }
let nextId = 1;

// ────────────────────────────────────────────────────────────
// CRUD Routes
// ────────────────────────────────────────────────────────────

// 1) Create
app.post('/todos', (req, res) => {
  const { title, done = false } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  const todo = { id: nextId++, title: title.trim(), done: !!done };
  todos.push(todo);
  res.status(201).json(todo);
});

// 2) Read all
app.get('/todos', (_req, res) => {
  res.json(todos);
});

// 3) Read one
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.json(todo);
});

// 4) Update
app.put('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Not found' });

  const { title, done } = req.body;
  if (title !== undefined) {
    if (!title.trim()) return res.status(400).json({ error: 'Title cannot be empty' });
    todo.title = title.trim();
  }
  if (done !== undefined) todo.done = !!done;

  res.json(todo);
});

// 5) Delete
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  const deleted = todos.splice(index, 1)[0];
  res.json(deleted);
});

// ────────────────────────────────────────────────────────────
// Startup
// ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(` Server dela na http://localhost:${PORT}`);
});
