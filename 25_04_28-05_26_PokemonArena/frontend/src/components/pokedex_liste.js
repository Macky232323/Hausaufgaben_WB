import React, { useMemo } from 'react';
import PokemonLine from './PokemonLine';
import '../styles/pokedex_liste.css';

function PokedexListe({
    pokemonList,
    getRowStylingInfo,
    typeColorsSolid,
    allTypes,
    containerRef,
    onPokemonSelect
}) {

    const typeMap = useMemo(() => {
        const map = {};
        if (allTypes) {
            allTypes.forEach(t => {
                map[t.ger_name] = t.api_name;
            });
        }
        return map;
    }, [allTypes]);

    if (!pokemonList || pokemonList.length === 0) {
        return null;
    }

    return (
        <div className="pokedex-list-view-container">
            <div className="pokemon-lines-container" ref={containerRef}>
                {pokemonList.map((pokemon) => (
                    <PokemonLine
                        key={pokemon.pokemon_id}
                        pokemon={pokemon}
                        getRowStylingInfo={getRowStylingInfo}
                        typeColorsSolid={typeColorsSolid}
                        typeMap={typeMap}
                        dataPokemonId={pokemon.pokemon_id}
                        onSelect={onPokemonSelect}
                    />
                ))}
            </div>
        </div>
    );
}

export default PokedexListe;