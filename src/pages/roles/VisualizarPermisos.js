import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import "./VisualizarPermisos.css";

const VisualizarPermisos = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Error al obtener los usuarios");
        }
      } catch (error) {
        console.error("Error en la conexión con el servidor:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPermissions([]);
    setMessage('');

    if (!selectedUser || !selectedUser.value) {
      setMessage('Selecciona un usuario primero');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/roles/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: selectedUser.value.trim(), 
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setMessage(`Error: ${errorMessage}`);
        return;
      }

      const userData = await response.json();
      setPermissions(userData.permissions);
    } catch (error) {
      console.error('Error al obtener los permisos del usuario:', error);
      setMessage('Error en la conexión con el servidor');
    }
  };

  const userOptions = users.map((user) => ({
    value: user,
    label: user,
  }));

  const navigate = useNavigate();

  return (
    <div className="visualizar-permisos-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          🔙 Atrás
        </button>
        <button className="nav-btn" onClick={() => navigate('/')}> 
          🏠 Inicio
        </button>
      </div>
      <div className="visualizar-permisos-card">
        <h2>Visualizar Permisos por Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Seleccionar Usuario:</label>
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={setSelectedUser}
              placeholder="Escribe para buscar..."
              isSearchable
            />
          </div>
          <button type="submit" className="primary-btn">Obtener Permisos</button>
        </form>
        {message && <p className="message">{message}</p>}
        {permissions.length > 0 && (
          <div className="permissions-list">
            <h3>Módulos y Permisos:</h3>
            <ul>
              {permissions.map((perm, index) => (
                <li key={index} className="permission-item">
                  <div className="module-name">{perm.moduleName}</div>
                  <div className="permissions-list-right">
                    {perm.permissions.join(", ")}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizarPermisos;
