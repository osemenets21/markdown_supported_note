const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route to get all notes
app.get('/api/notes', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ notes: rows });
  });
});

// Route to create a new note
app.post('/api/notes', (req, res) => {
  const { title, content, tags } = req.body;
  db.run('INSERT INTO notes (title, content, tags) VALUES (?, ?, ?)', [title, content, tags], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Route to update an existing note
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  db.run('UPDATE notes SET title = ?, content = ?, tags = ? WHERE id = ?', [title, content, tags, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ updatedID: id });
  });
});

// Route to delete a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM notes WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deletedID: id });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
