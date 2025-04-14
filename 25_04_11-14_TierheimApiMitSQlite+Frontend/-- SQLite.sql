-- SQLite
SELECT * FROM tiere;

INSERT INTO tiere(tierart,name,krankheit,age,gewicht)
VALUES ("Axolotl","Suheib","Milben",3,0.270);

DELETE FROM tiere 
WHERE id = ?;