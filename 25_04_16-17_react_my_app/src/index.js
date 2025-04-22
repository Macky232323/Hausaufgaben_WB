import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Titel from './components/Titel';
import TierCard from './components/TierCard';
import DarkMode from './components/DarkMode';
import tiere from './tiere.json';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Kontakt from "./components/Kontakt";
import About from "./components/About";
import FAQ from "./components/FAQ";
import Impressum from "./components/Impressum";
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [geladeneTiere, setGeladeneTiere] = useState([]);
  const [anzahlGeladen, setAnzahlGeladen] = useState(6);
  const tierCardsContainerRef = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const initialTiere = tiere.slice(0, anzahlGeladen);
    setGeladeneTiere(initialTiere);
  }, [anzahlGeladen, tiere]);

  useEffect(() => {
    const handleScroll = () => {
      if (tierCardsContainerRef.current) {
        const container = tierCardsContainerRef.current;
        // Überprüfen, ob wir fast am unteren Ende des Containers sind
        if (
          container.scrollTop + container.clientHeight >=
          container.scrollHeight - 200 && // Kleinerer Puffer, da wir im Container scrollen
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
  }, [anzahlGeladen, tiere.length]);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Titel darkMode={darkMode} />
      <div className="tier-cards-container" ref={tierCardsContainerRef}>
        {geladeneTiere.map((tier, index) => (
          <TierCard key={index} {...tier} />
        ))}
      </div>
      <DarkMode darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/impressum" element={<Impressum />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
