const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); // CORS importieren

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // CORS für alle Routen aktivieren

// Daten aus der JSON-Datei laden
let tiere = [];
try {
  const data = fs.readFileSync('tiere.json');
  tiere = JSON.parse(data);
} catch (err) {
  console.error('Fehler beim Laden der tiere.json:', err);
}

// Daten in der JSON-Datei speichern
function saveTiere() {
  fs.writeFileSync('tiere.json', JSON.stringify(tiere, null, 2));
}

// 1. GET /tiere
app.get('/tiere', (req, res) => {
  res.json(tiere);
});

// 2. GET /tiere/search?art=hund
app.get('/tiere/search', (req, res) => {
  const art = req.query.art;
  if (!art) {
    return res.status(400).json({ error: 'Art Parameter fehlt.' });
  }

  const gefilterteTiere = tiere.filter(tier => tier.art.toLowerCase() === art.toLowerCase());
  res.json(gefilterteTiere);
});

// 3. GET /tiere/:id
app.get('/tiere/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tier = tiere.find(tier => tier.id === id);

  if (!tier) {
    return res.status(404).json({ error: 'Tier nicht gefunden.' });
  }

  res.json(tier);
});

// 4. POST /tiere
app.post('/tiere', (req, res) => {
  const neuesTier = req.body;

  if (!neuesTier.name || !neuesTier.art || !neuesTier.alter) {
    return res.status(400).json({ error: 'Name, Art und Alter sind erforderlich.' });
  }

  neuesTier.id = tiere.length + 1;
  tiere.push(neuesTier);
  saveTiere(); // Daten speichern
  res.status(201).json(neuesTier);
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});