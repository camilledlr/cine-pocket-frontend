import API_BASE_URL, { apiFetch } from '../api';

// GET /api/lists
export const getLists = async () => {
  const res = await apiFetch(`${API_BASE_URL}/api/lists`);
  return res.json();
};

// GET /api/lists/watchlist
export const getWatchlist = async () => {
  const res = await apiFetch(`${API_BASE_URL}/api/lists/watchlist`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de la watchlist');
  }
  return res.json();
};

// GET /api/lists/seenlist
export const getSeenlist = async () => {
  const res = await apiFetch(`${API_BASE_URL}/api/lists/seenlist`);
  if (!res.ok) {
    throw new Error('Erreur lors de la récupération de la seenlist');
  }
  return res.json();
};

// GET /api/lists/:id
export const getListById = async (id) => {
  const res = await apiFetch(`${API_BASE_URL}/api/lists/${id}`);
  return res.json();
};

// // PUT /api/lists/add-to-watchlist
// export const addFilmToWatchlist = async (filmId, slug, title) => {
//   const res = await apiFetch(`${API_BASE_URL}/api/lists/add-to-watchlist`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ filmId, slug, title }),
//   });
//   return res.json();
// };


// DELETE /api/lists/:listType/films/:slug
export const removeFilmFromList = async (listType, slug) => {
  const res = await apiFetch(
    `${API_BASE_URL}/api/lists/${encodeURIComponent(listType)}/films/${encodeURIComponent(slug)}`,
    { method: 'DELETE' }
  );
  if (!res.ok) {
    throw new Error(`Erreur lors de la suppression du film de la ${listType}`);
  }
  // 204 No Content : pas de body à parser
  if (res.status === 204) return null;
  return res.json();
};
