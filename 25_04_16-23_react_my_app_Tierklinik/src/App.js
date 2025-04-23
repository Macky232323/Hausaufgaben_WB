import React, { useState, useEffect, useRef } from 'react';
 import { useLocation } from 'react-router-dom';
 import Titel from './components/Titel';
 import TierCard from './components/TierCard';
 import Kontakt from './components/Kontakt';
 import About from './components/About';
 import FAQ from './components/FAQ';
 import Impressum from './components/Impressum';
 import tiere from './tiere.json';
 import DarkMode from './components/DarkMode';
 import './index.css';
 

 function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [geladeneTiere, setGeladeneTiere] = useState([]);
  const [anzahlGeladen, setAnzahlGeladen] = useState(6);
  const tierCardsContainerRef = useRef(null);
  const location = useLocation();
 

  const toggleDarkMode = () => {
  setDarkMode(!darkMode);
  };
 

  const isTierPatientenPage = location.pathname === '/tierpatienten'; // Überprüfe, ob wir auf der Tierpatienten-Seite sind
 

  useEffect(() => {
  if (isTierPatientenPage) {  // Nur laden, wenn wir auf der Tierpatienten-Seite sind
  const initialTiere = tiere.slice(0, anzahlGeladen);
  setGeladeneTiere(initialTiere);
  } else {
  setGeladeneTiere([]);  // Leere die Tierliste, wenn wir nicht auf der Tierpatienten-Seite sind
  setAnzahlGeladen(6);  // Setze die Anzahl zurück
  }
  }, [anzahlGeladen, isTierPatientenPage]);  // Abhängigkeit von isTierPatientenPage
 

  useEffect(() => {
  if (isTierPatientenPage) {  // Nur scrollen, wenn wir auf der Tierpatienten-Seite sind
  const handleScroll = () => {
  if (tierCardsContainerRef.current) {
  const container = tierCardsContainerRef.current;
  if (
  container.scrollTop + container.clientHeight >=
  container.scrollHeight - 200 &&
  anzahlGeladen < tiere.length
  ) {
  setAnzahlGeladen(vorherigerAnzahl => vorherigerAnzahl + 6);
  }
  }
  };
 

  const containerElement = tierCardsContainerRef.current;
  if (containerElement) {
  containerElement.addEventListener('scroll', handleScroll);
  }
 

  return () => {
  if (containerElement) {
  containerElement.removeEventListener('scroll', handleScroll);
  }
  };
  }
  }, [anzahlGeladen, tiere.length, isTierPatientenPage]);  // Abhängigkeit von isTierPatientenPage
 

  let content;
  switch (location.pathname) {
  case "/":  // Home-Seite (keine Tierkarten)
  content = <div>Home-Seite</div>;  // Oder was auch immer du hier anzeigen willst
  break;
  case "/tierpatienten":
  content = (
  <div className="tier-cards-container" ref={tierCardsContainerRef}>
  {geladeneTiere.map((tier, index) => (
  <TierCard key={index} {...tier} />
  ))}
  </div>
  );
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
  content = <div>404 - Seite nicht gefunden</div>;  // Fehlerseite
  }
 

  return (
  <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
  <Titel darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  {content}
  </div>
  );
 }
 

 export default App;