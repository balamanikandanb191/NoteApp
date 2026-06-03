import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Resolve writeable directory for data
let dataDir = path.join(__dirname, 'data');
try {
  await fs.mkdir(dataDir, { recursive: true });
  // Test write permission
  const testFile = path.join(dataDir, '.write-test');
  await fs.writeFile(testFile, '');
  await fs.unlink(testFile);
} catch (e) {
  console.warn('⚠️ Local directory not writeable, trying /home/data (Azure persistent storage)...');
  try {
    dataDir = path.join('/home', 'data');
    await fs.mkdir(dataDir, { recursive: true });
    const testFile = path.join(dataDir, '.write-test');
    await fs.writeFile(testFile, '');
    await fs.unlink(testFile);
  } catch (err) {
    console.warn('⚠️ /home/data not writeable, falling back to temp directory...');
    dataDir = path.join(os.tmpdir(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
  }
}
const DATA_FILE = path.join(dataDir, 'notes.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load notes from file
async function loadNotes() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save notes to file
async function saveNotes(notes) {
  await fs.writeFile(DATA_FILE, JSON.stringify(notes, null, 2));
}

// GET all notes
app.get('/api/notes', async (req, res) => {
  const notes = await loadNotes();
  res.json(notes);
});

// POST create note
app.post('/api/notes', async (req, res) => {
  const { title, content, color } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  const notes = await loadNotes();
  const note = {
    id: randomUUID(),
    title,
    content,
    color: color || '#f5f0e8',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  notes.unshift(note);
  await saveNotes(notes);
  res.status(201).json(note);
});

// PUT update note
app.put('/api/notes/:id', async (req, res) => {
  const notes = await loadNotes();
  const idx = notes.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  notes[idx] = { ...notes[idx], ...req.body, updatedAt: new Date().toISOString() };
  await saveNotes(notes);
  res.json(notes[idx]);
});

// DELETE note
app.delete('/api/notes/:id', async (req, res) => {
  let notes = await loadNotes();
  const exists = notes.find(n => n.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Note not found' });
  notes = notes.filter(n => n.id !== req.params.id);
  await saveNotes(notes);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Notes server running at http://localhost:${PORT}`);
});
