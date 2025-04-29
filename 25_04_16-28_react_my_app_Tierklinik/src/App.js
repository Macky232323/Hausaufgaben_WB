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
 import { getAlleTiere } from './services/api';
 import './index.css';
 import './components/Tierpatienten.css';

 function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [geladeneTiere, setGeladeneTiere] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [needsRefresh, setNeedsRefresh] = useState(true); // State für Refresh

  const contentRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isTierPatientenPage = location.pathname === '/tierpatienten';
  let containerClass = "scrollable-content";
  if (isTierPatientenPage) {
    containerClass += " tierpatienten-content";
  }

  // DarkMode Logik
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode);
      document.body.classList.toggle('dark-mode', newMode);
      document.body.classList.toggle('light-mode', !newMode);
      return newMode;
    });
  };
   useEffect(() => {
     const savedMode = localStorage.getItem('darkMode') === 'true';
     setDarkMode(savedMode);
     document.body.classList.toggle('dark-mode', savedMode);
     document.body.classList.toggle('light-mode', !savedMode);
   }, []);

  // Lade Tiere Funktion
  const ladeTiere = useCallback(async (pageToLoad, force = false) => {
    if (!force && (loading || !hasMore)) return;
    setLoading(true);
    setError(null);
    console.log(`Lade Seite ${pageToLoad}...`);
    try {
      const response = await getAlleTiere();
      const alleTiereData = response.data;
      const startIndex = (pageToLoad - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const neueTiere = alleTiereData.slice(startIndex, endIndex);
      setGeladeneTiere(prevTiere => pageToLoad === 1 ? neueTiere : [...prevTiere, ...neueTiere]);
      setHasMore(endIndex < alleTiereData.length);
      setPage(pageToLoad);
    } catch (err) {
      console.error('Fehler beim Laden der Tierdaten:', err);
      setError('Fehler beim Laden der Tierdaten.');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, itemsPerPage]);

  // Effekt, der auf location.state.refresh reagiert
  useEffect(() => {
    if (location.state?.refresh) {
      console.log("Navigation state 'refresh: true' erkannt.");
      setNeedsRefresh(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  // Effekt zum Laden/Neuladen der Tierliste
  useEffect(() => {
    if (isTierPatientenPage && needsRefresh) {
      console.log("Tierpatienten page active AND refresh needed, reloading data...");
      setGeladeneTiere([]);
      setPage(1);
      setHasMore(true);
      setLoading(false);
      setError(null);
      ladeTiere(1, true);
      setNeedsRefresh(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTierPatientenPage, needsRefresh]); // ladeTiere wurde aus den Deps entfernt, um Endlosschleife zu vermeiden


  // Infinite Scroll Logik
  useEffect(() => {
    if (!isTierPatientenPage || !contentRef.current) return;
    const containerElement = contentRef.current;
    const handleScroll = () => {
      if (containerElement.scrollTop + containerElement.clientHeight >= containerElement.scrollHeight - 200 && hasMore && !loading) {
        ladeTiere(page + 1);
      }
    };
    containerElement.addEventListener('scroll', handleScroll);
    return () => {
      containerElement.removeEventListener('scroll', handleScroll);
    };
  }, [isTierPatientenPage, ladeTiere, hasMore, loading, page]);


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
    <div className="tierpatienten-content-area">
       <div className="add-tier-button-container">
         {/* Text kleingeschrieben */}
         <button onClick={handleAddTierClick} className="add-tier-button">
           Tier hinzufügen
         </button>
       </div>
       <div className="tier-cards-container">
         {geladeneTiere.map((tier) => (
           <TierCard key={tier.id} {...tier} />
         ))}
       </div>
       {loading && page > 1 && <div style={{textAlign: 'center', padding: '20px'}}>Lade mehr Tiere...</div>}
       {!hasMore && geladeneTiere.length > 0 && <div style={{textAlign: 'center', padding: '20px'}}>Keine weiteren Tiere vorhanden.</div>}
       {error && <div className="error-message" style={{textAlign: 'center', padding: '20px'}}>Fehler: {error}</div>}
     </div>
  );


  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Titel darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
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
          <Route path="*" element={<div>404 - Seite nicht gefunden</div>} />
        </Routes>
      </div>
    </div>
  );
 }

 export default App;