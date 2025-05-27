import React, { createContext, useState, useContext, useMemo } from 'react';
import axios from 'axios';

const PokedexStateContext = createContext();

export function PokedexStateProvider({ children }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [viewType, setViewType] = useState('grid');
    const [sortConfig, setSortConfig] = useState({ key: 'pokemon_id', direction: 'ascending' });
    const [lastViewedId, setLastViewedId] = useState(null);
    const [scrollNeeded, setScrollNeeded] = useState(false);
    const [isTeamRosterVisible, setIsTeamRosterVisible] = useState(false);
    const [teamRosterInitialPosition, setTeamRosterInitialPosition] = useState({ top: null, left: null });
    const [teamRosterCurrentPosition, setTeamRosterCurrentPosition] = useState({ x: 20, y: 180 });
    const [triggerTeamRosterReset, setTriggerTeamRosterReset] = useState(0);
    
    const [team, setTeam] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [contextualPokemonList, setContextualPokemonList] = useState([]);
    const [fullPokemonListFromApi, setFullPokemonListFromApi] = useState([]);

    const addPokemonToTeam = (pokemonToAdd, moves) => {
        setTeam(prevTeam => {
            if (prevTeam.length >= 6) {
                alert("Dein Team ist bereits voll! (Max. 6 Pokémon)");
                return prevTeam;
            }
            const isAlreadyInTeam = prevTeam.some(p => p.id === pokemonToAdd.id);
            if (isAlreadyInTeam) {
                alert(`${pokemonToAdd.ger_name} ist bereits in deinem Team!`);
                return prevTeam;
            }
            const filledMoves = Array(4).fill(null);
            if (moves && Array.isArray(moves)) {
                for (let i = 0; i < Math.min(moves.length, 4); i++) {
                    filledMoves[i] = moves[i];
                }
            }
            return [...prevTeam, { ...pokemonToAdd, selectedMoves: filledMoves }];
        });
    };

    const removePokemonFromTeam = (pokemonId) => {
        setTeam(prevTeam => prevTeam.filter(p => p.id !== pokemonId));
    };
    
    const clearTeam = async () => {
        if (window.confirm("Möchtest du wirklich das gesamte Team leeren?")) {
            try {
                await axios.delete('http://localhost:3001/battlemechanic/userteamroster');
            } catch (error) {
                console.error("Fehler beim Leeren des Teams im Backend:", error);
            }
            setTeam([]);
        }
    };

    const updatePokemonInTeam = (pokemonId, newMoves) => {
        const filledNewMoves = Array(4).fill(null);
        if (newMoves && Array.isArray(newMoves)) {
            for (let i = 0; i < Math.min(newMoves.length, 4); i++) {
                filledNewMoves[i] = newMoves[i];
            }
        }
        setTeam(prevTeam =>
            prevTeam.map(p =>
                p.id === pokemonId ? { ...p, selectedMoves: filledNewMoves } : p
            )
        );
    };

    const value = useMemo(() => ({
        searchTerm, setSearchTerm,
        selectedTypes, setSelectedTypes,
        viewType, setViewType,
        sortConfig, setSortConfig,
        lastViewedId, setLastViewedId,
        scrollNeeded, setScrollNeeded,
        isTeamRosterVisible, setIsTeamRosterVisible,
        teamRosterInitialPosition, setTeamRosterInitialPosition,
        teamRosterCurrentPosition, setTeamRosterCurrentPosition,
        triggerTeamRosterReset, setTriggerTeamRosterReset,
        team, addPokemonToTeam, removePokemonFromTeam, clearTeam, updatePokemonInTeam,
        allTypes, setAllTypes,
        contextualPokemonList, setContextualPokemonList,
        fullPokemonListFromApi, setFullPokemonListFromApi 
    }), [
        searchTerm, selectedTypes, viewType, sortConfig, lastViewedId, scrollNeeded,
        isTeamRosterVisible, teamRosterInitialPosition, teamRosterCurrentPosition, triggerTeamRosterReset,
        team, allTypes, contextualPokemonList, fullPokemonListFromApi
    ]);

    return (
        <PokedexStateContext.Provider value={value}>
            {children}
        </PokedexStateContext.Provider>
    );
}

export function usePokedexState() {
    const context = useContext(PokedexStateContext);
    if (context === undefined) {
        throw new Error('usePokedexState must be used within a PokedexStateProvider');
    }
    return context;
}