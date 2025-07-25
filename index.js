const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let todos = [];
let nextId = 1;

app.post('/todos', (req, res) => {
  const { title, done = false } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  const todo = { id: nextId++, title: title.trim(), done: !!done };
  todos.push(todo);
  res.status(201).json(todo);
});

app.get('/todos', (_req, res) => {
  res.json(todos);
});

app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.json(todo);
});

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

app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  const deleted = todos.splice(index, 1)[0];
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server dela na http://localhost:${PORT}`);
});
