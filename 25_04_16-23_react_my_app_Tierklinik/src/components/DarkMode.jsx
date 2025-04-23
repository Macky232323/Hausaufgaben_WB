import React from 'react';
 import './DarkMode.css';
 

 function DarkMode({ darkMode, toggleDarkMode }) {
  return (
  <div className="dark-mode-container">
  <label className="switch">
  <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
  <span className="slider round"></span>
  </label>
  <span className="dark-mode-text">{darkMode ? 'Dunkel' : 'Hell'}</span>  {/* Angepasster Text */}
  </div>
  );
 }
 

 export default DarkMode;