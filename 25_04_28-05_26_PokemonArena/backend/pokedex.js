const express = require('express');
const router = express.Router();

const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const port = 3001;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

router.get('/pokemon', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query(`SET search_path TO "${process.env.DB_SCHEMA1}";`);
        const result = await client.query(`SELECT * FROM pokemon`);
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error'); // Fehler an Client senden
    } finally {
        client.release();
    }
});

// Searchroute für die Eingabe des Namens durch den User
router.get('/pokemon/search', async (req, res) => {
    const client = await pool.connect();
    const userInput = req.query.name;
    try {
        await client.query(`SET search_path TO "${process.env.DB_SCHEMA1}";`);

        const result = await client.query(
            `SELECT 
                p.id AS pokemon_id,
                p.api_name AS pokemon_api_name,
                p.ger_name AS pokemon_ger_name,
                p.height AS pokemon_height,
                p.weight AS pokemon_weight,
                p.flavor_text AS pokemon_flavor_text,
                p.front_sprites AS pokemon_front_sprites,
            CASE 
                WHEN COUNT(pt.slot) = 1 THEN MAX(t.api_name)
                ELSE STRING_AGG(t.api_name, ', ')
            END AS typen
            FROM 
                pokemon p
            JOIN 
                pokemon_typ pt ON p.id = pt.pokemon_id
            JOIN 
                typ t ON pt.typ_id = t.id
            WHERE p.ger_name ILIKE $1
            GROUP BY 
                p.id, p.api_name, p.ger_name, p.height, p.weight, p.flavor_text, p.front_sprites
            ORDER BY 
                p.id;`, [`%${userInput}%`]);


        res.send(result.rows);

    } catch (error) {
        console.error('Fehler!', error);
        res.status(500).send('Server error'); // Fehler an Client senden
    } finally {
        client.release();
    }
});

// GET Route für ein Pokemon mit ID
router.get('/pokemon/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query(`SET search_path TO "${process.env.DB_SCHEMA1}";`);
        const result = await client.query(
        `SELECT 
            p.id AS pokemon_id,
            p.api_name AS pokemon_api_name,
            p.ger_name AS pokemon_ger_name,
            p.height AS pokemon_height,
            p.weight AS pokemon_weight,
            p.flavor_text AS pokemon_flavor_text,
            p.front_sprites AS pokemon_front_sprites,
        CASE 
            WHEN COUNT(pt.slot) = 1 THEN MAX(t.ger_name)
            ELSE STRING_AGG(t.ger_name, ', ' ORDER BY pt.slot)
        END AS typen
        FROM 
            pokemon p
        JOIN 
            pokemon_typ pt ON p.id = pt.pokemon_id
        JOIN 
            typ t ON pt.typ_id = t.id
        WHERE 
            p.id = ${req.params.id}
        GROUP BY 
            p.id, p.api_name, p.ger_name, p.height, p.weight, p.flavor_text, p.front_sprites
        ORDER BY 
            p.id;`);
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error'); // Fehler an Client senden
    } finally {
        client.release();
    }
});

// Get Route für die Typen
router.get('/types', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query(`SET search_path TO "${process.env.DB_SCHEMA1}";`);
        const result = await client.query(`SELECT * FROM typ`);
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error'); // Fehler an Client senden
    } finally {
        client.release();
    }
});

// GET Rote um die Pokemon nach Typen gefiltert auszugeben
router.get('/types/search', async (req, res) => {
    const client = await pool.connect();
    const input = req.query.typ;
    try {
        await client.query(`SET search_path TO "${process.env.DB_SCHEMA1}";`);

        const result = await client.query(
            `SELECT 
                p.id AS pokemon_id,
                p.api_name AS pokemon_api_name,
                p.ger_name AS pokemon_ger_name,
                p.height AS pokemon_height,
                p.weight AS pokemon_weight,
                p.flavor_text AS pokemon_flavor_text,
                p.front_sprites AS pokemon_front_sprites,
            CASE 
                WHEN COUNT(pt.slot) = 1 THEN MAX(t.api_name)
                ELSE STRING_AGG(t.api_name, ', ' ORDER BY pt.slot)
            END AS typen
            FROM 
                pokemon p
            JOIN 
                pokemon_typ pt ON p.id = pt.pokemon_id
            JOIN 
                typ t ON pt.typ_id = t.id
            /*Hier war ein Sub-SELELCT notwendig um die Pokemon mit mehreren Typen anzeigen zu
            lassen statt nur mit dem gefundenen Typ aus der WHERE Klausel.*/
            WHERE p.id IN (
                SELECT p.id
                FROM pokemon p
                JOIN pokemon_typ pt ON p.id = pt.pokemon_id
                JOIN typ t ON pt.typ_id = t.id
                WHERE LOWER(t.ger_name) = LOWER($1)
            )
            GROUP BY 
                p.id, p.api_name, p.ger_name, p.height, p.weight, p.flavor_text, p.front_sprites
            ORDER BY 
                p.id;`, [input]);

        res.send(result.rows);
    } catch (error) {
        console.error('Fehler!', error);
        res.status(500).send('Server error'); // Fehler an Client senden
    } finally {
        client.release();
    }
});

// Get Route für alle Pokemon mit JOIN Klausel und Berechnung des BST (Base Stat Total)
router.get('/allPokemon', async (req, res) => {
    const client = await pool.connect();
    try {
        // Setzt den Suchpfad für die Standard-Tabellen (pokemon p, typ t, etc.)
        await client.query(`SET search_path TO "${process.env.DB_SCHEMA1}";`);
        const result = await client.query(
        `SELECT 
            p.id AS pokemon_id,
            p.api_name AS pokemon_api_name,
            p.ger_name AS pokemon_ger_name,
            p.height AS pokemon_height,
            p.weight AS pokemon_weight,
            p.flavor_text AS pokemon_flavor_text,
            p.front_sprites AS pokemon_front_sprites,
        CASE 
            WHEN COUNT(pt.slot) = 1 THEN MAX(t.ger_name)
            ELSE STRING_AGG(t.ger_name, ', ' ORDER BY pt.slot)
        END AS typen,
            -- Berechnung des Base Stat Total (BST) durch Summation der einzelnen Basiswerte
            -- Die Basiswerte (hp, attack, etc.) stammen aus der Tabelle 'pokemon' im Schema DB_SCHEMA2 (z.B. 'public')
            (s_stats.hp + s_stats.attack + s_stats.defense + s_stats.special_attack + s_stats.special_defense + s_stats.speed) AS pokemon_bst
        FROM 
            pokemon p -- pokemon Tabelle aus DB_SCHEMA1
        JOIN 
            pokemon_typ pt ON p.id = pt.pokemon_id
        JOIN 
            typ t ON pt.typ_id = t.id
        JOIN 
            -- Expliziter Join mit der Tabelle 'pokemon' (hier als s_stats alias) aus DB_SCHEMA2 für die Basiswerte
            "${process.env.DB_SCHEMA2}".pokemon s_stats ON p.id = s_stats.id
        GROUP BY 
            p.id, 
            p.api_name, 
            p.ger_name, 
            p.height, 
            p.weight, 
            p.flavor_text, 
            p.front_sprites,
            -- Die einzelnen Basiswerte müssen in GROUP BY aufgenommen werden, da sie für die BST-Summe verwendet werden
            s_stats.hp, 
            s_stats.attack, 
            s_stats.defense, 
            s_stats.special_attack, 
            s_stats.special_defense, 
            s_stats.speed
        ORDER BY 
            p.id;`);
        res.send(result.rows);
    } catch (error) {
        console.error('Error in /allPokemon:', error);
        res.status(500).send('Server error fetching all Pokemon data');
    } finally {
        client.release();
    }
});

module.exports = router;