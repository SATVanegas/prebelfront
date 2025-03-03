import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConsultarMatriz.css'; 

const ConsultarMatriz = () => {
    const [inspecciones, setInspecciones] = useState([]);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [filteredInspecciones, setFilteredInspecciones] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProximasInspecciones = async () => {
            try {
                const response = await fetch('http://localhost:8080/inspections/upcoming');
                if (response.ok) {
                    const data = await response.json();
                    
                    const sortedData = data.sort((a, b) => new Date(a.expectedDate) - new Date(b.expectedDate));
                    
                    setInspecciones(sortedData);
                    setFilteredInspecciones(sortedData);
                    
                    if (data.length === 0) {
                        setMessage('No hay inspecciones programadas para los próximos 7 días.');
                        setStatus('warning');
                    } else {
                        setMessage('');
                        setStatus('');
                    }
                } else {
                    const errorText = await response.text();
                    console.error(`Error al obtener inspecciones: ${errorText}`);
                    setMessage(`Error: ${errorText}`);
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error al obtener inspecciones:', error);
                setMessage('Error en la conexión con el servidor.');
                setStatus('error');
            }
        };
        
        fetchProximasInspecciones();
    }, []);

    useEffect(() => {

        const applyFilters = () => {
            let filtered = [...inspecciones];
            
            if (selectedDate) {
                const filterDate = selectedDate.toISOString().split('T')[0];
                filtered = filtered.filter(inspeccion => {
                    const inspeccionDate = new Date(inspeccion.expectedDate).toISOString().split('T')[0];
                    return inspeccionDate === filterDate;
                });
            }
            
            setFilteredInspecciones(filtered);
        };
        
        applyFilters();
    }, [selectedDate, inspecciones]);

    const clearFilters = () => {
        setSelectedDate(null);
        setFilteredInspecciones(inspecciones);
    };

    const getDatesWithInspections = () => {
        return inspecciones.map(inspeccion => new Date(inspeccion.expectedDate).toISOString().split('T')[0]);
    };

    const renderCalendar = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const datesWithInspections = getDatesWithInspections();
        const calendarDays = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
            const hasInspection = datesWithInspections.includes(date);
            calendarDays.push(
                <div
                    key={day}
                    className={`calendar-day ${hasInspection ? 'highlighted' : ''} ${selectedDate && date === selectedDate.toISOString().split('T')[0] ? 'selected' : ''}`}
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

    const getStatusClass = (expectedDate) => {
        const today = new Date();
        const expected = new Date(expectedDate);
        const diffTime = expected - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'status-late';
        if (diffDays === 0) return 'status-today';
        if (diffDays <= 2) return 'status-soon';
        return 'status-upcoming';
    };

    const getStatusText = (expectedDate) => {
        const today = new Date();
        const expected = new Date(expectedDate);
        const diffTime = expected - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Atrasada';
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Mañana';
        return `En ${diffDays} días`;
    };

    return (
        <div className="inspecciones-container">
            <div className="nav-container">
                <button className="nav-btn" onClick={() => navigate(-1)}>
                    🔙 Atrás
                </button>
                <button className="nav-btn" onClick={() => navigate('/')}>
                    🏠 Inicio
                </button>
            </div>
            
            <div className="inspecciones-card">
                <h2 className="title">Próximas Inspecciones</h2>
                
                {message && (
                    <div className={`status-message ${status}`}>
                        {message}
                    </div>
                )}
                
                <div className="filters-container">
                    <button className="filter-btn" onClick={clearFilters}>
                        Limpiar Filtros
                    </button>
                </div>
                
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
                
                {filteredInspecciones.length > 0 ? (
                    <div className="inspecciones-timeline">
                        {filteredInspecciones.map((inspeccion) => (
                            <div 
                                key={inspeccion.id} 
                                className={`timeline-item ${getStatusClass(inspeccion.expectedDate)}`}
                            >
                                <div className="timeline-item-header">
                                    <span className={`status-badge ${getStatusClass(inspeccion.expectedDate)}`}>
                                        {getStatusText(inspeccion.expectedDate)}
                                    </span>
                                </div>
                                
                                <div className="timeline-item-details">
                                    <p><strong>Fecha Esperada:</strong> {new Date(inspeccion.expectedDate).toLocaleString()}</p>
                                    {inspeccion.realDate && (
                                        <p><strong>Fecha Real:</strong> {new Date(inspeccion.realDate).toLocaleString()}</p>
                                    )}
                                    <p><strong>Tiempo de Respuesta:</strong> {inspeccion.responseTime} minutos</p>
                                </div>
                                
                                <div className="timeline-item-conditions">
                                    <h4>Condiciones:</h4>
                                    <div className="conditions-grid">
                                        {inspeccion.aerosolStove > 0 && (
                                            <div className="condition">
                                                <span className="condition-name">Estufa Aerosol:</span>
                                                <span className="condition-value">{inspeccion.aerosolStove}</span>
                                            </div>
                                        )}
                                        {inspeccion.environment > 0 && (
                                            <div className="condition">
                                                <span className="condition-name">Ambiente:</span>
                                                <span className="condition-value">{inspeccion.environment}</span>
                                            </div>
                                        )}
                                        {inspeccion.fridge > 0 && (
                                            <div className="condition">
                                                <span className="condition-name">Refrigerador:</span>
                                                <span className="condition-value">{inspeccion.fridge}</span>
                                            </div>
                                        )}
                                        {inspeccion.hrStove > 0 && (
                                            <div className="condition">
                                                <span className="condition-name">Estufa HR:</span>
                                                <span className="condition-value">{inspeccion.hrStove}</span>
                                            </div>
                                        )}
                                        {inspeccion.inOut > 0 && (
                                            <div className="condition">
                                                <span className="condition-name">Interior/Exterior:</span>
                                                <span className="condition-value">{inspeccion.inOut}</span>
                                            </div>
                                        )}
                                        {inspeccion.photolysis > 0 && (
                                            <div className="condition">
                                                <span className="condition-name">Fotólisis:</span>
                                                <span className="condition-value">{inspeccion.photolysis}</span>
                                            </div>
                                        )}
                                        {inspeccion.stove > 0 && (
                                            <div className="condition">
                                                <span className="condition-name">Estufa:</span>
                                                <span className="condition-value">{inspeccion.stove}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        No se encontraron inspecciones con los filtros seleccionados.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultarMatriz;