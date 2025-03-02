import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Select from "react-select";
import './ConsultarReporte.css'; // Asegúrate de ajustar la ruta según la ubicación del archivo CSS

const BuscarInspecciones = () => {
  const [stabilityMatrix, setStabilityMatrix] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStabilityMatrix = async () => {
      try {
        const response = await axios.get("http://localhost:8080/stabilities-matrix");
        setStabilityMatrix(response.data);
      } catch (error) {
        console.error("Error fetching stability matrix:", error);
      }
    };
    fetchStabilityMatrix();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const productOptions = stabilityMatrix.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? { value: product.id, label: `${product.brand} - ${product.productDescription}` } : null;
  }).filter(Boolean);

  const handleSearch = async () => {
    if (!selectedProduct) return;
    const selectedMatrixItem = stabilityMatrix.find((item) => item.productId === selectedProduct.value);
    if (!selectedMatrixItem) return;
    
    try {
      const inspectionRequests = selectedMatrixItem.inspectionIds.map(id => axios.get(`http://localhost:8080/inspections/${id}`));
      const inspectionResponses = await Promise.all(inspectionRequests);
      setInspections(inspectionResponses.map(res => res.data));
    } catch (error) {
      console.error("Error fetching inspections:", error);
    }
  };

  const handleInspectionClick = (inspection) => {
    setSelectedInspection(inspection);
  };

  return (
    <div className="reportes-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>
      <div className="reportes-card">
        <h2 className="title">Buscar Inspecciones</h2>
        <Select
          options={productOptions}
          value={selectedProduct}
          onChange={setSelectedProduct}
          placeholder="Seleccione un producto"
          isSearchable
        />
        <button className="primary-btn" onClick={handleSearch}>Buscar</button>
        <div>
          {inspections.length > 0 ? (
            inspections.map((inspection) => (
              <button
                key={inspection.testId}
                className="inspection-btn"
                onClick={() => handleInspectionClick(inspection)}
              >
                Inspección #{inspection.testId}
              </button>
            ))
          ) : (
            <p>No se encontraron inspecciones.</p>
          )}
        </div>
        {selectedInspection && (
          <div className="inspection-details">
            <h3>Detalles de la Inspección</h3>
            <p><strong>Fecha Esperada:</strong> {selectedInspection.expectedDate}</p>
            <p><strong>Fecha Real:</strong> {selectedInspection.realDate}</p>
            <p><strong>Tiempo de Respuesta:</strong> {selectedInspection.responseTime}</p>
            <p><strong>Aerosol Stove:</strong> {selectedInspection.aerosolStove}</p>
            <p><strong>In/Out:</strong> {selectedInspection.inOut}</p>
            <p><strong>Stove:</strong> {selectedInspection.stove}</p>
            <p><strong>HR Stove:</strong> {selectedInspection.hrStove}</p>
            <p><strong>Ambiente:</strong> {selectedInspection.environment}</p>
            <p><strong>Nevera:</strong> {selectedInspection.fridge}</p>
            <p><strong>Fotólisis:</strong> {selectedInspection.photolysis}</p>
            <p><strong>ID de Matriz de Estabilidad:</strong> {selectedInspection.stabilitiesMatrixId}</p>
            <p><strong>ID de Prueba:</strong> {selectedInspection.testId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarInspecciones;