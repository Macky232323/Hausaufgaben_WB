import React, { useMemo } from 'react';
import '../styles/PokemonCard.css';
import { useNavigate } from 'react-router-dom';

const getRgbaWithOpacity = (hexColor, alpha = 0.65) => {
    if (!hexColor || typeof hexColor !== 'string') hexColor = '#777777';
    const bigint = parseInt(hexColor.startsWith('#') ? hexColor.slice(1) : hexColor, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const finalAlpha = Math.min(1, Math.max(0, alpha));
    return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
};

function PokemonCard({ pokemon, allTypes, onClick }) {
    const id = pokemon.pokemon_id;
    const name = pokemon.pokemon_ger_name;
    const imageUrl = pokemon.pokemon_front_sprites;
    const typenString = pokemon.typen;
    const navigate = useNavigate();

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const typesArray = typenString ? typenString.split(',').map(t => t.trim()) : [];
    const primaryType = typesArray[0] || 'default';
    
    const typeColorsSolid = { Normal: '#A8A77A', Feuer: '#EE8130', Wasser: '#6390F0', Elektro: '#F7D02C', Pflanze: '#7AC74C', Eis: '#96D9D6', Kampf: '#C22E28', Gift: '#A33EA1', Boden: '#E2BF65', Flug: '#A98FF3', Psycho: '#F95587', Käfer: '#A6B91A', Gestein: '#B6A136', Geist: '#735797', Drache: '#6F35FC', Unlicht: '#705746', Stahl: '#B7B7CE', Fee: '#D685AD', default: '#777777' };
    
    const solidBackgroundColor = typeColorsSolid[primaryType] || typeColorsSolid.default;
    
    const baseAlpha = 0.65;
    const cardTransparentBackgroundColor = getRgbaWithOpacity(solidBackgroundColor, baseAlpha);
    const hoverAlpha = baseAlpha + 0.2; 
    const hoverTransparentBackgroundColor = getRgbaWithOpacity(solidBackgroundColor, hoverAlpha);


    const getIconPath = (englishTypeName) => englishTypeName ? `${process.env.PUBLIC_URL}/TypeIcons/${englishTypeName}.svg` : null;
    
    const typeMap = useMemo(() => {
        const map = {};
        if (allTypes) { allTypes.forEach(t => { map[t.ger_name] = t.api_name; }); }
        return map;
    }, [allTypes]);

    const renderTypeIcons = () => {
        if (!typesArray.length || !typeMap) return null;
        return typesArray.map((gerName) => {
            const engName = typeMap[gerName];
            const iconSrc = getIconPath(engName);
            return iconSrc ? <img key={gerName} src={iconSrc} alt={gerName} className="type-icon-card" title={gerName} /> : null;
        });
    };

    const handleCardClick = (e) => {
        e.preventDefault();
        if (onClick) {
            onClick();
        }
        navigate(`/pokedex/${id}`);
    };

    const cardStyle = {
        '--pokemon-card-solid-type-color': solidBackgroundColor,
        '--pokemon-card-transparent-type-color': cardTransparentBackgroundColor,
        '--pokemon-card-hover-transparent-type-color': hoverTransparentBackgroundColor,
    };

    return (
        <div className="pokemon-card-link-wrapper" onClick={handleCardClick} data-pokemon-id={id} style={{ textDecoration: "none", cursor: 'pointer' }}>
            <div className="pokemon-card" style={cardStyle}>
                <div className="card-header">
                    <h3>#{String(id).padStart(3, '0')}</h3>
                </div>
                <div className="card-image-area">
                    <img className="card-pokemon-image" src={imageUrl} alt={name} />
                    <div className="card-type-icons-container">
                        {renderTypeIcons()}
                    </div>
                </div>
                <div className="card-body">
                    <h3 className="card-pokemon-name">{capitalizedName}</h3>
                </div>
            </div>
        </div>
    );
}

export default PokemonCard;