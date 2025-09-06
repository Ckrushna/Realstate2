import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginSign from "./pages/LoginSign";
import AddProject from "./pages/AddProject";
import './api'
import ButtonAdd from './pages/ButtonAdd'

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LoginSign />} />
        <Route path="/LoginSign" element={<LoginSign />} />
        <Route path="/ButtonAdd" element={<ButtonAdd />} />
        <Route path="/AddProject" element={<AddProject/>} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;