const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'historico.json');

app.use(cors());
app.use(express.json());

// Leer histórico desde archivo
function readHistorico() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Guardar histórico en archivo
function writeHistorico(historico) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(historico, null, 2));
}

// GET /historico
app.get('/historico', (req, res) => {
  const historico = readHistorico();
  res.json(historico);
});

// POST /historico
app.post('/historico', (req, res) => {
  const historico = readHistorico();
  const nuevo = req.body;
  historico.unshift(nuevo); // Agrega al inicio
  writeHistorico(historico);
  res.status(201).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
}); 