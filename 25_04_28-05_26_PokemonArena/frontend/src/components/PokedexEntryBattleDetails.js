import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Select, { components } from 'react-select';
import { usePokedexState } from '../context/PokedexStateContext';
import '../styles/pokedexEntryBattleDetails.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TYPE_ICON_FOLDER = 'TypeIcons';
const TYPE_ICON_EXTENSION = 'svg';

const formatApiNameToFileNameBattle = (apiTypeName) => {
    if (!apiTypeName) return '';
    return apiTypeName.charAt(0).toUpperCase() + apiTypeName.slice(1).toLowerCase();
};

const getTypeIconPath = (apiTypeName) => {
    if (!apiTypeName) return null;
    const fileName = formatApiNameToFileNameBattle(apiTypeName);
    return `${process.env.PUBLIC_URL}/${TYPE_ICON_FOLDER}/${fileName}.${TYPE_ICON_EXTENSION}`;
};

const typeColors = {
    Normal: '#A8A77A', Feuer: '#EE8130', Wasser: '#6390F0', Elektro: '#F7D02C',
    Pflanze: '#7AC74C', Eis: '#96D9D6', Kampf: '#C22E28', Gift: '#A33EA1',
    Boden: '#E2BF65', Flug: '#A98FF3', Psycho: '#F95587', Käfer: '#A6B91A',
    Gestein: '#B6A136', Geist: '#735797', Drache: '#6F35FC', Unlicht: '#705746',
    Stahl: '#B7B7CE', Fee: '#D685AD', defaultHex: '#4A4A4A'
};

