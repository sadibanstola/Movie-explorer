import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getMovieDetails, getMovieCredits } from "../../Services/api";

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDarkMode] = useState(() => localStorage.getItem("theme") !== "light");

  // Check if movie is in favorites
  useEffect(() => {
    let favorites = [];
    try {
      favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (!Array.isArray(favorites)) {
        favorites = [];
      }
    } catch (e) {
      console.error("Invalid favorites in localStorage:", e);
    }
    console.log("Favorites from localStorage:", favorites);
    setIsFavorite(favorites.some((fav) => fav.id === Number(movieId)));
  }, [movieId]);

  // Fetch movie details and credits
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieData, castData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
        ]);
        if (!movieData) throw new Error("Movie not found.");
        setMovie(movieData);
        setCast(castData);
      } catch (err) {
        setError("Failed to load movie details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  // Handle adding/removing from favorites
  const toggleFavorite = () => {
    if (!movie) {
      console.warn("Cannot toggle favorite: movie data not loaded");
      return;
    }
    console.log("Toggling favorite, current isFavorite:", isFavorite);
    let favorites = [];
    try {
      favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (!Array.isArray(favorites)) {
        favorites = [];
      }
    } catch (e) {
      console.error("Invalid favorites in localStorage:", e);
    }
    console.log("Current favorites:", favorites);
    if (isFavorite) {
      const updatedFavorites = favorites.filter((fav) => fav.id !== Number(movieId));
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      console.log("Removed favorite, new favorites:", updatedFavorites);
      setIsFavorite(false);
    } else {
      const favoriteMovie = {
        id: Number(movieId),
        title: movie.title,
        poster_path: movie.poster_path,
      };
      favorites.push(favoriteMovie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      console.log("Added favorite, new favorites:", favorites);
      setIsFavorite(true);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} font-roboto`}>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50"
          >
            <div className={`animate-spin rounded-full h-20 w-20 border-t-4 ${isDarkMode ? "border-red-600" : "border-blue-500"}`}></div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center p-6 rounded-lg m-8 backdrop-blur-md ${
            isDarkMode ? "bg-gray-800/60 text-red-400" : "bg-white/60 text-red-600"
          } shadow-lg`}
          role="alert"
        >
          {error}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className={`mt-4 px-6 py-2 ${isDarkMode ? "bg-red-600" : "bg-blue-500"} text-white rounded-full font-semibold font-lato`}
            aria-label="Back to home"
          >
            Back to Home
          </motion.button>
        </motion.div>
      )}

      {movie && !loading && !error && (
        <>
          {/* Hero Section */}
          <div
            className="relative h-[70vh] bg-cover bg-center"
            style={{
              backgroundImage: movie.backdrop_path
                ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                : "linear-gradient(to bottom, #1f2937, #111827)",
            }}
            role="banner"
            aria-label={`Backdrop for ${movie.title}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${isDarkMode ? "from-transparent to-gray-900/70" : "from-transparent to-gray-200/70"}`}></div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-28 flex items-end h-full"
            >
              <div className="backdrop-blur-md bg-black/30 p-6 rounded-lg shadow-xl">
                <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold drop-shadow-lg ${isDarkMode ? "text-white" : "text-gray-900"} font-roboto`}>
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className={`italic text-lg mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"} font-lato`}>{movie.tagline}</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Movie Details Section */}
          <div className="container mx-auto px-4 sm:px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-1"
              >
                <div className="relative">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/300x450"}
                    alt={`Poster for ${movie.title}`}
                    className="w-full max-w-[300px] rounded-xl shadow-2xl mx-auto"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFavorite}
                    disabled={!movie || loading}
                    className={`absolute top-4 right-4 p-3 rounded-full ${
                      isFavorite ? "bg-red-600" : "bg-gray-500"
                    } text-white shadow-md ${!movie || loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite ? "❤️" : "🤍"}
                  </motion.button>
                </div>
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-2 backdrop-blur-md bg-black/20 p-8 rounded-xl shadow-xl"
              >
                <p className={`mb-6 text-xl leading-7 ${isDarkMode ? "text-gray-200" : "text-gray-700"} font-lato`}>{movie.overview}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold font-roboto">Release Date:</p>
                    <p className="font-lato">{movie.release_date || "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold font-roboto">Rating:</p>
                    <p className="font-lato">{movie.vote_average ? `${movie.vote_average}/10` : "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold font-roboto">Genres:</p>
                    <p className="font-lato">{movie.genres?.map((g) => g.name).join(", ") || "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold font-roboto">Runtime:</p>
                    <p className="font-lato">{movie.runtime ? `${movie.runtime} min` : "N/A"}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className={`px-8 py-3 ${isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-full font-semibold font-lato shadow-md`}
                  aria-label="Back to home"
                >
                  Back to Home
                </motion.button>
              </motion.div>
            </div>

            {/* Cast Section */}
            {cast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-16"
              >
                <h2 className="text-3xl font-bold mb-8 font-roboto">Meet the Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                  {cast.map((actor) => (
                    <motion.div
                      key={actor.id}
                      whileHover={{ scale: 1.05 }}
                      className="text-center"
                    >
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "https://via.placeholder.com/185x278?text=No+Image"
                        }
                        alt={actor.name}
                        className="w-full h-48 object-cover rounded-lg shadow-md mb-2"
                      />
                      <p className="text-lg font-semibold font-roboto">{actor.name}</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"} font-lato`}>{actor.character}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;