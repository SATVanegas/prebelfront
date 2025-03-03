import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EnviarReporte = () => {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data);
                } else {
                    setMessage("Error al cargar productos.");
                    setStatus("error");
                }
            } catch (error) {
                setMessage("Error en la conexión con el servidor.");
                setStatus("error");
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const handleEnviarReporte = async () => {
        if (!productoSeleccionado || !email) {
            setMessage("Por favor, seleccione un producto e ingrese un email.");
            setStatus("warning");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/products/${productoSeleccionado}/send-report?email=${email}`, {
                method: 'GET',
            });

            if (response.ok) {
                setMessage("Reporte enviado exitosamente.");
                setStatus("success");
            } else {
                const errorText = await response.text();
                setMessage(`Error al enviar reporte: ${errorText}`);
                setStatus("error");
            }
        } catch (error) {
            setMessage("Error en la conexión con el servidor.");
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reportes-container">
            <div className="nav-container">
                <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
                <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
            </div>

            <div className="reportes-card">
                <h2 className="title">Enviar Reporte por Correo</h2>

                {message && <div className={`status-message ${status}`}>{message}</div>}

                <div className="form-container">
                    <div className="form-group">
                        <label htmlFor="producto">Seleccionar Producto:</label>
                        <select 
                            id="producto" 
                            value={productoSeleccionado} 
                            onChange={(e) => setProductoSeleccionado(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">-- Seleccione un producto --</option>
                            {productos.map(producto => (
                                <option key={producto.id} value={producto.id}>
                                    {producto.productDescription} - {producto.brand}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Ingrese el email"
                            disabled={loading}
                        />
                    </div>

                    <button 
                        className="report-btn send" 
                        onClick={handleEnviarReporte} 
                        disabled={loading || !productoSeleccionado || !email}
                    >
                        {loading ? 'Enviando...' : 'Enviar Reporte'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnviarReporte;
