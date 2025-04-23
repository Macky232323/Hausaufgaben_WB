import React, { useState } from 'react';
import './App.css';

function App() {
  // Initialisiere den Farbton mit einem Standardwert (z.B. 180 für Cyan)
  const [hue, setHue] = useState(180);

  // Funktion, die aufgerufen wird, wenn sich der Wert des Schiebereglers ändert
  const handleSliderChange = (event) => {
    setHue(event.target.value);
  };

  // Erstelle den HSL-Farbstring basierend auf dem aktuellen Farbton
  const backgroundColor = `hsl(${hue}, 70%, 70%)`;

  return (
    <div className="app" style={{ backgroundColor }}>
      <h1>Farbwechsler</h1>
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={handleSliderChange}
      />
      <p>Aktueller Farbton: {hue}</p>
    </div>
  );
}

export default App;