import API_BASE_URL from '../api';

// GET /api/films
export const getFilms = async () => {
  const res = await fetch(`${API_BASE_URL}/api/films`);
  return res.json();
};

// POST /api/films
export const addFilm = async (filmData) => {
  const res = await fetch(`${API_BASE_URL}/api/films`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filmData),
  });
  return res.json();
};

// GET/api/films/all-titles'
export const getAllFilms = async () => {
  console.log('Fetching all films');
  const res = await fetch(`${API_BASE_URL}/api/films/all-titles`);
  if (!res.ok) throw new Error('Films non trouvés');
  return res.json();
};

// GET /api/filters-data

export const getFiltersData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/films/filters-data`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la récupération des données de filtre');
    }

    const data = await response.json();
    return data; // { directors: [...], origins: [...], platforms: [...] }
  } catch (error) {
    console.error('❌ getFiltersData error:', error);
    throw error;
  }
};
// GET/api/films/slug
export const getFilmBySlug = async (slug) => {
  const res = await fetch(`${API_BASE_URL}/api/films/slug/${slug}`);
  if (!res.ok) throw new Error('Film non trouvé');
  return res.json();
};
// GET/api/films/:id
export const getFilmById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/api/films/id/${id}`);
  if (!res.ok) throw new Error('Film non trouvé');
  return res.json();
};

// PUT /api/films/add-to-watchlist
export const addFilmToWatchlist = async (filmId, slug, title) => {
  const res = await fetch(`${API_BASE_URL}/api/films/add-to-watchlist`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filmId, slug, title }),
  });
  return res.json();
};

// PUT /api/films/toggle-hype
export const toggleFilmHype = async (filmId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/films/toggle-hype/${filmId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors du changement de hyped');
    }

    return data; // { message: 'Hyped modifié', film: {...} }
  } catch (error) {
    console.error('Erreur dans toggleFilmHype:', error.message);
    throw error;
  }
};
// PUT /api/films/toggle-like
export const toggleFilmLike = async (filmId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/films/toggle-like/${filmId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors du changement de like');
    }

    return data; // { message: 'Like modifié', film: {...} }
  } catch (error) {
    console.error('Erreur dans toggleFilmlike:', error.message);
    throw error;
  }
};
// put /films/:filmId/add-reco
export const addReco = async (filmId, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/films/${filmId}/add-reco`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de l’ajout de la recommandation');
    }

    return await response.json(); // Contient message + recommendations
  } catch (error) {
    console.error('❌ addReco error:', error);
    throw error;
  }
};

export const updateFilmInfos = async (filmId, { director, actors, origin }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/films/${filmId}/update-infos`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ director, actors, origin }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la mise à jour des informations.');
    }

    return await response.json(); // { message, film }
  } catch (error) {
    console.error('❌ updateFilmCrew error:', error);
    throw error;
  }
};
export const updateFilmPlatforms = async (filmId, platforms) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/films/${filmId}/update-platforms`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({platforms}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la mise à jour des dispos');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ updateFilmCrew error:', error);
    throw error;
  }
};

export const markFilmAsSeen = async ({filmId, slug, title}) => {
  const response = await fetch(`${API_BASE_URL}/api/films/mark-as-watched`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ filmId, slug, title }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erreur lors du marquage du film comme vu');
  }

  return response.json(); // renvoie { message, film, timesWatched }
};


export const updateFilmReview = async (filmId, { shortReview, longReview, rating }) => {
  const response = await fetch(`${API_BASE_URL}/api/films/${filmId}/update-review`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shortReview, longReview, rating }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erreur lors de la mise à jour de la review');
  }

  return response.json(); // renvoie { message, film }
};
