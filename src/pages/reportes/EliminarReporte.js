import React, { useState } from 'react';

const EliminarReporte = () => {
    const [id, setId] = useState('');

    const handleDelete = () => {
        fetch(`/api/reportes/${id}`, {
            method: 'DELETE'
        })
        .then(() => alert('Reporte eliminado correctamente'))
        .catch(error => console.error('Error al eliminar reporte:', error));
    };

    return (
        <div>
            <h2>Eliminar Reporte</h2>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID del reporte" />
            <button onClick={handleDelete}>Eliminar</button>
        </div>
    );
};

export default EliminarReporte;
