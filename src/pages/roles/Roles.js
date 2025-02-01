import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Roles.css';

const Roles = () => {
  const navigate = useNavigate();

  return (
    <div className="roles-container">
      <h2>Control de Roles</h2>
      <div className="button-container">
        <button onClick={() => navigate('/crear-usuario')}>Crear Usuario</button>
        <button onClick={() => navigate('/crear-rol')}>Crear Rol</button>
        <button onClick={() => navigate('/modificar-permisos')}>Modificar permisos de un rol</button>
        <button onClick={() => navigate('/visualizar-permisos')}>Visualizar permisos por Usuario</button>
      </div>
    </div>
  );
};

export default Roles;