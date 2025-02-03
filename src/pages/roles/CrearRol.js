import React, { useState, useEffect } from 'react';
import './CrearRol.css';

const CrearRol = () => {
  const [roleName, setRoleName] = useState('');
  const [modules, setModules] = useState([]); // Lista de módulos obtenidos del backend
  const [selectedModules, setSelectedModules] = useState([]); // Módulos seleccionados con permisos
  const [selectedModule, setSelectedModule] = useState(''); // Módulo seleccionado en el desplegable
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  // Obtener la lista de módulos desde el backend
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/modules'); 
        if (response.ok) {
          const data = await response.json(); // Recibe un array de strings
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

  // Agregar un módulo con permisos por defecto
  const addModule = () => {
    if (selectedModule && !selectedModules.some(mod => mod.moduleName === selectedModule)) {
      setSelectedModules([...selectedModules, { moduleName: selectedModule, permissions: [] }]);
    }
  };

  // Manejar cambios en los permisos
  const togglePermission = (moduleName, permission) => {
    setSelectedModules(prevModules =>
      prevModules.map(mod =>
        mod.moduleName === moduleName
          ? {
              ...mod,
              permissions: mod.permissions.includes(permission)
                ? mod.permissions.filter(p => p !== permission) // Quitar permiso si ya está seleccionado
                : [...mod.permissions, permission] // Agregar permiso si no está seleccionado
            }
          : mod
      )
    );
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedModules.length === 0) {
      alert("Debes añadir al menos un módulo con permisos.");
      return;
    }

    const roleRequest = {
      roleName,
      description,
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
        if (description) {
          setDescription('');
        }
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

  return (
    <div className="crear-rol-container">
      <div className="crear-rol-card">
        <h2>Crear Rol</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rol:</label>
            <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} required />
          </div>
          <div className="form-group">
          <label>Descripción:</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
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
