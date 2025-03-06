import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImprimirReportes.css';
import Select from 'react-select';

const ImprimirReportes = () => {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [visualizando, setVisualizando] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [errorDetails, setErrorDetails] = useState('');
    
    const navigate = useNavigate();

    const productOptions = productos.map(producto => ({
        value: producto.id,
        label: `${producto.productDescription} - ${producto.brand}`
      }));

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                console.log('Iniciando fetch de productos...');
                
                const response = await fetch('http://localhost:8080/api/products', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });
                
                console.log('Respuesta recibida:', response.status, response.statusText);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos recibidos:', data);
                    setProductos(data);
                    
                    if (data.length === 0) {
                        setMessage('No hay productos disponibles para generar reportes.');
                        setStatus('warning');
                    } else {
                        setMessage('');
                        setStatus('');
                    }
                } else {
                    const errorText = await response.text();
                    console.error(`Error al obtener productos: ${response.status} ${response.statusText}`);
                    console.error(`Detalle del error: ${errorText}`);
                    
                    setMessage(`Error: No se pudieron cargar los productos. Código: ${response.status}`);
                    setStatus('error');
                    setErrorDetails(`Detalles: ${errorText}`);
                    
                    setProductos([
                        { id: 1, productDescription: 'Producto de prueba 1', brand: 'Marca 1' },
                        { id: 2, productDescription: 'Producto de prueba 2', brand: 'Marca 2' },
                    ]);
                }
            } catch (error) {
                console.error('Error en la conexión con el servidor:', error);
                setMessage(`Error en la conexión con el servidor: ${error.message}`);
                setStatus('error');
                setErrorDetails(`${error.toString()}`);
                
                setProductos([
                    { id: 1, productDescription: 'Producto de prueba 1', brand: 'Marca 1' },
                    { id: 2, productDescription: 'Producto de prueba 2', brand: 'Marca 2' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProductos();
    }, []);
    
    const handleProductoChange = (e) => {
        setProductoSeleccionado(e.target.value);
        if (visualizando) {
            setVisualizando(false);
            setPdfUrl('');
        }
    };
    
    const handleGenerarReporte = async () => {
        if (!productoSeleccionado) {
            setMessage('Por favor, seleccione un producto.');
            setStatus('warning');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/products/${productoSeleccionado}/generate-report`);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `reporte_producto_${productoSeleccionado}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                setMessage('Reporte generado y descargado exitosamente.');
                setStatus('success');
            } else {
                const errorText = await response.text();
                console.error(`Error al generar reporte: ${errorText}`);
                setMessage(`Error: ${errorText}`);
                setStatus('error');
            }
        } catch (error) {
            console.error('Error al generar reporte:', error);
            setMessage('Error en la conexión con el servidor.');
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };
    
    const handleVisualizarReporte = async () => {
        if (!productoSeleccionado) {
            setMessage('Por favor, seleccione un producto.');
            setStatus('warning');
            return;
        }
        try {
            setLoading(true);
            
            const response = await fetch(`http://localhost:8080/api/products/${productoSeleccionado}/generate-report`);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                setPdfUrl(url);
                setVisualizando(true);
                setMessage('');
                setStatus('');
            } else {
                const errorText = await response.text();
                console.error(`Error al visualizar reporte: ${errorText}`);
                setMessage(`Error: ${errorText}`);
                setStatus('error');
                setVisualizando(false);
            }
        } catch (error) {
            console.error('Error al visualizar reporte:', error);
            setMessage('Error en la conexión con el servidor.');
            setStatus('error');
            setVisualizando(false);
        } finally {
            setLoading(false);
        }
    };
    
    const handleVerDemoReporte = async () => {
        try {
            setLoading(true);
            
            const response = await fetch('http://localhost:8080/api/products/product/report/view');
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                setPdfUrl(url);
                setVisualizando(true);
                setMessage('');
                setStatus('');
            } else {
                const errorText = await response.text();
                console.error(`Error al visualizar reporte de demostración: ${errorText}`);
                setMessage(`Error: ${errorText}`);
                setStatus('error');
                setVisualizando(false);
            }
        } catch (error) {
            console.error('Error al visualizar reporte de demostración:', error);
            setMessage('Error en la conexión con el servidor.');
            setStatus('error');
            setVisualizando(false);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="imprimir-reportes-container">
            <div className="nav-container">
                <button className="nav-btn" onClick={() => navigate(-1)}>
                    🔙 Atrás
                </button>
                <button className="nav-btn" onClick={() => navigate('/')}>
                    🏠 Inicio
                </button>
            </div>
            
            <div className="imprimir-reportes-card">
                <h2 className="title">Generación de Reportes PDF</h2>
                
                {message && (
                    <div className={`status-message ${status}`}>
                        {message}
                        {errorDetails && (
                            <div className="error-details">
                                {errorDetails}
                            </div>
                        )}
                    </div>
                )}
                
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
                        className="select-container2"
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
                    
                    <div className="buttons-container">
                        <button 
                            className="report-btn generate"
                            onClick={handleGenerarReporte}
                            disabled={loading || !productoSeleccionado}
                        >
                            {loading ? 'Generando...' : 'Descargar Reporte PDF'}
                        </button>
                        
                        <button 
                            className="report-btn view"
                            onClick={handleVisualizarReporte}
                            disabled={loading || !productoSeleccionado}
                        >
                            {loading ? 'Cargando...' : 'Visualizar Reporte'}
                        </button>
                        
                        <button 
                            className="report-btn demo"
                            onClick={handleVerDemoReporte}
                            disabled={loading}
                        >
                            Ver Reporte de Demostración
                        </button>
                    </div>
                </div>
                
                {visualizando && pdfUrl && (
                    <div className="pdf-viewer-container">
                        <h3>Vista previa del reporte</h3>
                        <div className="pdf-viewer">
                            <iframe 
                                src={pdfUrl} 
                                title="Visor de PDF"
                                width="100%" 
                                height="500"
                            />
                        </div>
                        <button 
                            className="close-btn"
                            onClick={() => {
                                setVisualizando(false);
                                setPdfUrl('');
                            }}
                        >
                            Cerrar vista previa
                        </button>
                    </div>
                )}
                
                <div className="info-section">
                    <h3 className="info-title">Información sobre los reportes</h3>
                    <div className="info-content">
                        <div className="info-card">
                            <div className="info-icon">📄</div>
                            <div className="info-text">
                                <h4>Contenido Completo</h4>
                                <p>Los reportes PDF incluyen la información completa del producto seleccionado, incluyendo especificaciones técnicas.</p>
                            </div>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">👁️</div>
                            <div className="info-text">
                                <h4>Visualización</h4>
                                <p>Puede visualizar el reporte directamente en el navegador para revisar la información antes de descargarla.</p>
                            </div>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">🧪</div>
                            <div className="info-text">
                                <h4>Información Técnica</h4>
                                <p>Los reportes generados contienen datos detallados sobre las pruebas realizadas, condiciones de almacenamiento recomendadas y rangos de temperatura.</p>
                            </div>
                        </div>
                        
                        <div className="info-card">
                            <div className="info-icon">🔍</div>
                            <div className="info-text">
                                <h4>Reporte de Demostración</h4>
                                <p>El reporte de demostración muestra un ejemplo de la estructura y formato de los reportes generados por el sistema.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImprimirReportes;