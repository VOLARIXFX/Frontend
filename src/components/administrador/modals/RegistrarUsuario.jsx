import React, { useState, useRef } from "react"
import { API_URL } from "../../../../ConfigPort&Host"
import UseCrud from "../../../hook/Crud"
import { useTheme } from "../../../../DarkMode"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

const RegistrarUsuario = ({ isOpen, onClose, onSuccess }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    Nombres: "",
    Apellidos: "",
    Correo: "",
    Cuenta_conectada: "",
    telefono: "",
    pais: "",
    password: "",
    confirmarPassword: "",
    rol: "",
  })
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputFileRef = useRef(null)

  const BASE_URL = `${API_URL}/users/register`
  const { postApi } = UseCrud(BASE_URL)

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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImagen(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.Nombres?.trim()) errors.Nombres = "El nombre es requerido"
    if (!formData.Apellidos?.trim()) errors.Apellidos = "Los apellidos son requeridos"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.Correo?.trim()) {
      errors.Correo = "El correo es requerido"
    } else if (!emailRegex.test(formData.Correo)) {
      errors.Correo = "El formato del correo es inválido"
    }
    if (!formData.password) {
      errors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres"
    }
    if (!formData.confirmarPassword) {
      errors.confirmarPassword = "Debe confirmar la contraseña"
    } else if (formData.password !== formData.confirmarPassword) {
      errors.confirmarPassword = "Las contraseñas no coinciden"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "confirmarPassword") data.append(key, value)
    })
    if (imagen) data.append("imagen", imagen)

    try {
      const response = await postApi(data)
      if (response) {
        notifySuccess('Usuario registrado correctamente')
        setSubmitSuccess(true)
        setTimeout(() => {
          onSuccess()
          setSubmitSuccess(false)
          setFormData({
            Nombres: "",
            Apellidos: "",
            Correo: "",
            Cuenta_conectada: "",
            telefono: "",
            pais: "",
            password: "",
            confirmarPassword: "",
            rol: "",
          })
          setImagen(null)
          setPreview(null)
        }, 1500)
      } else {
        throw new Error("No se recibió respuesta del servidor")
      }
    } catch (err) {
      console.error("Error al registrar:", err)
      notifyError(err.response?.data?.message || "Error al registrar. Intente de nuevo.")
      setFormErrors({
        ...formErrors,
        form: err.response?.data?.message || "Error al registrar. Intente de nuevo.",
      })
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30">
        <div className={`rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col ${darkMode ? 'bg-gray-800 shadow-gray-900/50' : 'bg-white shadow-gray-200/50 border border-gray-200'}`}>
          {/* Header verde y avatar */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-32 flex flex-col items-center justify-end relative">
            <button className={`absolute top-4 left-4 rounded-full p-2 transition ${darkMode ? 'bg-gray-700/70 hover:bg-gray-700' : 'bg-white/90 hover:bg-white shadow-md'}`} onClick={onClose}>
              <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="absolute left-1/2 -bottom-12 transform -translate-x-1/2">
              <div
                className={`w-24 h-24 rounded-full shadow-lg flex items-center justify-center border-4 cursor-pointer hover:ring-2 hover:ring-emerald-400 transition ${darkMode ? 'bg-gray-700 border-gray-700' : 'bg-white border-white shadow-gray-200'}`}
                onClick={() => inputFileRef.current.click()}
                title="Haz clic para agregar foto"
              >
                <img
                  src={preview || "https://www.gravatar.com/avatar/?d=mp"}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  ref={inputFileRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="pt-28 pb-8 px-8 overflow-y-auto flex-1"
            style={{ maxHeight: "calc(90vh - 2rem)" }}
          >
            <h2 className={`text-2xl font-bold text-center mb-6 capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {formData.Nombres || "Nuevo usuario"}
            </h2>
            {submitSuccess && (
              <div className={`mb-4 p-3 rounded-lg text-center ${darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                ¡Usuario registrado con éxito!
              </div>
            )}
            {formErrors.form && (
              <div className={`mb-4 p-3 rounded-lg text-center ${darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {formErrors.form}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombres*</label>
                <input
                  type="text"
                  name="Nombres"
                  value={formData.Nombres}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'} 
                    ${formErrors.Nombres ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                />
                {formErrors.Nombres && (
                  <span className={`text-xs mt-1 block ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.Nombres}</span>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Apellidos*</label>
                <input
                  type="text"
                  name="Apellidos"
                  value={formData.Apellidos}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'} 
                    ${formErrors.Apellidos ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                />
                {formErrors.Apellidos && (
                  <span className={`text-xs mt-1 block ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.Apellidos}</span>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Correo electrónico*</label>
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
                <input
                  type="text"
                  name="Cuenta_conectada"
                  value={formData.Cuenta_conectada}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contraseña*</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'} 
                    ${formErrors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                />
                {formErrors.password && (
                  <span className={`text-xs mt-1 block ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.password}</span>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirmar contraseña*</label>
                <input
                  type="password"
                  name="confirmarPassword"
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'} 
                    ${formErrors.confirmarPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''}`}
                />
                {formErrors.confirmarPassword && (
                  <span className={`text-xs mt-1 block ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{formErrors.confirmarPassword}</span>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Rol</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className={`border rounded-lg w-full p-2.5 transition-colors ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm'}`}
                >
                  <option value="administrador">Administrador</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 shadow-sm'}`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${darkMode 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'}`}
              >
                {loading ? "Registrando..." : "Registrar usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default RegistrarUsuario
