import React, { useState } from 'react';
import './CrearUsuario.css';

const CrearUsuario = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { name, email, password, roleId };

    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setMessage('Usuario creado exitosamente');
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setMessage('Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="crear-usuario-container">
      <div className="crear-usuario-card">
      <h2>Crear Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Rol:</label>
          <input
            type="roleId"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Usuario</button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default CrearUsuario;