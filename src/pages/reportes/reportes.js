import React from 'react';
import { useNavigate} from 'react-router-dom'; 
import './reportes.css';

const Reportes = () => {
  const navigate = useNavigate();

  return (
    <div className="reportes-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          🔙 Atrás
        </button>
        <button className="nav-btn" onClick={() => navigate('/')}> 
          🏠 Inicio
        </button>
      </div>

      <div className="reportes-card">
        <h2 className='title'>Reportes</h2>
        <div className="bt-container">
            <button className="primary-btn" onClick={() => navigate('/reportes/consultar')}>Consultar Reporte</button>
            <button className="primary-btn" onClick={() => navigate('/reportes/anadir')}>Añadir Reporte</button>
            <button className="primary-btn" onClick={() => navigate('/reportes/imprimir')}>Imprimir Reporte</button>
            <button className="primary-btn" onClick={() => navigate('/reportes/enviar')}>Enviar Reporte</button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;