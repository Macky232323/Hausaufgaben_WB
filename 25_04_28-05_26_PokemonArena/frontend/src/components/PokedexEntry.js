import React, { useMemo } from 'react';
import '../styles/pokedexEntry.css';

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

function PokedexEntry({ pokemon, allTypes, loading, typeEffectiveness, loadingTypeEffectiveness }) {

    const germanNameToApiMap = useMemo(() => {
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
        for (const key in fallbackMap) {
            if (!map[key]) {
                map[key] = fallbackMap[key];
            }
        }
        return map;
    }, [allTypes]);

    const apiNameToGermanMap = useMemo(() => {
        const map = {};
        if (allTypes && Array.isArray(allTypes)) {
            allTypes.forEach(t => {
                map[t.api_name.toLowerCase()] = t.ger_name;
            });
        }
        return map;
    }, [allTypes]);

    const getIconPathForMainPokemonType = (germanTypeName) => {
        if (!germanTypeName) return null;
        const apiName = germanNameToApiMap[germanTypeName.toLowerCase()];
        return apiName ? getTypeIconPath(apiName) : null;
    };

    const parseEffectivenessStringToList = (effectivenessString) => {
        if (!effectivenessString) return [];
        if (Array.isArray(effectivenessString)) return effectivenessString.map(t => t.trim().toLowerCase()).filter(t => t);
        return effectivenessString.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    };

    const weakTypesApiNames = useMemo(() => {
        return typeEffectiveness ? parseEffectivenessStringToList(typeEffectiveness.weak) : [];
    }, [typeEffectiveness]);

    const strongTypesApiNames = useMemo(() => {
        return typeEffectiveness ? parseEffectivenessStringToList(typeEffectiveness.strong) : [];
    }, [typeEffectiveness]);

    const themeStyle = useMemo(() => {
        if (!pokemon || !pokemon.typen) {
            return { '--pokemon-theme-color': getRgbaWithOpacity(typeColors.defaultHex, 0.5) };
        }
        const typesFromPokemon = pokemon.typen.split(',').map(t => t.trim());
        const primaryTypeGerman = typesFromPokemon[0] || 'defaultHex';
        const primaryTypeHexColor = typeColors[primaryTypeGerman] || typeColors.defaultHex;
        return { '--pokemon-theme-color': getRgbaWithOpacity(primaryTypeHexColor, 0.5) };
    }, [pokemon]);


    if (loading || !pokemon) {
        return (
            <div className="pokedex-design-container pokedex-entry-loading" style={themeStyle}>
                <p>Lade Pokémon-Daten...</p>
            </div>
        );
    }

    const {
        pokemon_id: id,
        pokemon_ger_name: name,
        pokemon_front_sprites: imageUrl,
        pokemon_flavor_text: text,
        pokemon_weight: weight,
        pokemon_height: height,
        typen: typenString,
    } = pokemon;

    const typesFromPokemon = typenString ? typenString.split(',').map(t => t.trim()) : [];

    const renderTypeIconsList = (apiNameList, listKeyPrefix) => {
        if (!apiNameList || apiNameList.length === 0) {
            return <span className="no-effectiveness-inline">Keine</span>;
        }
        return apiNameList.map((apiTypeName, index) => {
            const iconPath = getTypeIconPath(apiTypeName);
            const titleText = apiNameToGermanMap[apiTypeName.toLowerCase()] || apiTypeName;
            return iconPath ? (
                <img
                    key={`${listKeyPrefix}-${apiTypeName}-${index}`}
                    src={iconPath}
                    alt={apiTypeName}
                    title={titleText}
                    className="type-icon-small-grid"
                />
            ) : (
                <span key={`${listKeyPrefix}-${apiTypeName}-${index}`} className="type-badge-text-inline-small">
                    {apiTypeName}
                </span>
            );
        });
    };

    return (
        <div className="pokedex-design-container" style={themeStyle}>
            <div className="pokedex-entry-layout-new">
                <div className="pe-header detail-box-style">
                    <div className="pe-name-type-header-inner">
                        <h2 className="pe-pokemon-name-header">#{String(id).padStart(3, '0')} - {name || 'Pokémon Name'}</h2>
                        <div className="pe-types-icon-container-main">
                            {typesFromPokemon.length > 0 ? typesFromPokemon.map((type, index) => {
                                const iconPath = getIconPathForMainPokemonType(type);
                                return iconPath ? (
                                    <img key={`main-type-${index}`} src={iconPath} alt={type} title={type} className="type-icon-detail" />
                                ) : (
                                    <span key={`main-type-${index}`} className="type-badge-text-fallback">{type}</span>
                                );
                            }) : <span className="type-badge-text-fallback">Unbekannt</span>}
                        </div>
                    </div>
                </div>

                <div className="pe-main-content-grid">
                    <div className="pe-grid-item pe-image-container-wrapper">
                        <div className="pe-image-container">
                            {imageUrl ? (
                                <img src={imageUrl} alt={name} className="pe-pokemon-image-square" />
                            ) : (
                                <div className="pe-pokemon-image-placeholder-square"></div>
                            )}
                        </div>
                    </div>

                    <div className="pe-grid-item pe-physical-info detail-box-style">
                        <h4 className="pe-grid-item-title">Physische Daten</h4>
                        <div className="pe-box-content-area">
                            <p className="info-item">
                                <span className="info-label">Größe:</span>
                                <span className="info-value">{height !== null && height !== undefined ? `${Number(height).toFixed(1)} m` : '-- m'}</span>
                            </p>
                            <p className="info-item">
                                <span className="info-label">Gewicht:</span>
                                <span className="info-value">{weight !== null && weight !== undefined ? `${Number(weight).toFixed(1)} kg` : '-- kg'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="pe-grid-item pe-weaknesses detail-box-style">
                        <h4 className="pe-grid-item-title">Schwächen</h4>
                        <div className="pe-box-content-area">
                            {loadingTypeEffectiveness && <p className="loading-text-inline-small">Laden...</p>}
                            {!loadingTypeEffectiveness && typeEffectiveness && (
                                <div className="type-icons-grid-list">
                                    {renderTypeIconsList(weakTypesApiNames, 'weak')}
                                </div>
                            )}
                            {!loadingTypeEffectiveness && !typeEffectiveness && <p className="error-text-inline-small">N/A</p>}
                        </div>
                    </div>

                    <div className="pe-grid-item pe-resistances detail-box-style">
                        <h4 className="pe-grid-item-title">Resistenzen</h4>
                        <div className="pe-box-content-area">
                            {loadingTypeEffectiveness && <p className="loading-text-inline-small">Laden...</p>}
                            {!loadingTypeEffectiveness && typeEffectiveness && (
                                <div className="type-icons-grid-list">
                                    {renderTypeIconsList(strongTypesApiNames, 'strong')}
                                </div>
                            )}
                            {!loadingTypeEffectiveness && !typeEffectiveness && <p className="error-text-inline-small">N/A</p>}
                        </div>
                    </div>
                </div>

                <div className="pe-footer detail-box-style">
                    <h3 className="pe-footer-title">Beschreibung</h3>
                    <div className="pe-description-content">
                        {text && text.trim() !== '' ? (
                            <p>{text}</p>
                        ) : (
                            <p>Keine Beschreibung verfügbar.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PokedexEntry;