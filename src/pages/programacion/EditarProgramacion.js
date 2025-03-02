import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditarProgramacion.css'; // Reutiliza los estilos de AnadirProgramacion

const EditarProgramacion = () => {
    const [roles, setRoles] = useState([]);
    const [assignedRoleId, setAssignedRoleId] = useState('');
    const [technicians, setTechnicians] = useState([]);
    const [technicianId, setTechnicianId] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const navigate = useNavigate();

    // Mapeo de roles a IDs (debe coincidir con el backend)
    const roleNameToId = {
        "PACK_TECH": 3,
        "LAB_TECH": 5,
        "STAB_TECH": 6,
    };

    // Obtener roles disponibles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/roles');
                if (response.ok) {
                    const data = await response.json();
                    const specificRoles = ["PACK_TECH", "LAB_TECH", "STAB_TECH"];
                    const filteredRoles = data.filter(roleName => specificRoles.includes(roleName));
                    setRoles(filteredRoles);
                } else {
                    const errorText = await response.text();
                    console.error(`Error al obtener roles: ${errorText}`);
                    setMessage(`Error: ${errorText}`);
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error al obtener roles:', error);
                setMessage('Error en la conexión con el servidor.');
                setStatus('error');
            }
        };
        fetchRoles();
    }, []);

    // Obtener técnicos por rol
    useEffect(() => {
        const fetchTechniciansByRoleName = async (roleName) => {
            if (!roleName) return;

            try {
                const response = await fetch(`http://localhost:8080/api/users/by-role/${roleName}`);
                if (response.ok) {
                    const data = await response.json();
                    setTechnicians(data);
                    if (data.length === 0) {
                        setMessage('No se encontraron técnicos con el rol seleccionado.');
                        setStatus('warning');
                    } else {
                        setMessage('');
                        setStatus('');
                    }
                } else {
                    const errorText = await response.text();
                    console.error(`Error al obtener técnicos: ${errorText}`);
                    setMessage('Error: No se pudieron cargar los técnicos.');
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error al obtener técnicos:', error);
                setMessage('Error en la conexión con el servidor.');
                setStatus('error');
            }
        };

        if (assignedRoleId) {
            fetchTechniciansByRoleName(assignedRoleId);
        } else {
            setTechnicians([]);
        }
    }, [assignedRoleId]);

    // Obtener programaciones del técnico seleccionado
    useEffect(() => {
        const fetchSchedulesByTechnician = async () => {
            if (!technicianId) return;

            try {
                const response = await fetch(`http://localhost:8080/api/weeklyplanner/techniciansschedule/technician/${technicianId}`);
                if (response.ok) {
                    const data = await response.json();
                    setSchedules(data);
                } else {
                    const errorText = await response.text();
                    console.error(`Error al obtener programaciones: ${errorText}`);
                    setMessage(`Error: ${errorText}`);
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error al obtener programaciones:', error);
                setMessage('Error en la conexión con el servidor.');
                setStatus('error');
            }
        };

        fetchSchedulesByTechnician();
    }, [technicianId]);

    // Función para eliminar una programación
    const handleDelete = async (scheduleId) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta programación?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/weeklyplanner/techniciansschedule/${scheduleId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage('Programación eliminada exitosamente');
                setStatus('success');
                setSchedules(schedules.filter(schedule => schedule.id !== scheduleId)); // Actualizar la lista
            } else {
                const errorText = await response.text();
                console.error(`Error al eliminar programación: ${errorText}`);
                setMessage(`Error: ${errorText}`);
                setStatus('error');
            }
        } catch (error) {
            console.error('Error al eliminar la programación:', error);
            setMessage('Error en la conexión con el servidor.');
            setStatus('error');
        }
    };

    // Función para editar una programación
    const handleEdit = (schedule) => {
        setIsEditing(true);
        setEditingSchedule(schedule);
    };

    // Función para guardar los cambios de la edición
    const handleSaveEdit = async (updatedSchedule) => {
        try {
            const response = await fetch(`http://localhost:8080/api/weeklyplanner/techniciansschedule/${updatedSchedule.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSchedule),
            });
            if (response.ok) {
                setMessage('Programación actualizada exitosamente');
                setStatus('success');
                setIsEditing(false);
                setEditingSchedule(null);
                setSchedules(schedules.map(schedule => 
                    schedule.id === updatedSchedule.id ? updatedSchedule : schedule
                )); // Actualizar la lista
            } else {
                const errorText = await response.text();
                console.error(`Error al actualizar programación: ${errorText}`);
                setMessage(`Error: ${errorText}`);
                setStatus('error');
            }
        } catch (error) {
            console.error('Error al actualizar la programación:', error);
            setMessage('Error en la conexión con el servidor.');
            setStatus('error');
        }
    };

    return (
        <div className="planner-container">
            <div className="nav-container">
                <button className="nav-btn" onClick={() => navigate(-1)}>
                    🔙 Atrás
                </button>
                <button className="nav-btn" onClick={() => navigate('/')}>
                    🏠 Inicio
                </button>
            </div>
            <div className="crear-usuario-card">
                <h2 className="title">Buscar Programación</h2>
                {message && (
                    <div className={`status-message ${status}`}>
                        {message}
                    </div>
                )}
                <div className="form">
                    <div className="form-group">
                        <label>Rol Asignado:</label>
                        <select
                            value={assignedRoleId}
                            onChange={(e) => setAssignedRoleId(e.target.value)}
                            required
                        >
                            <option value="">Seleccione un rol</option>
                            {roles.map((roleName, index) => (
                                <option key={index} value={roleName}>
                                    {roleName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Técnico:</label>
                        <select
                            value={technicianId}
                            onChange={(e) => setTechnicianId(e.target.value)}
                            required
                            disabled={technicians.length === 0}
                        >
                            <option value="">Seleccione un técnico</option>
                            {technicians.map((technician) => (
                                <option key={technician.id} value={technician.id}>
                                    {technician.name}
                                </option>
                            ))}
                        </select>
                        {technicians.length === 0 && assignedRoleId && (
                            <small className="form-help error">No hay técnicos disponibles para este rol</small>
                        )}
                    </div>
                </div>
                {schedules.length > 0 && (
                    <div className="schedules-list">
                        <h3>Programaciones del Técnico</h3>
                        {schedules.map((schedule) => (
                            <div key={schedule.id} className="schedule-item">
                                <p><strong>Fecha:</strong> {new Date(schedule.date).toLocaleDateString()}</p>
                                <p><strong>Día:</strong> {schedule.day}</p>
                                <p><strong>Horario:</strong> {schedule.schedule}</p>
                                <p><strong>Descripción:</strong> {schedule.info}</p>
                                <div className="schedule-actions">
                                    <button className="edit-btn" onClick={() => handleEdit(schedule)}> Editar</button>
                                    <button className="delete-btn" onClick={() => handleDelete(schedule.id)}> Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {isEditing && (
                    <EditScheduleModal
                        schedule={editingSchedule}
                        onSave={handleSaveEdit}
                        onCancel={() => setIsEditing(false)}
                        assignedRoleId={assignedRoleId}
                    />
                )}
            </div>
        </div>
    );
};

export default EditarProgramacion;

// Componente para editar programación (modal)
const EditScheduleModal = ({ schedule, onSave, onCancel, assignedRoleId }) => {
    const [date, setDate] = useState(new Date(schedule.date));
    const [day, setDay] = useState(schedule.day);
    const [scheduleTime, setScheduleTime] = useState(schedule.schedule);
    const [info, setInfo] = useState(schedule.info);
    const [schedules, setSchedules] = useState([]);

    // Actualizar el día de la semana cuando cambia la fecha
    const updateDayOfWeek = (date) => {
        const dayOfWeek = date.getDay();
        const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
        setDay(dayNames[dayOfWeek]);
    };

    // Obtener horarios según el rol
    useEffect(() => {
        const getSchedulesByRole = () => {
            if (!assignedRoleId) return [];
            switch (assignedRoleId) {
                case "PACK_TECH":
                    return ["7:00 am - 5:00 pm"];
                case "LAB_TECH":
                case "STAB_TECH":
                    return ["6:00 am - 2:00 pm", "2:00 pm - 10:00 pm"];
                default:
                    return [];
            }
        };
        setSchedules(getSchedulesByRole());
    }, [assignedRoleId]);

    // Formatear la fecha para el input
    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Manejar cambio de fecha
    const handleDateChange = (e) => {
        const newDateStr = e.target.value;
        const newDate = new Date(newDateStr + 'T00:00:00');
        if (newDate.getDay() === 0) { 
            alert('El domingo no es un día válido para programar. Por favor seleccione otro día.');
        } else {
            setDate(newDate);
            updateDayOfWeek(newDate);
        }
    };

    // Guardar cambios
    const handleSave = () => {
        const updatedSchedule = {
            ...schedule,
            date: date.toISOString(),
            day,
            schedule: scheduleTime,
            info,
        };
        onSave(updatedSchedule);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Editar Programación</h3>
                <div className="form-group">
                    <label>Fecha:</label>
                    <input
                        type="date"
                        value={formatDateForInput(date)}
                        onChange={handleDateChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Día de la semana:</label>
                    <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        disabled
                    >
                        <option value="LUNES">Lunes</option>
                        <option value="MARTES">Martes</option>
                        <option value="MIERCOLES">Miércoles</option>
                        <option value="JUEVES">Jueves</option>
                        <option value="VIERNES">Viernes</option>
                        <option value="SABADO">Sábado</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Horario:</label>
                    <select
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un horario</option>
                        {schedules.map((scheduleOption, index) => (
                            <option key={index} value={scheduleOption}>
                                {scheduleOption}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                    />
                </div>
                <div className="modal-actions">
                    <button onClick={handleSave}>Guardar</button>
                    <button onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};