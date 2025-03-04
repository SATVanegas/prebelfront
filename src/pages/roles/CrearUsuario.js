import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './CrearUsuario.css';

const CrearUsuario = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState('');

  const formRef = useRef(null);
  const navigate = useNavigate();

  const roleOptions = roles.map((role) => ({
    value: role,
    label: role,
  }));

  useEffect(() => {
    const form = formRef.current;
    if (form) {
      form.addEventListener(
        'invalid',
        (e) => {
          e.target.setCustomValidity('');
          if (!e.target.validity.valid) {
            e.target.setCustomValidity('Por favor rellene este campo');
          }
        },
        true
      );

      form.addEventListener(
        'input',
        (e) => {
          e.target.setCustomValidity('');
        },
        true
      );
    }
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/roles');
        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        } else {
          const errorText = await response.text();
          setMessage(`Error: ${errorText}`);
        }
      } catch (error) {
        console.error('Error al obtener los roles:', error);
        setMessage('Error en la conexión con el servidor.');
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { name, email, password, number, roleName };

    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setMessage('Usuario creado exitosamente');
        setName('');
        setEmail('');
        setPassword('');
        setNumber('');
        setRoleName(null);
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setMessage('Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="user-container">
      <div className="nav-container">
        <button className="nav-btn" onClick={() => navigate(-1)}>
          🔙 Atrás
        </button>
        <button className="nav-btn" onClick={() => navigate('/')}>
          🏠 Inicio
        </button>
      </div>

      <div className="crear-usuario-card">
        <h2 className="title">Crear Usuario</h2>
        <form ref={formRef} onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese su nombre"
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo electrónico"
              required
            />
          </div>
          <div className="form-group">
            <label>Celular:</label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Ingrese su número de celular"
              pattern="[0-9]+"
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          <div className="form-group">
            <label>Rol:</label>
            <Select
              options={roleOptions}
              value={roleOptions.find((option) => option.value === roleName) || null}
              onChange={(option) => setRoleName(option ? option.value : '')}
              placeholder="Seleccione un rol"
              isSearchable
              className="select-container"
              classNamePrefix="react-select"
            />
          </div>
          <button type="submit" className="primary-btn">
            Crear Usuario
          </button>
        </form>
        {message && (
          <div className={`status-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearUsuario;