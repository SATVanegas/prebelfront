import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./login/AuthContext"; 
import './Home.css'; 

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  if (!user) {
    return <p className="error-message">No tienes acceso. Por favor, inicia sesión.</p>;
  }

  // Definir permisos para cada módulo
  const permisos = {
    roles: ["ADMIN"],
    programacion: ["ADMIN", "LAB_TECH", "STAB_TECH", "PACK_TECH", "COORDINATOR"],
    matriz: ["ADMIN", "STAB_TECH", "COORDINATOR"],
    reportes: ["ADMIN", "STAB_TECH", "COORDINATOR"]
  };

  // Verifica si el usuario tiene permiso para un módulo
  const tieneAcceso = (modulo) => permisos[modulo]?.includes(user.roleName);

  return (
    <div className="home-container">
      <div className="home-card">
        <h2 className='title'>Bienvenido, {user.name}</h2>
        <p className="role-text">Tu rol es: <strong>{user.roleName}</strong></p>
        <div className="button-container">
          {tieneAcceso("roles") && (
            <button className="primary-btn" onClick={() => navigate('/roles')}>Control de Roles</button>
          )}
          {tieneAcceso("programacion") && (
            <button className="primary-btn" onClick={() => navigate('/programacion')}>Programación Semanal</button>
          )}
          {tieneAcceso("matriz") && (
            <button className="primary-btn" onClick={() => navigate('/matriz/consultar')}>Inspecciones próximas</button>
          )}
          {tieneAcceso("reportes") && (
            <button className="primary-btn" onClick={() => navigate('/reportes')}>Reportes</button>
          )}
          <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;