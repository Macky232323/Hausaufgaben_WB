import React from 'react';
 import './About.css';
 

 function About() {
  return (
  <div className="about-container">
  <h1>Über uns - Das Who's Who der Tierheilkunde</h1>
  <div className="about-content-wrapper">
  <img
  src="/assets/about.png"
  alt="Über uns"
  className="about-image"
  />
  <div className="about-text">
  <p>
  Willkommen bei der Tierklinik-Techstarter, wo wir seit gefühlten Ewigkeiten
  (tatsächlich sind es bescheidene 300 Jahre)
  dafür sorgen, dass Ihre tierischen Freunde nicht nur überleben, sondern regelrecht
  aufblühen.
  Wir sind eine bunt zusammengewürfelte Truppe von Tierärzten, Pflegern und Assistenten,
  die eines gemeinsam haben:
  Wir lieben Tiere mehr als den letzten Knochen (oder das letzte Leckerli, je nach
  Spezies).
  </p>
  <p>
  Unsere Klinik ist so hochmodern, dass selbst James T. Kirk neidisch werden
  würde. Wir haben Geräte,
  die Blinzeln auswerten können, Apparaturen, die den Seufzer eines Goldfisches
  messen, und Maschinen,
  die das "Miau" einer Katze in Goethes Faust übersetzen können (naja, fast).
  </p>
  <p>
  Aber was uns wirklich auszeichnet, ist unsere unkonventionelle Herangehensweise.
  Klar, wir können Schulmedizin.
  Aber wir haben auch ein paar Tricks im Ärmel, die Sie in keinem Lehrbuch finden:
  </p>
  <ul>
  <li>
  <b>Die "Empathie-Umarmung":</b> Eine Technik, bei der wir uns so fest in Ihr
  Tier hineinversetzen,
  dass wir genau wissen, wo es zwickt (und welches Leckerli es jetzt am liebsten
  hätte).
  </li>
  <li>
  <b>Die "Lachgas-Yoga-Session":</b> Hilft gestressten Tieren (und deren
  Besitzern), mal so richtig
  abzuschalten.
  (Warnung: Kann zu unkontrolliertem Kichern führen, auch bei Schildkröten).
  </li>
  <li>
  <b>Die "Telepathische Tierbefragung":</b> Wir stellen Ihrem Tier die wichtigen
  Fragen (z.B. "Wer hat
  den Teppich vollgespuckt?") und bekommen (meistens) ehrliche Antworten.
  </li>
  </ul>
  <p>
  Aber keine Sorge, wir sind nicht komplett verrückt. Wir kombinieren den ganzen
  Hokuspokus
  mit solider Wissenschaft, um sicherzustellen, dass Ihr Tier die bestmögliche
  Behandlung bekommt.
  </p>
  </div>
  </div>
  <h2>Unser Team - Die Stars der Tierheilkunde (in unseren Herzen)</h2>
  <div className="team-members">
  <div className="team-member">
  <h3>Dr. Anna "Die Flüsterin" Schmidt</h3>
  <p>
  Tierärztin, kann Katzen dazu bringen, ihre Geheimnisse preiszugeben (und Hunde,
  ihre Socken zu finden).
  </p>
  </div>
  <div className="team-member">
  <h3>Max "Der Knuddelmeister" Müller</h3>
  <p>
  Tierpfleger, hat eine beruhigende Wirkung auf alles, was Fell hat (und auf einige
  Menschen).
  </p>
  </div>
  <div className="team-member">
  <h3>Lisa "Die Skalpell-Virtuosin" Weber</h3>
  <p>
  Tierärztin, so geschickt mit dem Skalpell, dass sie Operationen im Schlaf
  durchführen könnte (macht
  sie aber nicht).
  </p>
  </div>
  </div>
  </div>
  );
 }
 

 export default About;