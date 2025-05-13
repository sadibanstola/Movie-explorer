import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black to-transparent text-white px-8 py-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link to="/">
          <div className="text-2xl font-bold text-red-600">MovieNight</div>
        </Link>

        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/favorites">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 transform hover:scale-105 shadow-lg">
                Favorites
              </button>
            </Link>
          </li>
          <li>
            <Link to="/login">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 transform hover:scale-105 shadow-lg">
                Login
              </button>
            </Link>
          </li>
          <li>
            <Link to="/signup">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 transform hover:scale-105 shadow-lg">
                Signup
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;