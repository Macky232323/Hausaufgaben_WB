import React from 'react';
import { FaList, FaTh, FaTimes } from 'react-icons/fa';
import '../styles/FilterControls.css';

function FilterControls({
    viewType,
    setViewType,
    searchTerm,
    setSearchTerm,
    selectedTypes,
    setSelectedTypes,
    allTypes,
    onFilterChange
}) {

    const handleTypeChange = (germanTypeName) => {
        setSelectedTypes(prev => {
            const newSelection = prev.includes(germanTypeName)
                ? prev.filter(t => t !== germanTypeName)
                : [...prev, germanTypeName];
            if (onFilterChange) onFilterChange();
            return newSelection;
        });
    };

     const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (onFilterChange) onFilterChange();
     }

     const handleClearFilters = () => {
        setSelectedTypes([]);
        setSearchTerm('');
        if (onFilterChange) onFilterChange();
     };

     const filtersAreActive = selectedTypes.length > 0 || searchTerm !== '';

    return (
        <div className="filter-controls-container">
            <div className="controls-row">
                <div className="view-switcher">
                    <button onClick={() => setViewType('grid')} className={viewType === 'grid' ? 'active' : ''} title="Kachelansicht">
                        <FaTh />
                    </button>
                    <button onClick={() => setViewType('list')} className={viewType === 'list' ? 'active' : ''} title="Listenansicht">
                        <FaList />
                    </button>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Pokémon suchen..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="type-filter">
                     {allTypes.map(type => {
                        const isSelected = selectedTypes.includes(type.ger_name);
                        const iconSrc = `${process.env.PUBLIC_URL}/TypeIcons/${type.api_name}.svg`;

                        return (
                            <div
                                key={type.id}
                                className={`type-icon-container ${isSelected ? 'active' : ''}`}
                                onClick={() => handleTypeChange(type.ger_name)}
                                title={type.ger_name}
                            >
                                <img
                                    src={iconSrc}
                                    alt={type.ger_name}
                                    className="type-icon"
                                />
                            </div>
                        );
                    })}
                </div>

                {filtersAreActive && (
                     <button
                        className="clear-filters-button"
                        onClick={handleClearFilters}
                        title="Alle Filter zurücksetzen"
                      >
                        <FaTimes />
                      </button>
                )}

            </div>
        </div>
    );
}

export default FilterControls;