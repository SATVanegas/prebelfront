import React, { useState, useEffect } from 'react';
import './ModificarPermisos.css';

const ModificarPermisos = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoleName, setSelectedRoleName] = useState('');
  const [modules, setModules] = useState([]);
  const [currentModules, setCurrentModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [message, setMessage] = useState('');
  const [modulesToRemove, setModulesToRemove] = useState([]); // Agregado para los módulos a eliminar

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/roles');
        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        } else {
          console.error('Error al obtener los roles');
        }
      } catch (error) {
        console.error('Error en la conexión con el servidor:', error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/modules');
        if (response.ok) {
          const data = await response.json();
          setModules(data);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Error al cargar módulos');
      }
    };
    fetchModules();
  }, []);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      setCurrentModules([]);
      setMessage('');
      if (!selectedRoleName) return;

      const body = JSON.stringify({ roleName: selectedRoleName });

      const response = await fetch('http://localhost:8080/api/roles/role_modules', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: body,
      });

      if (response.ok) {
        const roleData = await response.json();
        setCurrentModules(roleData.modules);
      } else {
        console.error('Error al obtener los módulos del rol:', response.status);
      }
    };

    fetchRoleDetails();
  }, [selectedRoleName]);

  const handleAddModule = () => {
    if (!selectedModule || selectedPermissions.length === 0) {
      alert("Selecciona un módulo y al menos un permiso");
      return;
    }

    const newModule = {
      moduleName: selectedModule,
      permissions: selectedPermissions,
    };

    setCurrentModules(prev => {
      const exists = prev.some(m => m.moduleName === selectedModule);
      if (exists) {
        return prev.map(m => m.moduleName === selectedModule ? newModule : m);
      }
      return [...prev, newModule];
    });

    setSelectedModule('');
    setSelectedPermissions([]);
  };

  const handleRemoveModule = (moduleName) => {
    setModulesToRemove(prev => [...prev, moduleName]); // Agregar módulo a eliminar
    setCurrentModules(prev => prev.filter(m => m.moduleName !== moduleName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRoleName) {
      setMessage('Selecciona un rol primero');
      return;
    }

    const updateData = {
      roleName: selectedRoleName,
      modules: currentModules,
      modulesToRemove: modulesToRemove, // Agregar los módulos a eliminar
    };

    try {
      const response = await fetch(`http://localhost:8080/api/roles/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setMessage('Permisos actualizados correctamente');
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión con el servidor');
    }
  };

  return (
    <div className="modificar-permisos-container">
      <div className="modificar-permisos-card">
        <h2>Modificar Permisos de Rol</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rol:</label>
            <select value={selectedRoleName} onChange={(e) => setSelectedRoleName(e.target.value)} required>
              <option value="">Seleccione un rol</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Módulos disponibles:</label>
            <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
              <option value="">Seleccione un módulo</option>
              {modules.map((module, index) => (
                <option key={index} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Permisos:</label>
            {['CREATE', 'READ', 'UPDATE', 'DELETE'].map(perm => (
              <label key={perm} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(perm)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPermissions([...selectedPermissions, perm]);
                    } else {
                      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
                    }
                  }}
                />
                {perm}
              </label>
            ))}
          </div>

          <button type="button" onClick={handleAddModule} className="add-button">
            Añadir Módulo
          </button>

          <div className="current-modules">
            <h3>Módulos asignados:</h3>
            {currentModules.map((mod, index) => (
              <div key={index} className="module-item">
                <div className="module-header">
                  <span className="module-name">{mod.moduleName}</span>
                  <button type="button" onClick={() => handleRemoveModule(mod.moduleName)} className="remove-button">
                    ✕
                  </button>
                </div>
                <div className="module-permissions">
                  {mod.permissions.join(', ')}
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="submit-button">
            Guardar Cambios
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ModificarPermisos;
