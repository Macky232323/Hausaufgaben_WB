import React from 'react';
 import { NavLink } from 'react-router-dom';
 import './Titel.css';
 import './NavBar.css';
 import bg_hell from '../assets/bg_hell.jpg';
 import bg_dunkel from '../assets/bg_dunkel.jpg';
 

 function Titel({ darkMode }) {
  const backgroundImage = darkMode ? bg_dunkel : bg_hell;
 

  return (
  <div className={`titel-container ${darkMode ? 'dark-mode' : 'light-mode'}`} style={{ backgroundImage: `url(${backgroundImage})` }}>
  <nav className="nav-bar">
  <NavLink exact to="/" className="nav-button" activeClassName="active">Home</NavLink>
  <NavLink to="/tierpatienten" className="nav-button" activeClassName="active">Tierpatienten</NavLink>
  <NavLink to="/about" className="nav-button" activeClassName="active">About</NavLink>
  <NavLink to="/kontakt" className="nav-button" activeClassName="active">Kontakt</NavLink>
  <NavLink to="/faq" className="nav-button" activeClassName="active">FAQ</NavLink>
  <NavLink to="/impressum" className="nav-button" activeClassName="active">Impressum</NavLink>
  </nav>
  <h1>Tierklinik-Techstarter</h1>
  </div>
  );
 }
 

 export default Titel;