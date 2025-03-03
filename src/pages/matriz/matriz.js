import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Matriz.css';

const Matriz = () => {
  const navigate = useNavigate();

  return (
    <div className="matriz-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>

      <div className="matriz-card">
        <h2 className='title'>Matriz de estabilidad</h2>
        <div className="bt-container">
          <button className="primary-btn" onClick={() => navigate('/matriz/consultar')}>Consultar matriz</button>
          <button className="primary-btn" onClick={() => navigate('/coming-soon')}>Crear matriz</button>
          <button className="primary-btn" onClick={() => navigate('/coming-soon')}>Editar matriz</button>
          <button className="primary-btn" onClick={() => navigate('/coming-soon')}>Eliminar matriz</button>
        </div>
      </div>
    </div>
  );
};

export default Matriz;
