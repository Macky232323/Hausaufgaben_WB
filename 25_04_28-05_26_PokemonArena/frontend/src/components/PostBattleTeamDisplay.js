import React, { useEffect, useRef } from 'react';
import '../styles/PostBattleTeamDisplay.css';


const TYPE_ICON_FOLDER = 'TypeIcons';
const TYPE_ICON_EXTENSION = 'svg';

const formatApiNameToFileNameForIconPostBattle = (apiTypeName) => {
    if (!apiTypeName || typeof apiTypeName !== 'string') return '';
    return apiTypeName.charAt(0).toUpperCase() + apiTypeName.slice(1).toLowerCase();
};

const getTypeIconPathPostBattle = (apiTypeName) => {
    if (!apiTypeName) return null;
    const fileName = formatApiNameToFileNameForIconPostBattle(apiTypeName);
    return `${process.env.PUBLIC_URL}/${TYPE_ICON_FOLDER}/${fileName}.${TYPE_ICON_EXTENSION}`;
};

const postBattleTypeColors = {
    Normal: '#A8A77A', Feuer: '#EE8130', Wasser: '#6390F0', Elektro: '#F7D02C',
    Pflanze: '#7AC74C', Eis: '#96D9D6', Kampf: '#C22E28', Gift: '#A33EA1',
    Boden: '#E2BF65', Flug: '#A98FF3', Psycho: '#F95587', Käfer: '#A6B91A',
    Gestein: '#B6A136', Geist: '#735797', Drache: '#6F35FC', Unlicht: '#705746',
    Stahl: '#B7B7CE', Fee: '#D685AD', defaultHex: '#5A5A5A'
};

const getRgbaWithOpacityPostBattle = (hexColor, alpha) => {
    if (!hexColor) hexColor = postBattleTypeColors.defaultHex;
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

function PokemonSlotPostBattle({ pokemon }) {
    if (!pokemon) return <div className="post-battle-pokemon-slot empty-slot-display">Leer</div>;

    const getPokemonName = (p) => p?.pokemon_ger_name || p?.pokemon_api_name || "Pokémon";
    const isFainted = pokemon.hp <= 0;

    let primaryTypeForColor = 'defaultHex';
    if (pokemon.typen_ger && pokemon.typen_ger.length > 0) {
        const firstGermanType = pokemon.typen_ger[0];
        primaryTypeForColor = firstGermanType.charAt(0).toUpperCase() + firstGermanType.slice(1).toLowerCase();
    }

    const primaryTypeHexColor = postBattleTypeColors[primaryTypeForColor] || postBattleTypeColors.defaultHex;

    const baseAlpha = 0.6;
    const slotStyle = {
        '--post-battle-slot-normal-bg': getRgbaWithOpacityPostBattle(primaryTypeHexColor, baseAlpha),
        '--post-battle-slot-hover-bg': getRgbaWithOpacityPostBattle(primaryTypeHexColor, Math.min(1, baseAlpha + 0.15)),
        '--post-battle-slot-solid-type-color': primaryTypeHexColor,
    };

    const spriteToDisplay = pokemon.pokedex_sprite_url
        ? pokemon.pokedex_sprite_url
        : `${process.env.PUBLIC_URL}/pokeball_placeholder.png`;

    return (
        <div className={`post-battle-pokemon-slot filled-slot-display ${isFainted ? 'fainted-display' : ''}`} style={slotStyle}>
            <div className="post-battle-slot-content-wrapper">
                <div className="post-battle-slot-line-1">
                    <div className="post-battle-sprite-wrapper">
                        <img
                            src={spriteToDisplay}
                            alt={getPokemonName(pokemon)}
                            className="post-battle-pokemon-sprite-img"
                        />
                    </div>
                    <div className="post-battle-pokemon-name-and-types">
                        <span className="post-battle-pokemon-name-text">{getPokemonName(pokemon)}</span>
                        <div className="post-battle-pokemon-types-icons">
                            {(pokemon.processed_typen_api || []).map((apiTypeName, index) => {
                                const iconPath = getTypeIconPathPostBattle(apiTypeName);
                                return iconPath ? (
                                    <img key={index} src={iconPath} alt={apiTypeName} title={apiTypeName} className="post-battle-type-icon-img" />
                                ) : null;
                            })}
                        </div>
                    </div>
                </div>
                <div className="post-battle-slot-line-2">
                    <div className="post-battle-pokemon-moves-list">
                        {(pokemon.moves_array || []).slice(0, 4).map((move, index) => {
                            if (!move) return <div key={`empty-move-${index}`} className="post-battle-move-entry empty">&nbsp;</div>;
                            const attackTypeIconPath = getTypeIconPathPostBattle(move.dmg_typ);
                            return (
                                <div key={index} className="post-battle-move-entry" title={`${move.ger_name}: ${move.flavor_text || ''}`}>
                                    {attackTypeIconPath && (
                                        <img src={attackTypeIconPath} alt={move.dmg_typ} className="post-battle-move-type-icon-img" />
                                    )}
                                    <span className="post-battle-move-name-text">
                                        {move.ger_name || "Unbekannt"}
                                    </span>
                                </div>
                            );
                        })}
                        {Array.from({ length: Math.max(0, 4 - (pokemon.moves_array?.length || 0)) }).map((_, i) => (
                            <div key={`placeholder-move-${i}`} className="post-battle-move-entry empty">&nbsp;</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function PostBattleTeamDisplay({
    userTeam,
    botTeam,
    battleResultText
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    const userWon = battleResultText && battleResultText.toLowerCase().includes("du hast gewonnen");
    const botWon = battleResultText && battleResultText.toLowerCase().includes("bot hat gewonnen");

    return (
        <div
            className="post-battle-overview-container"
            ref={containerRef}
            tabIndex={-1}
        >
            {battleResultText && <h1 style={{ color: userWon ? '#90EE90' : (botWon ? '#FF7F7F' : '#FFFFFF') , textShadow: '1px 1px 3px black', textAlign: 'center', marginBottom: '15px' }}>{battleResultText}</h1>}
            <div className="post-battle-teams-display-area">
                <div className={`post-battle-team-column user-team-column post-battle ${botWon ? '' : 'winner-frame'}`}>
                    <div className="post-battle-team-header">
                        <h2>Dein Team</h2>
                    </div>
                    <div className="post-battle-slots-scroll-container">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <PokemonSlotPostBattle key={`user-pkmn-${index}`} pokemon={userTeam[index]} />
                        ))}
                    </div>
                </div>
                <div className="post-battle-vs-text">END</div>
                <div className={`post-battle-team-column bot-team-column post-battle ${userWon ? '' : 'winner-frame'}`}>
                    <div className="post-battle-team-header">
                        <h2>Gegnerisches Team</h2>
                    </div>
                    <div className="post-battle-slots-scroll-container">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <PokemonSlotPostBattle key={`bot-pkmn-${index}`} pokemon={botTeam[index]} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostBattleTeamDisplay;