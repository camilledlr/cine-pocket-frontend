import React from 'react'

const MinSearchBar = () => {
const [query, setQuery] = React.useState('');

const handleChange = (e) => {
    setQuery(e.target.value);
};

const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoutez ici la logique de recherche si besoin
    console.log('Recherche:', query);
};

return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
        {/* <input
            type="text"
            placeholder="Rechercher..."
            value={query}
            onChange={handleChange}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
        />
        <button type="submit" style={{ marginLeft: '8px', padding: '6px 16px', borderRadius: '4px', border: 'none', background: '#1976d2', color: '#fff' }}>
            Chercher
        </button> */}
    </form>
)
}

export default MinSearchBar