const getRgbaWithOpacity = (hexColor, alpha = 0.5) => {
    if (!hexColor) hexColor = typeColors.defaultHex;

    const bigint = parseInt(hexColor.startsWith('#') ? hexColor.slice(1) : hexColor, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const CustomControl = ({ children, ...props }) => {
    const selectedOption = props.getValue()?.[0];
    let title = '';
    if (selectedOption && selectedOption.moveData) {
        const moveName = selectedOption.moveData.ger_name || selectedOption.label;
        const flavorText = selectedOption.moveData.flavor_text || 'Keine Beschreibung verfügbar.';
        title = `${moveName}: ${flavorText}`;
    }

    return (
        <components.Control {...props} innerProps={{ ...props.innerProps, title: title }}>
            {children}
        </components.Control>
    );
};


function PokedexEntryBattleDetails({ pokemon, allTypes, stats, loadingStats, moveset, loadingMoveset }) {
    const { team, addPokemonToTeam, updatePokemonInTeam } = usePokedexState();

    const [selectedMovesInternal, setSelectedMovesInternal] = useState(Array(4).fill(null));
    const [initialMovesLoaded, setInitialMovesLoaded] = useState(false);
    const [hasMovesChanged, setHasMovesChanged] = useState(false);

    const pokemonInTeam = useMemo(() => team.find(p => p.id === pokemon?.pokemon_id), [team, pokemon]);

    const apiToGermanTypeMap = useMemo(() => {
        const map = {};
        if (allTypes && Array.isArray(allTypes)) {
            allTypes.forEach(t => {
                map[t.api_name.toLowerCase()] = t.ger_name;
            });
        }
        return map;
    }, [allTypes]);

    const primaryPokemonTypeColor = useMemo(() => {
        if (!pokemon || !pokemon.typen) {
            return typeColors.defaultHex;
        }
        const typesFromPokemon = pokemon.typen.split(',').map(t => t.trim());
        const primaryTypeGerman = typesFromPokemon[0] || 'defaultHex';
        return typeColors[primaryTypeGerman] || typeColors.defaultHex;
    }, [pokemon]);

    const themeStyle = useMemo(() => {
        return { '--pokemon-theme-color': getRgbaWithOpacity(primaryPokemonTypeColor, 0.5) };
    }, [primaryPokemonTypeColor]);


    useEffect(() => {
        if (pokemonInTeam && moveset.length > 0 && !initialMovesLoaded) {
            const teamMemberMoves = pokemonInTeam.selectedMoves.map(move => move ? { value: String(move.id), label: move.ger_name, moveData: move } : null);
            setSelectedMovesInternal(teamMemberMoves.slice(0, 4).concat(Array(4 - teamMemberMoves.length).fill(null)));
            setInitialMovesLoaded(true);
            setHasMovesChanged(false);
        } else if (!pokemonInTeam && pokemon) {
            setSelectedMovesInternal(Array(4).fill(null));
            setInitialMovesLoaded(false);
            setHasMovesChanged(false);
        }
    }, [pokemonInTeam, moveset, initialMovesLoaded, pokemon]);

    const handleMoveChange = useCallback((index, selectedOption) => {
        setSelectedMovesInternal(prevSelectedMoves => {
            const newSelectedMoves = [...prevSelectedMoves];
            newSelectedMoves[index] = selectedOption;
            return newSelectedMoves;
        });
        setHasMovesChanged(true);
    }, []);

    const minRequiredMoves = 1;

    const handleSaveOrAdd = () => {
        if (!pokemon) return;
        const chosenMoveObjects = selectedMovesInternal
            .map(selectedOption => selectedOption ? selectedOption.moveData : null)
            .filter(move => move !== null);

        if (chosenMoveObjects.length < minRequiredMoves) {
            alert(`Bitte wähle mindestens ${minRequiredMoves} Attacke${minRequiredMoves > 1 ? 'n' : ''} für das Pokémon aus.`);
            return;
        }

        const finalSelectedMoveObjectsForTeam = Array(4).fill(null);
        let currentTeamMoveIndex = 0;
        for (let i = 0; i < selectedMovesInternal.length; i++) {
            const selectedOption = selectedMovesInternal[i];
            if (selectedOption && selectedOption.moveData) {
                finalSelectedMoveObjectsForTeam[currentTeamMoveIndex++] = selectedOption.moveData;
            }
        }

        const pokemonDataForTeam = {
            id: pokemon.pokemon_id,
            api_name: pokemon.pokemon_api_name,
            ger_name: pokemon.pokemon_ger_name,
            front_sprite: pokemon.pokemon_front_sprites,
            types: pokemon.typen ? pokemon.typen.split(',').map(t => t.trim()) : [],
        };

        if (pokemonInTeam) {
            updatePokemonInTeam(pokemon.pokemon_id, finalSelectedMoveObjectsForTeam);
        } else {
            addPokemonToTeam(pokemonDataForTeam, finalSelectedMoveObjectsForTeam);
        }
        setHasMovesChanged(false);
    };

    const statDataForChart = useMemo(() => {
        if (!stats) return [];
        const statOrder = [
            { key: 'hp', name: 'KP' }, { key: 'attack', name: 'Angriff' },
            { key: 'defense', name: 'Vert.' }, { key: 'special_attack', name: 'Sp.-Ang.' },
            { key: 'special_defense', name: 'Sp.-Vert.' }, { key: 'speed', name: 'Init.' }
        ];
        return statOrder.map(s => ({ name: s.name, value: stats[s.key] || 0 }));
    }, [stats]);

    const calculatedBst = useMemo(() => {
        if (!stats) return null;
        return (stats.hp || 0) + (stats.attack || 0) + (stats.defense || 0) +
            (stats.special_attack || 0) + (stats.special_defense || 0) + (stats.speed || 0);
    }, [stats]);

    const moveOptions = useMemo(() => {
        if (!moveset) return [];
        return moveset.map(move => ({
            value: String(move.id),
            label: move.ger_name,
            moveData: move
        }));
    }, [moveset]);

    const formatOptionLabel = ({ label, moveData }, formatOptionLabelContext) => {
        const iconPath = getTypeIconPath(moveData.dmg_typ);
        const moveDetail = moveData.pp !== null && moveData.pp !== undefined ? `(AP: ${moveData.pp})` : '(AP: -)';
        const germanMoveType = apiToGermanTypeMap[moveData.dmg_typ?.toLowerCase()] || formatApiNameToFileNameBattle(moveData.dmg_typ);
        const showDetails = formatOptionLabelContext.context === 'menu';

        return (
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', height: '22px' }} title={showDetails ? (moveData.flavor_text || 'Keine Beschreibung') : ''}>
                {iconPath && <img src={iconPath} alt={germanMoveType} style={{ width: '14px', height: '14px', marginRight: '6px', flexShrink: 0 }} />}
                {!iconPath && <span style={{ marginRight: '6px', minWidth: '14px', display: 'inline-block', textAlign: 'center', flexShrink: 0 }}>{germanMoveType.substring(0,3)}</span>}
                <span style={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                {showDetails && (
                    <span style={{ marginLeft: '6px', color: '#bbb', fontSize: '0.7rem', flexShrink: 0 }}>{moveDetail}</span>
                )}
            </div>
        );
    };

    const isOptionDisabled = useCallback((option, currentIndex) => {
        return selectedMovesInternal.some((selectedOpt, i) =>
            i !== currentIndex && selectedOpt && selectedOpt.value === option.value
        );
    }, [selectedMovesInternal]);

    const customSelectStyles = useMemo(() => ({
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'rgba(30, 30, 30, 0.7)',
            borderColor: state.hasValue ? 'white' : (state.isFocused ? primaryPokemonTypeColor : '#555'),
            boxShadow: state.isFocused && !state.hasValue ? `0 0 0 1px ${primaryPokemonTypeColor}` : (state.hasValue && state.isFocused ? '0 0 0 1px white' : null),
            borderRadius: '4px',
            minHeight: '36px',
            height: '36px',
            fontSize: '0.78rem',
            color: state.hasValue ? 'white' : '#aaa',
            '&:hover': {
                borderColor: state.hasValue ? 'white' : primaryPokemonTypeColor,
            }
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '36px',
            padding: '0 6px'
        }),
        input: (provided) => ({
            ...provided,
            color: 'white',
            margin: '0px',
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        clearIndicator: (provided) => ({
            ...provided,
            padding: '6px 2px 6px 4px',
            color: '#ccc',
            cursor: 'pointer',
            '&:hover': {
                color: 'white',
            },
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            padding: '6px 6px 6px 2px',
            color: '#ccc',
            '&:hover': {
                color: 'white',
            }
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(40, 40, 40, 0.85)',
            backdropFilter: 'blur(3px)',
            border: `1px solid ${primaryPokemonTypeColor}`,
            borderRadius: '4px',
            minWidth: 'calc(100% + 40px)',
            width: 'auto',
        }),
        menuList: (provided) => ({
            ...provided,
            paddingTop: 0,
            paddingBottom: 0,
            maxHeight: '390px',
            '::-webkit-scrollbar': {
                width: '8px',
            },
            '::-webkit-scrollbar-track': {
                background: '#2c2c2c',
                borderRadius: '4px',
            },
            '::-webkit-scrollbar-thumb': {
                background: '#666',
                borderRadius: '4px',
            },
            '::-webkit-scrollbar-thumb:hover': {
                background: '#888',
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#666 #2c2c2c',
        }),
        menuPortal: base => ({
            ...base,
            zIndex: 9999
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? getRgbaWithOpacity(primaryPokemonTypeColor, 0.6) : state.isFocused ? getRgbaWithOpacity(primaryPokemonTypeColor, 0.8) : 'transparent',
            color: state.isDisabled ? '#777' : 'white',
            padding: '6px 10px',
            fontSize: '0.75rem',
            textShadow: '1px 1px 1px rgba(0,0,0,0.3)',
            cursor: state.isDisabled ? 'not-allowed' : 'default',
            fontStyle: state.isDisabled ? 'italic' : 'normal',
            '&:active': {
                backgroundColor: state.isDisabled ? undefined : getRgbaWithOpacity(primaryPokemonTypeColor, 0.7),
            },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: state.hasValue ? 'white' : '#aaa',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#aaa',
        }),
    }), [primaryPokemonTypeColor]);

    const isTeamFull = team.length >= 6 && !pokemonInTeam;
    const actualSelectedMovesCount = selectedMovesInternal.filter(opt => opt && opt.value !== '').length;
    const minMovesRequirementMet = actualSelectedMovesCount >= minRequiredMoves;

    let buttonDisabled = false;
    let buttonText = "";
    let buttonTitleText = "";

    if (pokemonInTeam) {
        if (!minMovesRequirementMet) {
            buttonDisabled = true;
            buttonText = `mind. ${minRequiredMoves} Attacke${minRequiredMoves > 1 ? 'n' : ''} nötig`;
            buttonTitleText = `Bitte wähle mindestens ${minRequiredMoves} Attacke${minRequiredMoves > 1 ? 'n' : ''} aus.`;
        } else if (hasMovesChanged) {
            buttonText = "Änderungen speichern";
            buttonTitleText = "Attackenänderungen speichern";
        } else {
            buttonDisabled = true;
            buttonText = "Attacken-Auswahl ist aktuell";
            buttonTitleText = "Keine Änderungen an den Attacken vorgenommen.";
        }
    } else {
        if (isTeamFull) {
            buttonDisabled = true;
            buttonText = "Team ist voll";
            buttonTitleText = "Dein Team ist bereits voll (Max. 6 Pokémon).";
        } else if (!minMovesRequirementMet) {
            buttonDisabled = true;
            buttonText = `mind. ${minRequiredMoves} Attacke${minRequiredMoves > 1 ? 'n' : ''} nötig`;
            buttonTitleText = `Bitte wähle mindestens ${minRequiredMoves} Attacke${minRequiredMoves > 1 ? 'n' : ''} aus.`;
        } else {
            buttonText = "Hinzufügen";
            buttonTitleText = "Zum Team hinzufügen";
        }
    }

    if (!pokemon) {
        return (
            <div className="pokedex-design-container battle-details-layout battle-details-loading" style={themeStyle}>
                <p>Pokémon-Details laden...</p>
            </div>
        );
    }

    return (
        <div className="pokedex-design-container battle-details-layout" style={themeStyle}>
            <div className="detail-box-battle-style section-stats-battle">
                <h3>Basiswerte {calculatedBst !== null && `(BST: ${calculatedBst})`}</h3>
                {loadingStats && <p className="loading-text-small">Lade Basiswerte...</p>}
                {!loadingStats && stats && (
                    <ResponsiveContainer width="100%" height={170}>
                        <BarChart data={statDataForChart} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.15)" />
                            <XAxis type="number" domain={[0, 200]} tickCount={6} ticks={[0, 40, 80, 120, 160, 200]} tick={{ fill: 'white', fontSize: 9 }} stroke="rgba(255,255,255,0.4)" />
                            <YAxis type="category" dataKey="name" tick={{ fill: 'white', fontSize: 10 }} width={50} stroke="rgba(255,255,255,0.4)" />
                            <Tooltip
                                cursor={{ fill: 'rgba(255, 255, 255, 0.5)' }}
                                contentStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    border: '1px solid #555',
                                    borderRadius: '5px',
                                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                                }}
                                labelStyle={{ color: '#eee', fontWeight: 'bold', fontSize: '12px' }}
                                itemStyle={{ color: '#ddd', fontSize: '11px' }}
                            />
                            <Bar dataKey="value" barSize={12} background={{ fill: 'rgba(255,255,255,0.05)' }} fill="#FFFFFF" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
                {!loadingStats && !stats && <p className="error-text-small">Basiswerte nicht verfügbar.</p>}
            </div>

            <div className="detail-box-battle-style section-moves-battle">
                <h3>Attacken auswählen</h3>
                {loadingMoveset && <p className="loading-text-small">Lade Attacken...</p>}
                {!loadingMoveset && moveset.length > 0 && (
                    <div className="moves-selection-container-battle">
                        {selectedMovesInternal.map((selectedOption, index) => {
                            return (
                                <div key={index} className="move-slot-battle">
                                    <Select
                                        id={`move-select-battle-${index}`}
                                        value={selectedOption}
                                        onChange={(option) => handleMoveChange(index, option)}
                                        options={moveOptions}
                                        formatOptionLabel={formatOptionLabel}
                                        styles={customSelectStyles}
                                        components={{ Control: CustomControl }}
                                        placeholder={`-- Attacke ${index + 1} --`}
                                        isClearable={true}
                                        getOptionValue={(option) => option.value}
                                        getOptionLabel={(option) => option.label}
                                        menuPlacement="top"
                                        menuPortalTarget={document.body}
                                        isOptionDisabled={(option) => isOptionDisabled(option, index)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
                {!loadingMoveset && moveset.length === 0 && <p className="error-text-small">Keine Attacken für dieses Pokémon verfügbar.</p>}
            </div>
            <div className="section-add-to-team-battle">
                <button
                    onClick={handleSaveOrAdd}
                    disabled={buttonDisabled}
                    className="add-to-team-button-battle"
                    title={buttonTitleText}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}

export default PokedexEntryBattleDetails;