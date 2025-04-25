import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TierCard.css';

function TierCard({ name, art, krankheit, age, gewicht, bild, id }) {
 const navigate = useNavigate();

 return (
   <div className="tier-card" onClick={() => navigate(`/tiere/${id}`)}>
     <img src={`/assets/${bild}`} alt={name} className="tier-bild" />
     <div className="tier-info">
       <h3>{name}</h3>
       <p>Art: {art}</p>
       <p>Krankheit: {krankheit}</p>
       <p>Alter: {age}</p>
       <p>Gewicht: {gewicht}</p>
     </div>
   </div>
 );
}

export default TierCard;