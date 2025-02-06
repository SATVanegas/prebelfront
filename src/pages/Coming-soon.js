import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Coming-soon.css";
import logo from ".//login/logo.png";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="coming-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>
      <div className="coming-card">
        <img src={logo} alt="Prebel Logo" className="logo" />
        <p className="text2">Estamos trabajando en esta página. Vuelve pronto.</p>
      </div>
    </div>
  );
};

export default ComingSoon;
