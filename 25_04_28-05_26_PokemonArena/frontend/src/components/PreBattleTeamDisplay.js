import React, { useEffect, useRef } from 'react';
import '../styles/PreBattleTeamDisplay.css';

const TYPE_ICON_FOLDER = 'TypeIcons';
const TYPE_ICON_EXTENSION = 'svg';

const formatApiNameToFileNameForIcon = (apiTypeName) => {
    if (!apiTypeName || typeof apiTypeName !== 'string') return '';
    return apiTypeName.charAt(0).toUpperCase() + apiTypeName.slice(1).toLowerCase();
};

const getTypeIconPath = (apiTypeName) => {
    if (!apiTypeName) return null;
    const fileName = formatApiNameToFileNameForIcon(apiTypeName);
    return `${process.env.PUBLIC_URL}/${TYPE_ICON_FOLDER}/${fileName}.${TYPE_ICON_EXTENSION}`;
};

const preBattleTypeColors = {
    Normal: '#A8A77A', Feuer: '#EE8130', Wasser: '#6390F0', Elektro: '#F7D02C',
    Pflanze: '#7AC74C', Eis: '#96D9D6', Kampf: '#C22E28', Gift: '#A33EA1',
    Boden: '#E2BF65', Flug: '#A98FF3', Psycho: '#F95587', Käfer: '#A6B91A',
    Gestein: '#B6A136', Geist: '#735797', Drache: '#6F35FC', Unlicht: '#705746',
    Stahl: '#B7B7CE', Fee: '#D685AD', defaultHex: '#4A4A4A'
};

const getRgbaWithOpacityPreBattle = (hexColor, alpha) => {
    if (!hexColor) hexColor = preBattleTypeColors.defaultHex;
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
        }
    }
    const finalAlpha = Math.min(1, Math.max(0, alpha));
    return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
};

function PokemonSlot({ pokemon, allTypes }) {
    if (!pokemon) return <div className="pre-battle-pokemon-slot empty-slot-display">Leer</div>;

    const getPokemonName = (p) => p?.pokemon_ger_name || p?.pokemon_api_name || "Pokémon";

    let primaryTypeForColor = 'defaultHex';
    if (pokemon.typen_ger && pokemon.typen_ger.length > 0) {
        const firstGermanType = pokemon.typen_ger[0];
        primaryTypeForColor = firstGermanType.charAt(0).toUpperCase() + firstGermanType.slice(1).toLowerCase();
    }

    const primaryTypeHexColor = preBattleTypeColors[primaryTypeForColor] || preBattleTypeColors.defaultHex;

    const baseAlpha = 0.6;
    const slotStyle = {
        '--pre-battle-slot-normal-bg': getRgbaWithOpacityPreBattle(primaryTypeHexColor, baseAlpha),
        '--pre-battle-slot-hover-bg': getRgbaWithOpacityPreBattle(primaryTypeHexColor, Math.min(1, baseAlpha + 0.15)),
        '--pre-battle-slot-solid-type-color': primaryTypeHexColor,
    };

    const spriteToDisplay = pokemon.pokedex_sprite_url
        ? pokemon.pokedex_sprite_url
        : `${process.env.PUBLIC_URL}/pokeball_placeholder.png`;

    return (
        <div className="pre-battle-pokemon-slot filled-slot-display" style={slotStyle}>
            <div className="pre-battle-slot-content-wrapper">
                <div className="pre-battle-slot-line-1">
                    <div className="pre-battle-sprite-wrapper">
                        <img
                            src={spriteToDisplay}
                            alt={getPokemonName(pokemon)}
                            className="pre-battle-pokemon-sprite-img"
                        />
                    </div>
                    <div className="pre-battle-pokemon-name-and-types">
                        <span className="pre-battle-pokemon-name-text">{getPokemonName(pokemon)}</span>
                        <div className="pre-battle-pokemon-types-icons">
                            {(pokemon.processed_typen_api || []).map((apiTypeName, index) => {
                                const iconPath = getTypeIconPath(apiTypeName);
                                return iconPath ? (
                                    <img key={index} src={iconPath} alt={apiTypeName} title={apiTypeName} className="pre-battle-type-icon-img" />
                                ) : null;
                            })}
                        </div>
                    </div>
                </div>
                <div className="pre-battle-slot-line-2">
                    <div className="pre-battle-pokemon-moves-list">
                        {(pokemon.moves_array || []).slice(0, 4).map((move, index) => {
                            if (!move) return <div key={`empty-move-${index}`} className="pre-battle-move-entry empty">&nbsp;</div>;
                            const attackTypeIconPath = getTypeIconPath(move.dmg_typ);
                            return (
                                <div key={index} className="pre-battle-move-entry" title={`${move.ger_name}: ${move.flavor_text || ''}`}>
                                    {attackTypeIconPath && (
                                        <img src={attackTypeIconPath} alt={move.dmg_typ} className="pre-battle-move-type-icon-img" />
                                    )}
                                    <span className="pre-battle-move-name-text">
                                        {move.ger_name || "Unbekannt"}
                                    </span>
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 4 - (pokemon.moves_array?.length || 0)) }).map((_, i) => (
                            <div key={`placeholder-move-${i}`} className="pre-battle-move-entry empty">&nbsp;</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreBattleTeamDisplay({ userTeam, botTeam, onStartBattle, onRemixBotTeam, allTypes }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    return (
        <div
            className="pre-battle-overview-container"
            ref={containerRef}
            tabIndex={-1}
        >
            <div className="pre-battle-teams-display-area">
                <div className="pre-battle-team-column user-team-column">
                    <div className="pre-battle-team-header">
                        <button
                            onClick={onStartBattle}
                            className='prebattle-header-button prebattle-start-button'
                        >
                            Kampf
                        </button>
                        <h2>Dein Team</h2>
                        <div className="prebattle-header-button prebattle-header-spacer">
                            Kampf
                        </div>
                    </div>
                    <div className="pre-battle-slots-scroll-container">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <PokemonSlot key={`user-pkmn-${index}`} pokemon={userTeam[index]} allTypes={allTypes} />
                        ))}
                    </div>
                </div>
                <div className="pre-battle-vs-text">VS</div>
                <div className="pre-battle-team-column bot-team-column">
                    <div className="pre-battle-team-header">
                        <button
                            onClick={onRemixBotTeam}
                            className='prebattle-header-button prebattle-remix-button'
                        >
                            Würfeln
                        </button>
                        <h2>Gegnerisches Team</h2>
                        <div className="prebattle-header-button prebattle-header-spacer">
                           Würfeln
                        </div>
                    </div>
                    <div className="pre-battle-slots-scroll-container">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <PokemonSlot key={`bot-pkmn-${index}`} pokemon={botTeam[index]} allTypes={allTypes} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PreBattleTeamDisplay;