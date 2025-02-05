import React, { useState } from 'react';

const EditarReporte = () => {
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/api/reportes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        })
        .then(response => response.json())
        .then(() => alert('Reporte actualizado correctamente'))
        .catch(error => console.error('Error al actualizar reporte:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Reporte</h2>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID del reporte" />
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nuevo nombre" />
            <button type="submit">Actualizar</button>
        </form>
    );
};

export default EditarReporte;