import React from 'react';
import { useNavigate } from 'react-router-dom';
import './menu.css'; 

const MenuPlanificador = () => {
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
        <h2 className="title">Gestión de la Programación Semanal</h2>
        <div className="button-container">
          <button 
            className="primary-btn" 
            onClick={() => navigate('/programacion/anadir')}
          >
            Añadir Programación
          </button>
          <button 
            className="primary-btn" 
            onClick={() => navigate('/programacion/editar')}
          >
            Editar Programación
          </button>
          <button 
            className="primary-btn" 
            onClick={() => navigate('/programacion/consultar')}
          >
            Consultar Programación
          </button>
          <button 
            className="primary-btn" 
            onClick={() => navigate('/planificador/eliminar-programacion')}
          >
            Eliminar Programación
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuPlanificador;