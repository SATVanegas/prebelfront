import React, { useState } from 'react';
import './ModificarPermisos.css';

const ModificarPermisos = () => {
  const [roleId, setRoleId] = useState('');
  const [permissions, setPermissions] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleDetails = { permissions: permissions.split(',') };

    try {
      const response = await fetch(`http://localhost:8080/api/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleDetails),
      });

      if (response.ok) {
        setMessage('Permisos actualizados exitosamente');
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al modificar los permisos:', error);
      setMessage('Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="modificar-permisos-container">
      <h2>Modificar Permisos de un Rol</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ID del Rol:</label>
          <input
            type="text"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Permisos (separados por comas):</label>
          <input
            type="text"
            value={permissions}
            onChange={(e) => setPermissions(e.target.value)}
            required
          />
        </div>
        <button type="submit">Modificar Permisos</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ModificarPermisos;