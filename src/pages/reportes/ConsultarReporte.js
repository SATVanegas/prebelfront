import React, { useState } from 'react';

const ConsultarReporte = () => {
  const [reporteId, setReporteId] = useState('');
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState('');

  const buscarReporte = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reportes/${reporteId}`);
      if (!response.ok) {
        throw new Error('Reporte no encontrado');
      }
      const data = await response.json();
      setReporte(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setReporte(null);
    }
  };

  return (
    <div>
      <h2>Consultar Reporte</h2>
      <input
        type="text"
        placeholder="Ingrese el ID del reporte"
        value={reporteId}
        onChange={(e) => setReporteId(e.target.value)}
      />
      <button onClick={buscarReporte}>Buscar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reporte && (
        <div>
          <h3>Detalles del Reporte</h3>
          <p><strong>ID:</strong> {reporte.id}</p>
          <p><strong>Nombre del Producto:</strong> {reporte.nombreProducto}</p>
          <h4>Inspecciones:</h4>
          <ul>
            {reporte.inspecciones.map((inspeccion) => (
              <li key={inspeccion.id}>
                <p><strong>Inspección ID:</strong> {inspeccion.id}</p>
                <p><strong>Descripción:</strong> {inspeccion.descripcion}</p>
                <h5>Tests:</h5>
                <ul>
                  {inspeccion.tests.map((test) => (
                    <li key={test.id}>
                      <p><strong>Test ID:</strong> {test.id}</p>
                      <p><strong>Resultado:</strong> {test.resultado}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConsultarReporte;