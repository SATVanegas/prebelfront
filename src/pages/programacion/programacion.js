import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import './programacion.css'

const WeeklyPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showUserSelect, setShowUserSelect] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);

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

  // Cargar tareas desde el backend con filtro de usuario o rol
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let url = "http://localhost:8080/api/weeklycalendar";

        // Verificar si se ha seleccionado un usuario o un rol
        const filter = {
          userName: selectedUser ? selectedUser.value : null,
          roleName: selectedRole ? selectedRole.value : null,
        };

        // Si hay filtro, lo enviamos en el cuerpo de la solicitud
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filter),
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Error al cargar las tareas");
        }
      } catch (err) {
        console.error("Error al cargar las tareas:", err);
        setError("Error al cargar las tareas");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedUser, selectedRole]); // Dependiendo de las selecciones de usuario o rol


  // Función para manejar los cambios en el formulario de tarea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Función para manejar el cambio de usuario o rol
  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
    setNewTask((prevTask) => ({
      ...prevTask,
      assignedTo: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
    setNewTask((prevTask) => ({
      ...prevTask,
      assignedTo: selectedOption ? selectedOption.value : "",
    }));
  };

  // Función para agregar nueva tarea
  const handleAddTask = (e) => {
    e.preventDefault();
    const { title, description, startDateTime, endDateTime, assignedTo } = newTask;
    if (!title || !description || !startDateTime || !endDateTime || !assignedTo) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Enviar la nueva tarea al backend
    fetch("http://localhost:8080/api/weeklycalendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setNewTask({
          title: "",
          description: "",
          startDateTime: "",
          endDateTime: "",
          assignedTo: "",
        });
      })
      .catch((err) => {
        console.error("Error al agregar tarea:", err);
        setError("Error al agregar tarea");
      });
  };

  const userOptions = users.map((user) => ({
    value: user,
    label: user,
  }));

  const roleOptions = roles.map((role) => ({
    value: role,
    label: role,
  }));

  const navigate = useNavigate();

  return (
    <div className="weekly-planner-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          🔙 Atrás
        </button>
        <button className="nav-btn" onClick={() => navigate('/')}>
          🏠 Inicio
        </button>
      </div>


      <form onSubmit={handleAddTask} className="task-card">
        <h1 className="title">Calendario Semanal</h1>

        {loading ? (
          <p>Cargando tareas...</p>
        ) : error ? (
          <p>{error}</p>
        ) : tasks.length === 0 ? (
          <p>No se han registrado tareas. Añadir una nueva tarea a continuación:</p>
        ) : (
          <div>
            <ul>
              {tasks.map((task) => (
                <li key={task.id} className="task-card">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>
                    {task.startDateTime ? newTask.startDateTime = new Date(newTask.startDateTime).toISOString() : "Fecha no válida"} -{" "}
                    {task.endDateTime ? newTask.endDateTime = new Date(newTask.endDateTime).toISOString() : "Fecha no válida"}
                  </p>
                  <p>Asignado a: {task.assignedTo}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <h3>Añadir Nueva Tarea</h3>
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Fecha y Hora de Inicio:</label>
          <input
            type="datetime-local"
            name="startDateTime"
            value={newTask.startDateTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Fecha y Hora de Fin:</label>
          <input
            type="datetime-local"
            name="endDateTime"
            value={newTask.endDateTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="select-container">
          <button type="button" className="primary-btn" onClick={() => setShowUserSelect(!showUserSelect)}>
            Agregar por Usuario
          </button>
          {showUserSelect && (
            <Select
              options={userOptions}
              value={selectedUser}
              onChange={handleUserChange}
              placeholder="Buscar Usuario"
              isSearchable
            />
          )}

          <button type="button" className="primary-btn" onClick={() => setShowRoleSelect(!showRoleSelect)}>
            Agregar por Rol
          </button>
          {showRoleSelect && (
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={handleRoleChange}
              placeholder="Buscar Rol"
              isSearchable
            />
          )}
        </div>

        <button type="submit" className="primary-btn">Añadir Tarea</button>
      </form>
    </div>
  );
};

export default WeeklyPlanner;