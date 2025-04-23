const express = require("express")
 const app = express()
 const sqlite3 = require("sqlite3")
 const fs = require('fs');
 const cors = require('cors'); // CORS importieren
 

 // Middleware, um JSON-Daten im Request Body zu verarbeiten
 app.use(express.json())
 app.use(express.static("public"))
 app.use(cors()); // CORS für alle Routen aktivieren
 

 const db = new sqlite3.Database("tiere.db")
 

 db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS tiere (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  art TEXT,
  age TEXT,
  gewicht TEXT,
  bild TEXT,
  krankheit TEXT
  );
  `);
  //db.run(`INSERT INTO tiere(art,name,krankheit,age,gewicht,bild) VALUES ("Hund","Bello","husten","5","12.4","default.png")`)
  //db.run(`INSERT INTO tiere(art,name,krankheit,age,gewicht,bild) VALUES ("Katze","Minka",null,"3","3.1", "default.png")`)
  //db.run(`INSERT INTO tiere(art,name,krankheit,age,gewicht,bild) VALUES ("Hase","Hoppel","schnupfen","1","1.8","hoppel.jpg")`)
 

  selectAllTiereQuery = `SELECT * FROM tiere`
  db.all(selectAllTiereQuery, (err,rows) => {
  if(err){
  console.log(err)
  }else {
  console.log("Initial geladene Tiere:", rows)
  }
  })
  process.on("exit", () => {
  db.close()
  })
 })
 

 app.get("/", (req,res) => {
  res.send("Die Tierheim-API funktioniert!")
 })
 

 // 1. GET /tiere/:id
 app.get("/tiere/:id", (req, res) => {
  const id = req.params.id;
  const selectTierByIdQuery = `SELECT * FROM tiere WHERE id = ?`;
 

  db.get(selectTierByIdQuery, [id], (err, row) => {
  if (err) {
  console.error(err);
  return res.status(500).send("Fehler beim Abrufen des Tieres aus der Datenbank.");
  }
  if (!row) {
  return res.status(404).send(`Tier mit der ID ${id} nicht gefunden.`);
  }
  res.json(row);
  });
 });
 

 app.get("/tiere", (req,res) => {
  let query = selectAllTiereQuery;
  const queryParams = [];
 

  if (req.query.krankheit) {
  query = `SELECT * FROM tiere WHERE krankheit = ?`;
  queryParams.push(req.query.krankheit);
  } else if (req.query.sort) {
  const sortParam = req.query.sort.toLowerCase();
  if (sortParam === 'name') {
  query = `SELECT * FROM tiere ORDER BY name ASC`;
  } else if (sortParam === 'gewicht') {
  query = `SELECT * FROM tiere ORDER BY gewicht ASC`;
  } else if (sortParam === 'age') {
            query = `SELECT * FROM tiere ORDER BY age ASC`;
        }
  }
 

  db.all(query, queryParams, (err, rows) => {
  if(err){
  console.error(err);
  return res.status(500).send("Fehler bei der Datenbankabfrage.");
  }
  res.json(rows);
  });
 });
 

 app.post("/tiere", (req,res) => {
  const { art, name, krankheit, age, gewicht, bild } = req.body;
 

  if (!art || !name || age === undefined || gewicht === undefined || !bild || !krankheit) {
  return res.status(400).send("Fehler: 'art', 'name', 'age', 'gewicht', 'bild' und 'krankheit' sind Pflichtfelder.");
  }
 

  db.run(`INSERT INTO tiere (art, name, krankheit, age, gewicht, bild) VALUES (?, ?, ?, ?, ?, ?)`,
  [art, name, krankheit, age, gewicht, bild],
  function(err) {
  if (err) {
  console.error(err);
  return res.status(500).send("Fehler beim Einfügen des Tieres in die Datenbank.");
  }
  res.status(201).send(`Tier mit der ID ${this.lastID} wurde erfolgreich hinzugefügt.`);
  });
 })
 

 // 2. PUT /tiere/:id
 app.put("/tiere/:id", (req, res) => {
  const id = req.params.id;
  const { art, name, krankheit, age, gewicht, bild } = req.body;
  let updateFields = [];
  let updateValues = [];
 

  if (art !== undefined) {
  updateFields.push("art = ?");
  updateValues.push(art);
  }
  if (name !== undefined) {
  updateFields.push("name = ?");
  updateValues.push(name);
  }
  if (krankheit !== undefined) {
  updateFields.push("krankheit = ?");
  updateValues.push(krankheit);
  }
  if (age !== undefined) {
  updateFields.push("age = ?");
  updateValues.push(age);
  }
  if (gewicht !== undefined) {
  updateFields.push("gewicht = ?");
  updateValues.push(gewicht);
  }
  if (bild !== undefined) {
            updateFields.push("bild = ?");
            updateValues.push(bild);
        }
 

  if (updateFields.length === 0) {
  return res.status(400).send("Fehler: Es wurden keine Felder zum Aktualisieren im Request Body gefunden.");
  }
 

  const updateQuery = `UPDATE tiere SET ${updateFields.join(", ")} WHERE id = ?`;
  updateValues.push(id);
 

  db.run(updateQuery, updateValues, function(err) {
  if (err) {
  console.error(err);
  return res.status(500).send("Fehler beim Aktualisieren des Tieres in der Datenbank.");
  }
  if (this.changes === 0) {
  return res.status(404).send(`Tier mit der ID ${id} nicht gefunden.`);
  }
  res.send(`Tier mit der ID ${id} wurde erfolgreich aktualisiert.`);
  });
 });
 

 // 3. DELETE /tiere/:id
 app.delete("/tiere/:id", (req, res) => {
  const id = req.params.id;
  const deleteTierQuery = `DELETE FROM tiere WHERE id = ?`;
 

  db.run(deleteTierQuery, [id], function(err) {
  if (err) {
  console.error(err);
  return res.status(500).send("Fehler beim Löschen des Tieres aus der Datenbank.");
  }
  if (this.changes === 0) {
  return res.status(404).send(`Tier mit der ID ${id} nicht gefunden.`);
  }
  res.send(`Tier mit der ID ${id} wurde erfolgreich gelöscht.`);
  });
 });
 

 app.listen(3001, () => {
  console.log("Server listening on port 3001");
 })