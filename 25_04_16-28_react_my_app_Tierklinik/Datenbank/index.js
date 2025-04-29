const express = require("express");
 const multer = require('multer');
 const path = require('path');
 const fs = require('fs').promises; // Use promise-based fs for async/await
 const cors = require('cors');
 const sqlite3 = require("sqlite3").verbose();
 const { open } = require('sqlite'); // sqlite wrapper for async/await support

 const app = express();
 const port = 3001;

 // --- Configuration ---
 const UPLOAD_DIR = path.join(__dirname, '../public/assets');
 const DB_PATH = path.join(__dirname, 'tiere.db');
 const DEFAULT_IMAGE = 'default.png';

 // Global database handle (initialized later)
 let db;

 // --- Middleware ---
 app.use(cors());
 app.use(express.json());
 // Serve static files from the assets directory
 app.use('/assets', express.static(UPLOAD_DIR));

 // --- Multer Setup ---
 const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
  try {
  await fs.mkdir(UPLOAD_DIR, { recursive: true }); // Ensure directory exists
  cb(null, UPLOAD_DIR);
  } catch (err) {
  console.error("Error ensuring upload directory exists:", err);
  cb(err);
  }
  },
  filename: (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
 });
 const upload = multer({ storage: storage });

 // --- Helper Functions ---

 // Helper for handling file deletion, ignores "not found" errors
 const deleteFileIfExists = async (filePath) => {
  try {
  await fs.unlink(filePath);
  console.log(`Deleted file: ${filePath}`);
  } catch (err) {
  if (err.code !== 'ENOENT') { // Ignore file not found errors
  console.error(`Error deleting file ${filePath}:`, err);
  }
  }
 };

 // Helper to run database operations with error handling
 const runDbOperation = async (query, params = []) => {
  try {
  return await db.run(query, params);
  } catch (err) {
  console.error(`Database error for query "${query}" with params ${JSON.stringify(params)}:`, err.message);
  throw new Error('Datenbankfehler'); // Generic error for client
  }
 };

 const getDbOperation = async (query, params = []) => {
  try {
  return await db.get(query, params);
  } catch (err) {
  console.error(`Database error for query "${query}" with params ${JSON.stringify(params)}:`, err.message);
  throw new Error('Datenbankfehler');
  }
 };

 const allDbOperation = async (query, params = []) => {
  try {
  return await db.all(query, params);
  } catch (err) {
  console.error(`Database error for query "${query}" with params ${JSON.stringify(params)}:`, err.message);
  throw new Error('Datenbankfehler');
  }
 };


 // --- Database Initialization ---
 async function initializeDatabase() {
  try {
  db = await open({
  filename: DB_PATH,
  driver: sqlite3.Database
  });
  console.log("Database connected successfully.");

  // Enable foreign key constraints
  await db.run('PRAGMA foreign_keys = ON;');

  // Create tables if they don't exist
  await runDbOperation(`
  CREATE TABLE IF NOT EXISTS tiere (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  art TEXT NOT NULL,
  age TEXT,
  gewicht TEXT,
  bild TEXT,
  krankheit TEXT
  );
  `);
  console.log("'tiere' table checked/created.");

  await runDbOperation(`
  CREATE TABLE IF NOT EXISTS anamnese (
  tier_id INTEGER PRIMARY KEY,
  text TEXT,
  FOREIGN KEY (tier_id) REFERENCES tiere(id) ON DELETE CASCADE
  );
  `);
  console.log("'anamnese' table checked/created.");

  const countResult = await getDbOperation("SELECT COUNT(*) as count FROM tiere");
  console.log(`Initial loaded animals count: ${countResult.count}`);

  } catch (err) {
  console.error("FATAL: Database initialization failed:", err.message);
  process.exit(1); // Exit if DB can't be initialized
  }
 }

 // --- API Routes ---

 // Root check
 app.get("/", (req, res) => {
  res.send("Die Tierklinik-Techstarter API funktioniert!");
 });

 // GET all animals (with optional sorting)
 app.get("/tiere", async (req, res, next) => {
  try {
  let query = `SELECT * FROM tiere`;
  const queryParams = [];
  const validSortColumns = ['name', 'gewicht', 'age', 'art', 'krankheit', 'id'];

  if (req.query.krankheit) {
  query += ` WHERE krankheit = ?`;
  queryParams.push(req.query.krankheit);
  }

  if (req.query.sort) {
  const sortParam = req.query.sort.toLowerCase();
  if (validSortColumns.includes(sortParam)) {
  query += ` ORDER BY ${sortParam} ASC`;
  } else {
  console.warn(`Invalid sort parameter: ${req.query.sort}`);
  // Optional: return 400 for invalid sort
  // return res.status(400).send("Ungültiger Sortierparameter.");
  }
  }

  const rows = await allDbOperation(query, queryParams);
  res.json(rows);
  } catch (err) {
  next(err); // Forward error to the error handler
  }
 });


 // GET single animal by ID
 app.get("/tiere/:id", async (req, res, next) => {
  try {
  const id = req.params.id;
  const query = `SELECT * FROM tiere WHERE id = ?`;
  const tier = await getDbOperation(query, [id]);

  if (!tier) {
  return res.status(404).send(`Tier mit der ID ${id} nicht gefunden.`);
  }
  res.json(tier);
  } catch (err) {
  next(err);
  }
 });

 // GET anamnese by animal ID
 app.get("/Anamnese/:id", async (req, res, next) => {
  try {
  const id = req.params.id;
  const query = `SELECT text FROM anamnese WHERE tier_id = ?`;
  const anamnese = await getDbOperation(query, [id]);

  // Send empty string if no anamnese exists, not an error
  res.send(anamnese ? anamnese.text : '');
  } catch (err) {
  next(err);
  }
 });

 // POST new animal
 app.post("/tiere", upload.single('bild'), async (req, res, next) => {
  const { art, name, krankheit, age, gewicht, anamnese } = req.body;
  const bildFile = req.file;
  const bildFilename = bildFile ? bildFile.filename : DEFAULT_IMAGE;

  // Validation
  if (!art || !name || !age || !gewicht || !krankheit || !anamnese) {
  if (bildFile) await deleteFileIfExists(bildFile.path); // Clean up uploaded file
  return res.status(400).send("Fehler: Alle Textfelder sind Pflichtfelder.");
  }

  try {
  await runDbOperation('BEGIN TRANSACTION');

  const tierInsertResult = await runDbOperation(
  `INSERT INTO tiere (art, name, krankheit, age, gewicht, bild) VALUES (?, ?, ?, ?, ?, ?)`,
  [art, name, krankheit, age, gewicht, bildFilename]
  );

  const tierId = tierInsertResult.lastID;

  await runDbOperation(
  `INSERT INTO anamnese (tier_id, text) VALUES (?, ?)`,
  [tierId, anamnese]
  );

  await runDbOperation('COMMIT');
  res.status(201).json({ id: tierId, message: `Tier mit ID ${tierId} erfolgreich hinzugefügt.` });

  } catch (err) {
  await runDbOperation('ROLLBACK');
  if (bildFile) await deleteFileIfExists(bildFile.path); // Clean up on error
  next(err); // Forward to error handler
  }
 });


 // PUT update animal by ID
 app.put("/tiere/:id", upload.single('bild'), async (req, res, next) => {
  const id = req.params.id;
  const { art, name, krankheit, age, gewicht, anamnese, oldBild } = req.body;
  const newBildFile = req.file;
  let updatedTierData = {};
  let oldBildPathToDelete = null;

  try {
  // Check if tier exists first
  const currentTier = await getDbOperation('SELECT bild FROM tiere WHERE id = ?', [id]);
  if (!currentTier) {
  if (newBildFile) await deleteFileIfExists(newBildFile.path);
  return res.status(404).send(`Tier mit der ID ${id} nicht gefunden.`);
  }

  const updateFields = [];
  const updateValues = [];

  // Build dynamic query parts for 'tiere' table
  if (art !== undefined) { updateFields.push("art = ?"); updateValues.push(art); }
  if (name !== undefined) { updateFields.push("name = ?"); updateValues.push(name); }
  if (krankheit !== undefined) { updateFields.push("krankheit = ?"); updateValues.push(krankheit); }
  if (age !== undefined) { updateFields.push("age = ?"); updateValues.push(age); }
  if (gewicht !== undefined) { updateFields.push("gewicht = ?"); updateValues.push(gewicht); }
  if (newBildFile) {
  updateFields.push("bild = ?");
  updateValues.push(newBildFile.filename);
  // Mark old image for deletion if it's not the default one
  if (currentTier.bild && currentTier.bild !== DEFAULT_IMAGE) {
  oldBildPathToDelete = path.join(UPLOAD_DIR, currentTier.bild);
  }
  }

  if (updateFields.length === 0 && anamnese === undefined) {
  if (newBildFile) await deleteFileIfExists(newBildFile.path); // Clean up unused new file
  return res.status(400).send("Fehler: Keine Felder zum Aktualisieren angegeben.");
  }

  // --- Transaction ---
  await runDbOperation('BEGIN TRANSACTION');

  // Update 'tiere' table if needed
  if (updateFields.length > 0) {
  const updateTierQuery = `UPDATE tiere SET ${updateFields.join(", ")} WHERE id = ?`;
  updateValues.push(id);
  await runDbOperation(updateTierQuery, updateValues);
  }

  // Update or Insert 'anamnese' table if provided
  if (anamnese !== undefined) {
  const upsertAnamneseQuery = `INSERT INTO anamnese (tier_id, text) VALUES (?, ?)
  ON CONFLICT(tier_id) DO UPDATE SET text = excluded.text;`;
  await runDbOperation(upsertAnamneseQuery, [id, anamnese]);
  }

  // Commit transaction
  await runDbOperation('COMMIT');

  // Delete old image file *after* successful commit
  if (oldBildPathToDelete) {
  await deleteFileIfExists(oldBildPathToDelete);
  }

  // Fetch and return the updated tier data
  updatedTierData = await getDbOperation('SELECT * FROM tiere WHERE id = ?', [id]);
  res.json(updatedTierData);

  } catch (err) {
  await runDbOperation('ROLLBACK'); // Rollback on any error
  if (newBildFile) await deleteFileIfExists(newBildFile.path); // Clean up new file on error
  next(err); // Forward to error handler
  }
 });


 // DELETE animal by ID
 app.delete("/tiere/:id", async (req, res, next) => {
  const id = req.params.id;
  let imagePathToDelete = null;

  try {
  // Get current image filename *before* starting transaction
  const tier = await getDbOperation('SELECT bild FROM tiere WHERE id = ?', [id]);
  if (!tier) {
  return res.status(404).send(`Tier mit der ID ${id} nicht gefunden.`);
  }
  if (tier.bild && tier.bild !== DEFAULT_IMAGE) {
  imagePathToDelete = path.join(UPLOAD_DIR, tier.bild);
  }

  // Transaction for deletion (Anamnese is deleted via CASCADE)
  await runDbOperation('BEGIN TRANSACTION');
  const result = await runDbOperation('DELETE FROM tiere WHERE id = ?', [id]);
  await runDbOperation('COMMIT');

  if (result.changes === 0) {
  // Should have been caught by the check above, but for safety
  return res.status(404).send(`Tier mit der ID ${id} konnte nicht gelöscht werden (nicht gefunden).`);
  }

  // Delete image file *after* successful commit
  if (imagePathToDelete) {
  await deleteFileIfExists(imagePathToDelete);
  }

  res.status(200).send(`Tier mit der ID ${id} erfolgreich gelöscht.`);

  } catch (err) {
  // Rollback might fail if the error occurred before BEGIN, but try anyway
  try { await runDbOperation('ROLLBACK'); } catch (rbErr) { console.error("Rollback failed:", rbErr);}
  next(err);
  }
 });


 // --- Global Error Handler ---
 app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message || err); // Log the full error stack
  // Avoid sending detailed error messages to the client in production
  const statusCode = err.status || 500;
  const message = (statusCode === 500 && process.env.NODE_ENV === 'production')
  ? 'Ein interner Serverfehler ist aufgetreten.'
  : err.message || 'Ein unbekannter Fehler ist aufgetreten.';
  res.status(statusCode).send(message);
 });


 // --- Server Start ---
 (async () => {
  await initializeDatabase(); // Wait for DB before starting server
  app.listen(port, () => {
  console.log(`-----\nServer listening on port ${port}`);
  console.log(`Static files served from: ${UPLOAD_DIR}\n-----`);
  });
 })(); // Immediately Invoked Function Expression (IIFE) to use async/await at top level

 // --- Graceful Shutdown ---
 const cleanup = async () => {
  console.log("\nClosing database connection...");
  try {
  if (db) {
  await db.close();
  console.log("Database connection closed.");
  }
  process.exit(0);
  } catch (err) {
  console.error("Error closing database:", err.message);
  process.exit(1);
  }
 };

 process.on('SIGINT', cleanup); // Ctrl+C
 process.on('SIGTERM', cleanup); // Termination signal