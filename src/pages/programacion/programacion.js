import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import './programacion.css';

const Reportes = () => {
  const navigate = useNavigate();

  return (
    <div className="reportes-container"> {/* Agregar clase única */}
      <div className="nav-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Atrás
        </button>
        <Link to="/" className="home-btn">
          🏠 Inicio
        </Link>
      </div>

      <div className="matriz-card">
        <h2>Reportes</h2>
        <div className="button-container">
          <button className="primary-btn" onClick={() => navigate('/programacion/consultar')}>Consultar Programacion</button>
          <button className="primary-btn" onClick={() => navigate('/programacion/anadir')}>Añadir Programación</button>
          <button className="primary-btn" onClick={() => navigate('/programacion/editar')}>Editar Programación</button>
          <button className="primary-btn" onClick={() => navigate('/programacion/eliminar')}>Eliminar Programación</button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
