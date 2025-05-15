import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../Components/Card/MovieCard";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode] = useState(() => localStorage.getItem("theme") !== "light");
  const navigate = useNavigate();

  useEffect(() => {
    const updateFavorites = () => {
      setLoading(true);
      try {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (!Array.isArray(savedFavorites)) {
          console.warn("Favorites is not an array, resetting to empty array");
          setFavorites([]);
        } else {
          setFavorites(savedFavorites);
        }
      } catch (e) {
        console.error("Error parsing favorites from localStorage:", e);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    updateFavorites();
    window.addEventListener("storage", updateFavorites);
    window.addEventListener("favoritesUpdated", updateFavorites);
    return () => {
      window.removeEventListener("storage", updateFavorites);
      window.removeEventListener("favoritesUpdated", updateFavorites);
    };
  }, []);

  const removeFavorite = (movieId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== movieId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="container mx-auto px-4 sm:px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">Your Favorite Movies</h1>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-4"
          >
            <div className={`animate-spin rounded-full h-10 w-10 border-t-4 ${isDarkMode ? "border-red-600" : "border-blue-500"} mx-auto`}></div>
          </motion.div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center p-4 rounded-lg ${
              isDarkMode ? "text-gray-400 bg-gray-800" : "text-gray-600 bg-gray-200"
            }`}
          >
            <p>No favorite movies yet. Add some from the movie details page!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className={`mt-4 px-6 py-3 ${isDarkMode ? "bg-red-500" : "bg-blue-500"} text-white rounded-full font-semibold`}
            >
              Back to Home
            </motion.button>
          </motion.div>
        ) : (
          <MovieCard title="Your Favorites" movies={favorites} onRemoveFavorite={removeFavorite} />
        )}
      </div>
    </div>
  );
};

export default Favorites;