import React, { useState, useEffect } from "react"
import { API_URL } from "../../../../ConfigPort&Host"
import UseCrud from "../../../hook/Crud"
import { useTheme } from "../../../../DarkMode";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = `${API_URL}/users/infoUser/`;

const LockIcon = ({darkMode}) => (
  <svg className={`w-4 h-4 ml-2 inline ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17a2 2 0 002-2v-2a2 2 0 00-2-2 2 2 0 00-2 2v2a2 2 0 002 2zm6 0V9a6 6 0 10-12 0v8a2 2 0 002 2h8a2 2 0 002-2z" />
  </svg>
)

const EditarUsuario = ({ isOpen, onClose, user, onSuccess }) => {
  const { updateApi } = UseCrud(BASE_URL);
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    Nombres: "",
    Apellidos: "",
    Correo: "",
    telefono: "",
    pais: "",
    rol: "",
    Cuenta_conectada: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        Nombres: user.Nombres || "",
        Apellidos: user.Apellidos || "",
        Correo: user.Correo || "",
        telefono: user.telefono || "",
        pais: user.pais || "",
        rol: user.rol || "",
        Cuenta_conectada: user.Cuenta_conectada || "",
      })
      setFormErrors({})
      setSubmitSuccess(false)
    }
  }, [user])

  const notifyError = (message) => {
    toast.error(message);
  };

  const notifySuccess = (message) => {
    toast.success(message);
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: null })
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.Correo.trim()) errors.Correo = "El correo es requerido"
    if (!formData.rol) errors.rol = "El rol es requerido"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const data = new FormData()
      data.append("Nombres", formData.Nombres)
      data.append("Apellidos", formData.Apellidos)
      data.append("Correo", formData.Correo)
      data.append("Cuenta_conectada", formData.Cuenta_conectada)
      data.append("telefono", formData.telefono)
      data.append("pais", formData.pais)
      data.append("descripcion", formData.descripcion || "")
      data.append("rol", formData.rol)

      const response = await updateApi(data, user.id_user)
      
      if (response) {
        notifySuccess('Usuario actualizado correctamente')
        setSubmitSuccess(true)
        if (onSuccess) onSuccess()
        setTimeout(() => {
          setSubmitSuccess(false)
          onClose()
        }, 1200)
      } else {
        throw new Error("No se recibió respuesta del servidor")
      }
    } catch (err) {
      console.error("Error al actualizar:", err)
      notifyError(err.response?.data?.message || "Error al actualizar. Intente de nuevo.")
      setFormErrors({ 
        form: err.response?.data?.message || "Error al actualizar. Intente de nuevo." 
      })
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30">
        <div className={`rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-32 flex flex-col items-center justify-end relative">
            <button className={`absolute top-4 left-4 rounded-full p-2 transition ${darkMode ? 'bg-gray-700/70 hover:bg-gray-700' : 'bg-white/90 hover:bg-white shadow-md'}`} onClick={onClose}>
              <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
              <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
                <img
                  src={user?.imagen ? `${API_URL}/uploads/${user.imagen}` : "https://www.gravatar.com/avatar/?d=mp"}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="pt-28 pb-8 px-4 md:px-8 overflow-y-auto flex-1"
            style={{ maxHeight: "calc(90vh - 2rem)" }}
          >
            <h2 className={`text-2xl font-bold text-center mb-6 capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formData.Nombres} {formData.Apellidos}</h2>
            {submitSuccess && (
              <div className={`mb-4 p-3 rounded-lg text-center ${darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                ¡Usuario actualizado con éxito!
              </div>
            )}
            {formErrors.form && (
              <div className={`mb-4 p-3 rounded-lg text-center ${darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {formErrors.form}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombres</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="Nombres"
                    value={formData.Nombres}
                    readOnly
                    className={`border rounded-lg w-full p-2.5 cursor-not-allowed pr-8 ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200'}`}
                  />
                  <span className="absolute right-2"><LockIcon darkMode={darkMode}/></span>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Apellidos</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="Apellidos"
                    value={formData.Apellidos}
                    readOnly
                    className={`border rounded-lg w-full p-2.5 cursor-not-allowed pr-8 ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200'}`}
                  />
                  <span className="absolute right-2"><LockIcon darkMode={darkMode}/></span>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Correo electrónico</label>
                <input
                  type="email"
                  name="Correo"
                  value={formData.Correo}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'} 
                    ${formErrors.Correo ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                />
                {formErrors.Correo && (
                  <span className={`text-xs mt-1 block ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.Correo}</span>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>País</label>
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cuenta conectada</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="Cuenta_conectada"
                    value={formData.Cuenta_conectada}
                    readOnly
                    className={`border rounded-lg w-full p-2.5 cursor-not-allowed pr-8 ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200'}`}
                  />
                  <span className="absolute right-2"><LockIcon darkMode={darkMode}/></span>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rol*</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'}
                    ${formErrors.rol ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="administrador">Administrador</option>
                  <option value="cliente">Cliente</option>
                </select>
                {formErrors.rol && (
                  <span className={`text-xs mt-1 block ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.rol}</span>
                )}
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition-colors ${darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 shadow-sm'}`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold transition-colors ${darkMode 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditarUsuario