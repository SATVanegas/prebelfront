import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import axios from "axios";
import Select from "react-select";
import './AnadirReporte.css';
import ConfirmationModal from "./ConfirmationModal";

const InspectionForm = () => {
  const [formData, setFormData] = useState({
    aerosolStove: "",
    inOut: "",
    stove: "",
    hrStove: "",
    environment: "",
    fridge: "",
    photolysis: "",
    stabilitiesMatrixId: "",
  });

  const [lastInspectionDate, setLastInspectionDate] = useState(null);
  const [products, setProducts] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [status, setStatus] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Maneja el mensaje cuando se recibe a través de la navegación
    if (location.state?.message) {
      setMessage(location.state.message);
      setStatus(location.state.status);
      // Limpia el estado de la ubicación después de mostrar el mensaje
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchLastInspection = async () => {
      try {
        const response = await axios.get("/inspections/last");
        if (response.data != null) {
          setLastInspectionDate(new Date(response.data.realDate));
        } else {
          setLastInspectionDate(new Date());
        }
      } catch (error) {
        console.error("Error fetching last inspection:", error);
        setLastInspectionDate(new Date());
      }
    };

    fetchLastInspection();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        if (response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (selectedOption) => {
    setFormData({ 
      ...formData, 
      stabilitiesMatrixId: selectedOption ? selectedOption.value : "" 
    });
    localStorage.setItem('selectedProductName', selectedOption ? selectedOption.label : "");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.stabilitiesMatrixId) newErrors.stabilitiesMatrixId = "⚠️ El producto evaluado es obligatorio";
    if (!formData.aerosolStove) newErrors.aerosolStove = "⚠️ El valor de Estufa de Aerosol es obligatorio";
    if (!formData.inOut) newErrors.inOut = "⚠️ El valor de Entrada/Salida es obligatorio";
    if (!formData.stove) newErrors.stove = "⚠️ El valor de Estufa es obligatorio";
    if (!formData.hrStove) newErrors.hrStove = "⚠️ El valor de Estufa HR es obligatorio";
    if (!formData.environment) newErrors.environment = "⚠️ El valor de Ambiente es obligatorio";
    if (!formData.fridge) newErrors.fridge = "⚠️ El valor de Nevera es obligatorio";
    if (!formData.photolysis) newErrors.photolysis = "⚠️ El valor de Fotólisis es obligatorio";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    
    // Encuentra el producto seleccionado para mostrar su nombre en el modal
    const product = productOptions.find(option => option.value === formData.stabilitiesMatrixId);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    const currentDate = new Date();
    const expectedDate = new Date(currentDate);
    expectedDate.setMonth(currentDate.getMonth() + 1);

    let responseTime = 0;
    if (lastInspectionDate) {
      const diffTime = Math.abs(currentDate - lastInspectionDate);
      responseTime = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const dataToSubmit = {
      ...formData,
      realDate: currentDate.toISOString().split('T')[0],
      expectedDate: expectedDate.toISOString().split('T')[0],
      responseTime,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem('inspectionData', JSON.stringify(dataToSubmit));
      setMessage('Inspección creada exitosamente');
      navigate('/reportes/tests', { state: { ...dataToSubmit } });
    } catch (error) {
      console.error('Error al crear la inspección:', error);
      setMessage('Error en la conexión con el servidor.');
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(product =>
    product.brand.toLowerCase().includes(brandFilter.toLowerCase()) &&
    product.productDescription.toLowerCase().includes(descriptionFilter.toLowerCase())
  );

  const productOptions = filteredProducts.map(product => ({
    value: product.id,                                      // Este es el valor que debemos usar
    label: `${product.brand} - ${product.productDescription}`,
    stabilitiesMatrixId: product.stabilitiesMatrixId
  }));

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault(); // Prevenir la propagación
      e.stopPropagation(); // Asegurar que no se propague
      
      const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
      const currentIndex = inputs.indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      
      if (nextInput) {
        nextInput.focus();
      } else if (e.key === 'Enter' && currentIndex === inputs.length - 1) {
        // Si es el último campo, llamar a handleSubmit manualmente
        handleSubmit(e);
        return false; // Evitar cualquier propagación adicional
      }
    }
  
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
      const currentIndex = inputs.indexOf(e.target);
      const prevInput = inputs[currentIndex - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  return (
    <div className="anadir-reportes-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>

      <div className="anadir-reportes-card">
      {message && (
          <div className={`status-message-reporte ${status}`}>
            {message}
          </div>
        )}
        <h2 className="title1">Crear Reporte</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="form-group">
            <span className="label-text">Producto evaluado</span>
            <Select
              options={productOptions}
              value={productOptions.find(option => option.value === formData.stabilitiesMatrixId)}
              onChange={handleProductChange}
              placeholder="Seleccione el producto evaluado"
              isSearchable
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
                  color: '#3a8dde',  // Color del texto cuando está seleccionado
                })
              }}
            />
            {errors.stabilitiesMatrixId && <span className="error-text">{errors.stabilitiesMatrixId}</span>}
          </label>
          
          {/* Campos de entrada numéricos */}
          <label className="form-group">
            <span className="label-text">Estufa de Aerosol</span>
            <input 
              type="number" 
              name="aerosolStove" 
              placeholder="Ingrese el número de la Estufa de Aerosol en que se encuentra el producto" 
              value={formData.aerosolStove} 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              className="input-field" 
            />
            {errors.aerosolStove && <span className="error-text">{errors.aerosolStove}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Entrada/Salida</span>
            <input 
              type="number" 
              name="inOut" 
              placeholder="Ingrese el número de Entrada/Salida del producto" 
              value={formData.inOut} 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              className="input-field" 
            />
            {errors.inOut && <span className="error-text">{errors.inOut}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Estufa</span>
            <input 
              type="number" 
              name="stove" 
              placeholder="Ingrese el número de la Estufa en que se encuentra el producto" 
              value={formData.stove} 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              className="input-field" 
            />
            {errors.stove && <span className="error-text">{errors.stove}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Estufa HR</span>
            <input 
              type="number" 
              name="hrStove" 
              placeholder="Ingrese el número de la Estufa HR en que se encuentra el producto" 
              value={formData.hrStove} 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              className="input-field" 
            />
            {errors.hrStove && <span className="error-text">{errors.hrStove}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Ambiente</span>
            <input 
              type="number" 
              name="environment" 
              placeholder="Ingrese el número del Ambiente en que se encuentra el producto" 
              value={formData.environment} 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              className="input-field" 
            />
            {errors.environment && <span className="error-text">{errors.environment}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Nevera</span>
            <input 
              type="number" 
              name="fridge" 
              placeholder="Ingrese el número de la Nevera en que se encuentra el producto" 
              value={formData.fridge} 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              className="input-field" 
            />
            {errors.fridge && <span className="error-text">{errors.fridge}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Fotólisis</span>
            <input 
              type="number" 
              name="photolysis" 
              placeholder="Ingrese el estado de Fotólisis en que se encuentra el producto" 
              value={formData.photolysis} 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              className="input-field" 
            />
            {errors.photolysis && <span className="error-text">{errors.photolysis}</span>}
          </label>

          <button type="submit" className="primary-btn">Crear Reporte</button>
        </form>
      </div>
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        data={{
          productName: selectedProduct?.label || '',
          ...formData
        }}
      />
    </div>
  );
};

export default InspectionForm;