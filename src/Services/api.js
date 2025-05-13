const API_KEY = "e45942ec07b5e46d492419a29a567ae8";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  return data.results;
};

export const getSearchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`
  );
  const data = await response.json();
  return data.results;
};

export const getTopRatedMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  return data.results;
};

export const getHorrorMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&language=en-US&page=1`
  ); // 27 is Horror genre ID
  const data = await response.json();
  return data.results;
};

export const getSciFiMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878&language=en-US&page=1`
  ); // 878 is Sci-Fi genre ID
  const data = await response.json();
  return data.results;
};

export const getComedyMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&language=en-US&page=1`
  ); // 35 is Comedy genre ID
  const data = await response.json();
  return data.results;
};

export const getActionMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=en-US&page=1`
  ); // 28 is Action genre ID
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (movieId) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
  );
  const data = await response.json();
  return data;
};
export const getMovieCredits = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=e45942ec07b5e46d492419a29a567ae8&language=en-US`
    );
    if (!response.ok) throw new Error("Failed to fetch movie credits");
    const data = await response.json();
    return data.cast.slice(0, 5); // Get top 5 cast members
  } catch (error) {
    throw new Error(error.message);
  }
};