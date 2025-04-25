import React from 'react';
 import './Kontakt.css';
 

 function Kontakt() {
  return (
  <div className="kontakt-container">
  <h1>Kontaktieren Sie uns</h1>
  <p>
  Haben Sie Fragen oder möchten Sie einen Termin vereinbaren? Füllen Sie das untenstehende Formular aus,
  und wir werden uns so schnell wie möglich bei Ihnen melden.
  </p>
  <form className="kontakt-form">
  <div className="form-group">
  <label htmlFor="name">Name:</label>
  <input type="text" id="name" name="name" required />
  </div>
  <div className="form-group">
  <label htmlFor="strasse">Straße:</label>
  <input type="text" id="strasse" name="strasse" required />
  </div>
  <div className="form-group">
  <label htmlFor="plz">PLZ:</label>
  <input type="text" id="plz" name="plz" required />
  </div>
  <div className="form-group">
  <label htmlFor="stadt">Stadt:</label>
  <input type="text" id="stadt" name="stadt" required />
  </div>
  <div className="form-group">
  <label htmlFor="email">E-Mail:</label>
  <input type="email" id="email" name="email" required />
  </div>
  <div className="form-group">
  <label htmlFor="telefon">Telefonnummer:</label>
  <input type="tel" id="telefon" name="telefon" required />
  </div>
  <div className="form-group">
  <label htmlFor="tier">Tier:</label>
  <input type="text" id="tier" name="tier" />
  </div>
  <div className="form-group">
  <label htmlFor="beschwerden">Beschwerden:</label>
  <input type="text" id="beschwerden" name="beschwerden" />
  </div>
  <div className="form-group">
  <label htmlFor="anliegen">Anliegen:</label>
  <textarea id="anliegen" name="anliegen" rows="4" required></textarea>
  </div>
  <button type="submit">Absenden</button>
  </form>
  </div>
  );
 }
 

 export default Kontakt;