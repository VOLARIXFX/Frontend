import React, { useState, useEffect } from "react";
import { API_URL } from "../../ConfigPort&Host";
import UseCrud from "../hook/Crud";
import { useAuth } from "../../AuthContext";
import CambioContraseña from "./cliente/modals/CambioContraseñaPerfil";
import DashboardSidebar from "./administrador/Sidebar";
import { useTheme } from "../../DarkMode";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next'

const Profile = () => {
  const { darkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    Nombres: "",
    Apellidos: "",
    telefono: "",
    descripcion: "",
    Cuenta_conectada: "",
  });
  const [loading, setLoading] = useState(true);
  const [previewImg, setPreviewImg] = useState(null); // Para previsualizar la imagen
  const [newImg, setNewImg] = useState(null); // Para guardar la nueva imagen
  const [showChangePass, setShowChangePass] = useState(false);

  const { auth } = useAuth();
  const BASE_URL_GET = `${API_URL}/users/obtenerperfil`;
  const { getApiById } = UseCrud(BASE_URL_GET);
  const BASE_URL_UPDATE = `${API_URL}/users/infoUser`;
  const { updateApi } = UseCrud(BASE_URL_UPDATE);
  const { t } = useTranslation()

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

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (auth.user.id) {
          const data = await getApiById(auth.user.id);
          const userData = Array.isArray(data) ? data[0] : data;
          setUser(userData);
          setForm({
            Nombres: userData.Nombres || "",
            Apellidos: userData.Apellidos || "",
            telefono: userData.telefono || "",
            descripcion: userData.descripcion || "",
            Cuenta_conectada: userData.Cuenta_conectada || "",
          });
          setPreviewImg(userData.imagen ? `${API_URL}/uploads/${userData.imagen}` : null);
        }
      } catch (err) {
        notifyError("Error al cargar el perfil");
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [auth.user.id]);

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setForm({
      Nombres: user.Nombres || "",
      Apellidos: user.Apellidos || "",
      telefono: user.telefono || "",
      descripcion: user.descripcion || "",
      Cuenta_conectada: user.Cuenta_conectada || "",
    });
    setPreviewImg(user.imagen ? `${API_URL}/uploads/${user.imagen}` : null);
    setNewImg(null);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        notifyError("La imagen no debe superar los 5MB");
        return;
      }
      setNewImg(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("Nombres", form.Nombres);
      data.append("Apellidos", form.Apellidos);
      data.append("telefono", form.telefono);
      data.append("descripcion", form.descripcion);
      data.append("Correo", user.Correo);
      data.append("Cuenta_conectada", form.Cuenta_conectada);
      data.append("pais", user.pais);

      if (newImg) {
        data.append("imagen", newImg);
      }

      const response = await updateApi(data, `/${user.id || user.id_user}`);
      
      if (response) {
        notifySuccess("Perfil actualizado correctamente");
        setUser({ ...user, ...form, imagen: newImg ? newImg.name : user.imagen });
        setEditMode(false);
        setNewImg(null);
      } else {
        throw new Error("No se recibió respuesta del servidor");
      }
    } catch (err) {
      notifyError(err.response?.data?.message || "Error al actualizar el perfil");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center ${darkMode ? 'text-white' : 'text-gray-900'} text-xl`}>
        Cargando perfil...
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center ${darkMode ? 'text-white' : 'text-gray-900'} text-xl`}>
        No se pudo cargar el perfil.
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen">
        
        <DashboardSidebar isAdmin={true}/>

        <div className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div
            className={`flex flex-col md:flex-row gap-4 w-full max-w-5xl mx-auto mt-8 p-3 rounded-2xl shadow-2xl border 
              ${darkMode 
                ? 'bg-gray-800 border-blue-600' 
                : 'bg-white border-blue-500'
            } animate-modal`}
            style={{
              boxShadow: darkMode 
                ? "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
                : "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl  w-full md:w-1/3 flex flex-col items-center shadow-lg border ${darkMode ? 'border-blue-600' : 'border-blue-400'}`}>
              <div className={`w-24 h-24 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex items-center justify-center text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 shadow relative group`}>
                <label
                  htmlFor="profile-img-input"
                  className={`w-full h-full absolute inset-0 cursor-pointer ${editMode ? "hover:opacity-80" : ""}`}
                  style={{ zIndex: 2 }}
                  title={editMode ? "Toca la imagen para cambiarla" : ""}
                >
                  {previewImg ? (
                    <img
                      src={previewImg}
                      alt="Imagen de perfil"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-full h-full">
                      {user.Nombres?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                  <input
                    id="profile-img-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImgChange}
                    className="hidden"
                    disabled={!editMode}
                  />
                </label>
              </div>
              {editMode && (
                <div className={`mb-2 text-center ${darkMode ? 'text-blue-400' : 'text-blue-600'} text-sm animate-pulse`}>
                  Toca la imagen para cambiarla
                </div>
              )}
              <div className={`${darkMode ? 'text-white' : 'text-gray-900'} text-xl font-semibold mb-0`}>
                {user.Nombres} {user.Apellidos}
              </div>
              <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>{user.Correo}</div>
              <div className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium mb-2`}>{user.rol}</div>
              <button
                className={`mt-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded font-semibold transition`}
                onClick={() => setShowChangePass(true)}
              >
                Cambiar contraseña
              </button>
            </div>

            {/* Información personal */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-3   w-full md:w-2/3 shadow-lg border ${darkMode ? 'border-blue-600' : 'border-blue-400'}`}>
              <div className="mb-4">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Perfil</h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>
                  Gestiona tu información personal y preferencias
                </p>
              </div>
              <div className="flex justify-end mb-4">
                {!editMode && (
                  <button
                    onClick={handleEdit}
                    className={`${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded font-semibold transition`}
                  >
                    Editar
                  </button>
                )}
              </div>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                onSubmit={e => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div>
                  <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Nombre</label>
                  <input
                    type="text"
                    name="Nombres"
                    value={form.Nombres}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-900'} border ${
                      editMode 
                        ? darkMode 
                          ? 'border-blue-500' 
                          : 'border-blue-400'
                        : darkMode 
                          ? 'border-gray-600' 
                          : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Apellido</label>
                  <input
                    type="text"
                    name="Apellidos"
                    value={form.Apellidos}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-900'} border ${
                      editMode 
                        ? darkMode 
                          ? 'border-blue-500' 
                          : 'border-blue-400'
                        : darkMode 
                          ? 'border-gray-600' 
                          : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Correo electrónico</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="Correo"
                      value={user.Correo}
                      disabled={!editMode || auth.user?.rol !== 'administrador'}
                      className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'} pr-10 ${!editMode || auth.user?.rol !== 'administrador' ? 'cursor-not-allowed' : ''}`}
                    />
                    {/* {(!editMode || auth.user?.rol !== 'administrador') && (
                      <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg select-none`}>
                        🔒
                      </span>
                    )} */}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Teléfono </label>
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-900'} border ${
                      editMode 
                        ? darkMode 
                          ? 'border-blue-500' 
                          : 'border-blue-400'
                        : darkMode 
                          ? 'border-gray-600' 
                          : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Biografía</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-900'} border ${
                      editMode 
                        ? darkMode 
                          ? 'border-blue-500' 
                          : 'border-blue-400'
                        : darkMode 
                          ? 'border-gray-600' 
                          : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>Cuenta conectada </label>
                  <input
                    type="text"
                    name="Cuenta_conectada"
                    value={form.Cuenta_conectada}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} ${darkMode ? 'text-white' : 'text-gray-900'} border ${
                      editMode 
                        ? darkMode 
                          ? 'border-blue-500' 
                          : 'border-blue-400'
                        : darkMode 
                          ? 'border-gray-600' 
                          : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                {editMode && (
                  <div className="md:col-span-2 flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-600 hover:bg-gray-700'} text-white px-4 py-2 rounded font-semibold transition`}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          <CambioContraseña 
            open={showChangePass} 
            onClose={() => setShowChangePass(false)} 
          />

        
        </div>
      </div>
    </>
  );
};

export default Profile;