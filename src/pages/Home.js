import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./login/AuthContext"; // Importa el contexto
import './Home.css'; // Importa los estilos mejorados

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Obtiene el usuario y la función logout

  if (!user) {
    return <p className="error-message">No tienes acceso. Por favor, inicia sesión.</p>;
  }

  return (
    <div className="home-container">
      <div className="home-card">
        <h2>Bienvenido, {user.name}</h2>
        <p className="role-text">Tu rol es: <strong>{user.roleEnum}</strong></p>
        <div className="button-container">
          <button className="primary-btn" onClick={() => navigate('/roles')}>Control de Roles</button>
          <button className="primary-btn" onClick={() => navigate('/programacion')}>Programación Semanal</button>
          <button className="primary-btn" onClick={() => navigate('/matriz')}>Matriz de Estabilidades</button>
          <button className="primary-btn" onClick={() => navigate('/reportes')}>Reportes</button>
          <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
