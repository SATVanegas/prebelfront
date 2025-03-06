import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AnadirProgramacion.css';
import Select from 'react-select';


const AnadirProgramacion = () => {
    const [date, setDate] = useState(new Date());
    const [day, setDay] = useState('LUNES');
    const [technicianId, setTechnicianId] = useState('');
    const [assignedRoleId, setAssignedRoleId] = useState('');
    const [schedule, setSchedule] = useState('');
    const [info, setInfo] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [technicians, setTechnicians] = useState([]);
    const [roles, setRoles] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const formRef = useRef(null);
    const navigate = useNavigate();
    const defaultWeeklyCalendarId = 1;

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
                    console.log("Roles recibidos:", data);
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
                console.log(`Consultando técnicos para el rol: ${roleName}`);
                const response = await fetch(`http://localhost:8080/api/users/by-role/${roleName}`);
    
                if (response.ok) {
                    const data = await response.json();
                    console.log("Técnicos recibidos:", data);
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

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (e) => {
        const newDateStr = e.target.value;
        const newDate = new Date(newDateStr + 'T00:00:00');

        if (newDate.getDay() === 0) { 
            setMessage('El domingo no es un día válido para programar. Por favor seleccione otro día.');
            setStatus('error');
        } else {
            setDate(newDate);
            updateDayOfWeek(newDate);
            if (message.includes('domingo')) {
                setMessage('');
                setStatus('');
            }
        }
    };

    const updateDayOfWeek = (date) => {
        const dayOfWeek = date.getDay();
        const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
        setDay(dayNames[dayOfWeek]);
    };

    useEffect(() => {
        updateDayOfWeek(date);
    }, []);

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

        if (assignedRoleId) {
            const availableSchedules = getSchedulesByRole();
            setSchedules(availableSchedules);
            setSchedule('');
        } else {
            setSchedules([]);
        }
    }, [assignedRoleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!technicianId || !assignedRoleId || !schedule) {
            setMessage('Por favor complete todos los campos requeridos');
            setStatus('error');
            return;
        }

        if (date.getDay() === 0) {
            setMessage('No se puede programar en domingo. Por favor seleccione otro día.');
            setStatus('error');
            return;
        }

        const roleId = roleNameToId[assignedRoleId];
        if (!roleId) {
            setMessage('Rol no válido');
            setStatus('error');
            return;
        }

        const technicianScheduleData = {
            date: date.toISOString(),
            day,
            technicianId: parseInt(technicianId),
            assignedRoleId: roleId,
            schedule,
            info,
            weeklyCalendarId: defaultWeeklyCalendarId,
        };

        try {
            console.log("Enviando datos de programación:", technicianScheduleData);
            const response = await fetch('http://localhost:8080/api/weeklyplanner/techniciansschedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(technicianScheduleData),
            });

            if (response.ok) {
                setMessage('Programación creada exitosamente');
                setStatus('success');
                setSchedule('');
                setInfo('');
                setTechnicianId('');
            } else {
                const errorText = await response.text();
                console.error(`Error al crear programación: ${errorText}`);
                setMessage(`Error al crear la programación: ${errorText}`);
                setStatus('error');
            }
        } catch (error) {
            console.error('Error al crear la programación:', error);
            setMessage('Error en la conexión con el servidor.');
            setStatus('error');
        }
    };

    return (
        <div className="create-schedule-container">
            <div className="nav-container">
                <button className="nav-btn" onClick={() => navigate(-1)}>
                    🔙 Atrás
                </button>
                <button className="nav-btn" onClick={() => navigate('/')}>
                    🏠 Inicio
                </button>
            </div>
            <div className="create-schedule-card">
                <h2 className="title">Añadir Programación</h2>

                {message && (
                    <div className={`status-message ${status}`}>
                        {message}
                    </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>Fecha:</label>
                        <input
                            type="date"
                            value={formatDateForInput(date)}
                            onChange={handleDateChange}
                            required
                        />
                        <small className="form-help">No se permite seleccionar domingo</small>
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
                        <small className="form-help">Se actualiza automáticamente según la fecha seleccionada</small>
                    </div>
                    <div className="form-group">
                        <label>Rol Asignado:</label>
                        <Select
                            options={roles.map(roleName => ({
                                value: roleName,
                                label: roleName
                            }))}
                            value={roles.map(roleName => ({
                                value: roleName,
                                label: roleName
                            })).find(option => option.value === assignedRoleId)}
                            onChange={(option) => setAssignedRoleId(option ? option.value : '')}
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
                    <div className="form-group">
                        <label>Técnico:</label>
                        <Select
                            options={technicians.map(tech => ({
                                value: tech.id,
                                label: tech.name
                            }))}
                            value={technicians.map(tech => ({
                                value: tech.id,
                                label: tech.name
                            })).find(option => option.value === technicianId)}
                            onChange={(option) => setTechnicianId(option ? option.value : '')}
                            placeholder="Seleccione un técnico"
                            isSearchable
                            isDisabled={technicians.length === 0}
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
                        {technicians.length === 0 && assignedRoleId && (
                            <small className="form-help error">No hay técnicos disponibles para este rol</small>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Horario:</label>
                        <Select
                            options={schedules.map(scheduleOption => ({
                                value: scheduleOption,
                                label: scheduleOption
                            }))}
                            value={schedules.map(scheduleOption => ({
                                value: scheduleOption,
                                label: scheduleOption
                            })).find(option => option.value === schedule)}
                            onChange={(option) => setSchedule(option ? option.value : '')}
                            placeholder="Seleccione un horario"
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
                    <div className="form-group">
                        <label>Información adicional:</label>
                        <textarea className="input-field"
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                            placeholder="Ingrese información adicional sobre la programación"
                            rows={4}
                        />
                    </div>
                    <button type="submit" className="primary-btn">Crear Programación</button>
                </form>
            </div>
        </div>
    );
};

export default AnadirProgramacion;