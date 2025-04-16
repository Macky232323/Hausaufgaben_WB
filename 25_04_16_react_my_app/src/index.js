import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Titel from './components/Titel';
import TierCard from './components/TierCard';
import DarkMode from './components/DarkMode';
import './index.css';

const tiere = [
  { name: 'Bello', art: 'Hund', alter: '5 Jahre', gewicht: '25 kg', bild: 'bello.png' },
  { name: 'Minka', art: 'Katze', krankheit: 'Schnupfen', alter: '3 Jahre', gewicht: '4 kg', bild: 'minka.png' },
  { name: 'Hans', art: 'Wellensittich', alter: '1 Jahr', gewicht: '0.1 kg', bild: 'hans.png' },
  { name: 'Hoppel', art: 'Kaninchen', alter: '2 Jahre', gewicht: '1.5 kg', bild: 'hoppel.png' },
  { name: 'Gustav', art: 'Meerschweinchen', alter: '4 Jahre', gewicht: '0.8 kg', bild: 'gustav.png' },
  { name: 'Susi', art: 'Hamster', alter: '1.5 Jahre', gewicht: '0.2 kg', bild: 'susi.png' },
  { name: 'Rex', art: 'Hund', alter: '7 Jahre', gewicht: '30 kg', bild: 'rex.png' },
  { name: 'Luna', art: 'Katze', alter: '6 Monate', gewicht: '2 kg', bild: 'luna.png' },
  { name: 'Poldi', art: 'Schildkröte', alter: '50 Jahre', gewicht: '5 kg', bild: 'poldi.png' },
  { name: 'Freddy', art: 'Fisch', alter: '2 Jahre', gewicht: '0.05 kg', bild: 'freddy.png' },
];

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Titel darkMode={darkMode} />
      <div className="tier-cards-container">
        {tiere.map((tier, index) => (
          <TierCard key={index} {...tier} />
        ))}
      </div>
      <DarkMode darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);