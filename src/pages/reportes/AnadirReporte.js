import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Select from "react-select";
import './AnadirReporte.css';

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
    setFormData({ ...formData, stabilitiesMatrixId: selectedOption ? selectedOption.stabilitiesMatrixId : "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.stabilitiesMatrixId) newErrors.stabilitiesMatrixId = "El producto evaluado es obligatorio";
    if (!formData.aerosolStove) newErrors.aerosolStove = "El valor de Aerosol Stove es obligatorio";
    if (!formData.inOut) newErrors.inOut = "El valor de In/Out es obligatorio";
    if (!formData.stove) newErrors.stove = "El valor de Stove es obligatorio";
    if (!formData.hrStove) newErrors.hrStove = "El valor de HR Stove es obligatorio";
    if (!formData.environment) newErrors.environment = "El valor de Ambiente es obligatorio";
    if (!formData.fridge) newErrors.fridge = "El valor de Nevera es obligatorio";
    if (!formData.photolysis) newErrors.photolysis = "El valor de Fotólisis es obligatorio";
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem('inspectionData', JSON.stringify(dataToSubmit));
      setMessage('Inspección creada exitosamente');
      navigate('/reportes/tests', { state: { ...dataToSubmit } });
    } catch (error) {
      console.error('Error al crear la inspección:', error);
      setMessage('Error en la conexión con el servidor.');
    }
  };

  const filteredProducts = products.filter(product =>
    product.brand.toLowerCase().includes(brandFilter.toLowerCase()) &&
    product.productDescription.toLowerCase().includes(descriptionFilter.toLowerCase())
  );

  const productOptions = filteredProducts.map(product => ({
    value: product.id,
    label: `${product.brand} - ${product.productDescription}`,
    stabilitiesMatrixId: product.stabilitiesMatrixId
  }));

  return (
    <div className="reportes-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>🔙 Atrás</button>
        <button className="nav-btn" onClick={() => navigate('/')}>🏠 Inicio</button>
      </div>

      <div className="reportes-card">
        <h2 className="title">Crear Inspección</h2>
        <form onSubmit={handleSubmit} className="form">
          <label className="form-group">
            <span className="label-text">Producto evaluado</span>
            <Select
              options={productOptions}
              value={productOptions.find(option => option.value === formData.stabilitiesMatrixId)}
              onChange={handleProductChange}
              placeholder="Seleccione el producto evaluado"
              isSearchable
              className="input-field"
            />
            {errors.stabilitiesMatrixId && <span className="error-text">{errors.stabilitiesMatrixId}</span>}
          </label>
          
          {/* Campos de entrada numéricos */}
          <label className="form-group">
            <span className="label-text">Aerosol Stove</span>
            <input type="number" name="aerosolStove" placeholder="Ingrese el valor" value={formData.aerosolStove} onChange={handleChange} className="input-field" />
            {errors.aerosolStove && <span className="error-text">{errors.aerosolStove}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">In/Out</span>
            <input type="number" name="inOut" placeholder="Ingrese el valor" value={formData.inOut} onChange={handleChange} className="input-field" />
            {errors.inOut && <span className="error-text">{errors.inOut}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Stove</span>
            <input type="number" name="stove" placeholder="Ingrese el valor" value={formData.stove} onChange={handleChange} className="input-field" />
            {errors.stove && <span className="error-text">{errors.stove}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">HR Stove</span>
            <input type="number" name="hrStove" placeholder="Ingrese el valor" value={formData.hrStove} onChange={handleChange} className="input-field" />
            {errors.hrStove && <span className="error-text">{errors.hrStove}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Ambiente</span>
            <input type="number" name="environment" placeholder="Ingrese el valor" value={formData.environment} onChange={handleChange} className="input-field" />
            {errors.environment && <span className="error-text">{errors.environment}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Nevera</span>
            <input type="number" name="fridge" placeholder="Ingrese el valor" value={formData.fridge} onChange={handleChange} className="input-field" />
            {errors.fridge && <span className="error-text">{errors.fridge}</span>}
          </label>

          <label className="form-group">
            <span className="label-text">Fotólisis</span>
            <input type="number" name="photolysis" placeholder="Ingrese el valor" value={formData.photolysis} onChange={handleChange} className="input-field" />
            {errors.photolysis && <span className="error-text">{errors.photolysis}</span>}
          </label>

          <button type="submit" className="primary-btn">Crear Inspección</button>
          {message && (
            <div className={`status-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InspectionForm;