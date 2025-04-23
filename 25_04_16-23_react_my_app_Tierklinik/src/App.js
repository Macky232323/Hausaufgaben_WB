import React, { useState, useEffect, useRef } from 'react';
 import { useLocation } from 'react-router-dom';
 import Titel from './components/Titel';
 import TierCard from './components/TierCard';
 import Kontakt from './components/Kontakt';
 import About from './components/About';
 import FAQ from './components/FAQ';
 import Impressum from './components/Impressum';
 import DarkMode from './components/DarkMode';
 import './index.css';
 

 function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [geladeneTiere, setGeladeneTiere] = useState([]);
  const [anzahlGeladen, setAnzahlGeladen] = useState(6);
  const [gesamtAnzahlTiere, setGesamtAnzahlTiere] = useState(0); // Neu: Gesamtzahl der Tiere
  const contentRef = useRef(null);
  const location = useLocation();
  let containerClass = "scrollable-content";
 

  const toggleDarkMode = () => {
  setDarkMode(!darkMode);
  };
 

  const isTierPatientenPage = location.pathname === '/tierpatienten';
 

  useEffect(() => {
  if (isTierPatientenPage) {
  // Daten von der API abrufen
  fetch('http://localhost:3001/tiere')
  .then(response => response.json())
  .then(data => {
  setGesamtAnzahlTiere(data.length); // Setze die Gesamtzahl
  const initialTiere = data.slice(0, anzahlGeladen);
  setGeladeneTiere(initialTiere);
  })
  .catch(error => console.error('Fehler beim Laden der Daten:', error));
  } else {
  setGeladeneTiere([]);
  setAnzahlGeladen(6);
  }
  }, [anzahlGeladen, isTierPatientenPage]);
 

  useEffect(() => {
  if (isTierPatientenPage) {
  const handleScroll = () => {
  if (contentRef.current) {
  const container = contentRef.current;
  if (
  container.scrollTop + container.clientHeight >=
  container.scrollHeight - 200 &&
  geladeneTiere.length < gesamtAnzahlTiere // Verwende gesamtAnzahlTiere
  ) {
  setAnzahlGeladen(vorherigerAnzahl => vorherigerAnzahl + 6);
  fetch('http://localhost:3001/tiere')
  .then(response => response.json())
  .then(data => {
  const neueTiere = data.slice(geladeneTiere.length, geladeneTiere.length + 6);
  setGeladeneTiere([...geladeneTiere, ...neueTiere]);
  })
  .catch(error => console.error('Fehler beim Laden weiterer Daten:', error));
  }
  }
  };
 

  const containerElement = contentRef.current;
  if (containerElement) {
  containerElement.addEventListener('scroll', handleScroll);
  }
 

  return () => {
  if (containerElement) {
  containerElement.removeEventListener('scroll', handleScroll);
  }
  };
  }
  }, [geladeneTiere.length, gesamtAnzahlTiere, isTierPatientenPage]); // Verwende geladeneTiere.length und gesamtAnzahlTiere
 

  let content;
  switch (location.pathname) {
  case "/":
  content = (
  <div style={{ display: 'flex', alignItems: 'center' }}>
  <div style={{ flex: 1, marginRight: '20px' }}>
  <h1>Willkommen bei der Tierklinik-Techstarter!</h1>
  <p>
  Seit über 300 Jahren sind wir die erste Adresse für alle, die das Beste für ihre tierischen Mitbewohner wollen.
  Unsere Klinik wurde im Jahre 1723 von dem visionären Dr. Archibald Fusselbart gegründet, der damals schon
  bahnbrechende Methoden wie die "Kräuter-Kitzel-Therapie" für gestresste Hamster und die "Symphonie-Behandlung"
  für melancholische Möpse entwickelte.
  </p>
  <p>
  Im Laufe der Jahrhunderte haben wir unser Repertoire stetig erweitert. Heute bieten wir unter anderem:
  </p>
  <ul>
  <li>
  <b>Die "Schnurrhaar-Harmonisierung":</b> Eine sanfte Methode, um das energetische Gleichgewicht von Katzen
  wiederherzustellen (hilft auch bei akuter Unentschlossenheit vor dem Futternapf).
  </li>
  <li>
  <b>Die "Feder-Flüster-Technik":</b> Speziell für Vögel mit Kommunikationsschwierigkeiten (und für Papageien,
  die einfach mal was Nettes sagen sollen).
  </li>
  <li>
  <b>Die "Hasen-Hypnose":</b> Verhilft ängstlichen Langohren zu mehr Selbstbewusstsein (und macht sie zu
  unübertroffenen Karotten-Verhandlern).
  </li>
  <li>
  <b>Die "Reptilien-Reflexzonenmassage":</b> Aktiviert die Lebensgeister von Echsen und Schlangen (und sorgt
  für eine entspannte Häutung).
  </li>
  </ul>
  <p>
  Und natürlich haben wir auch die neuesten, wissenschaftlich fundierten Methoden im Angebot. Aber seien wir ehrlich,
  manchmal hilft eben doch nur ein gutes altes "Kräuter-Kitzel".
  </p>
  <p>
  Kommen Sie vorbei und überzeugen Sie sich selbst! Ihr Tier wird es Ihnen danken (oder zumindest nicht böse sein).
  </p>
  </div>
  <img src="/assets/home.png" alt="Tierklinik" style={{ maxWidth: '40%', height: 'auto' }} />
  </div>
  );
  break;
  case "/tierpatienten":
  content = (
  <div className="tier-cards-container">
  {geladeneTiere.map((tier, index) => (
  <TierCard key={index} {...tier} />
  ))}
  </div>
  );
  containerClass = "scrollable-content tierpatienten-content";
  break;
  case "/kontakt":
  content = <Kontakt />;
  break;
  case "/about":
  content = <About />;
  break;
  case "/faq":
  content = <FAQ />;
  break;
  case "/impressum":
  content = <Impressum />;
  break;
  default:
  content = <div>404 - Seite nicht gefunden</div>;
  }
 

  return (
  <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
  <Titel darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  <div className={containerClass} ref={contentRef}>
  {content}
  </div>
  </div>
  );
 }
 

 export default App;