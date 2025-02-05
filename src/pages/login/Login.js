import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
import "./Login.css";
import logo from './/logo.png';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState(""); 
  const [resetCode, setResetCode] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 
  const [codeSent, setCodeSent] = useState(false); 
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

  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setMessage("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/email/send/resetCode/${resetEmail}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setMessage("Código de recuperación enviado a tu correo.");
        setCodeSent(true); // Mostrar el formulario para ingresar el código
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "No se pudo enviar el código de recuperación."}`);
      }
    } catch (error) {
      console.error("Error en la solicitud de recuperación:", error);
      setMessage("Error en la conexión con el servidor.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!resetCode || !newPassword) {
      setMessage("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/email/changePassword/${resetEmail}/${resetCode}/${newPassword}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setMessage("Contraseña cambiada correctamente.");
        setShowResetPassword(false);
        setCodeSent(false); 
      } else {
        const errorData = await response.json();
        if (response.status === 404) {
          setMessage("Usuario no encontrado.");
        } else if (response.status === 401) {
          setMessage("Código de recuperación incorrecto. Verifica e intenta nuevamente.");
        } else {
          setMessage(`Error: ${errorData.message || "No se pudo cambiar la contraseña."}`);
        }
      }
    } catch (error) {
      console.error("Error en el cambio de contraseña:", error);
      setMessage("No se pudo verificar el código de recuperación. Intenta nuevamente.");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Prebel Logo" className="prebel-logo"/>
      <div className="login-box">
        <h2>Ingrese sus datos</h2>
        {!showResetPassword ? (
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
            <p className="reset-password-link" onClick={() => setShowResetPassword(true)}>
              ¿Olvidaste tu contraseña?
            </p>
            {message && <p className="message">{message}</p>}
          </form>
        ) : (
          <>
            {!codeSent ? (
              <form onSubmit={handleSendCode}>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Enviar código de recuperación</button>
                <p className="reset-password-link" onClick={() => setShowResetPassword(false)}>
                  Volver al inicio de sesión
                </p>
                {message && <p className="message">{message}</p>}
              </form>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Código de recuperación"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Cambiar Contraseña</button>
                <p className="reset-password-link" onClick={() => setShowResetPassword(false)}>
                  Volver al inicio de sesión
                </p>
                {message && <p className="message">{message}</p>}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;