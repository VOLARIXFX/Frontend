import React, { useState } from "react";
import { API_URL } from "../../../../ConfigPort&Host";
import { useTheme } from "../../../../DarkMode";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next'

const CambioContraseña = ({ open, onClose }) => {
  const [passwordAntigua, setPasswordAntigua] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();
  const { t } = useTranslation();

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      },
      bodyStyle: {
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  };

  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: "linear-gradient(to right, #2193b0, #6dd5ed)",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      },
      bodyStyle: {
        fontSize: "14px",
        fontWeight: "500",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordAntigua || !passwordNueva || !confirmarPassword) {
      notifyError("Todos los campos son requeridos.");
      return;
    }
    if (passwordNueva.length < 6) {
      notifyError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (passwordNueva !== confirmarPassword) {
      notifyError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/contrasenaDash`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          passwordAntigua,
          passwordNueva,
          confirmarPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        notifySuccess("Contraseña actualizada correctamente.");
        setPasswordAntigua("");
        setPasswordNueva("");
        setConfirmarPassword("");
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        notifyError(data.message || "Error al cambiar la contraseña.");
      }
    } catch (err) {
      notifyError("Error en el servidor.");
    }
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className={`relative rounded-2xl shadow-2xl max-w-md w-full p-8 animate-modal 
          ${darkMode ? 'bg-[#232846] border border-gray-700 shadow-gray-700/50' : 'bg-white border border-blue-500 shadow-blue-200/50'}
        `}
      >
        <button
          className="absolute top-3 right-4 text-blue-500 text-2xl font-bold hover:text-blue-700 transition"
          onClick={onClose}
          title="Cerrar"
        >×</button>
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 mb-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <path fill={darkMode ? "#93C5FD" : "#3b82f6"} d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 5a3 3 0 1 1 6 0v3h-6V7Zm10 5v8H5v-8h14Z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-blue-700 dark:text-white mb-1">Cambiar contraseña</h2>
          <p className="text-sm mb-2 text-center text-gray-600 dark:text-blue-200">
            Ingresa tu contraseña actual y la nueva contraseña.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Contraseña actual"
            className={`p-2 rounded border focus:outline-none focus:ring-2 transition-colors 
              ${darkMode 
                ? 'border-blue-700 bg-[#181c2f] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50' 
                : 'border-blue-300 bg-blue-50 text-blue-900 placeholder-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}
              }
            `}
            value={passwordAntigua}
            onChange={e => setPasswordAntigua(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            className={`p-2 rounded border focus:outline-none focus:ring-2 transition-colors 
              ${darkMode 
                ? 'border-blue-700 bg-[#181c2f] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50' 
                : 'border-blue-300 bg-blue-50 text-blue-900 placeholder-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}
              }
            `}
            value={passwordNueva}
            onChange={e => setPasswordNueva(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Repetir nueva contraseña"
            className={`p-2 rounded border focus:outline-none focus:ring-2 transition-colors 
              ${darkMode 
                ? 'border-blue-700 bg-[#181c2f] text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/50' 
                : 'border-blue-300 bg-blue-50 text-blue-900 placeholder-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}
              }
            `}
            value={confirmarPassword}
            onChange={e => setConfirmarPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
      <style>
        {`
          .animate-modal {
            animation: modalScaleIn 0.25s cubic-bezier(.4,2,.6,1) both;
          }
          @keyframes modalScaleIn {
            0% { transform: scale(0.85); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default CambioContraseña;