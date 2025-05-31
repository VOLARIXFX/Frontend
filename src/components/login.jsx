iimport React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import UseCrud from "../hook/Crud";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../ConfigPort&Host";
import logo2 from '../Img/logo2.png'
import { useTranslation } from 'react-i18next'


const Login = () => {
  const BASEURL = `${API_URL}/login`;

  const { login, loading } = useAuth();
  const { postApi, loading: crudLoading } = UseCrud(BASEURL);
  const navigate = useNavigate();
  const [Correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [setshowPassword, setSetshowPassword] = useState(false);

  const togglePassword = () => {
    setSetshowPassword(!setshowPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!Correo || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      const data = await postApi({ Correo, password });

      if (data?.token && data?.rol) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id_user,
            rol: data.rol,
          })
        );
      }

      login(data, data.token);
      toast.success("Bienvenido a volarixCP");

      switch (data.rol) {
        case "administrador":
          navigate("/adminview");
          break;
        case "cliente":
          navigate("/cliente-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isLoading = loading || crudLoading;
  const { t } = useTranslation()

  return (

    <>
    <ToastContainer/>
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-[#0a0e17] text-white">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 text-white">
          <img src={logo2}  alt="Logo" className="w-24 h-24"/>
          {/* <span className="text-3xl font-extrabold tracking-wide">Volarix Capital</span> */}
        </div>
      </div>
      <div className="w-full max-w-md p-4 rounded-2xl shadow-xl border bg-[#181e2a] border-[#23293a]">
        <h2 className="text-2xl font-bold text-center mb-2">Iniciar Sesión</h2>
        <p className="text-center mb-6 text-gray-300">
          Ingresa tus credenciales para acceder a la plataforma
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-200">
              Correo Electrónico
            </label>
            <input
              value={Correo}
              onChange={(e) => setCorreo(e.target.value)}
              type="email"
              placeholder=""
              className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500/20"
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-200">
              Contraseña
            </label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={setshowPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition bg-gray-800 border-gray-700 text-white focus:border-green-500 focus:ring-green-500/20"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-400 transition"
                aria-label={setshowPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {setshowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full p-3 rounded-md bg-green-500 text-white font-semibold shadow-lg transition ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/forgot-password" className="text-green-500 hover:text-green-600 font-medium transition">
            ¿Has olvidado la contraseña?
          </a>
        </div>
      </div>
      <div className="mt-8 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} VolarixCP. Todos los derechos reservados.
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="flex flex-col items-center text-white">
            <svg className="animate-spin h-10 w-10 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Iniciando Sesión...</span>
          </div>
        </div>
      )}
    </div>
    
    </>
  );
};

export default Login;
