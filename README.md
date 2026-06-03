# 📝 குறிப்புகள் — Notes App

Tamil Notes App built with Node.js 24 (ESM) + Express backend and a beautiful paper-aesthetic frontend.

## 🚀 Setup & Run

```bash
# Install dependencies
npm install

# Start server
npm start

# Or with hot-reload
npm run dev
```

Open **http://localhost:3000** in your browser.

## 📁 Project Structure

```
notes-app/
├── server.js          # Node.js 24 + Express backend (ESM)
├── package.json
├── public/
│   └── index.html     # Frontend (HTML + CSS + Vanilla JS)
└── data/
    └── notes.json     # Auto-created JSON storage
```

## 🔌 API Endpoints

| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| GET    | /api/notes         | Get all notes       |
| POST   | /api/notes         | Create a new note   |
| PUT    | /api/notes/:id     | Update a note       |
| DELETE | /api/notes/:id     | Delete a note       |

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + N` — New note
- `Escape` — Close modal

## 🛠 Tech Stack

- **Backend**: Node.js 24 (ES Modules), Express 5
- **Storage**: JSON file (no database needed)
- **Frontend**: Vanilla HTML/CSS/JS — Paper aesthetic, Tamil UI
