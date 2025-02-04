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
  const [modulesToRemove, setModulesToRemove] = useState([]);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

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

  const handleModifyPermissions = () => {
    if (!selectedModule) {
      alert("Selecciona un módulo primero");
      return;
    }
    const existingModule = currentModules.find(m => m.moduleName === selectedModule);
    setSelectedPermissions(existingModule ? existingModule.permissions : []);
    setShowPermissionsDialog(true);
  };

  const handleDeleteModule = () => {
    if (!selectedModule) {
      alert("Selecciona un módulo primero");
      return;
    }
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar el módulo ${selectedModule} del rol ${selectedRoleName}?`);
    if (confirmDelete) {
      setCurrentModules(prev => prev.filter(m => m.moduleName !== selectedModule));
      setModulesToRemove(prev => [...prev, selectedModule]);
    }
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
      modulesToRemove: modulesToRemove,
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
            <select
              value={selectedRoleName}
              onChange={(e) => setSelectedRoleName(e.target.value)}
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Módulos:</label>
            <div className="module-actions">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
              >
                <option value="">Seleccione un módulo</option>
                {modules.map((module, index) => (
                  <option key={index} value={module}>
                    {module}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleModifyPermissions}
                className="modify-button"
              >
                Modificar Permisos
              </button>
              <button
                type="button"
                onClick={handleDeleteModule}
                className="delete-button"
              >
                Eliminar Módulo
              </button>
            </div>
          </div>

          {showPermissionsDialog && (
            <div className="permissions-dialog">
              <h3>Permisos para {selectedModule}</h3>
              <div className="permissions-list">
                {['CREATE', 'READ', 'UPDATE', 'DELETE'].map((perm) => (
                  <label key={perm} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, perm]);
                        } else {
                          setSelectedPermissions(
                            selectedPermissions.filter((p) => p !== perm)
                          );
                        }
                      }}
                    />
                    {perm}
                  </label>
                ))}
              </div>
              <div className="dialog-buttons">
                <button
                  type="button"
                  onClick={() => {
                    const newModule = {
                      moduleName: selectedModule,
                      permissions: selectedPermissions,
                    };
                    setCurrentModules((prev) => {
                      const exists = prev.some(
                        (m) => m.moduleName === selectedModule
                      );
                      if (exists) {
                        return prev.map((m) =>
                          m.moduleName === selectedModule ? newModule : m
                        );
                      }
                      return [...prev, newModule];
                    });
                    setShowPermissionsDialog(false);
                  }}
                  className="save-button"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowPermissionsDialog(false)}
                  className="cancel-button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="current-modules">
            <h3>Módulos asignados:</h3>
            {currentModules.map((mod, index) => (
              <div key={index} className="module-item">
                <div className="module-header">
                  <span className="module-name">{mod.moduleName}</span>
                  <div className="module-permissions">
                    {mod.permissions.join(', ')}
                  </div>
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