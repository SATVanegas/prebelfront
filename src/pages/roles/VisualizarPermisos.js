import React, { useState } from 'react';
import './VisualizarPermisos.css';

const VisualizarPermisos = () => {
  const [userId, setUserId] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/roles/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPermissions(data);
        setMessage('Permisos obtenidos exitosamente');
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al obtener los permisos:', error);
      setMessage('Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="visualizar-permisos-container">
      <h2>Visualizar Permisos por Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ID del Usuario:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Obtener Permisos</button>
      </form>
      {message && <p>{message}</p>}
      {permissions.length > 0 && (
        <div>
          <h3>Permisos:</h3>
          <ul>
            {permissions.map((perm, index) => (
              <li key={index}>{perm.module}: {perm.permissions.join(', ')}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VisualizarPermisos;