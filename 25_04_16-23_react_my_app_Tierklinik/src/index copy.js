import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Titel from './components/Titel';
import TierCard from './components/TierCard';
import DarkMode from './components/DarkMode';

import './index.css';

const alleTiere = [
  { name: 'Bella', art: 'Kaninchen', alter: '1.8 Jahre', gewicht: '1.4 kg', bild: 'hoppel.png', krankheit: 'Durchfall' },
  { name: 'Paul', art: 'Meerschweinchen', alter: '3.5 Jahre', gewicht: '0.95 kg', bild: 'gustav.png', krankheit: 'geheilt' },
  { name: 'Minka', art: 'Katze', alter: '3 Jahre', gewicht: '4 kg', bild: 'minka.png', krankheit: 'Schnupfen' },
  { name: 'Buddy', art: 'Wellensittich', alter: '0.9 Jahre', gewicht: '0.1 kg', bild: 'hans.png', krankheit: 'geheilt' },
  { name: 'Susi', art: 'Hamster', alter: '1.5 Jahre', gewicht: '0.2 kg', bild: 'susi.png', krankheit: 'geheilt' },
  { name: 'Shadow', art: 'Kaninchen', alter: '3 Jahre', gewicht: '1.7 kg', bild: 'hoppel.png', krankheit: 'geheilt' },
  { name: 'Lola', art: 'Wellensittich', alter: '0.7 Jahre', gewicht: '0.09 kg', bild: 'hans.png', krankheit: 'Parasiten' },
  { name: 'Theo', art: 'Meerschweinchen', alter: '1.5 Jahre', gewicht: '0.75 kg', bild: 'gustav.png', krankheit: 'geheilt' },
  { name: 'Lucy', art: 'Hund', alter: '1 Jahr', gewicht: '15 kg', bild: 'bello.png', krankheit: 'Verdauungsprobleme' },
  { name: 'Bella', art: 'Wellensittich', alter: '1.3 Jahre', gewicht: '0.1 kg', bild: 'hans.png', krankheit: 'Durchfall' },
  { name: 'Rex', art: 'Hund', alter: '7 Jahre', gewicht: '30 kg', bild: 'rex.png', krankheit: 'Husten' },
  { name: 'Lilly', art: 'Katze', alter: '2 Jahre', gewicht: '3 kg', bild: 'minka.png', krankheit: 'Erkältung' },
  { name: 'Hoppel', art: 'Kaninchen', alter: '2 Jahre', gewicht: '1.5 kg', bild: 'hoppel.png', krankheit: 'geheilt' },
  { name: 'Finn', art: 'Meerschweinchen', alter: '2.2 Jahre', gewicht: '0.8 kg', bild: 'gustav.png', krankheit: 'geheilt' },
  { name: 'Charlie', art: 'Hund', alter: '9 Jahre', gewicht: '26 kg', bild: 'bello.png', krankheit: 'geheilt' },
  { name: 'Tweety', art: 'Wellensittich', alter: '2 Jahre', gewicht: '0.12 kg', bild: 'hans.png', krankheit: 'Schnupfen' },
  { name: 'Greta', art: 'Meerschweinchen', alter: '2 Jahre', gewicht: '0.7 kg', bild: 'gustav.png', krankheit: 'Erkältung' },
  { name: 'Max', art: 'Hund', alter: '6 Jahre', gewicht: '31 kg', bild: 'bello.png', krankheit: 'geheilt' },
  { name: 'Oreo', art: 'Kaninchen', alter: '1.2 Jahre', gewicht: '1.1 kg', bild: 'hoppel.png', krankheit: 'Hautprobleme' },
  { name: 'Simba', art: 'Katze', alter: '7 Jahre', gewicht: '6 kg', bild: 'minka.png', krankheit: 'geheilt' },
  { name: 'Kiwi', art: 'Wellensittich', alter: '0.5 Jahre', gewicht: '0.09 kg', bild: 'hans.png', krankheit: 'geheilt' },
  { name: 'Gustav', art: 'Meerschweinchen', alter: '4 Jahre', gewicht: '0.8 kg', bild: 'gustav.png', krankheit: 'geheilt' },
  { name: 'Daisy', art: 'Hund', alter: '3 Jahre', gewicht: '23 kg', bild: 'bello.png', krankheit: 'Hautirritationen' },
  { name: 'Rocky', art: 'Wellensittich', alter: '2.5 Jahre', gewicht: '0.12 kg', bild: 'hans.png', krankheit: 'geheilt' },
  { name: 'Fritz', art: 'Meerschweinchen', alter: '1 Jahr', gewicht: '0.6 kg', bild: 'gustav.png', krankheit: 'geheilt' },
  { name: 'Bello', art: 'Hund', alter: '5 Jahre', gewicht: '25 kg', bild: 'bello.png', krankheit: 'geheilt' },
  { name: 'Cotton', art: 'Kaninchen', alter: '0.5 Jahre', gewicht: '0.9 kg', bild: 'hoppel.png', krankheit: 'Verdauungsprobleme' },
  { name: 'Nala', art: 'Katze', alter: '1 Jahr', gewicht: '2.5 kg', bild: 'minka.png', krankheit: 'Magenverstimmung' },
  { name: 'Sky', art: 'Wellensittich', alter: '1.5 Jahre', gewicht: '0.11 kg', bild: 'hans.png', krankheit: 'Federprobleme' },
  { name: 'Rosie', art: 'Meerschweinchen', alter: '3 Jahre', gewicht: '0.9 kg', bild: 'gustav.png', krankheit: 'Pilzinfektion' },
  { name: 'Sadie', art: 'Hund', alter: '2 Jahre', gewicht: '19 kg', bild: 'bello.png', krankheit: 'Augenentzündung' },
  { name: 'Lilly', art: 'Meerschweinchen', alter: '2.5 Jahre', gewicht: '0.85 kg', bild: 'gustav.png', krankheit: 'Hautmilben' },
  { name: 'Peter', art: 'Kaninchen', alter: '2.5 Jahre', gewicht: '1.6 kg', bild: 'hoppel.png', krankheit: 'geheilt' },
  { name: 'Oscar', art: 'Katze', alter: '4 Jahre', gewicht: '4.5 kg', bild: 'minka.png', krankheit: 'geheilt' },
  { name: 'Pips', art: 'Wellensittich', alter: '3 Jahre', gewicht: '0.13 kg', bild: 'hans.png', krankheit: 'geheilt' },
  { name: 'Paul', art: 'Hamster', alter: '1 Jahr', gewicht: '0.18 kg', bild: 'susi.png', krankheit: 'Erkältung' },
  { name: 'Thumper', art: 'Kaninchen', alter: '3.5 Jahre', gewicht: '1.9 kg', bild: 'hoppel.png', krankheit: 'geheilt' },
  { name: 'Mia', art: 'Hamster', alter: '2 Jahre', gewicht: '0.22 kg', bild: 'susi.png', krankheit: 'geheilt' },
  { name: 'Hans', art: 'Wellensittich', alter: '1 Jahr', gewicht: '0.1 kg', bild: 'hans.png', krankheit: 'geheilt' },
  { name: 'Sophie', art: 'Meerschweinchen', alter: '0.8 Jahre', gewicht: '0.65 kg', bild: 'gustav.png', krankheit: 'Augenprobleme' },
  { name: 'Buddy', art: 'Hund', alter: '8 Jahre', gewicht: '22 kg', bild: 'bello.png', krankheit: 'geheilt' },
  { name: 'Mia', art: 'Katze', alter: '6 Jahre', gewicht: '3.5 kg', bild: 'minka.png', krankheit: 'Zahnfleischentzündung' },
  { name: 'Daisy', art: 'Kaninchen', alter: '0.8 Jahre', gewicht: '1 kg', bild: 'hoppel.png', krankheit: 'Augenentzündung' },
  { name: 'Finn', art: 'Hamster', alter: '0.8 Jahre', gewicht: '0.16 kg', bild: 'susi.png', krankheit: 'Hautprobleme' },
  { name: 'Sunny', art: 'Wellensittich', alter: '0.8 Jahre', gewicht: '0.1 kg', bild: 'hans.png', krankheit: 'Atemwegsinfektion' },
  { name: 'Finn', art: 'Meerschweinchen', alter: '2.2 Jahre', gewicht: '0.8 kg', bild: 'gustav.png', krankheit: 'geheilt' },
  { name: 'Luna', art: 'Hund', alter: '2 Jahre', gewicht: '18 kg', bild: 'bello.png', krankheit: 'Ohrenentzündung' },
  { name: 'Leo', art: 'Katze', alter: '2 Jahre', gewicht: '4 kg', bild: 'minka.png', krankheit: 'geheilt' },
  { name: 'Coco', art: 'Kaninchen', alter: '2.2 Jahre', gewicht: '1.5 kg', bild: 'hoppel.png', krankheit: 'geheilt' },
  { name: 'Lotte', art: 'Hamster', alter: '1.2 Jahre', gewicht: '0.2 kg', bild: 'susi.png', krankheit: 'geheilt' },
  { name: 'Blue', art: 'Wellensittich', alter: '2.2 Jahre', gewicht: '0.11 kg', bild: 'hans.png', krankheit: 'geheilt' },
  { name: 'Emma', art: 'Meerschweinchen', alter: '1.2 Jahre', gewicht: '0.7 kg', bild: 'gustav.png', krankheit: 'Verdauungsstörung' },
  { name: 'Max', art: 'Hund', alter: '6 Jahre', gewicht: '31 kg', bild: 'bello.png', krankheit: 'geheilt' },
  { name: 'Sophie', art: 'Katze', alter: '3 Jahre', gewicht: '3 kg', bild: 'minka.png', krankheit: 'Bindehautentzündung' },
  { name: 'Hazel', art: 'Kaninchen', alter: '0.7 Jahre', gewicht: '0.95 kg', bild: 'hoppel.png', krankheit: 'Zahnschmerzen' },
  { name: 'Ben', art: 'Hamster', alter: '1.8 Jahre', gewicht: '0.21 kg', bild: 'susi.png', krankheit: 'Fellprobleme' },
  { name: 'Daisy', art: 'Wellensittich', alter: '1.2 Jahre', gewicht: '0.1 kg', bild: 'hans.png', krankheit: 'Verletzung' },
  { name: 'Ben', art: 'Meerschweinchen', alter: '3 Jahre', gewicht: '0.9 kg', bild: 'gustav.png', krankheit: 'geheilt' },
  { name: 'Bella', art: 'Hund', alter: '4 Jahre', gewicht: '20 kg', bild: 'bello.png', krankheit: 'Allergie' },
  { name: 'Sammy', art: 'Katze', alter: '8 Jahre', gewicht: '5.5 kg', bild: 'minka.png', krankheit: 'geheilt' },
  { name: 'Finn', art: 'Kaninchen', alter: '2.8 Jahre', gewicht: '1.65 kg', bild: 'hoppel.png', krankheit: 'geheilt' },
  { name: 'Lotte', art: 'Hamster', alter: '1.2 Jahre', gewicht: '0.2 kg', bild: 'susi.png', krankheit: 'geheilt' },
  { name: 'Rocky', art: 'Wellensittich', alter: '2.5 Jahre', gewicht: '0.12 kg', bild: 'hans.png', krankheit: 'geheilt' },
  { name: 'Clara', art: 'Meerschweinchen', alter: '0.7 Jahre', gewicht: '0.6 kg', bild: 'gustav.png', krankheit: 'Atemwegsprobleme' },
  { name: 'Charlie', art: 'Hund', alter: '9 Jahre', gewicht: '26 kg', bild: 'bello.png', krankheit: 'geheilt' },
  { name: 'Cleo', art: 'Katze', alter: '1.5 Jahre', gewicht: '2.8 kg', bild: 'minka.png', krankheit: 'Husten' },
  { name: 'Bella', art: 'Kaninchen', alter: '1.8 Jahre', gewicht: '1.4 kg', bild: 'hoppel.png', krankheit: 'Durchfall' },
  { name: 'Paul', art: 'Hamster', alter: '1.3 Jahre', gewicht: '0.19 kg', bild: 'susi.png', krankheit: 'Verdauungsprobleme' },
  { name: 'Lola', art: 'Wellensittich', alter: '0.7 Jahre', gewicht: '0.09 kg', bild: 'hans.png', krankheit: 'Parasiten' },
  { name: 'Max', art: 'Meerschweinchen', alter: '2.8 Jahre', gewicht: '0.85 kg', bild: 'gustav.png', krankheit: 'geheilt' },
  { name: 'Oliver', art: 'Hund', alter: '8 Jahre', gewicht: '24 kg', bild: 'bello.png', krankheit: 'geheilt' },
  { name: 'Milo', art: 'Katze', alter: '5 Jahre', gewicht: '4.2 kg', bild: 'minka.png', krankheit: 'geheilt' },
  { name: 'Lucky', art: 'Kaninchen', alter: '3.2 Jahre', gewicht: '1.85 kg', bild: 'hoppel.png', krankheit: 'geheilt' },
  { name: 'Susi', art: 'Hamster', alter: '1.5 Jahre', gewicht: '0.2 kg', bild: 'susi.png', krankheit: 'geheilt' },
  { name: 'Blue', art: 'Wellensittich', alter: '2.2 Jahre', gewicht: '0.11 kg', bild: 'hans.png', krankheit: 'geheilt' },
  { name: 'Ida', art: 'Meerschweinchen', alter: '1.8 Jahre', gewicht: '0.75 kg', bild: 'gustav.png', krankheit: 'Gewichtsverlust' },
  { name: 'Penny', art: 'Hund', alter: '4 Jahre', gewicht: '21 kg', bild: 'bello.png', krankheit: 'Zahnschmerzen' },
  { name: 'Ella', art: 'Katze', alter: '4 Jahre', gewicht: '3.2 kg', bild: 'minka.png', krankheit: 'Ohrenmilben' },
  { name: 'Coco', art: 'Kaninchen', alter: '2.2 Jahre', gewicht: '1.5 kg', bild: 'hoppel.png', krankheit: 'geheilt' },
  { name: 'Paul', art: 'Hamster', alter: '1.1 Jahre', gewicht: '0.17 kg', bild: 'susi.png', krankheit: 'Allergie' },
  { name: 'Sunny', art: 'Wellensittich', alter: '0.8 Jahre', gewicht: '0.1 kg', bild: 'hans.png', krankheit: 'Atemwegsinfektion' },
  { name: 'Oscar', art: 'Meerschweinchen', alter: '3.2 Jahre', gewicht: '0.92 kg', bild: 'gustav.png', krankheit: 'geheilt' },
  { name: 'Tucker', art: 'Hund', alter: '6 Jahre', gewicht: '30 kg', bild: 'bello.png', krankheit: 'geheilt' },  
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [geladeneTiere, setGeladeneTiere] = useState([]);
  const [anzahlGeladeneTiere, setAnzahlGeladeneTiere] = useState(15);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    // Hier nehmen wir uns die ersten 'anzahlGeladeneTiere' aus deiner 'alleTiere'-Liste
    const ersteTiere = alleTiere.slice(0, anzahlGeladeneTiere);
    setGeladeneTiere(ersteTiere);
      }, [anzahlGeladeneTiere]);
      console.log('Erster useEffect ausgeführt (nach Scroll)');

  useEffect(() => {
    const handleScroll = () => {
      // Überprüfen, ob wir am Ende der aktuell geladenen Tiere angekommen sind
      console.log('innerHeight:', window.innerHeight);
      console.log('scrollY:', window.scrollY);
      console.log('offsetHeight:', document.body.offsetHeight);
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500 // Ein kleiner Puffer, damit es nicht ganz am Ende passiert
      ) {
        // Wenn wir noch nicht alle Tiere geladen haben, laden wir die nächsten 15
        if (geladeneTiere.length < alleTiere.length) {
          setAnzahlGeladeneTiere(vorherigeAnzahl => vorherigeAnzahl + 15);
        }
      }
    };

    // Füge den Event Listener hinzu, wenn die Komponente "aufgebaut" wird
    window.addEventListener('scroll', handleScroll);

    // Entferne den Event Listener, wenn die Komponente "abgebaut" wird (wichtig für die Performance!)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [geladeneTiere.length]);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Titel darkMode={darkMode} />
      <div className="tier-cards-container">
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
    <App />
  </React.StrictMode>
);