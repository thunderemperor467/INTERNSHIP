import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login"; // create this soon

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div className="text-3xl p-10">React + Tailwind App is Running ✅</div>} />
      </Routes>
    </Router>
  );
}

export default App;
