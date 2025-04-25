import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TierCard from './TierCard';
import './Tierpatienten.css';

function Tierpatienten() {
 const [tiere, setTiere] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const location = useLocation();

 useEffect(() => {
   const fetchTiere = async () => {
     setLoading(true);
     setError(null);
     try {
       const response = await fetch('http://localhost:3001/tiere');
       if (!response.ok) {
         throw new Error('Fehler beim Laden der Tierdaten');
       }
       const data = await response.json();
       setTiere(data);
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   };

   fetchTiere();
 }, [location]);

 if (loading) {
   return <div>Lade Tierdaten...</div>;
 }

 if (error) {
   return <div>Fehler: {error}</div>;
 }

 return (
   <div className="tierpatienten-container">
     <h1>Tierpatienten</h1>
     <div className="tier-grid">
       {tiere.map(tier => (
         <TierCard key={tier.id} {...tier} /> // Hier werden die Tierdaten an TierCard übergeben
       ))}
     </div>
   </div>
 );
}

export default Tierpatienten;