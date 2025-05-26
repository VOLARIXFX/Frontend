import React, { useState } from 'react';
import { API_URL } from '../../../ConfigPort&Host';
import { useAuth } from '../../../AuthContext';
import UseCrud from '../../hook/Crud';
import DashboardSidebar from './Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../DarkMode';

const Formulario = () => {
    const { auth } = useAuth();

    const {darkMode} = useTheme();

    const BASEURL = `${API_URL}/form/enviar/${auth.user.id}`;
    const { postApi, loading, error } = UseCrud(BASEURL);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        tipo_operacion: '',
        divisa_operada: '',
        precio_apertura: '',
        precio_cierre: '',
        resultado: '',
        stop_loss: '',
        take_profit: '',
        hora_apertura: '',
        hora_cierre: '',
        imagen: null,
        notas: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        
        if (!formData.tipo_operacion) {
            errors.tipo_operacion = "Debe seleccionar un tipo de operación";
        }
        if (!formData.divisa_operada?.trim()) {
            errors.divisa_operada = "La divisa es requerida";
        }
        if (!formData.precio_apertura) {
            errors.precio_apertura = "El precio de apertura es requerido";
        }
        if (!formData.precio_cierre) {
            errors.precio_cierre = "El precio de cierre es requerido";
        }
        if (!formData.resultado) {
            errors.resultado = "Debe seleccionar un resultado";
        }
        if (!formData.stop_loss) {
            errors.stop_loss = "El stop loss es requerido";
        }
        if (!formData.take_profit) {
            errors.take_profit = "El take profit es requerido";
        }
        if (!formData.hora_apertura) {
            errors.hora_apertura = "La hora de apertura es requerida";
        }
        if (!formData.hora_cierre) {
            errors.hora_cierre = "La hora de cierre es requerida";
        }
        if (formData.hora_apertura && formData.hora_cierre && formData.hora_apertura >= formData.hora_cierre) {
            errors.hora_cierre = "La hora de cierre debe ser posterior a la hora de apertura";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        const newValue = type === 'file' ? files[0] : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            Object.entries(formErrors).forEach(([field, message]) => {
                toast.error(message);
            });
            return;
        }

        try {
            const dataToSend = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (key === 'imagen' && value instanceof File) {
                        dataToSend.append('imagen', value);
                    } else {
                        dataToSend.append(key, value.toString());
                    }
                }
            });

            const response = await postApi(dataToSend);
            
            if (response) {
                navigate('/obtener-post');
                window.alert('Formulario enviado exitosamente')
                toast.success('Formulario enviado exitosamente');

                
                setFormData({
                    tipo_operacion: '',
                    divisa_operada: '',
                    precio_apertura: '',
                    precio_cierre: '',
                    resultado: '',
                    stop_loss: '',
                    take_profit: '',
                    hora_apertura: '',
                    hora_cierre: '',
                    imagen: null,
                    notas: ''
                });
                setFormErrors({});
            }

        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al enviar el formulario. Por favor, intente nuevamente.');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className={`flex h-screen ${darkMode ? 'bg-[#0B0F18]' : 'bg-gray-100'} text-gray-900 dark:text-white`}>
                <DashboardSidebar isAdmin={true} />

                <div className="flex-1 overflow-y-auto p-6">
                    <h1 className={`text-2xl font-bold mb-6 ml-16 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nueva Operación</h1>
                    <p className={`text-gray-600 ${darkMode ? 'dark:text-gray-400' : ''} ml-16 mb-8`}>Registra una nueva operación para compartir con los usuarios</p>

                    <div className={`bg-white ${darkMode ? 'dark:bg-gray-800' : ''} w-screen p-6 rounded-lg shadow-lg max-w-3xl mx-auto`}>
                        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Detalles de la operación</h2>
                        <p className={`text-gray-600 ${darkMode ? 'dark:text-gray-400' : ''} mb-6`}>Completa la información sobre la operación realizada</p>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Tipo de operación</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600 dark:text-blue-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                                name="tipo_operacion"
                                                value="buy"
                                                checked={formData.tipo_operacion === 'buy'}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Compra</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600 dark:text-blue-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                                name="tipo_operacion"
                                                value="sell"
                                                checked={formData.tipo_operacion === 'sell'}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Venta</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="divisa_operada">Divisa operacion</label>
                                    <input
                                        type="text"
                                        id="divisa_operada"
                                        name="divisa_operada"
                                        value={formData.divisa_operada}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                                        placeholder="Ej: EUR/USD, BTC/USD"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="precio_apertura">Precio de apertura</label>
                                    <input
                                        type="number"
                                        id="precio_apertura"
                                        name="precio_apertura"
                                        value={formData.precio_apertura}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="precio_cierre">Precio de cierre</label>
                                    <input
                                        type="number"
                                        id="precio_cierre"
                                        name="precio_cierre"
                                        value={formData.precio_cierre}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="resultado">Resultado</label>
                                    <select
                                        id="resultado"
                                        name="resultado"
                                        value={formData.resultado}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                                        required
                                    >
                                        <option value="">Seleccionar resultado</option>
                                        <option value="ganancia">Ganancia</option>
                                        <option value="perdida">Pérdida</option>
                                        <option value="breakeven">Breakeven</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="stop_loss">Stop Loss</label>
                                    <input
                                        type="number"
                                        id="stop_loss"
                                        name="stop_loss"
                                        value={formData.stop_loss}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="take_profit">Take Profit</label>
                                    <input
                                        type="number"
                                        id="take_profit"
                                        name="take_profit"
                                        value={formData.take_profit}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="hora_apertura">Hora de apertura</label>
                                    <input
                                        type="time"
                                        id="hora_apertura"
                                        name="hora_apertura"
                                        value={formData.hora_apertura}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="hora_cierre">Hora de cierre</label>
                                    <input
                                        type="time"
                                        id="hora_cierre"
                                        name="hora_cierre"
                                        value={formData.hora_cierre}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="imagen">Imagen del gráfico</label>
                                <div className={`flex items-center justify-center w-full rounded-lg border p-6 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 cursor-pointer rounded-lg">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className={`w-8 h-8 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                            <p className={`mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}><span className="font-semibold">Subir imagen</span> o arrastrar y soltar</p>
                                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Formatos soportados: PNG, JPG, JPEG. Tamaño máximo: 5MB</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" name="imagen" onChange={handleInputChange} accept=".png,.jpg,.jpeg" />
                                    </label>
                                </div>
                                {formData.imagen && <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Archivo seleccionado: {formData.imagen.name}</p>}
                            </div>

                            <div className="mb-6">
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} htmlFor="notas">Comentarios (opcional)</label>
                                <textarea
                                    id="notas"
                                    name="notas"
                                    value={formData.notas}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className={`w-full p-3 rounded border focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
                                    placeholder="Añade comentarios sobre la operación, estrategia utilizada, etc."
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className={`px-6 py-3 border rounded-md transition-colors ${darkMode 
                                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                      : 'border-gray-300 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    onClick={() => {
                                        setFormData({
                                            tipo_operacion: '',
                                            divisa_operada: '',
                                            precio_apertura: '',
                                            precio_cierre: '',
                                            resultado: '',
                                            stop_loss: '',
                                            take_profit: '',
                                            hora_apertura: '',
                                            hora_cierre: '',
                                            imagen: null,
                                            notas: ''
                                        });
                                        setFormErrors({});
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                                        loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </div>
                                    ) : (
                                        'Guardar operación'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Formulario;