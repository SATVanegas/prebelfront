import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {FiCheckSquare, FiPlus, FiEdit } from 'react-icons/fi';
import './CrearRol.css';

const CrearRol = () => {
  const [roleName, setRoleName] = useState('');
  const [modules, setModules] = useState([]); 
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [expandedModule, setExpandedModule] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/modules'); 
        if (response.ok) {
          const data = await response.json(); 
          setModules(data);
        } else {
          console.error('Error al obtener los módulos');
        }
      } catch (error) {
        console.error('Error en la conexión con el servidor:', error);
      }
    };

    fetchModules();
  }, []);

  const addModule = () => {
    if (selectedModule && !selectedModules.some(mod => mod.moduleName === selectedModule)) {
      setSelectedModules([...selectedModules, { moduleName: selectedModule, permissions: [] }]);
    }
    setExpandedModule(selectedModule);
  };

  const togglePermission = (moduleName, permission) => {
    setSelectedModules(prevModules =>
      prevModules.map(mod =>
        mod.moduleName === moduleName
          ? {
              ...mod,
              permissions: mod.permissions.includes(permission)
                ? mod.permissions.filter(p => p !== permission) 
                : [...mod.permissions, permission] 
            }
          : mod
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedModules.length === 0) {
      alert("Debes añadir al menos un módulo con permisos.");
      return;
    }

    const roleRequest = {
      roleName,
      modules: selectedModules
    };

    try {
      const response = await fetch('http://localhost:8080/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleRequest),
      });

      if (response.ok) {
        setMessage('Rol creado exitosamente');
        setRoleName('');
        setSelectedModules([]);
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al crear el rol:', error);
      setMessage('Error en la conexión con el servidor.');
    }
  };

  const handleExpandModule = (moduleName) => {
    setExpandedModule(expandedModule === moduleName ? '' : moduleName); 
  };

  const navigate = useNavigate();

  return (
    <div className="crear-rol-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          🔙 Atrás
        </button>
        <button className="nav-btn" onClick={() => navigate('/')}> 
          🏠 Inicio
        </button>
      </div>

      <div className="crear-rol-card">
        <h1 className="title">Crear Nuevo Rol</h1>
        
        <form onSubmit={handleSubmit} className="role-form">
          <div className="input-group">
            <label className="input-label">Nombre del Rol</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="text-input"
              placeholder="Ej: Administrador"
              required
            />
          </div>

          <div className="module-selector">
            <div className="selector-header">
              <h3 className="section-title">Seleccionar Módulos</h3>
              <div className="selector-controls">
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="module-dropdown"
                >
                  <option value="">Selecciona un módulo</option>
                  {modules.map((module, index) => (
                    <option key={index} value={module}>
                      {module}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addModule}
                  className="add-module-btn"
                  disabled={!selectedModule}
                >
                  <FiPlus className="btn-icon" />
                  Añadir Módulo
                </button>
              </div>
            </div>

            {selectedModules.length > 0 && (
              <div className="selected-modules">
                {selectedModules.map((mod, index) => (
                  <div key={index} className="module-card">
                    <div className="module-header">
                      <h4 className="module-title">{mod.moduleName}</h4>
                      <button
                        type="button"
                        onClick={() => handleExpandModule(mod.moduleName)}
                        className="edit-btn"
                      >
                        <FiEdit />
                      </button>
                    </div>
                    {expandedModule === mod.moduleName ? (
                      <div className="permissions-grid">
                        {['CREATE', 'READ', 'UPDATE', 'DELETE'].map((perm) => (
                          <button
                            key={perm}
                            type="button"
                            className={`permission-btn ${mod.permissions.includes(perm) ? 'active' : ''}`}
                            onClick={() => togglePermission(mod.moduleName, perm)}
                          >
                            <FiCheckSquare className="check-icon" />
                            {perm}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="permissions-collapsed">
                        <span>Permisos (haz click para editar)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Crear Rol
            </button>
          </div>
        </form>

        {message && (
          <div className={`status-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearRol;
