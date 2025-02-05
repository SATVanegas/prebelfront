import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import './reportes.css';

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
          <button className="primary-btn" onClick={() => navigate('/reportes/consultar')}>Consultar Reporte</button>
          <button className="primary-btn" onClick={() => navigate('/reportes/anadir')}>Añadir Reporte</button>
          <button className="primary-btn" onClick={() => navigate('/reportes/editar')}>Editar Reporte</button>
          <button className="primary-btn" onClick={() => navigate('/reportes/eliminar')}>Eliminar Reporte</button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
