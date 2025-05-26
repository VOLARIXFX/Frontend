import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../../../ConfigPort&Host";
import UseCrud from "../../hook/Crud";
import Avatar from "../../Img/AvatarPerfil.jpg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import DashboardSidebar from "./Sidebar";
import RegistrarUsuario from "./modals/RegistrarUsuario";
import EditarUsuario from "./modals/EditarUsuario";
import { useTheme } from "../../../DarkMode";

const Usuarios = () => {
  const { darkMode } = useTheme();
  const BASEURL = `${API_URL}/users/obtener`;
  const { getApi } = UseCrud(BASEURL);

  const BASEURL2 = `${API_URL}/users/`
  const {updateApi} = UseCrud(BASEURL2);

  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('activos'); 
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 5;
  const [modalAdvertencia, setModalAdvertencia] = useState({ abierto: false, usuario: null });
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getApi();
        setUsuarios(data || []);
        setUsuariosFiltrados(data?.filter(user => user.estado === 'activo') || []);
      } catch (error) {
        notifyError('Error al cargar los usuarios');
      }
    };
    fetchUsuarios();
  }, []);
  
  useEffect(() => {
    if (filtroEstado === 'activos') {
      setUsuariosFiltrados(usuarios.filter(user => user.estado === 'activo'));
    } else {
      setUsuariosFiltrados(usuarios.filter(user => user.estado === 'inactivo'));
    }
    setPaginaActual(1);
  }, [filtroEstado, usuarios]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const indiceUltimoUsuario = paginaActual * usuariosPorPagina;
  const indicePrimerUsuario = indiceUltimoUsuario - usuariosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(indicePrimerUsuario, indiceUltimoUsuario);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);

  const handleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

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

  const cambiarEstado = async(id, estado) => {
    const nuevoEstado = estado === 'activo' ? 'inactivo' : 'activo';

    try {
      await updateApi({estado: nuevoEstado}, `estadoUser/${id}`);
      notifySuccess('Estado actualizado correctamente');
      
      const usuariosActualizados = usuarios.map(usuario => 
        usuario.id_user === id 
          ? {...usuario, estado: nuevoEstado}
          : usuario
      );
      setUsuarios(usuariosActualizados);
      setMenuOpen(null); 
    } catch (error) {
      notifyError('Error al actualizar el estado');
      setMenuOpen(null);
    }
  };

  const abrirModalAdvertencia = (usuario) => {
    setModalAdvertencia({ abierto: true, usuario });
  };
  const cerrarModalAdvertencia = () => {
    setModalAdvertencia({ abierto: false, usuario: null });
  };
  const confirmarDesactivar = () => {
    if (modalAdvertencia.usuario) {
      cambiarEstado(modalAdvertencia.usuario.id_user, modalAdvertencia.usuario.estado);
      cerrarModalAdvertencia();
    }
  };

  const handleRegistroExitoso = () => {
    setModalRegistroAbierto(false);
    const fetchUsuarios = async () => {
      const data = await getApi();
      setUsuarios(data || []);
      setUsuariosFiltrados(data?.filter(user => user.estado === 'activo') || []);
    };
    fetchUsuarios();
  };

  const handleEditarUsuario = () => {
    setModalEditar(false)
    const fetchUsuarios = async () => {
      const data = await getApi();
      setUsuarios(data || []);
      setUsuariosFiltrados(data?.filter(user => user.estado === 'activo') || []);
    };
    fetchUsuarios();
  }

  const abrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditar(true);
    setMenuOpen(null);
  };

  return (
    <div className="flex h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        style={{
          zIndex: 9999,
        }}
      />
      <DashboardSidebar isAdmin={true} />
      <div className={`flex-1 overflow-auto ${darkMode ? 'bg-[#0B0F18]' : 'bg-gray-50'}`}>
        <div className={`p-4 md:p-6 rounded-xl shadow-xl max-w-7xl mx-auto mt-4 md:mt-16 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gestión de Usuarios</h1>
            <button 
              onClick={() => setModalRegistroAbierto(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition text-base shadow-md"
            >
              <span className="text-xl">＋</span> Nuevo Usuario
            </button>
          </div>

          <div className="mb-5 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className={`absolute left-3 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm'
                }`}
              />
            </div>
            <select 
              className={`w-full md:w-auto border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base transition-colors ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900 shadow-sm'
              }`}
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>

          <div className={`rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200 shadow-sm'}`} style={{overflow: 'visible'}}>
            <div className="overflow-x-auto">
              <table className={`min-w-full text-base ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <thead>
                  <tr className={`${darkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                    <th className="py-3 px-3 text-left font-semibold">Usuario</th>
                    <th className="py-3 px-3 text-left font-semibold">Email</th>
                    <th className="py-3 px-3 text-left font-semibold">Estado</th>
                    <th className="py-3 px-3 text-left font-semibold">Teléfono</th>
                    <th className="py-3 px-3 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosPagina.map((usuario) => (
                    <tr
                      key={usuario.id_user}
                      className={`border-b last:border-b-0 transition-colors ${
                        darkMode 
                          ? 'border-gray-700 hover:bg-gray-700/50' 
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-3 flex items-center gap-3">
                        <img
                          src={usuario.imagen ? `${API_URL}/uploads/${usuario.imagen}` : `${Avatar}`}
                          alt="Perfil"
                          className="w-8 h-8 rounded-full object-cover bg-gray-200"
                        />
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {usuario.Nombres} {usuario.Apellidos}
                        </span>
                      </td>
                      <td className={`py-3 px-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{usuario.Correo}</td>
                      <td className="py-3 px-3">
                        {usuario.estado === "activo" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-base font-semibold">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                            Activo
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-base font-semibold ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{usuario.telefono}</td>
                      <td className="py-3 px-3 relative">
                        <button
                          className={`p-1.5 rounded-full transition-colors ${
                            darkMode 
                              ? 'hover:bg-gray-700 text-gray-400' 
                              : 'hover:bg-gray-100 text-gray-500'
                          }`}
                          onClick={() => handleMenu(usuario.id_user)}
                        >
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="4" cy="10" r="2" />
                            <circle cx="10" cy="10" r="2" />
                            <circle cx="16" cy="10" r="2" />
                          </svg>
                        </button>
                        {menuOpen === usuario.id_user && (
                          <div 
                            ref={menuRef}
                            className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                              darkMode 
                                ? 'bg-gray-700 border border-gray-600' 
                                : 'bg-white border border-gray-200 shadow-gray-200/50'
                            }`}
                          >
                            <div className={`px-5 py-2 font-semibold border-b text-base ${
                              darkMode 
                                ? 'text-white border-gray-600' 
                                : 'text-gray-900 border-gray-200'
                            }`}>Acciones</div>
                            <button
                              className={`flex items-center w-full px-5 py-2 text-base transition-colors ${
                                darkMode 
                                  ? 'text-gray-300 hover:bg-gray-600' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                              onClick={() => { handleMenu(null); navigate(`/profile/${usuario.id_user}`); }}
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="7" r="4" />
                                <path d="M5.5 21a7.5 7.5 0 0113 0" />
                              </svg>
                              Ver perfil
                            </button>
                            <button
                              className={`flex items-center w-full px-5 py-2 text-base transition-colors ${
                                darkMode 
                                  ? 'text-gray-300 hover:bg-gray-600' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                              onClick={() => { handleMenu(null); abrirModalEditar(usuario); }}
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Editar perfil
                            </button>
                            <button
                              className={`flex items-center w-full px-5 py-2 text-base transition-colors ${
                                darkMode 
                                  ? 'text-red-400 hover:bg-gray-600' 
                                  : 'text-red-600 hover:bg-gray-50'
                              }`}
                              onClick={() => { handleMenu(null); abrirModalAdvertencia(usuario); }}
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                              {usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPaginas > 1 && (
            <div className="flex flex-col md:flex-row justify-center items-center gap-3 mt-6">
              <button
                className={`w-full md:w-auto px-4 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                Anterior
              </button>
              <span className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                className={`w-full md:w-auto px-4 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </div>
          )}

          {modalAdvertencia.abierto && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
              <div className={`rounded-xl shadow-xl p-8 w-[350px] relative ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <button 
                  className={`absolute top-3 right-3 text-xl transition-colors ${
                    darkMode 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`} 
                  onClick={cerrarModalAdvertencia}
                >×</button>
                <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {modalAdvertencia.usuario.estado === 'activo' ? 'Desactivar Usuario' : 'Activar Usuario'}
                </h2>
                <p className={`text-base mb-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ¿Estás seguro de que deseas {modalAdvertencia.usuario.estado === 'activo' ? 'desactivar' : 'activar'} este usuario? El usuario {modalAdvertencia.usuario.estado === 'activo' ? 'no podrá acceder' : 'podrá acceder'} a la plataforma.
                </p>
                <div className="flex items-center gap-3 mb-5">
                  <img 
                    src={modalAdvertencia.usuario.imagen ? `${API_URL}/uploads/${modalAdvertencia.usuario.imagen}` : `${Avatar}`}
                    alt="Perfil" 
                    className="w-10 h-10 rounded-full object-cover bg-gray-200" 
                  />
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {modalAdvertencia.usuario.Nombres} {modalAdvertencia.usuario.Apellidos}
                    </div>
                    <div className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {modalAdvertencia.usuario.Correo}
                    </div>
                  </div>
                </div>
                <div className={`rounded-lg p-3 mb-5 flex items-center gap-2 ${
                  darkMode 
                    ? 'bg-yellow-900/50 text-yellow-300' 
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Esta acción impedirá que el usuario acceda a su cuenta, pero mantendrá todos sus datos en el sistema.
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`} 
                    onClick={cerrarModalAdvertencia}
                  >Cancelar</button>
                  <button 
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                    onClick={confirmarDesactivar}
                  >
                    {modalAdvertencia.usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <RegistrarUsuario 
        isOpen={modalRegistroAbierto}
        onClose={() => setModalRegistroAbierto(false)}
        onSuccess={handleRegistroExitoso}
      />

      <EditarUsuario
        isOpen={modalEditar}
        onClose={() => {
          setModalEditar(false);
          setUsuarioSeleccionado(null);
        }}
        onSuccess={handleEditarUsuario}
        user={usuarioSeleccionado}
      />
    </div>
  );
};

export default Usuarios;
