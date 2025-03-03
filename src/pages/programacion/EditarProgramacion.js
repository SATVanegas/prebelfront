import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditarProgramacion.css'; 

const EditarProgramacion = () => {
    const [roles, setRoles] = useState([]);
    const [assignedRoleId, setAssignedRoleId] = useState('');
    const [technicians, setTechnicians] = useState([]);
    const [technicianId, setTechnicianId] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    const roleNameToId = {
        "PACK_TECH": 3,
        "LAB_TECH": 5,
        "STAB_TECH": 6,
    };

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

    useEffect(() => {
        const fetchSchedulesByTechnician = async () => {
            if (!technicianId) return;
            try {
                const response = await fetch(`http://localhost:8080/api/weeklyplanner/techniciansschedule/technician/${technicianId}`);
                if (response.ok) {
                    const data = await response.json();
                    setSchedules(data);
                    setFilteredSchedules(data); 
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

    useEffect(() => {
        if (selectedDate) {
            const filtered = schedules.filter(schedule => {
                const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
                const selectedDateFormatted = selectedDate.toISOString().split('T')[0];
                return scheduleDate === selectedDateFormatted;
            });
            setFilteredSchedules(filtered);
        } else {
            setFilteredSchedules(schedules);
        }
    }, [selectedDate, schedules]);

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
                setSchedules(schedules.filter(schedule => schedule.id !== scheduleId)); 
                setFilteredSchedules(filteredSchedules.filter(schedule => schedule.id !== scheduleId)); 
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

    const getDatesWithSchedules = () => {
        return schedules.map(schedule => new Date(schedule.date).toISOString().split('T')[0]);
    };

    const renderCalendar = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const datesWithSchedules = getDatesWithSchedules();

        const calendarDays = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
            const hasSchedule = datesWithSchedules.includes(date);
            calendarDays.push(
                <div
                    key={day}
                    className={`calendar-day ${hasSchedule ? 'highlighted' : ''} ${selectedDate && date === selectedDate.toISOString().split('T')[0] ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                >
                    {day}
                </div>
            );
        }

        return calendarDays;
    };

    const changeMonth = (offset) => {
        const newMonth = currentMonth + offset;
        if (newMonth < 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else if (newMonth > 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(newMonth);
        }
    };

    const changeYear = (offset) => {
        setCurrentYear(currentYear + offset);
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
            <div className="planner-card">
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
                    <div className="form-group">
                        <label>Calendario:</label>
                        <div className="calendar">
                            <div className="calendar-header">
                                <button onClick={() => changeYear(-1)}>«</button>
                                <button onClick={() => changeMonth(-1)}>‹</button>
                                <span>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                <button onClick={() => changeMonth(1)}>›</button>
                                <button onClick={() => changeYear(1)}>»</button>
                            </div>
                            <div className="calendar-grid">
                                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                                    <div key={day} className="calendar-day-header">{day}</div>
                                ))}
                                {renderCalendar()}
                            </div>
                        </div>
                    </div>
                </div>
                {filteredSchedules.length > 0 && (
                    <div className="schedules-table">
                        <h3>Programaciones del Técnico</h3>
                        <table className='schedules'>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Día</th>
                                    <th>Horario</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td>{new Date(schedule.date).toLocaleDateString()}</td>
                                        <td>{schedule.day}</td>
                                        <td>{schedule.schedule}</td>
                                        <td>{schedule.info}</td>
                                        <td>
                                            <button className="delete-btn" onClick={() => handleDelete(schedule.id)}> Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditarProgramacion;