const express = require('express');
const router = express.Router();

const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

router.get('/types4wsi/:id', async (req, res) => {
    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}"`);
        const result = await pool.query(
            `SELECT
                pokemon_id,
                weak,
                strong,
                immune
            FROM pokemon_weak_strong_immune
            WHERE pokemon_id = $1;`,
            [req.params.id]
        );
        res.send(result.rows);
    } catch (error) {
        console.error(error);
    }
});

router.get('/pokemonattr/:id', async (req, res) => {
    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        const result = await pool.query(
            `SELECT 
                hp, 
                attack,
                special_attack,
                defense,
                special_defense,
                speed
            FROM pokemon
            WHERE id = $1;`,
            [req.params.id]
        );
        res.send(result.rows)
    } catch (error) {
        console.error(error);
    }
});

router.get('/pokemonmoveset/:id', async (req, res) => {
    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        const result = await pool.query(
            `SELECT m.*, t.sprites
             FROM pokemon_moves pm
             JOIN LATERAL unnest(pm.moves_arr) AS move_id ON TRUE
             JOIN moves m ON m.id = move_id
             JOIN typ t ON m.dmg_typ = t.api_name
             WHERE pm.pokemon_id = $1
               AND (m.dmg_class = 'physical' OR m.dmg_class = 'special' OR m.id = 143);`,
            [req.params.id]
        );

        res.send(result.rows);
    } catch (error) {
        console.error(error);
    }
});

router.get('/newbattle', async (req, res) => {

    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        await pool.query(`DROP TABLE IF EXISTS bot_teamroster;`);
        await pool.query(`DROP TABLE IF EXISTS user_teamroster;`);
        await pool.query(
            `CREATE TABLE user_teamroster (
                pokemon_id INTEGER PRIMARY KEY,
                pokemon_api_name TEXT,
                pokemon_ger_name TEXT,
                front_sprite BYTEA,
                back_sprite BYTEA,
                cry_url TEXT,
                hp INTEGER,
                attack INTEGER,
                special_attack INTEGER,
                defense INTEGER,
                special_defense INTEGER,
                speed INTEGER,
                typen_api TEXT[],
                typen_ger TEXT[],
                typen_dmg_relations JSONB,
                moves JSONB,
                ailment TEXT,
                inFight BOOLEAN
            );`
        );

        await pool.query(
            `CREATE TABLE bot_teamroster (
                pokemon_id INTEGER PRIMARY KEY,
                pokemon_api_name TEXT,
                pokemon_ger_name TEXT,
                front_sprite BYTEA,
                back_sprite BYTEA,
                cry_url TEXT,
                hp INTEGER,
                attack INTEGER,
                special_attack INTEGER,
                defense INTEGER,
                special_defense INTEGER,
                speed INTEGER,
                typen_api TEXT[],
                typen_ger TEXT[],
                typen_dmg_relations JSONB,
                moves JSONB,
                ailment TEXT,
                inFight BOOLEAN
            );`
        );
        res.send('Tabellen erfolgreich erneuert!')
    } catch (error) {
        console.error(error);
    }
});

router.get('/userteamroster', async (req, res) => {

    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        const result = await pool.query(`SELECT * FROM user_teamroster;`);
        
        const rowsWithBase64 = result.rows.map(row => {
            if (row.front_sprite) {
                row.front_sprite = row.front_sprite.toString('base64');
            }
            if (row.back_sprite) {
                row.back_sprite = row.back_sprite.toString('base64');
            }
            return row;
        });

        res.send(rowsWithBase64);
    } catch (error) {
        console.error(error);
    }
});

router.delete('/userteamroster', async (req, res) => {

    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        await pool.query(`DELETE FROM user_teamroster;`);
        res.status(200).send("Team erfolgreich gelöscht");
    } catch (error) {
        console.error(error);
    }
});

router.get('/userteamroster/infight', async (req, res) => {
    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        const result = await pool.query(`SELECT * FROM user_teamroster WHERE inFight = TRUE;`);

        const rowsWithBase64 = result.rows.map(row => {
            if (row.front_sprite) {
                row.front_sprite = row.front_sprite.toString('base64');
            }
            if (row.back_sprite) {
                row.back_sprite = row.back_sprite.toString('base64');
            }
            return row;
        });

        res.send(rowsWithBase64);
    } catch (error) {
        console.error(error);
    }
});

router.get('/userteamroster/:id', async (req, res) => {
    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        const result = await pool.query(`SELECT * FROM user_teamroster WHERE pokemon_id = $1;`, [req.params.id]);

        const rowsWithBase64 = result.rows.map(row => {
            if (row.front_sprite) {
                row.front_sprite = row.front_sprite.toString('base64');
            }
            if (row.back_sprite) {
                row.back_sprite = row.back_sprite.toString('base64');
            }
            return row;
        });

        res.send(rowsWithBase64);
    } catch (error) {
        console.error(error);
    }
});

router.post('/userteamroster/:id', async (req, res) => {
    try {
        const movesArray = req.body.moves;
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);

        // Prüfen, ob das Team leer ist
        const countResult = await pool.query(`SELECT COUNT(*) FROM user_teamroster;`);
        const isFirst = countResult.rows[0].count === "0";

        const result = await pool.query(
            `SELECT
                p.id AS pokemon_id,
                p.api_name AS pokemon_api_name,
                p.ger_name AS pokemon_ger_name,
                p.front_sprite,
                p.back_sprite,
                p.cry_url,
                p.hp,
                p.attack,
                p.special_attack,
                p.defense,
                p.special_defense,
                p.speed,
                ARRAY_AGG(DISTINCT t.api_name) AS typen_api,
                ARRAY_AGG(DISTINCT t.ger_name) AS typen_ger,
                ARRAY_AGG(DISTINCT t.dmg_relations) AS typen_dmg_relations
            FROM
                pokemon p
            LEFT JOIN
                pokemon_typ pt ON p.id = pt.pokemon_id
            LEFT JOIN
                typ t ON pt.typ_id = t.id
            LEFT JOIN
                pokemon_moves pm ON p.id = pm.pokemon_id
            WHERE p.id = $1
            GROUP BY
                p.id
            ORDER BY
                p.id;`,
            [req.params.id]
        );

        await pool.query(
            `INSERT INTO user_teamroster(
                pokemon_id,
                pokemon_api_name,
                pokemon_ger_name,
                front_sprite,
                back_sprite,
                cry_url,
                hp,
                attack,
                special_attack,
                defense,
                special_defense,
                speed,
                typen_api,
                typen_ger,
                typen_dmg_relations,
                moves,
                ailment,
                inFight
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NULL, $17);`,
            [
                result.rows[0].pokemon_id,
                result.rows[0].pokemon_api_name,
                result.rows[0].pokemon_ger_name,
                result.rows[0].front_sprite,
                result.rows[0].back_sprite,
                result.rows[0].cry_url,
                result.rows[0].hp,
                result.rows[0].attack,
                result.rows[0].special_attack,
                result.rows[0].defense,
                result.rows[0].special_defense,
                result.rows[0].speed,
                result.rows[0].typen_api,
                result.rows[0].typen_ger,
                JSON.stringify(result.rows[0].typen_dmg_relations),
                JSON.stringify(movesArray),
                isFirst // TRUE wenn erstes Pokémon, sonst FALSE
            ]
        );

        res.status(201).send("Pokemon erfolgreich hinzugefügt");
    } catch (error) {
        console.error(error);
    }
});

router.patch('/userteamroster/:id', async (req, res) => {

    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        const allowedFields = ['hp', 'attack', 'special_attack', 'defense', 'special_defense', 'speed', 'ailment', 'inFight'];

        const fields = Object.keys(req.body).filter(f => allowedFields.includes(f));
        const values = Object.values(req.body);

        const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = `UPDATE user_teamroster SET ${setString} WHERE pokemon_id = $${fields.length + 1};`;

        await pool.query(query, [...values, req.params.id]);

        res.status(200).send("Update erfolgreich!");
    } catch (error) {
        console.log(error);
    }
});

router.delete('/userteamroster/:id', async (req, res) => {

    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        await pool.query(`DELETE FROM user_teamroster WHERE pokemon_id = $1;`, [req.params.id]);
        res.status(200).send("Pokemon erfolgreich gelöscht");
    } catch (error) {
        console.error(error);
    }
});

router.get('/botteamroster', async (req, res) => {

    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        const result = await pool.query(`SELECT * FROM bot_teamroster;`);
        
        const rowsWithBase64 = result.rows.map(row => {
            if (row.front_sprite) {
                row.front_sprite = row.front_sprite.toString('base64');
            }
            if (row.back_sprite) {
                row.back_sprite = row.back_sprite.toString('base64');
            }
            return row;
        });

        res.send(rowsWithBase64);
    } catch (error) {
        console.error(error);
    }
});

router.delete('/botteamroster', async (req, res) => {

    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        await pool.query(`DELETE FROM bot_teamroster;`);
        res.status(200).send("Team erfolgreich gelöscht");
    } catch (error) {
        console.error(error);
    }
});

router.get('/botteamroster/infight', async (req, res) => {
    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        const result = await pool.query(`SELECT * FROM bot_teamroster WHERE inFight = TRUE;`);

        const rowsWithBase64 = result.rows.map(row => {
            if (row.front_sprite) {
                row.front_sprite = row.front_sprite.toString('base64');
            }
            if (row.back_sprite) {
                row.back_sprite = row.back_sprite.toString('base64');
            }
            return row;
        });
        console.log(rowsWithBase64);
        res.send(rowsWithBase64);
    } catch (error) {
        console.error(error);
    }
});

// BOTTEAMROSTER FILL
router.post('/fillbotteamroster', async (req, res) => {
    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        // 1. 6 zufällige Pokémon holen
        const pokeResult = await pool.query(
            `SELECT id FROM pokemon ORDER BY RANDOM() LIMIT 6;`
        );

        let isFirst = true;
        for (const row of pokeResult.rows) {
            // 2. Bis zu 4 zufällige Moves für das Pokémon holen
            const movesResult = await pool.query(
                `SELECT m.*
                 FROM pokemon_moves pm
                 JOIN moves m ON m.id = ANY(pm.moves_arr)
                 WHERE pm.pokemon_id = $1
                    AND (m.dmg_class = 'physical' OR m.dmg_class = 'special' OR m.id = 143)
                 ORDER BY RANDOM()
                 LIMIT 4;`,
                [row.id]
            );
            const movesArray = movesResult.rows;

            // 3. Pokémon-Infos holen (wie in deiner bisherigen Route)
            const pokeInfo = await pool.query(
                `SELECT
                    p.id AS pokemon_id,
                    p.api_name AS pokemon_api_name,
                    p.ger_name AS pokemon_ger_name,
                    p.front_sprite,
                    p.back_sprite,
                    p.cry_url,
                    p.hp,
                    p.attack,
                    p.special_attack,
                    p.defense,
                    p.special_defense,
                    p.speed,
                    ARRAY_AGG(DISTINCT t.api_name) AS typen_api,
                    ARRAY_AGG(DISTINCT t.ger_name) AS typen_ger,
                    ARRAY_AGG(DISTINCT t.dmg_relations) AS typen_dmg_relations
                FROM
                    pokemon p
                LEFT JOIN
                    pokemon_typ pt ON p.id = pt.pokemon_id
                LEFT JOIN
                    typ t ON pt.typ_id = t.id
                WHERE p.id = $1
                GROUP BY p.id;`,
                [row.id]
            );

            // 4. In bot_teamroster einfügen
            const movesObject = { moves: movesArray }; // <-- gewünschtes Format

            await pool.query(
                `INSERT INTO bot_teamroster(
                    pokemon_id,
                    pokemon_api_name,
                    pokemon_ger_name,
                    front_sprite,
                    back_sprite,
                    cry_url,
                    hp,
                    attack,
                    special_attack,
                    defense,
                    special_defense,
                    speed,
                    typen_api,
                    typen_ger,
                    typen_dmg_relations,
                    moves,
                    ailment,
                    inFight
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16 ,NULL, $17);`,
                [
                    pokeInfo.rows[0].pokemon_id,
                    pokeInfo.rows[0].pokemon_api_name,
                    pokeInfo.rows[0].pokemon_ger_name,
                    pokeInfo.rows[0].front_sprite,
                    pokeInfo.rows[0].back_sprite,
                    pokeInfo.rows[0].cry_url,
                    pokeInfo.rows[0].hp,
                    pokeInfo.rows[0].attack,
                    pokeInfo.rows[0].special_attack,
                    pokeInfo.rows[0].defense,
                    pokeInfo.rows[0].special_defense,
                    pokeInfo.rows[0].speed,
                    pokeInfo.rows[0].typen_api,
                    pokeInfo.rows[0].typen_ger,
                    JSON.stringify(pokeInfo.rows[0].typen_dmg_relations),
                    JSON.stringify(movesObject),
                    isFirst // TRUE für das erste, dann FALSE
                ]
            );
            isFirst = false;
        }

        res.status(201).send("Bot-Team erfolgreich gefüllt!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Fehler beim Füllen des Bot-Teams");
    }
});

router.patch('/botteamroster/:id', async (req, res) => {

    try {
        await pool.query(`SET search_path TO "${process.env.DB_SCHEMA2}";`);
        const allowedFields = ['hp', 'attack', 'special_attack', 'defense', 'special_defense', 'speed', 'ailment', 'inFight'];

        const fields = Object.keys(req.body).filter(f => allowedFields.includes(f));
        const values = Object.values(req.body);

        const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const query = `UPDATE bot_teamroster SET ${setString} WHERE pokemon_id = $${fields.length + 1};`;

        await pool.query(query, [...values, req.params.id]);

        res.status(200).send("Update erfolgreich!");
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;