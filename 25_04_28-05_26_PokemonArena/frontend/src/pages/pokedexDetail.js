import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import '../styles/pokedexDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import PokedexEntry from '../components/PokedexEntry.js';
import PokedexEntryBattleDetails from '../components/PokedexEntryBattleDetails.js';
import { usePokedexState } from '../context/PokedexStateContext';

function PokedexDetailPage() {
    const { id } = useParams();
    const idNum = Number(id);
    const navigate = useNavigate();
    const {
        setScrollNeeded,
        setLastViewedId,
        allTypes: typesFromContext,
        setTeamRosterInitialPosition,
        setTriggerTeamRosterReset,
        contextualPokemonList,
        searchTerm,
        selectedTypes,
        sortConfig
    } = usePokedexState();

    const [pokemon, setPokemon] = useState(null);
    const [prevPokemonInList, setPrevPokemonInList] = useState(null);
    const [nextPokemonInList, setNextPokemonInList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allTypesForEntry, setAllTypesForEntry] = useState([]);

    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [typeEffectiveness, setTypeEffectiveness] = useState(null);
    const [loadingTypeEffectiveness, setLoadingTypeEffectiveness] = useState(true);
    const [moveset, setMoveset] = useState([]);
    const [loadingMoveset, setLoadingMoveset] = useState(true);

    const MAX_POKEMON_ID_FALLBACK = 1025;

    const battleDetailsRef = useRef(null);
    const pokedexEntryRef = useRef(null);

    const isPageLoading = loading || (pokemon && (loadingStats || loadingTypeEffectiveness || loadingMoveset));

    const handleGoToPokedex = useCallback(() => {
        if (isPageLoading) return;
        setScrollNeeded(true);
        navigate('/pokedex');
    }, [isPageLoading, setScrollNeeded, navigate]);

    const navigateToPokemon = useCallback((targetId) => {
        if (targetId && !isPageLoading) {
            navigate(`/pokedex/${targetId}`);
        }
    }, [isPageLoading, navigate]);


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (isPageLoading) return;

            switch (event.key) {
                case 'ArrowRight':
                    if (nextPokemonInList) {
                        navigateToPokemon(nextPokemonInList.pokemon_id);
                    }
                    break;
                case 'ArrowLeft':
                    if (prevPokemonInList) {
                        navigateToPokemon(prevPokemonInList.pokemon_id);
                    }
                    break;
                case 'ArrowUp':
                    handleGoToPokedex();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [navigateToPokemon, handleGoToPokedex, nextPokemonInList, prevPokemonInList, isPageLoading]);


    useEffect(() => {
        setTriggerTeamRosterReset(prev => prev + 1);
    }, [setTriggerTeamRosterReset, idNum]);

    useEffect(() => {
        if (pokemon && battleDetailsRef.current && pokedexEntryRef.current && !loading) {
            const battleRect = battleDetailsRef.current.getBoundingClientRect();
            const Abstand = 20;
            const targetTop = battleRect.top;
            const targetLeft = battleRect.right + Abstand;
            setTeamRosterInitialPosition({ top: targetTop, left: targetLeft });
        }
    }, [pokemon, loading, setTeamRosterInitialPosition, idNum]);

    useEffect(() => {
        const fetchAllTypes = async () => {
            if (typesFromContext && typesFromContext.length > 0) {
                setAllTypesForEntry(typesFromContext);
            } else {
                try {
                    const typesRes = await axios.get("http://localhost:3001/types");
                    setAllTypesForEntry(typesRes.data);
                } catch (error) {
                    console.error("Fehler beim Laden der Typen in PokedexDetail:", error);
                    setAllTypesForEntry([]);
                }
            }
        };
        fetchAllTypes();
    }, [typesFromContext]);

    useEffect(() => {
        const fetchBasePokemonData = async () => {
            setLoading(true);
            setPokemon(null);
            setStats(null);
            setTypeEffectiveness(null);
            setMoveset([]);
            setLoadingStats(true);
            setLoadingTypeEffectiveness(true);
            setLoadingMoveset(true);
            setPrevPokemonInList(null);
            setNextPokemonInList(null);

            setLastViewedId(idNum);
            try {
                const currentPokemonRes = await axios.get(`http://localhost:3001/pokemon/${idNum}`);
                const currentPokemonData = currentPokemonRes.data?.[0];
                setPokemon(currentPokemonData);

            } catch (error) {
                console.error("Fehler beim Laden der Basis-Pokémon-Daten:", error);
                setPokemon(null);
            } finally {
                setLoading(false);
            }
        };
        if (allTypesForEntry.length > 0 || !typesFromContext || (typesFromContext && typesFromContext.length === 0 && allTypesForEntry.length === 0) ) {
            fetchBasePokemonData();
        }
    }, [idNum, setLastViewedId, allTypesForEntry, typesFromContext]);

    useEffect(() => {
        if (pokemon && contextualPokemonList && contextualPokemonList.length > 0) {
            const currentIndex = contextualPokemonList.findIndex(p => p.pokemon_id === pokemon.pokemon_id);
            if (currentIndex !== -1) {
                setPrevPokemonInList(currentIndex > 0 ? contextualPokemonList[currentIndex - 1] : null);
                setNextPokemonInList(currentIndex < contextualPokemonList.length - 1 ? contextualPokemonList[currentIndex + 1] : null);
            } else {
                setPrevPokemonInList(null);
                setNextPokemonInList(null);
            }
        } else if (pokemon && (!contextualPokemonList || contextualPokemonList.length === 0)) {
            const fetchFallbackPrevNext = async () => {
                const prevId = pokemon.pokemon_id > 1 ? pokemon.pokemon_id - 1 : null;
                const nextId = pokemon.pokemon_id < MAX_POKEMON_ID_FALLBACK ? pokemon.pokemon_id + 1 : null;

                if (prevId) {
                    try {
                        const prevRes = await axios.get(`http://localhost:3001/pokemon/${prevId}`);
                        setPrevPokemonInList(prevRes.data?.[0] || null);
                    } catch { setPrevPokemonInList(null); }
                } else { setPrevPokemonInList(null); }

                if (nextId) {
                    try {
                        const nextRes = await axios.get(`http://localhost:3001/pokemon/${nextId}`);
                        setNextPokemonInList(nextRes.data?.[0] || null);
                    } catch { setNextPokemonInList(null); }
                } else { setNextPokemonInList(null); }
            };
            fetchFallbackPrevNext();
        }
    }, [pokemon, contextualPokemonList]);


    useEffect(() => {
        if (pokemon && pokemon.pokemon_id) {
            const fetchBattleData = async () => {
                setLoadingStats(true);
                try {
                    const statsRes = await axios.get(`http://localhost:3001/battlemechanic/pokemonattr/${pokemon.pokemon_id}`);
                    setStats(statsRes.data?.[0] || null);
                } catch (error) {
                    console.error(`Fehler beim Laden der Stats für Pokémon ${pokemon.pokemon_id}:`, error);
                    setStats(null);
                } finally {
                    setLoadingStats(false);
                }

                setLoadingTypeEffectiveness(true);
                try {
                    const typeEffRes = await axios.get(`http://localhost:3001/battlemechanic/types4wsi/${pokemon.pokemon_id}`);
                    setTypeEffectiveness(typeEffRes.data?.[0] || null);
                } catch (error) {
                    console.error(`Fehler beim Laden der Typ-Effektivitäten für Pokémon ${pokemon.pokemon_id}:`, error);
                    setTypeEffectiveness(null);
                } finally {
                    setLoadingTypeEffectiveness(false);
                }

                setLoadingMoveset(true);
                try {
                    const movesetRes = await axios.get(`http://localhost:3001/battlemechanic/pokemonmoveset/${pokemon.pokemon_id}`);
                    const sortedMoves = (movesetRes.data || []).sort((a, b) => {
                        if (a.dmg_typ < b.dmg_typ) return -1;
                        if (a.dmg_typ > b.dmg_typ) return 1;
                        if (a.ger_name < b.ger_name) return -1;
                        if (a.ger_name > b.ger_name) return 1;
                        return 0;
                    });
                    setMoveset(sortedMoves);
                } catch (error) {
                    console.error(`Fehler beim Laden des Movesets für Pokémon ${pokemon.pokemon_id}:`, error);
                    setMoveset([]);
                } finally {
                    setLoadingMoveset(false);
                }
            };

            fetchBattleData();
        }
    }, [pokemon]);

    const getMiddleButtonText = () => {
        const isDefaultSort = sortConfig.key === 'pokemon_id' && sortConfig.direction === 'ascending';
        const hasActiveFilters = searchTerm !== '' || selectedTypes.length > 0;
        const hasActiveSorting = !isDefaultSort;

        if (hasActiveFilters && hasActiveSorting) {
            return "▲ Filter & Sortierung aktiv ▲";
        } else if (hasActiveFilters) {
            return "▲ Filterung aktiv ▲";
        } else if (hasActiveSorting) {
            return "▲ Sortierung aktiv ▲";
        }
        return "▲ Pokédex ▲";
    };

    const prevButtonText = prevPokemonInList
        ? `◀ #${String(prevPokemonInList.pokemon_id).padStart(3, '0')} ${prevPokemonInList.pokemon_ger_name}`
        : '◀ Anfang';
    const prevButtonTitle = prevPokemonInList
        ? `Vorheriges Pokémon: ${prevPokemonInList.pokemon_ger_name}`
        : 'Kein vorheriges Pokémon in der Liste';

    const nextButtonText = nextPokemonInList
        ? `#${String(nextPokemonInList.pokemon_id).padStart(3, '0')} ${nextPokemonInList.pokemon_ger_name} ▶`
        : 'Ende ▶';
    const nextButtonTitle = nextPokemonInList
        ? `Nächstes Pokémon: ${nextPokemonInList.pokemon_ger_name}`
        : 'Kein nächstes Pokémon in der Liste';


    const contentWrapperClass = pokemon ? 'content-wrap-split' : 'content-wrap-full';

    return (
        <div className={`pokedex-detail-page-container styled-box ${contentWrapperClass}`}>
            <div className="pokedex-navigation-controls">
                <button
                    onClick={() => navigateToPokemon(prevPokemonInList?.pokemon_id)}
                    className='pokedex-nav-button prev-pokemon-button'
                    disabled={!prevPokemonInList || isPageLoading}
                    title={prevButtonTitle}
                >
                    {prevButtonText}
                </button>

                <div className="nav-buttons-right-group">
                    <button
                        onClick={handleGoToPokedex}
                        className='pokedex-nav-button home home-button'
                        title="Zurück zur Pokédex Übersicht"
                        disabled={isPageLoading}
                    >
                        {getMiddleButtonText()}
                    </button>

                    <button
                        onClick={() => navigateToPokemon(nextPokemonInList?.pokemon_id)}
                        className='pokedex-nav-button next-pokemon-button'
                        disabled={!nextPokemonInList || isPageLoading}
                        title={nextButtonTitle}
                    >
                        {nextButtonText}
                    </button>
                </div>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', color: 'white', width: '100%', padding: '20px' }}>
                    <p>Lade Pokémon-Daten...</p>
                </div>
            )}

            {!loading && !pokemon && (
                 <div style={{ textAlign: 'center', color: 'white', width: '100%', padding: '20px' }}>
                    <p>Pokémon nicht gefunden.</p>
                </div>
            )}

            {!loading && pokemon && (
                <div className="pokedex-detail-content-area">
                    <div className="pokedex-detail-left-half" ref={pokedexEntryRef}>
                        <PokedexEntry
                            pokemon={pokemon}
                            allTypes={allTypesForEntry.length > 0 ? allTypesForEntry : (typesFromContext || [])}
                            loading={loading}
                            typeEffectiveness={typeEffectiveness}
                            loadingTypeEffectiveness={loadingTypeEffectiveness}
                        />
                    </div>

                    <div className="pokedex-detail-right-half" ref={battleDetailsRef}>
                        <PokedexEntryBattleDetails
                            pokemon={pokemon}
                            allTypes={allTypesForEntry.length > 0 ? allTypesForEntry : (typesFromContext || [])}
                            stats={stats}
                            loadingStats={loadingStats}
                            moveset={moveset}
                            loadingMoveset={loadingMoveset}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default PokedexDetailPage;