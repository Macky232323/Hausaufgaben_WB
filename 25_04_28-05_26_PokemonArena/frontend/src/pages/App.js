import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Header from "../components/header";
import Home from './home';
import Pokedex from "./pokedex";
import PokemonArena from "./pokemonArena";
import PokedexDetail from "./pokedexDetail";
import Tutorial from "./tutorial";
import { PokedexStateProvider, usePokedexState } from '../context/PokedexStateContext';
import TeamRoster from '../components/TeamRoster';
import '../styles/App.css';


const pageBodyBackgrounds = {
  '/': 'images/bg_1.jpg',
  '/pokedex': 'images/bg_2.jpg',
  '/arena': 'images/bg_3.jpg',
  '/tutorial': 'images/bg_2.jpg',
};
const defaultPageBodyBackground = 'images/bg_1.jpg';

function PageBodyBackgroundManager({ currentlyAppliedImageUrl, setCurrentlyAppliedImageUrl }) {
  const location = useLocation();

  let targetImageFile = defaultPageBodyBackground;
  if (pageBodyBackgrounds[location.pathname]) {
    targetImageFile = pageBodyBackgrounds[location.pathname];
  } else if (location.pathname.startsWith('/pokedex/')) {
    targetImageFile = pageBodyBackgrounds['/pokedex'] || defaultPageBodyBackground;
  } else if (location.pathname.startsWith('/tutorial/')) {
    targetImageFile = pageBodyBackgrounds['/tutorial'] || defaultPageBodyBackground;
  } else if (location.pathname.startsWith('/arena/')) {
    targetImageFile = pageBodyBackgrounds['/arena'] || defaultPageBodyBackground;
  }

  const newTargetImageUrl = `${process.env.PUBLIC_URL}/${targetImageFile}`;

  useEffect(() => {
    const imageDidChange = newTargetImageUrl !== currentlyAppliedImageUrl;

    if (imageDidChange) {
      document.body.style.backgroundImage = `url(${newTargetImageUrl})`;
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.minHeight = '100vh';
      document.body.style.backgroundSize = 'cover';
      document.body.style.transition = 'background-image 0.3s ease-in-out';

      setCurrentlyAppliedImageUrl(newTargetImageUrl);

    } else {
      if (!document.body.style.backgroundImage && newTargetImageUrl) {
        document.body.style.backgroundImage = `url(${newTargetImageUrl})`;
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.minHeight = '100vh';
        document.body.style.backgroundSize = 'cover';
      }
    }
  }, [newTargetImageUrl, currentlyAppliedImageUrl, setCurrentlyAppliedImageUrl]);

  useEffect(() => {
    return () => {};
  }, []);

  return null;
}


function AppContent() {
  const {
    team,
    teamRosterInitialPosition,
    teamRosterCurrentPosition,
    setTeamRosterCurrentPosition,
    triggerTeamRosterReset
  } = usePokedexState();
  const location = useLocation();

  const isOnDetailPage = location.pathname.startsWith('/pokedex/');
  const isOnArenaPage = location.pathname === '/arena';
  let renderTeamRoster = false;

  if (isOnArenaPage) {
    renderTeamRoster = false;
  } else if (isOnDetailPage) {
    renderTeamRoster = true;
  } else {
    renderTeamRoster = team.length > 0;
  }

  useEffect(() => {
    if (triggerTeamRosterReset > 0 && teamRosterInitialPosition.top !== null && teamRosterInitialPosition.left !== null) {
      if (location.pathname.startsWith('/pokedex/')) {
        setTeamRosterCurrentPosition({
          x: teamRosterInitialPosition.left,
          y: teamRosterInitialPosition.top
        });
      }
    }
  }, [triggerTeamRosterReset, teamRosterInitialPosition, location.pathname, setTeamRosterCurrentPosition]);


  const teamRosterStyle = {
    top: teamRosterCurrentPosition.y !== null ? `${teamRosterCurrentPosition.y}px` : undefined,
    left: teamRosterCurrentPosition.x !== null ? `${teamRosterCurrentPosition.x}px` : undefined,
  };

  return (
    <div className="app-container">


      <Header className="header-fixed" />
      <div className="content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/pokedex/:id" element={<PokedexDetail />} />
          <Route path="/arena" element={<PokemonArena />} />
          <Route path="/tutorial" element={<Tutorial />} />
        </Routes>
      </div>
      {renderTeamRoster && <TeamRoster style={teamRosterStyle} />}
    </div>
  );
}

function App() {

  const [currentlyAppliedImageUrl, setCurrentlyAppliedImageUrl] = useState('');

  useEffect(() => {
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.minHeight = '';
      document.body.style.transition = '';
      document.body.classList.remove('animate-body-background');
    };
  }, []);

  return (

    <Router>
      <PokedexStateProvider>
        <PageBodyBackgroundManager
          currentlyAppliedImageUrl={currentlyAppliedImageUrl}
          setCurrentlyAppliedImageUrl={setCurrentlyAppliedImageUrl}
        />
        <AppContent />
      </PokedexStateProvider>
    </Router>
  );
}

export default App;