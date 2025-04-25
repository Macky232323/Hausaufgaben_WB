import React from 'react';
 import './FAQ.css';
 

 function FAQ() {
  return (
  <div className="faq-container">
  <h1>Häufig gestellte Fragen</h1>
  <div className="faq-item">
  <button className="faq-question">
  Was sind die Öffnungszeiten Ihrer Klinik?
  </button>
  <div className="faq-answer">
  Unsere Klinik ist Montag bis Freitag von 8:00 bis 18:00 Uhr und Samstag von 9:00 bis 13:00 Uhr geöffnet.
  An Sonn- und Feiertagen haben wir geschlossen.
  </div>
  </div>
  <div className="faq-item">
  <button className="faq-question">
  Bieten Sie auch Notfallversorgung an?
  </button>
  <div className="faq-answer">
  Ja, wir bieten Notfallversorgung während unserer Öffnungszeiten an. Außerhalb der Öffnungszeiten
  wenden Sie sich bitte an den tierärztlichen Notdienst.
  </div>
  </div>
  <div className="faq-item">
  <button className="faq-question">
  Welche Tierarten behandeln Sie?
  </button>
  <div className="faq-answer">
  Wir behandeln hauptsächlich Kleintiere wie Hunde, Katzen, Kaninchen, Meerschweinchen und Hamster.
  Für andere Tierarten wenden Sie sich bitte an eine spezialisierte Klinik.
  </div>
  </div>
  <div className="faq-item">
  <button className="faq-question">
  Kann ich online einen Termin vereinbaren?
  </button>
  <div className="faq-answer">
  Ja, Sie können online einen Termin über unser Terminvereinbarungsformular auf der Kontaktseite vereinbaren.
  </div>
  </div>
  <div className="faq-item">
  <button className="faq-question">
  Akzeptieren Sie Haustierversicherungen?
  </button>
  <div className="faq-answer">
  Ja, wir akzeptieren die meisten gängigen Haustierversicherungen. Bitte bringen Sie Ihre Versicherungsinformationen
  zu Ihrem Termin mit.
  </div>
  </div>
  </div>
  );
 }
 

 export default FAQ;