import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Importa el contexto
import "./Login.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtiene la función login del contexto

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
          login(data); // Establece el usuario en el contexto
          navigate("/"); // Redirige al Home después de login
        } else {
          setMessage("Datos inválidos o vacíos."); // Mensaje si no se recibe un dato válido
        }
      } else {
        setMessage(`Error: Usuario no encontrado`);
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      setMessage("Error en la conexión con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginForm;
