import React, { useState } from 'react';

const AnadirReporte = () => {
    const [reporte, setReporte] = useState({ nombre: '', inspecciones: [] });

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/reportes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reporte)
        })
        .then(response => response.json())
        .then(() => alert('Reporte añadido correctamente'))
        .catch(error => console.error('Error al añadir reporte:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Añadir Reporte</h2>
            <input type="text" value={reporte.nombre} onChange={(e) => setReporte({ ...reporte, nombre: e.target.value })} placeholder="Nombre del reporte" />
            <button type="submit">Añadir</button>
        </form>
    );
};

export default AnadirReporte;