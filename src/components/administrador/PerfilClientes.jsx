import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UseCrud from "../../hook/Crud";
import { API_URL } from "../../../ConfigPort&Host";
import Avatar from "../../Img/AvatarPerfil.jpg";
import DashboardSidebar from "./Sidebar";
import { useTheme } from "../../../DarkMode";

import { CheckCircle, XCircle, Mail, Phone, Globe, MapPin, User, ArrowLeft, Briefcase, Sidebar } from 'lucide-react';

const PerfilUsuario = () => {
  const { id_user } = useParams();
  const navigate = useNavigate();
  const BASEURL = `${API_URL}/users/obtenerperfil/${id_user}`;
  const { getApi } = UseCrud(BASEURL);
  const { darkMode } = useTheme();

  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const data = await getApi();
        setUsuario(data);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id_user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-300 h-24 w-24 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mb-3"></div>
          <div className="h-3 bg-gray-300 rounded w-32 mb-6"></div>
          <div className="h-3 bg-gray-300 rounded w-64 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-64 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-64 mb-2"></div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Usuario no encontrado</h2>
          <p className="text-gray-600 mb-6">No pudimos encontrar la información del perfil solicitado.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar isAdmin={true} />
      <div className={`flex-1 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className={`rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-32 relative">
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <div className="px-8 pb-8 -mt-16 relative">
              <div className="flex justify-center">
                <div className={`ring-4 ${darkMode ? 'ring-gray-800' : 'ring-white'} rounded-full overflow-hidden h-32 w-32 shadow-lg`}>
                  <img
                    src={usuario.imagen ? `${API_URL}/uploads/${usuario.imagen}` : Avatar}
                    alt="Perfil"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              
              <div className="text-center mt-4 mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {usuario.Nombres} {usuario.Apellidos}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {usuario.rol}
                  </span>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    usuario.estado === "activo" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`
                  }`}>
                    {usuario.estado === "activo" ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                    {usuario.estado}
                  </span>
                </div>
              </div>
              
              {/* Detalles del usuario */}
              <div className={`rounded-xl p-6 space-y-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                      <Mail className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Correo electrónico</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{usuario.Correo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                      <Phone className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Teléfono</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{usuario.telefono || "No especificado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                      <Briefcase className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cuenta conectada</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{usuario.Cuenta_conectada || "No conectada"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg">
                      <MapPin className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>País</p>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{usuario.pais || "No especificado"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Descripción */}
                {usuario.descripcion && (
                  <div className={`pt-2 mt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Descripción</p>
                    <p className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-100'}`}>
                      {usuario.descripcion}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;