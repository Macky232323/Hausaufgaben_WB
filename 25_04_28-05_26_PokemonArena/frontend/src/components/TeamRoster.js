import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/TeamRoster.css';
import { usePokedexState } from '../context/PokedexStateContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TYPE_ICON_FOLDER = 'TypeIcons';
const TYPE_ICON_EXTENSION = 'svg';

const formatApiNameToFileName = (apiTypeName) => {
    if (!apiTypeName) return '';
    return apiTypeName.charAt(0).toUpperCase() + apiTypeName.slice(1).toLowerCase();
};

const getTypeIconPath = (apiTypeName) => {
    if (!apiTypeName) return null;
    const fileName = formatApiNameToFileName(apiTypeName);
    return `${process.env.PUBLIC_URL}/${TYPE_ICON_FOLDER}/${fileName}.${TYPE_ICON_EXTENSION}`;
};

const typeColorsRoster = {
    Normal: '#A8A77A', Feuer: '#EE8130', Wasser: '#6390F0', Elektro: '#F7D02C',
    Pflanze: '#7AC74C', Eis: '#96D9D6', Kampf: '#C22E28', Gift: '#A33EA1',
    Boden: '#E2BF65', Flug: '#A98FF3', Psycho: '#F95587', Käfer: '#A6B91A',
    Gestein: '#B6A136', Geist: '#735797', Drache: '#6F35FC', Unlicht: '#705746',
    Stahl: '#B7B7CE', Fee: '#D685AD', defaultHex: '#373737'
};

const getRgbaWithOpacityRoster = (hexColor, alpha) => {
    if (!hexColor) hexColor = typeColorsRoster.defaultHex;

    let r = 0, g = 0, b = 0;

    if (hexColor.startsWith('#')) {
        const bigint = parseInt(hexColor.slice(1), 16);
        r = (bigint >> 16) & 255;
        g = (bigint >> 8) & 255;
        b = bigint & 255;
    } else if (hexColor.startsWith('rgb')) {
        const parts = hexColor.match(/[\d.]+/g);
        if (parts && parts.length >= 3) {
            r = parseInt(parts[0]);
            g = parseInt(parts[1]);
            b = parseInt(parts[2]);

            if (parts.length === 4 && alpha === undefined) {
                alpha = parseFloat(parts[3]);
            }
        }
    }
    const finalAlpha = Math.min(1, Math.max(0, alpha));
    return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
};


