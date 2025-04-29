import React, { useState, useEffect, useRef, useCallback } from 'react';
 import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';
 import Titel from './components/Titel';
 import TierCard from './components/TierCard';
 import Kontakt from './components/Kontakt';
 import About from './components/About';
 import FAQ from './components/FAQ';
 import Impressum from './components/Impressum';
 import DarkMode from './components/DarkMode';
 import TierDetail from './components/TierDetail';
 import TierHinzufuegen from './components/TierHinzufuegen';
 import { getAlleTiere } from './services/api'; // Importiere die API-Funktion
 import './index.css';
 import './components/Tierpatienten.css'; // Importiere CSS für den Button

 function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [geladeneTiere, setGeladeneTiere] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true); // Zustand, ob mehr Tiere geladen werden können
  const [page, setPage] = useState(1); // Aktuelle Seite für die Paginierung (Beispiel)
  const itemsPerPage = 6; // Tiere pro "Seite"

  const contentRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate hook

  const isTierPatientenPage = location.pathname === '/tierpatienten';
  let containerClass = "scrollable-content";
  if (isTierPatientenPage) {
    containerClass += " tierpatienten-content"; // Spezifische Klasse hinzufügen
  }


  const toggleDarkMode = () => {
  setDarkMode(!darkMode);
  document.body.classList.toggle('dark-mode', !darkMode);
    document.body.classList.toggle('light-mode', darkMode);
  };

   // Initialisiere Dark Mode basierend auf localStorage oder Systemeinstellung
   useEffect(() => {
     const savedMode = localStorage.getItem('darkMode') === 'true';
     setDarkMode(savedMode);
     document.body.classList.toggle('dark-mode', savedMode);
     document.body.classList.toggle('light-mode', !savedMode);
   }, []);

   // Speichere Dark Mode Einstellung
   useEffect(() => {
     localStorage.setItem('darkMode', darkMode);
     document.body.classList.toggle('dark-mode', darkMode);
     document.body.classList.toggle('light-mode', !darkMode);
   }, [darkMode]);


  // Lade Tiere Funktion
  const ladeTiere = useCallback(async (pageToLoad) => {
  if (loading || !hasMore) return; // Verhindere mehrfaches Laden oder wenn keine Tiere mehr da sind
  setLoading(true);
  setError(null);
  console.log(`Lade Seite ${pageToLoad}...`);
  try {
  // Annahme: Die API unterstützt Paginierung über query parameter (z.B. ?page=1&limit=6)
  // Wenn nicht, muss die Logik angepasst werden (z.B. alle laden und clientseitig paginieren)
  // Für dieses Beispiel laden wir immer alle und slicen clientseitig.
  const response = await getAlleTiere(); // Lädt *alle* Tiere
  const alleTiereData = response.data;

  const startIndex = (pageToLoad - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const neueTiere = alleTiereData.slice(startIndex, endIndex);

  setGeladeneTiere(prevTiere => pageToLoad === 1 ? neueTiere : [...prevTiere, ...neueTiere]);
  setHasMore(endIndex < alleTiereData.length); // Prüfen, ob noch mehr Tiere vorhanden sind
  setPage(pageToLoad); // Update die aktuelle Seite

  } catch (err) {
  console.error('Fehler beim Laden der Tierdaten:', err);
  setError('Fehler beim Laden der Tierdaten.');
  // Optional: hasMore auf false setzen, um weitere Ladeversuche zu stoppen
  // setHasMore(false);
  } finally {
  setLoading(false);
  }
  }, [loading, hasMore, itemsPerPage]); // Abhängigkeiten hinzufügen


  // Initiales Laden für Tierpatienten-Seite
  useEffect(() => {
  if (isTierPatientenPage) {
  // Setze Tiere und Paginierung zurück, wenn zur Seite navigiert wird
  setGeladeneTiere([]);
  setPage(0); // Setze auf 0, damit der nächste Effekt Seite 1 lädt
  setHasMore(true);
  // Trigger loading for page 1
    ladeTiere(1);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTierPatientenPage]); // Nur ausführen, wenn sich der Pfad ändert


  // Infinite Scroll Logik
  useEffect(() => {
  if (!isTierPatientenPage || !contentRef.current) return;

  const observer = new IntersectionObserver(
  (entries) => {
  if (entries[0].isIntersecting && hasMore && !loading) {
  ladeTiere(page + 1);
  }
  },
  {
  root: contentRef.current, // Beobachte Scrollen innerhalb dieses Containers
  rootMargin: '0px',
  threshold: 0.8, // Trigger, wenn 80% des Markers sichtbar sind
  }
  );

  // Ein unsichtbares Element am Ende der Liste als Trigger
  const scrollTrigger = document.createElement('div');
  scrollTrigger.style.height = '10px'; // Kleines, unsichtbares Element
  contentRef.current.appendChild(scrollTrigger);
  observer.observe(scrollTrigger);

  return () => {
  if (scrollTrigger && contentRef.current?.contains(scrollTrigger)) {
      observer.unobserve(scrollTrigger);
      contentRef.current.removeChild(scrollTrigger);
    }
  };
  }, [isTierPatientenPage, ladeTiere, hasMore, loading, page]); // Abhängigkeiten aktualisiert

  const handleAddTierClick = () => {
  navigate('/tierpatienten/Hinzufuegen');
  };

  // --- Render Logic ---
  const renderHome = () => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <h1>Willkommen bei der Tierklinik-Techstarter!</h1>
         <p>
           Seit über 300 Jahren sind wir die erste Adresse für alle, die das Beste für ihre tierischen Mitbewohner wollen.
           Unsere Klinik wurde im Jahre 1723 von dem visionären Dr. Archibald Fusselbart gegründet, der damals schon
           bahnbrechende Methoden wie die "Kräuter-Kitzel-Therapie" für gestresste Hamster und die "Symphonie-Behandlung"
           für melancholische Möpse entwickelte.
         </p>
         <p>
           Im Laufe der Jahrhunderte haben wir unser Repertoire stetig erweitert. Heute bieten wir unter anderem:
         </p>
         <ul>
           <li>
             <b>Die "Schnurrhaar-Harmonisierung":</b> Eine sanfte Methode, um das energetische Gleichgewicht von Katzen
             wiederherzustellen (hilft auch bei akuter Unentschlossenheit vor dem Futternapf).
           </li>
           <li>
             <b>Die "Feder-Flüster-Technik":</b> Speziell für Vögel mit Kommunikationsschwierigkeiten (und für Papageien,
             die einfach mal was Nettes sagen sollen).
           </li>
           <li>
             <b>Die "Hasen-Hypnose":</b> Verhilft ängstlichen Langohren zu mehr Selbstbewusstsein (und macht sie zu
             unübertroffenen Karotten-Verhandlern).
           </li>
           <li>
             <b>Die "Reptilien-Reflexzonenmassage":</b> Aktiviert die Lebensgeister von Echsen und Schlangen (und sorgt
             für eine entspannte Häutung).
           </li>
          </ul>
         <p>
          Und natürlich haben wir auch die neuesten, wissenschaftlich fundierten Methoden im Angebot. Aber seien wir ehrlich,
          manchmal hilft eben doch nur ein gutes altes "Kräuter-Kitzel".
         </p>
         <p>
           Kommen Sie vorbei und überzeugen Sie sich selbst! Ihr Tier wird es Ihnen danken (oder zumindest nicht böse sein).
         </p>
      </div>
      <img src="/assets/home.png" alt="Tierklinik" style={{ maxWidth: '40%', height: 'auto', borderRadius: '8px' }} />
    </div>
  );

  const renderTierpatienten = () => (
    <>
       <div className="add-tier-button-container">
         <button onClick={handleAddTierClick} className="add-tier-button">
           Tier Hinzufügen
         </button>
       </div>
       <div className="tier-cards-container">
         {geladeneTiere.map((tier) => (
           <TierCard key={tier.id} {...tier} />
         ))}
       </div>
       {loading && <div>Lade mehr Tiere...</div>}
       {!hasMore && geladeneTiere.length > 0 && <div>Keine weiteren Tiere vorhanden.</div>}
       {error && <div className="error-message">Fehler: {error}</div>}
     </>
  );


  return (
  <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
  <Titel darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  {/* Verwende contentRef für den scrollbaren Container */}
  <div className={containerClass} ref={contentRef}>
  <Routes>
  <Route path="/" element={renderHome()} />
  <Route path="/tierpatienten" element={renderTierpatienten()} />
  <Route path="/tierpatienten/Hinzufuegen" element={<TierHinzufuegen />} />
  <Route path="/tiere/:id" element={<TierDetail />} />
  <Route path="/kontakt" element={<Kontakt />} />
  <Route path="/about" element={<About />} />
  <Route path="/faq" element={<FAQ />} />
  <Route path="/impressum" element={<Impressum />} />
  <Route path="*" element={<div>404 - Seite nicht gefunden</div>} /> {/* Fallback Route */}
  </Routes>
  </div>
  </div>
  );
 }

 export default App;