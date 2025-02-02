import React, { useState } from 'react';
import './CrearRol.css';

const CrearRol = () => {
  const [roleEnum, setRoleEnum] = useState('');
  const [modules, setModules] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
 
  const handleAddModule = () => {
    if (!selectedModule || selectedPermissions.length === 0) {
      alert("Selecciona un módulo y al menos un permiso.");
      return;
    }
  
    setModules([...modules, { moduleId: selectedModule, permissions: selectedPermissions }]);

    setSelectedModule('');
    setSelectedPermissions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (modules.length === 0) {
      alert("Debes añadir al menos un módulo con permisos.");
      return;
    }
  
    const roleRequest = {
      roleEnum,
      modules
    };
  
    try {
      const response = await fetch('http://localhost:8080/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
            <input type="text" value={roleEnum} onChange={(e) => setRoleEnum(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Módulo ID:</label>
            <input
              type="text"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              
            />
          </div>

          <div className="form-group">
            <label>Permisos (separados por coma):</label>
            <input
              type="text"
              value={selectedPermissions.join(', ')}
              onChange={(e) => setSelectedPermissions(e.target.value.split(',').map(p => p.trim()))}
              
            />
          </div>
          <button type="button" onClick={handleAddModule}>Añadir Módulo</button>
          <ul>
            {modules.map((mod, index) => (
              <li key={index}>
                Módulo {mod.moduleId}: {mod.permissions.join(", ")}
              </li>
            ))}
          </ul>
          <button type="submit">Crear Rol</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default CrearRol;
