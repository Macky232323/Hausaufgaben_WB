import React from 'react';
import './Titel.css';
import bg_hell from '../assets/bg_hell.jpg';
import bg_dunkel from '../assets/bg_dunkel.jpg';

function Titel({ darkMode }) {
  const backgroundImage = darkMode ? bg_dunkel : bg_hell;

  return (
    <div className={`titel-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1>Unsere Tiere</h1>
    </div>
  );
}

export default Titel;