import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./login/AuthContext"; // Importa el contexto

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Obtiene el usuario y la función logout

  if (!user) {
    return <p>No tienes acceso. Por favor, inicia sesión.</p>;
  }

  return (
    <div className="home-container">
      <h2>Bienvenido</h2>
      <p>Usuario autenticado: {user.name}</p>
      <p>Bienvenido, {user.name}, tu rol es: {user.roleEnum}</p>
      <div className="button-container">
        <button onClick={() => navigate('/roles')}>Control de Roles</button>
        <button onClick={() => navigate('/programacion')}>Programación semanal</button>
        <button onClick={() => navigate('/matriz')}>Matriz de Estabilidades</button>
        <button onClick={() => navigate('/reportes')}>Reportes</button>
        <button onClick={() => { logout(); navigate('/login'); }}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Home;
