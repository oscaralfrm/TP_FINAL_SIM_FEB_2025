import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Menu/Navbar";
import HomePage from "./pages/HomePage";
import SimulacionPage from "./pages/SimulacionPage";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulacion" element={<SimulacionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;