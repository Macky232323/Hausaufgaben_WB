import React from 'react';
import './TierCard.css';

function TierCard({ name, art, krankheit, alter, gewicht, bild }) {
  return (
    <div className="tier-card">
      <img src={`/assets/${bild}`} alt={name} className="tier-bild" />
      <div className="tier-info">
        <h3>{name}</h3>
        <p>Art: {art}</p>
        <p>Krankheit: {krankheit}</p>
        <p>Alter: {alter}</p>
        <p>Gewicht: {gewicht}</p>
      </div>
    </div>
  );
}

export default TierCard;