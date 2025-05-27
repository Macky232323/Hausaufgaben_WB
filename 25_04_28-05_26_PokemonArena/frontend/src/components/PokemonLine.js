import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PokemonLine.css';

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const getIconPath = (englishTypeName) => {
    if (!englishTypeName) return null;
    return `${process.env.PUBLIC_URL}/TypeIcons/${englishTypeName}.svg`;
};

function PokemonLine({ pokemon, getRowStylingInfo, typeMap, dataPokemonId, onSelect }) {
    const navigate = useNavigate();

    const handleLineClick = () => {
        if (onSelect) {
            onSelect(pokemon.pokemon_id);
        }
        navigate(`/pokedex/${pokemon.pokemon_id}`);
    };

    const { backgroundColorRgba, solidColor, hoverBackgroundColorRgba } = getRowStylingInfo(pokemon.typen);

    const renderTypes = (typenString) => {
        if (!typenString || !typeMap) return '-';
        const germanTypes = typenString.split(',').map(t => t.trim());

        return germanTypes.map((gerName, index) => {
            const engName = typeMap[gerName];
            const iconSrc = getIconPath(engName);
            return (
                <span key={index} className="type-display">
                    {iconSrc && <img src={iconSrc} alt={gerName} className="type-icon-inline" />}
                    {capitalizeFirstLetter(gerName)}
                </span>
            );
        });
    };
    const formatHeight = (heightInMeters) => heightInMeters == null ? '-' : `${heightInMeters.toFixed(1)} m`;
    const formatWeight = (weightInKg) => weightInKg == null ? '-' : `${weightInKg.toFixed(1)} kg`;
    const formatBst = (bst) => bst === null || bst === undefined ? '-' : bst;

    return (
        <div
            className="pokemon-line"
            onClick={handleLineClick}
            style={{
                '--type-color': solidColor,
                '--normal-background-color': backgroundColorRgba,
                '--hover-background-color': hoverBackgroundColorRgba,
            }}
            data-pokemon-id={dataPokemonId}
        >
            <div className="pokemon-line-image-container">
                <img
                    src={pokemon.pokemon_front_sprites}
                    alt={pokemon.pokemon_ger_name || pokemon.pokemon_api_name}
                    className="pokemon-line-image"
                />
            </div>
            <div className="pokemon-line-id">#{String(pokemon.pokemon_id).padStart(3, '0')}</div>
            <div className="pokemon-line-name">{capitalizeFirstLetter(pokemon.pokemon_ger_name || pokemon.pokemon_api_name)}</div>
            <div className="pokemon-line-types">{renderTypes(pokemon.typen)}</div>
            <div className="pokemon-line-bst">{formatBst(pokemon.pokemon_bst)}</div>
            <div className="pokemon-line-height">{formatHeight(pokemon.pokemon_height)}</div>
            <div className="pokemon-line-weight">{formatWeight(pokemon.pokemon_weight)}</div>
        </div>
    );
}

export default PokemonLine;