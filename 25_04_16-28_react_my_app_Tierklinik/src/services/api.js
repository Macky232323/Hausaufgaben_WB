import axios from 'axios';

 const API_URL = 'http://localhost:3001'; // Deine Backend-URL

 const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
  'Content-Type': 'application/json',
  },
 });

 // Funktion zum Abrufen aller Tiere (mit optionalem Sortierparameter)
 export const getAlleTiere = (sortBy = '') => {
  const params = {};
  if (sortBy) {
  params.sort = sortBy;
  }
  return apiClient.get('/tiere', { params });
 };

 // Funktion zum Abrufen eines Tiers nach ID
 export const getTierById = (id) => {
  return apiClient.get(`/tiere/${id}`);
 };

 // Funktion zum Abrufen der Anamnese für ein Tier
 export const getAnamneseById = (id) => {
  return apiClient.get(`/Anamnese/${id}`);
 };

 // Funktion zum Hinzufügen eines neuen Tiers (verwendet FormData)
 export const addTier = (formData) => {
  return apiClient.post('/tiere', formData, {
  headers: {
  'Content-Type': 'multipart/form-data', // Wichtig für Datei-Uploads
  },
  });
 };

 // Funktion zum Aktualisieren eines Tiers (verwendet FormData)
 export const updateTier = (id, formData, oldBildFilename) => {
   // Füge den alten Bildnamen hinzu, damit das Backend ihn löschen kann, falls ein neues Bild hochgeladen wird
   if (oldBildFilename) {
     formData.append('oldBild', oldBildFilename);
   }
  return apiClient.put(`/tiere/${id}`, formData, {
  headers: {
  'Content-Type': 'multipart/form-data', // Wichtig für Datei-Uploads
  },
  });
 };

 // Funktion zum Löschen eines Tiers
 export const deleteTier = (id) => {
  return apiClient.delete(`/tiere/${id}`);
 };

 export default apiClient; // Exportiere auch die konfigurierte Instanz, falls benötigt