import React, { useState, useEffect } from 'react';
import { FiCheckSquare, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './ModificarPermisos.css';
import Select from "react-select";

const ModificarPermisos = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoleName, setSelectedRoleName] = useState('');
  const [modules, setModules] = useState([]);
  const [currentModules, setCurrentModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [expandedModule, setExpandedModule] = useState('');
  const [message, setMessage] = useState('');
  const [modulesToRemove, setModulesToRemove] = useState([]);


  const roleOptions = roles.map((role) => ({
    value: role,
    label: role,
  }));
  
  const moduleOptions = modules.map((module) => ({
    value: module,
    label: module,
  }));

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

  const handleDeleteModule = () => {
    if (!selectedModule) {
      alert("Selecciona un módulo primero");
      return;
    }
    
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar el módulo ${selectedModule} del rol ${selectedRoleName}?`);
    
    if (confirmDelete) {
      setCurrentModules(prev => {
        const updated = prev.filter(m => m.moduleName !== selectedModule);
        setMessage(<span className="succes">Módulo {selectedModule} eliminado exitosamente del rol {selectedRoleName}</span>);
        return updated;
      });
      
      setModulesToRemove(prev => [...prev, selectedModule]);
      setSelectedModule('');
    }
  };

  const addModule = () => {
    if (selectedModule && !currentModules.some(mod => mod.moduleName === selectedModule)) {
      setCurrentModules([...currentModules, { moduleName: selectedModule, permissions: [] }]);
      setExpandedModule(selectedModule);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRoleName) {
      setMessage('Selecciona un rol primero');
      return;
    }

    if (!selectedModule || !modulesToRemove) {
      setMessage('Seleccione un módulo para añadir o eliminar');
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
        setMessage(<span className="succes">Permisos actualizados correctamente</span>);
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión con el servidor');
    }
  };

  const togglePermission = (moduleName, permission) => {
    setCurrentModules(prevModules =>
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

  const handleExpandModule = (moduleName) => {
    setExpandedModule(expandedModule === moduleName ? '' : moduleName); 
  };

  const navigate = useNavigate();

  return (
    <div className="modificar-permisos-container">
      
       <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          🔙 Atrás
        </button>
        <button className="nav-btn" onClick={() => navigate('/')}> 
          🏠 Inicio
        </button>
      </div>

      <div className="modificar-permisos-card">
        <h2 className='title'>Modificar Permisos de Rol</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rol:</label>
            <Select
    options={roleOptions}
    value={roleOptions.find(option => option.value === selectedRoleName)}
    onChange={(option) => setSelectedRoleName(option ? option.value : '')}
    placeholder="Seleccione un rol"
    isSearchable
    className="select-container"
    classNamePrefix="react-select"
    styles={{
      control: (base) => ({
        ...base,
        minHeight: '40px',
        boxShadow: 'none',
      }),
      valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#3a8dde' : base.backgroundColor,
        '&:hover': {
          backgroundColor: '#BDDCF5',
        }
      }),
      singleValue: (base) => ({
        ...base,
        color: '#3a8dde',
      })
    }}
  />
</div>

          <div className="module-selector">
      <div className="selector-header">
        <h3 className="section-title">Módulos del Rol</h3>
        <div className="selector-controls">
        <Select
    options={moduleOptions}
    value={moduleOptions.find(option => option.value === selectedModule)}
    onChange={(option) => setSelectedModule(option ? option.value : '')}
    placeholder="Selecciona un módulo"
    isSearchable
    className="select-container"
    classNamePrefix="react-select"
    styles={{
      control: (base) => ({
        ...base,
        minHeight: '40px',
        boxShadow: 'none',
      }),
      valueContainer: (base) => ({
        ...base,
        padding: '0 8px',
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? '#3a8dde' : base.backgroundColor,
        '&:hover': {
          backgroundColor: '#BDDCF5',
        }
      }),
      singleValue: (base) => ({
        ...base,
        color: '#3a8dde',
      })
    }}
  />
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

      {currentModules.length > 0 && (
        <div className="selected-modules">
          {currentModules.map((mod, index) => (
            <div key={index} className="module-card">
              <div className="module-header">
                <h4 className="module-title">{mod.moduleName}</h4>
                <div className="module-actions">
                  <button
                    type="button"
                    onClick={() => handleExpandModule(mod.moduleName)}
                    className="edit-btn"
                  >
                    <FiEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteModule(mod.moduleName)}
                    className="delete-btn"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              {expandedModule === mod.moduleName && (
                <div className="permissions-grid">
                  {['CREATE', 'READ', 'UPDATE', 'DELETE'].map((perm) => (
                    <button
                      key={perm}
                      type="button"
                      className={`permission-btn ${
                        mod.permissions.includes(perm) ? 'active' : ''
                      }`}
                      onClick={() => togglePermission(mod.moduleName, perm)}
                    >
                      <FiCheckSquare className="check-icon" />
                      {perm}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    <div className='guardar-container'>
    <button type="submit" className="primary-btn">
      Guardar Cambios
    </button>
    {message && <p className="message">{message}</p>}
    </div>
  </form>
</div>
</div>
  );
};

export default ModificarPermisos;