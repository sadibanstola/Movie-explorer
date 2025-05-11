import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getMovieDetails } from "../../Services/api";

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode] = useState(() => localStorage.getItem("theme") !== "light");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const movieData = await getMovieDetails(movieId);
        if (!movieData) throw new Error("Movie not found.");
        setMovie(movieData);
      } catch (err) {
        setError("Failed to load movie details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-opacity-50 backdrop-blur-sm z-50"
          >
            <div className={`animate-spin rounded-full h-20 w-20 border-t-4 ${isDarkMode ? "border-red-500" : "border-blue-500"}`}></div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center p-4 rounded-lg m-8 ${
            isDarkMode ? "text-red-400 bg-red-900/20" : "text-red-600 bg-red-100"
          }`}
          role="alert"
        >
          {error}
          <button
            onClick={handleBack}
            className={`mt-4 px-4 py-2 ${isDarkMode ? "bg-red-500" : "bg-blue-500"} text-white rounded-full font-semibold`}
            aria-label="Back to home"
          >
            Back to Home
          </button>
        </motion.div>
      )}

      {movie && !loading && !error && (
        <>
          {/* Hero Section */}
          <div
            className="relative h-[60vh] bg-cover bg-center"
            style={{
              backgroundImage: movie.backdrop_path
                ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                : "linear-gradient(to bottom, #4a5568, #2d3748)",
            }}
            role="banner"
            aria-label={`Backdrop for ${movie.title}`}
          >
            <div className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-t from-gray-900 to-transparent" : "bg-gradient-to-t from-gray-100 to-transparent"}`}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="container mx-auto px-4 sm:px-6 pt-16 sm:pt-24 flex items-end h-full"
              >
                <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {movie.title}
                </h1>
              </motion.div>
            </div>
          </div>

          {/* Movie Details Section */}
          <div className="container mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Poster */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <img
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/300x450"}
                  alt={`Poster for ${movie.title}`}
                  className="w-full max-w-[300px] rounded-lg shadow-lg"
                />
              </motion.div>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex-1"
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">{movie.title}</h2>
                {movie.tagline && (
                  <p className={`italic mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{movie.tagline}</p>
                )}
                <p className={`mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{movie.overview}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="font-semibold">Release Date:</span> {movie.release_date || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Rating:</span> {movie.vote_average ? `${movie.vote_average}/10` : "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Genres:</span>{" "}
                    {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Runtime:</span>{" "}
                    {movie.runtime ? `${movie.runtime} min` : "N/A"}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className={`px-6 py-3 ${isDarkMode ? "bg-red-500" : "bg-blue-500"} text-white rounded-full font-semibold`}
                  aria-label="Back to home"
                >
                  Back to Home
                </motion.button>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;