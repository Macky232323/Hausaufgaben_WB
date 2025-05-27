import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePokedexState } from '../context/PokedexStateContext';
import axios from 'axios';
import '../styles/header.css';

const backgroundImages = {
    '/': 'images/bg_1.jpg',
    '/pokedex': 'images/header_02.jpg',
    '/arena': 'images/bg_3.jpg',
    '/tutorial': 'images/bg_2.jpg',
};
const defaultBackgroundImage = 'images/bg_1.jpg';

function Header({ className }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { team } = usePokedexState();
    const [headerStyle, setHeaderStyle] = useState({});

    useEffect(() => {
        const currentPath = location.pathname;
        let backgroundImage = defaultBackgroundImage;
        if (backgroundImages[currentPath]) {
            backgroundImage = backgroundImages[currentPath];
        } else if (currentPath.startsWith('/pokedex/')) {
            backgroundImage = backgroundImages['/pokedex'] || defaultBackgroundImage;
        }

        setHeaderStyle({
            backgroundImage: `url(${process.env.PUBLIC_URL}/${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        });
    }, [location.pathname]);

    const handleConditionalNavigate = (event, path) => {
        event.preventDefault();
        if (location.pathname === '/arena') {
            if (window.confirm("Willst du wirklich den Kampf verlassen?")) {
                navigate(path);
            }
        } else {
            navigate(path);
        }
    };

    const handleHeaderNavigateToArena = async (event) => {
        event.preventDefault(); 
        if (team.length === 0) {
            alert("Dein Team ist leer. Du benötigst mindestens ein Pokémon im Team, um die Arena zu betreten!");
            return;
        }

        const collectedPayloads = [];

        try {
            await axios.get('http://localhost:3001/battlemechanic/newbattle');
            await axios.post('http://localhost:3001/battlemechanic/fillbotteamroster');
            

            for (const pokemon of team) {
                const movesToSend = pokemon.selectedMoves.filter(move => move !== null);
                if (movesToSend.length > 0) {
                    const payloadBody = { moves: movesToSend };
                    await axios.post(`http://localhost:3001/battlemechanic/userteamroster/${pokemon.id}`, payloadBody);
                    collectedPayloads.push({
                        pokemonId: pokemon.id,
                        pokemonName: pokemon.ger_name,
                        body: payloadBody
                    });
                    
                } else {
                    
                }
            }
            
            navigate('/arena', { state: { teamPayloads: collectedPayloads } });
        } catch (error) {
            
            alert('Fehler beim Vorbereiten des Kampfes. Bitte versuche es erneut.');
        }
    };

    return (
        <div className={`${className} header`} style={headerStyle}>
            <img src={`${process.env.PUBLIC_URL}/images/Logo.png`} alt="Pokémon Arena Logo" className="header-logo" />
            <nav>
                <ul>
                    <li>
                        <button onClick={(e) => handleConditionalNavigate(e, '/')} className="header-nav-button">
                            Home
                        </button>
                    </li>
                    <li>
                        <button onClick={(e) => handleConditionalNavigate(e, '/pokedex')} className="header-nav-button">
                            Pokédex
                        </button>
                    </li>
                    <li>
                        <button onClick={handleHeaderNavigateToArena} className="header-nav-button">
                            Arena
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;