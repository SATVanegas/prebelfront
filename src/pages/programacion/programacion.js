import React from 'react';
import { useNavigate } from 'react-router-dom';
import './programacion.css';

const Programacion = () => {
  const navigate = useNavigate();

  return (
    <div className="matriz-container">
      <div className="matriz-card">
        <h2>Progrmación semanal</h2>
        <div className="button-container">
          <button className="primary-btn" onClick={() => navigate('/consultar')}>Consultar</button>
          <button className="primary-btn" onClick={() => navigate('/editar')}>Editar</button>
        </div>
      </div>
    </div>
  );
};

export default Programacion;
