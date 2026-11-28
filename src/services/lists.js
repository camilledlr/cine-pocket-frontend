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

// POST /api/lists : enregistre un classement (liste Customised avec ranked: true, films dans l'ordre)
export const createRanking = async ({ title, films }) => {
  const res = await apiFetch(`${API_BASE_URL}/api/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, listType: 'Customised', ranked: true, films }),
  });
  if (!res.ok) throw new Error("Impossible d'enregistrer le top");
  return res.json();
};

// PUT /api/lists/:id : met à jour le titre et l'ordre d'un classement déjà enregistré
export const updateRanking = async (id, { title, films }) => {
  const res = await apiFetch(`${API_BASE_URL}/api/lists/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, films }),
  });
  if (!res.ok) throw new Error("Impossible d'enregistrer le top");
  return res.json();
};

// GET /api/lists/rankings : classements enregistrés, du plus récent au plus ancien
export const getRankings = async () => {
  const res = await apiFetch(`${API_BASE_URL}/api/lists/rankings`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des tops');
  return res.json();
};

// DELETE /api/lists/:id : supprime un classement (les films, eux, restent)
export const deleteRanking = async (id) => {
  const res = await apiFetch(`${API_BASE_URL}/api/lists/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Impossible de supprimer le top');
  return res.json();
};

// GET /api/lists/:id : un top, avec ses films dans l'ordre du classement
export const getRanking = async (id) => {
  const res = await apiFetch(`${API_BASE_URL}/api/lists/${encodeURIComponent(id)}`);
  if (!res.ok) {
    const error = new Error(res.status === 404 ? 'Top introuvable' : 'Erreur lors du chargement du top');
    error.status = res.status;
    throw error;
  }
  return res.json();
};
