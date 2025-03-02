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
    testId: "",
  });

  const [lastInspectionDate, setLastInspectionDate] = useState(null);
  const [products, setProducts] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");

  useEffect(() => {
    const fetchLastInspection = async () => {
      try {
        const response = await axios.get("/inspections/last");
        if (response.data) {
          setLastInspectionDate(new Date(response.data.realDate));
        }
      } catch (error) {
        console.error("Error fetching last inspection:", error);
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
    setFormData({ ...formData, stabilitiesMatrixId: selectedOption ? selectedOption.value : "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await axios.post("/inspections", dataToSubmit);
      alert("Inspección creada correctamente");
      navigate(`/tests/${response.data.testId}`);
    } catch (error) {
      alert("Error al crear la inspección");
    }
  };

  const navigate = useNavigate();

  const filteredProducts = products.filter(product =>
    product.brand.toLowerCase().includes(brandFilter.toLowerCase()) &&
    product.productDescription.toLowerCase().includes(descriptionFilter.toLowerCase())
  );

  const productOptions = filteredProducts.map(product => ({
    value: product.id,
    label: `${product.brand} - ${product.productDescription}`
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
          </label>

          <label className="form-group">
            <span className="label-text">Nombre de la prueba realizada</span>
            <input type="number" name="testId" placeholder="Seleccione la prueba realizada" value={formData.testId} onChange={handleChange} className="input-field" required />
          </label>
          
          {/* Campos de entrada numéricos */}
          <label className="form-group">
            <span className="label-text">Aerosol Stove</span>
            <input type="number" name="aerosolStove" placeholder="Ingrese el valor" value={formData.aerosolStove} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">In/Out</span>
            <input type="number" name="inOut" placeholder="Ingrese el valor" value={formData.inOut} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Stove</span>
            <input type="number" name="stove" placeholder="Ingrese el valor" value={formData.stove} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">HR Stove</span>
            <input type="number" name="hrStove" placeholder="Ingrese el valor" value={formData.hrStove} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Ambiente</span>
            <input type="number" name="environment" placeholder="Ingrese el valor" value={formData.environment} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Nevera</span>
            <input type="number" name="fridge" placeholder="Ingrese el valor" value={formData.fridge} onChange={handleChange} className="input-field" />
          </label>

          <label className="form-group">
            <span className="label-text">Fotólisis</span>
            <input type="number" name="photolysis" placeholder="Ingrese el valor" value={formData.photolysis} onChange={handleChange} className="input-field" />
          </label>

          <button type="submit" className="primary-btn">Crear Inspección</button>
        </form>
      </div>
    </div>
  );
};

export default InspectionForm;