function TeamRoster({ style }) {
    const {
        team,
        removePokemonFromTeam,
        clearTeam,
        teamRosterCurrentPosition,
        setTeamRosterCurrentPosition,
        allTypes
    } = usePokedexState();

    const navigate = useNavigate();

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const rosterRef = useRef(null);

    const germanToApiTypeMapRoster = useMemo(() => {
        const map = {};
        if (allTypes && Array.isArray(allTypes)) {
            allTypes.forEach(t => {
                map[t.ger_name.toLowerCase()] = t.api_name.toLowerCase();
            });
        }
        const fallbackMap = {
            'normal': 'normal', 'feuer': 'fire', 'wasser': 'water', 'pflanze': 'grass',
            'elektro': 'electric', 'eis': 'ice', 'kampf': 'fighting', 'gift': 'poison',
            'boden': 'ground', 'flug': 'flying', 'psycho': 'psychic', 'käfer': 'bug',
            'gestein': 'rock', 'geist': 'ghost', 'drache': 'dragon', 'unlicht': 'dark',
            'stahl': 'steel', 'fee': 'fairy'
        };
        for (const key in fallbackMap) { if (!map[key]) { map[key] = fallbackMap[key]; } }
        return map;
    }, [allTypes]);

    const getIconPathForPokemonTypeInRoster = (germanTypeName) => {
        if (!germanTypeName) return null;
        const apiName = germanToApiTypeMapRoster[germanTypeName.toLowerCase()];
        return apiName ? getTypeIconPath(apiName) : null;
    };

    const handleNavigateToArena = async (event) => {
        event.preventDefault();
        if (team.length === 0) {
            alert("Dein Team ist leer!");
            return;
        }

        const collectedPayloads = [];

        try {
            await axios.get('http://localhost:3001/battlemechanic/newbattle');
            await axios.post('http://localhost:3001/battlemechanic/fillbotteamroster');
            console.log('TeamRoster: Backend-Roster-Tabellen erneuert.');

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
                    console.log(`TeamRoster: ${pokemon.ger_name} (ID: ${pokemon.id}) mit Attacken zum Backend-Roster hinzugefügt.`);
                } else {
                    console.warn(`TeamRoster: ${pokemon.ger_name} (ID: ${pokemon.id}) hat keine ausgewählten Attacken und wurde nicht gesendet.`);
                }
            }
            console.log('TeamRoster: Alle Pokémon erfolgreich zum Backend gesendet.');
            navigate('/arena', { state: { teamPayloads: collectedPayloads } });
        } catch (error) {
            console.error('TeamRoster: Fehler beim Senden des Teams ans Backend:', error);
            alert('Fehler beim Vorbereiten des Kampfes. Bitte versuche es erneut.');
        }
    };


    const handleMouseDown = (e) => {
        if (e.target.closest('.roster-action-button') || e.target.closest('.roster-pokemon-moves span') || e.target.closest('.roster-to-arena-button')) {
            return;
        }
        if (rosterRef.current && e.target.closest('.team-roster-slot') && !e.target.closest('.team-roster-slots-container::-webkit-scrollbar-thumb')) {
            if (e.button !== 0) return;
            setIsDragging(true);
            const rect = rosterRef.current.getBoundingClientRect();
            setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            e.preventDefault();
        } else if (rosterRef.current && rosterRef.current.contains(e.target) && !e.target.closest('.team-roster-slots-container')) {
            if (e.button !== 0) return;
            setIsDragging(true);
            const rect = rosterRef.current.getBoundingClientRect();
            setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            e.preventDefault();
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            let newX = e.clientX - offset.x;
            let newY = e.clientY - offset.y;
            setTeamRosterCurrentPosition({ x: newX, y: newY });
        };
        const handleMouseUp = () => setIsDragging(false);
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset, setTeamRosterCurrentPosition]);

    const currentStyle = {
        ...style,
        top: `${teamRosterCurrentPosition.y}px`,
        left: `${teamRosterCurrentPosition.x}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
    };

    const handleSlotClick = (pokemonId) => {
        if (pokemonId) {
            navigate(`/pokedex/${pokemonId}`);
        }
    };

    const baseAlpha = 0.5;

    return (
        <div
            ref={rosterRef}
            className="team-roster-container"
            style={currentStyle}
            onMouseDown={handleMouseDown}
        >
            <div className="team-roster-header">
                {team.length > 0 && (
                    <button
                        onClick={handleNavigateToArena}
                        className="roster-action-button roster-to-arena-button"
                    >
                        Zur Arena
                    </button>
                )}
                <h3>Team ({team.length}/6)</h3>
                {team.length > 0 && (
                    <button
                        onClick={clearTeam}
                        className="roster-action-button clear-team-button"
                        title="Gesamtes Team leeren"
                    >
                        Alle entfernen
                    </button>
                )}
            </div>

            <div className="team-roster-slots-container">
                {team.map((pokemonInTeam) => {
                    const pokemonTypesForDisplay = pokemonInTeam.types || [];
                    const primaryTypeGerman = pokemonTypesForDisplay[0] || 'defaultHex';
                    const primaryTypeHexColor = typeColorsRoster[primaryTypeGerman] || typeColorsRoster.defaultHex;

                    const normalBg = getRgbaWithOpacityRoster(primaryTypeHexColor, baseAlpha);
                    const hoverBg = getRgbaWithOpacityRoster(primaryTypeHexColor, Math.min(1, baseAlpha + 0.2));
                    const solidTypeColor = primaryTypeHexColor;

                    const slotStyle = {
                        '--roster-slot-normal-bg': normalBg,
                        '--roster-slot-hover-bg': hoverBg,
                        '--roster-slot-solid-type-color': solidTypeColor,
                    };

                    return (
                        <div
                            key={pokemonInTeam.id}
                            className="team-roster-slot filled-slot"
                            style={slotStyle}
                            onClick={(e) => {
                                if (e.target.closest('.remove-pokemon-button')) return;
                                handleSlotClick(pokemonInTeam.id);
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => { if (e.key === 'Enter' && !e.target.closest('.remove-pokemon-button')) handleSlotClick(pokemonInTeam.id) }}
                            title={`Details für ${pokemonInTeam.ger_name} anzeigen`}
                        >
                            <div className="roster-slot-content-wrapper">
                                <div className="roster-slot-line-1">
                                    <div className="roster-sprite-wrapper">
                                        <img
                                            src={pokemonInTeam.front_sprite}
                                            alt={pokemonInTeam.ger_name}
                                            className="roster-pokemon-sprite"
                                        />
                                    </div>
                                    <div className="roster-pokemon-name-and-types">
                                        <span className="roster-pokemon-name">{pokemonInTeam.ger_name}</span>
                                        <div className="roster-pokemon-types">
                                            {pokemonTypesForDisplay.map((germanTypeName, index) => {
                                                const iconPath = getIconPathForPokemonTypeInRoster(germanTypeName);
                                                return iconPath ? (
                                                    <img key={index} src={iconPath} alt={germanTypeName} title={germanTypeName} className="roster-type-icon" />
                                                ) : (
                                                    <span key={index} className="roster-type-badge">{germanTypeName}</span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removePokemonFromTeam(pokemonInTeam.id); }}
                                        className="roster-action-button remove-pokemon-button"
                                        title={`${pokemonInTeam.ger_name} aus Team entfernen`}
                                    >
                                        X
                                    </button>
                                </div>
                                <div className="roster-slot-line-2">
                                    <div className="roster-pokemon-moves">
                                        {pokemonInTeam.selectedMoves && pokemonInTeam.selectedMoves.map((move, index) => {
                                            if (!move) return <div key={`empty-move-${index}`} className="roster-move-entry empty">&nbsp;</div>;

                                            const attackTypeIconPath = getTypeIconPath(move.dmg_typ);
                                            const moveTooltip = `${move.ger_name}: ${move.flavor_text || 'Keine Beschreibung verfügbar.'}`;

                                            return (
                                                <div key={index} className="roster-move-entry" title={moveTooltip}>
                                                    {attackTypeIconPath && (
                                                        <img src={attackTypeIconPath} alt={move.dmg_typ} className="roster-move-type-icon" />
                                                    )}
                                                    <span className="roster-move-name">
                                                        {move.ger_name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {Array.from({ length: Math.max(0, 4 - (pokemonInTeam.selectedMoves?.length || 0)) }).map((_, i) => (
                                            <div key={`placeholder-move-${i}`} className="roster-move-entry empty">&nbsp;</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {Array.from({ length: Math.max(0, 6 - team.length) }).map((_, index) => (
                    <div key={`empty-${index}`} className="team-roster-slot empty-slot">
                        <span className="empty-slot-text">Slot {team.length + index + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TeamRoster;