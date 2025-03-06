import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./EnviarReporte.css";

const EnviarReporte = () => {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const productOptions = productos.map(producto => ({
        value: producto.id,
        label: `${producto.productDescription} - ${producto.brand}`
      }));

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
        <div className="enviar-reportes-container">
            <div className="nav-container">
                <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
                <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
            </div>

            <div className="enviar-reportes-card">
                <h2 className="title">Enviar Reporte por Correo</h2>

                {message && <div className={`status-message ${status}`}>{message}</div>}

                <div className="form-container">
                <div className="form-group">
                    <label>Seleccionar Producto:</label>
                    <Select
                        options={productOptions}
                        value={productOptions.find(option => option.value === productoSeleccionado)}
                        onChange={(option) => setProductoSeleccionado(option ? option.value : '')}
                        placeholder="Seleccione un producto"
                        isSearchable
                        isDisabled={loading}
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
                        className="primary-btn send" 
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
