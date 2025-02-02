import React, { useState } from 'react';
import './ModificarPermisos.css';

const ModificarPermisos = () => {
  const [roleId, setRoleId] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [modules, setModules] = useState([]);
  const [message, setMessage] = useState('');

  const handleAddModule = () => {
    if (!selectedModule.trim() || selectedPermissions.length === 0) {
      alert("Debes seleccionar un módulo y al menos un permiso.");
      return;
    }

    const newModule = {
      moduleId: selectedModule,
      permissions: selectedPermissions,
    };

    // Verifica si el módulo ya existe y lo reemplaza
    const existingModuleIndex = modules.findIndex(mod => mod.moduleId === selectedModule);
    if (existingModuleIndex !== -1) {
      const updatedModules = [...modules];
      updatedModules[existingModuleIndex] = newModule;
      setModules(updatedModules);
    } else {
      setModules([...modules, newModule]);
    }

    setSelectedModule('');
    setSelectedPermissions([]);
  };

  const handleRemoveModule = (moduleId) => {
    setModules(modules.filter(mod => mod.moduleId !== moduleId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modules.length === 0) {
      alert("Debes agregar al menos un módulo con permisos.");
      return;
    }

    const roleDetails = { modules };

    try {
      const response = await fetch(`http://localhost:8080/api/roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleDetails),
      });

      if (response.ok) {
        setMessage('Permisos modificados exitosamente');
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
      <div className="modificar-permisos-card">
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
            <label>ID del Módulo:</label>
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
              onChange={(e) => setSelectedPermissions(e.target.value.split(',').map(p => p.trim()))}
            />
          </div>

          <button type="button" onClick={handleAddModule}>
            Añadir Módulo
          </button>

          <ul>
            {modules.map((mod, index) => (
              <li key={index}>
                <strong>Módulo {mod.moduleId}:</strong> {mod.permissions.join(", ")}
                <button type="button" onClick={() => handleRemoveModule(mod.moduleId)}>
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <button type="submit">Modificar Permisos</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ModificarPermisos;

