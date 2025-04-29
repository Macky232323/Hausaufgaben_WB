const sqlite3 = require('sqlite3').verbose();
 const { faker } = require('@faker-js/faker');
 

 // Funktion, um eine humorvolle Anamnese zu generieren
 function generateHumorousAnamnese() {
  const sentences = [];
  const rand = Math.random()
  const rand2 = Math.random()
  const rand3 = Math.random()
  const rand4 = Math.random()
  const rand5 = Math.random()
  const rand6 = Math.random()
  const rand7 = Math.random()
  const rand8 = Math.random()
  const rand9 = Math.random()
  const rand10 = Math.random()
 

  if (rand > 0.5) {
  sentences.push(`Patient zeigte heute eine bemerkenswerte Fähigkeit, den Tierarzt mit einem einzigen Blick zum Schweigen zu bringen. Verdacht auf telepathische Fähigkeiten, wird weiter beobachtet.`);
  } else {
  sentences.push(`Besitzer meldet, dass der Patient versucht hat, die Weltherrschaft an sich zu reißen. Beweise sind spärlich, aber der Blick war verdächtig.`);
  }
 

  if (rand2 > 0.5) {
  sentences.push(`Leidet an akuter "Ich-bin-so-süß"-itis. Prognose: Unheilbar.`);
  } else {
  sentences.push(`Hat heute versucht, den Tierarzt zu bestechen. Angebot: Ein benutztes Spielzeug und ein leicht angenagter Knochen. Wir haben abgelehnt.`);
  }
 

  if (rand3 > 0.5) {
  sentences.push(`Der Patient hat eine philosophische Krise. Stellt die Existenz von Leckerlis in Frage. Empfehlung: Mehr Leckerlis.`);
  } else {
  sentences.push(`Anamnese: Patient hat heute versucht, die Schwerkraft herauszufordern. Ergebnis: Schmerzhafte Landung, peinliche Stille.`);
  }
 

  if (rand4 > 0.5) {
  sentences.push(`Der Patient ist überzeugt, ein Superheld zu sein. Fordert ein Cape für die nächste Visite.`);
  } else {
  sentences.push(`Hat heute versucht, den Tierarzt zu hypnotisieren. Es war... weniger erfolgreich.`);
  }
  if (rand5 > 0.5) {
  sentences.push(`Der Patient leidet an chronischer Unentschlossenheit beim Fressen. Empfehlung: Buffet-Optionen.`);
  } else {
  sentences.push(`Anamnese: Patient hat heute versucht, den Tierarzt zu bestechen. Angebot: Ein benutztes Spielzeug und ein leicht angenagter Knochen. Wir haben abgelehnt.`);
  }
 

  if (rand6 > 0.5) {
  sentences.push(`Der Patient hat eine philosophische Krise. Stellt die Existenz von Leckerlis in Frage. Empfehlung: Mehr Leckerlis.`);
  } else {
  sentences.push(`Anamnese: Patient hat heute versucht, die Schwerkraft herauszufordern. Ergebnis: Schmerzhafte Landung, peinliche Stille.`);
  }
  if (rand7 > 0.5) {
  sentences.push(`Der Patient ist überzeugt, ein Superheld zu sein. Fordert ein Cape für die nächste Visite.`);
  } else {
  sentences.push(`Hat heute versucht, den Tierarzt zu hypnotisieren. Es war... weniger erfolgreich.`);
  }
  if (rand8 > 0.5) {
  sentences.push(`Der Patient leidet an chronischer Unentschlossenheit beim Fressen. Empfehlung: Buffet-Optionen.`);
  } else {
  sentences.push(`Anamnese: Patient hat heute versucht, den Tierarzt zu bestechen. Angebot: Ein benutztes Spielzeug und ein leicht angenagter Knochen. Wir haben abgelehnt.`);
  }
  if (rand9 > 0.5) {
  sentences.push(`Der Patient hat eine philosophische Krise. Stellt die Existenz von Leckerlis in Frage. Empfehlung: Mehr Leckerlis.`);
  } else {
  sentences.push(`Anamnese: Patient hat heute versucht, die Schwerkraft herauszufordern. Ergebnis: Schmerzhafte Landung, peinliche Stille.`);
  }
  if (rand10 > 0.5) {
  sentences.push(`Der Patient ist überzeugt, ein Superheld zu sein. Fordert ein Cape für die nächste Visite.`);
  } else {
  sentences.push(`Hat heute versucht, den Tierarzt zu hypnotisieren. Es war... weniger erfolgreich.`);
  }
 

  return sentences.join(' ');
 }
 

 // Code zum Einfügen der Anamnesen
 const db = new sqlite3.Database('tiere.db');
 

 db.serialize(() => {
  // Annahme: Du hast bereits eine Tabelle 'anamnese' mit 'tier_id' und 'text'
  // Wenn nicht, musst du sie hier erstellen:
  // db.run("CREATE TABLE anamnese (tier_id INTEGER PRIMARY KEY, text TEXT)");
 

  for (let i = 1; i <= 50; i++) {
  const anamneseText = generateHumorousAnamnese();
  db.run("INSERT OR REPLACE INTO anamnese (tier_id, text) VALUES (?, ?)", [i, anamneseText], function(err) {
  if (err) {
  return console.error(err.message);
  }
  console.log(`Anamnese für Tier ${i} hinzugefügt/aktualisiert.`);
  });
  }
 

  db.close((err) => {
  if (err) {
  return console.error(err.message);
  }
  console.log('Verbindung zur Datenbank geschlossen.');
  });
 });