import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
import "./Login.css";
import logo from './/logo.png';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/api/login/${email}/${password}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          login(data); 
          navigate("/"); 
        } else {
          setMessage("Datos inválidos o vacíos."); 
        }
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          setMessage("Contraseña incorrecta.");
        } else if (response.status === 404) {
          setMessage("Usuario no encontrado.");
        } else {
          setMessage(`Error: ${errorData.message || "Error desconocido"}`);
        }
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      setMessage("Error en la conexión con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Prebel Logo" className="prebel-logo"style={{ width: '250px', marginBottom: '20px' }} />
      <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>
        <div className="form-group">
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button type="submit">Iniciar Sesión</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
    </div>
  );
};

export default LoginForm;
