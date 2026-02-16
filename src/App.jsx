// src/App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import DashboardGrid from './components/DashboardGrid';

function App() {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white">
      <main>
        <DashboardGrid />
      </main>
    </div>
  );
}

export default App;