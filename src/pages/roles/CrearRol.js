import React, { useState } from 'react';
import './CrearRol.css';

const CrearRol = () => {
  const [roleEnum, setRoleEnum] = useState('');
  const [modules, setModules] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleRequest = { roleEnum, modules };

    try {
      const response = await fetch('http://localhost:8080/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleRequest),
      });

      if (response.ok) {
        setMessage('Rol creado exitosamente');
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al crear el rol:', error);
      setMessage('Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="crear-rol-container">
      <div className="crear-rol-card">
      <h2>Crear Rol</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rol:</label>
          <input
            type="text"
            value={roleEnum}
            onChange={(e) => setRoleEnum(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Módulos:</label>
          <input
            type="text"
            value={modules}
            onChange={(e) => setModules(e.target.value.split(','))}
            required
          />
        </div>
        <button type="submit">Crear Rol</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default CrearRol;