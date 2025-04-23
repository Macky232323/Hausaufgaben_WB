const express = require("express");
const app = express();
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER, // Dein PostgreSQL-Benutzername
  host: process.env.DB_HOST, // z. B. 'localhost'
  database: process.env.DB_NAME, // Name deiner Datenbank
  password: process.env.DB_PASSWORD, // Dein Passwort
  port: process.env.DB_PORT, // Standardport für PostgreSQL
});

const createTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
    CREATE TABLE IF NOT EXISTS tiere (
    id SERIAL PRIMARY KEY,
    tierart VARCHAR(50),
    name VARCHAR(50),
    krankheit VARCHAR(100),
    age INT,
    gewicht REAL);
        `);
    console.log("✅ Table 'users' created!");
  } catch (err) {
    console.error("❌ Error creating table:", err);
  } finally {
    client.release();
  }
};

createTable();

app.use(express.json()); // Ermöglicht Express Json aus einem Body auszulesen
app.use(express.static("public"));

app.get("/tiere", async (req, res) => {
  const result = await pool.query("SELECT * FROM tiere");
  res.json(result.rows);
});

app.post("/tiere", async (req, res) => {
  const { tierart, name, krankheit, age, gewicht } = req.body;
  await pool.query(
    `INSERT INTO tiere (tierart, name, krankheit, age, gewicht)
     VALUES ($1, $2, $3, $4, $5)`,
    [tierart, name, krankheit, age, gewicht]
  );
  res.status(201).send("Tier wurde erfolgreich hinzugefügt");
});

// app.delete("/tiere/:id", (req, res) => {
//   const id = req.params.id;
//   db.run(`DELETE FROM tiere WHERE id = ?`, [id]);
//   res.send("Eintrag gelöscht");
// });

app.listen(3000);