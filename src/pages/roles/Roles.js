import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Roles.css';

const Roles = () => {
  const navigate = useNavigate();

  return (
    <div className="roles-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          🔙 Atrás
        </button>
        <button className="nav-btn" onClick={() => navigate('/')}> 
          🏠 Inicio
        </button>
      </div>
      <div className="roles-card">
        <h2>Control de Roles</h2>
        <div className="button-container">
          <button 
            className="primary-btn" 
            onClick={() => navigate('/crear-usuario')}
          >
            Crear Usuario
          </button>
          <button 
            className="primary-btn" 
            onClick={() => navigate('/crear-rol')}
          >
            Crear Rol
          </button>
          <button 
            className="primary-btn" 
            onClick={() => navigate('/modificar-permisos')}
          >
            Modificar Permisos
          </button>
          <button 
            className="primary-btn" 
            onClick={() => navigate('/visualizar-permisos')}
          >
            Visualizar Permisos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roles;
