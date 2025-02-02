import React, { useState, useEffect } from 'react';
import './CrearUsuario.css';

const CrearUsuario = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleEnum, setRoleEnum] = useState('');
  const [roles, setRoles] = useState([]); // Estado para almacenar los roles
  const [message, setMessage] = useState('');

  // Obtener roles desde el backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/roles'); // Ajusta la URL según tu API
        if (response.ok) {
          const data = await response.json();
          setRoles(data); // Suponiendo que `data` es un array de objetos { id, name }
        } else {
          console.error('Error al obtener los roles');
        }
      } catch (error) {
        console.error('Error en la conexión con el servidor:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { name, email, password, roleEnum };

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
            <select value={roleEnum} onChange={(e) => setRoleEnum(e.target.value)} required>
              <option value="">Seleccione un rol</option>
              {roles.map((role, index) => (
                 <option key={index} value={role}>
                    {role}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Crear Usuario</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default CrearUsuario;
