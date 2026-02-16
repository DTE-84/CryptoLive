import React from "react";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">Crypto Dashboard</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
}
