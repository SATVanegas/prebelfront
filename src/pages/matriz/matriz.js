import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import './Matriz.css';

const Reportes = () => {
  const navigate = useNavigate();

  return (
    <div className="matriz-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          🔙 Atrás
        </button>
        <button className="nav-btn" onClick={() => navigate('/')}> 
          🏠 Inicio
        </button>
      </div>

      <div className="matriz-card">
        <h2 className='title'>Matriz de estabilidad</h2>
        <div className="bt-container">
          <button className="primary-btn" onClick={() => navigate('/matriz/consultar')}>Consultar matriz</button>
          <button className="primary-btn" onClick={() => navigate('/matriz/anadir')}>Crear matriz</button>
          <button className="primary-btn" onClick={() => navigate('/matriz/editar')}>Editar matriz</button>
          <button className="primary-btn" onClick={() => navigate('/matriz/eliminar')}>Eliminar matriz</button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
