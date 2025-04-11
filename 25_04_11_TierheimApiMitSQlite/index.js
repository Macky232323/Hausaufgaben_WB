const express = require("express")
const app = express()
const sqlite3 = require("sqlite3")

// Middleware, um JSON-Daten im Request Body zu verarbeiten
app.use(express.json())

const db = new sqlite3.Database(":memory:")

db.serialize(() => {
    db.run( `CREATE TABLE tiere (
        id INTEGER PRIMARY KEY,
        tierart VARCHAR(50),
        name VARCHAR(50),
        krankheit VARCHAR(100),
        age INT,
        gewicht REAL);`)
    db.run(`INSERT INTO tiere(tierart,name,krankheit,age,gewicht) VALUES ("Hund","Bello","husten",5,12.4)`)
    db.run(`INSERT INTO tiere(tierart,name,krankheit,age,gewicht) VALUES ("Katze","Minka",null,3,3.1)`)
    db.run(`INSERT INTO tiere(tierart,name,krankheit,age,gewicht) VALUES ("Hase","Hoppel","schnupfen",1,1.8)`)

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
    const { tierart, name, krankheit, age, gewicht } = req.body;

    if (!tierart || !name || age === undefined || gewicht === undefined) {
        return res.status(400).send("Fehler: 'tierart', 'name', 'age' und 'gewicht' sind Pflichtfelder.");
    }

    db.run(`INSERT INTO tiere (tierart, name, krankheit, age, gewicht) VALUES (?, ?, ?, ?, ?)`,
        [tierart, name, krankheit, age, gewicht],
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
    const { tierart, name, krankheit, age, gewicht } = req.body;
    const updateTierQuery = `UPDATE tiere SET tierart = ?, name = ?, krankheit = ?, age = ?, gewicht = ? WHERE id = ?`;

    db.run(updateTierQuery, [tierart, name, krankheit, age, gewicht, id], function(err) {
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

app.listen(3000, () => {
    console.log("Server listening on port 3000");
})