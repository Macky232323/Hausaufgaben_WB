import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';
import PokemonCard from '../components/PokemonCard';
import PokedexListe from '../components/pokedex_liste';
import FilterControls from '../components/FilterControls';
import { usePokedexState } from '../context/PokedexStateContext';
import '../styles/pokedex.css';
import '../styles/pokedex_liste.css';

const typeColorsSolid = {
    Normal: '#A8A77A', Feuer: '#EE8130', Wasser: '#6390F0', Elektro: '#F7D02C',
    Pflanze: '#7AC74C', Eis: '#96D9D6', Kampf: '#C22E28', Gift: '#A33EA1',
    Boden: '#E2BF65', Flug: '#A98FF3', Psycho: '#F95587', Käfer: '#A6B91A',
    Gestein: '#B6A136', Geist: '#735797', Drache: '#6F35FC', Unlicht: '#705746',
    Stahl: '#B7B7CE', Fee: '#D685AD', default: '#777777',
};

const getRgbaWithOpacity = (hexColor, alpha = 0.6) => {
    if (!hexColor || typeof hexColor !== 'string') hexColor = typeColorsSolid.default;
    const bigint = parseInt(hexColor.startsWith('#') ? hexColor.slice(1) : hexColor, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const finalAlpha = Math.min(1, Math.max(0, alpha));
    return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
};

const baseHeadersConfig = [
    { key: 'pokemon_front_sprites', label: 'Bild', sortable: false, className: 'pokemon-line-image-container' },
    { key: 'pokemon_id', label: 'ID', sortable: true, className: 'pokemon-line-id' },
    { key: 'pokemon_ger_name', label: 'Name', sortable: true, className: 'pokemon-line-name' },
    { key: 'typen', label: 'Typ', sortable: true, className: 'pokemon-line-types' },
    { key: 'pokemon_bst', label: 'BST', sortable: true, className: 'pokemon-line-bst' },
    { key: 'pokemon_height', label: 'Größe', sortable: true, className: 'pokemon-line-height' },
    { key: 'pokemon_weight', label: 'Gewicht', sortable: true, className: 'pokemon-line-weight' }
];

function Pokedex() {
    const [pokemonList, setPokemonList] = useState([]);
    const [allTypesLocal, setAllTypesLocal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorIdForViewSwitch, setAnchorIdForViewSwitch] = useState(null);

    const {
        viewType, setViewType,
        searchTerm, setSearchTerm,
        selectedTypes, setSelectedTypes,
        sortConfig, setSortConfig,
        lastViewedId, setLastViewedId,
        scrollNeeded, setScrollNeeded,
        setContextualPokemonList,
        setAllTypes: setAllTypesContext,
        setFullPokemonListFromApi 
    } = usePokedexState();

    const listContainerRef = useRef(null);
    const gridContainerRef = useRef(null);

    const headersForRender = useMemo(() => {
        if (viewType === 'list') {
            return baseHeadersConfig.map(header => {
                if (header.key === 'pokemon_front_sprites') {
                    return { ...header, label: '' };
                }
                return header;
            });
        } else {
            return baseHeadersConfig.filter(header => header.key !== 'pokemon_front_sprites');
        }
    }, [viewType]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [pokemonRes, typesRes] = await Promise.all([
                    axios.get("http://localhost:3001/allPokemon"),
                    axios.get("http://localhost:3001/types")
                ]);

                const fetchedPokemonList = pokemonRes.data || [];
                setPokemonList(fetchedPokemonList);
                setFullPokemonListFromApi(fetchedPokemonList); 

                const currentAllTypes = typesRes.data || [];
                setAllTypesLocal(currentAllTypes);
                setAllTypesContext(currentAllTypes);

            } catch (error) {
                console.error("Fehler beim Laden der Pokémon-Daten:", error);
                setPokemonList([]);
                setFullPokemonListFromApi([]);
                setAllTypesLocal([]);
                setAllTypesContext([]);
            }
            setLoading(false);
        }
        fetchData();
    }, [setAllTypesContext, setFullPokemonListFromApi]);


    const filteredPokemon = useMemo(() => {
        let list = pokemonList;
        if (searchTerm) {
            list = list.filter(pokemon =>
                pokemon.pokemon_ger_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(pokemon.pokemon_id).includes(searchTerm)
            );
        }
        if (selectedTypes.length > 0) {
            list = list.filter(pokemon => {
                const pokemonTypes = pokemon.typen ? pokemon.typen.split(',').map(t => t.trim()) : [];
                return selectedTypes.some(st => pokemonTypes.includes(st));
            });
        }
        return list;
    }, [pokemonList, searchTerm, selectedTypes]);

     const sortedAndFilteredPokemon = useMemo(() => {
        if (!filteredPokemon) return [];
        let sortableItems = [...filteredPokemon];
        if (sortConfig.key !== null) {
          sortableItems.sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            if (valA === null || valA === undefined) valA = sortConfig.direction === 'ascending' ? Infinity : -Infinity;
            if (valB === null || valB === undefined) valB = sortConfig.direction === 'ascending' ? Infinity : -Infinity;

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            
            if (['pokemon_id', 'pokemon_height', 'pokemon_weight', 'pokemon_bst'].includes(sortConfig.key)) {
                valA = parseFloat(valA);
                valB = parseFloat(valB);
            }
             if (sortConfig.key === 'typen') {
                 valA = a.typen ? a.typen.split(',')[0].trim().toLowerCase() : '';
                 valB = b.typen ? b.typen.split(',')[0].trim().toLowerCase() : '';
             }

            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
          });
        }
        return sortableItems;
      }, [filteredPokemon, sortConfig]);

    useEffect(() => {
        setContextualPokemonList(sortedAndFilteredPokemon);
    }, [sortedAndFilteredPokemon, setContextualPokemonList]);

    const findTopVisiblePokemonId = useCallback((container) => {
        if (!container) return null;
        const containerTop = container.scrollTop;
        const pokemonElements = container.querySelectorAll('[data-pokemon-id]');

        for (const element of pokemonElements) {
             if (element.offsetTop >= containerTop) {
                return element.getAttribute('data-pokemon-id');
             }
        }
         return pokemonElements.length > 0 ? pokemonElements[0].getAttribute('data-pokemon-id') : null;
    }, []);


    const handleViewChange = useCallback((newViewType) => {
        if (newViewType === viewType) return;

        const currentContainer = viewType === 'list' ? listContainerRef.current : gridContainerRef.current;
        const topId = findTopVisiblePokemonId(currentContainer);

        setAnchorIdForViewSwitch(topId ? parseInt(topId, 10) : null);
        setViewType(newViewType);
        setScrollNeeded(false);

    }, [viewType, setViewType, findTopVisiblePokemonId, setScrollNeeded]);


    useEffect(() => {
        if (scrollNeeded && lastViewedId && !loading && sortedAndFilteredPokemon.length > 0) {
            const container = viewType === 'list' ? listContainerRef.current : gridContainerRef.current;
            if (!container || anchorIdForViewSwitch) return;

            const targetElement = container.querySelector(`[data-pokemon-id="${lastViewedId}"]`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                 const availableIds = sortedAndFilteredPokemon.map(p => p.pokemon_id);
                 const nextAvailableId = availableIds.find(id => id > lastViewedId);
                 const elementToScrollTo = nextAvailableId
                    ? container.querySelector(`[data-pokemon-id="${nextAvailableId}"]`)
                    : container.querySelector(`[data-pokemon-id]`);
                 if (elementToScrollTo) {
                     elementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                 }
            }
            setScrollNeeded(false);
        }
     }, [scrollNeeded, lastViewedId, loading, sortedAndFilteredPokemon, viewType, setScrollNeeded, anchorIdForViewSwitch]);


     useEffect(() => {
        if (anchorIdForViewSwitch && !loading && sortedAndFilteredPokemon.length > 0) {
            const newContainer = viewType === 'list' ? listContainerRef.current : gridContainerRef.current;
            if (!newContainer) return;

            const targetElement = newContainer.querySelector(`[data-pokemon-id="${anchorIdForViewSwitch}"]`);

            if (targetElement) {
                 setTimeout(() => {
                    targetElement.scrollIntoView({ block: 'start', behavior: 'instant' });
                    setAnchorIdForViewSwitch(null);
                 }, 0);
            } else {
                 newContainer.scrollTo({ top: 0, behavior: 'instant'});
                 setAnchorIdForViewSwitch(null);
            }
        }
     }, [viewType, anchorIdForViewSwitch, loading, sortedAndFilteredPokemon]);

    const getRowStylingInfo = useCallback((typenString) => {
        const firstType = typenString ? typenString.split(',')[0].trim() : 'default';
        const solidColor = typeColorsSolid[firstType] || typeColorsSolid.default;
        const baseAlpha = 0.6;
        return {
            backgroundColorRgba: getRgbaWithOpacity(solidColor, baseAlpha),
            solidColor: solidColor,
            hoverBackgroundColorRgba: getRgbaWithOpacity(solidColor, baseAlpha + 0.2)
        };
    }, []);


    const handleSort = (key) => {
        if (!key) return;
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
        setScrollNeeded(false);
        setAnchorIdForViewSwitch(null);
    };

     const handleFilterChange = () => {
         setScrollNeeded(false);
         setAnchorIdForViewSwitch(null);
     }

     const handlePokemonSelect = (id) => {
         setLastViewedId(id);
         setScrollNeeded(false);
         setAnchorIdForViewSwitch(null);
     }

    const renderSortArrow = (columnKey) => {
        if (sortConfig.key === columnKey) {
          return sortConfig.direction === 'ascending' ? ' \u25B2' : ' \u25BC';
        }
        return '';
    };

    return (
        <div className="pokedex-page-container">
            <div className="pokedex-content-wrapper styled-box">
                <FilterControls
                    viewType={viewType}
                    setViewType={handleViewChange}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                    allTypes={allTypesLocal}
                    onFilterChange={handleFilterChange}
                />

                <div className={`pokedex-list-header-div pokedex-list-header-${viewType}`}>
                    {headersForRender.map(header => (
                        <div
                            key={header.key}
                            className={`header-item ${viewType === 'grid' && header.key === 'pokemon_front_sprites' ? 'grid-mode-sprite-header-hidden' : ''} ${viewType === 'grid' ? 'grid-mode-item' : header.className || ''} ${header.sortable ? 'sortable' : ''}`}
                            onClick={() => header.sortable && handleSort(header.key)}
                            style={ header.label === '' && !header.sortable ? { cursor: 'default' } : {} }
                        >
                            {header.label}
                            {header.sortable && <span className="sort-arrow">{renderSortArrow(header.key)}</span>}
                        </div>
                    ))}
                </div>

                <div className={`pokedex-content-area ${viewType === 'list' ? 'list-view-active' : 'grid-view-active'}`}>
                    {loading ? (
                        <p style={{ color: 'white', textAlign: 'center' }}>Lade Pokémon Daten...</p>
                    ) : viewType === 'grid' ? (
                        <div className="pokemon-card-grid" ref={gridContainerRef}>
                            {sortedAndFilteredPokemon.map((pokemon) => (
                                <div key={pokemon.pokemon_id} data-pokemon-id={pokemon.pokemon_id}>
                                    <PokemonCard
                                        pokemon={pokemon}
                                        allTypes={allTypesLocal}
                                        onClick={() => handlePokemonSelect(pokemon.pokemon_id)}
                                     />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <PokedexListe
                            pokemonList={sortedAndFilteredPokemon}
                            getRowStylingInfo={getRowStylingInfo}
                            typeColorsSolid={typeColorsSolid}
                            allTypes={allTypesLocal}
                            containerRef={listContainerRef}
                            onPokemonSelect={handlePokemonSelect}
                        />
                    )}
                    {!loading && sortedAndFilteredPokemon.length === 0 && (
                        <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
                            Keine Pokémon entsprechen deiner Suche oder Filterauswahl.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Pokedex;