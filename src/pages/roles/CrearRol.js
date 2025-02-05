import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrearRol.css';

const CrearRol = () => {
  const [roleName, setRoleName] = useState('');
  const [modules, setModules] = useState([]); 
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
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

  const navigate = useNavigate();

  return (
    <div className="crear-rol-container">
      
      <div className="nav-container">
        <button className="btn" onClick={() => navigate(-1)}>
          🔙 Atrás
        </button>
        <button className="btn" onClick={() => navigate('/')}> 
          🏠 Inicio
        </button>
      </div>

      <div className="crear-rol-card">
        <h2>Crear Rol</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rol:</label>
            <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} required />
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
            <button type="button" onClick={addModule}>Añadir Módulo</button>
          </div>

          {/* Lista de módulos seleccionados con permisos */}
          {selectedModules.length > 0 && (
            <div className="form-group">
              <h3>Módulos y permisos:</h3>
              {selectedModules.map((mod, index) => (
                <div key={index} className="module-permissions">
                  <h4>{mod.moduleName}</h4>
                  {['CREATE', 'READ', 'UPDATE', 'DELETE'].map((perm) => (
                    <label key={perm} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={mod.permissions.includes(perm)}
                        onChange={() => togglePermission(mod.moduleName, perm)}
                      />
                      {perm}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}

          <button type="submit">Crear Rol</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default CrearRol;
