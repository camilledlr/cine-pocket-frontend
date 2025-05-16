import API_BASE_URL from '../api';

// GET /api/lists
export const getLists = async () => {
  const res = await fetch(`${API_BASE_URL}/api/lists`);
  return res.json();
};

// GET /api/lists/watchlist
export const getWatchlist = async () => {
  const res = await fetch(`${API_BASE_URL}/api/lists/watchlist`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de la watchlist');
  }
  return res.json();
};

// GET /api/lists/seenlist
export const getSeenlist = async () => {
  const res = await fetch(`${API_BASE_URL}/api/lists/seenlist`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de la seenlist');
  }
  return res.json();
};

// GET /api/lists/:id
export const getListById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/lists/${id}`);
  return res.json();
};

// // PUT /api/lists/add-to-watchlist
// export const addFilmToWatchlist = async (filmId, slug, title) => {
//   const res = await fetch(`${API_BASE_URL}/api/lists/add-to-watchlist`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ filmId, slug, title }),
//   });
//   return res.json();
// };

