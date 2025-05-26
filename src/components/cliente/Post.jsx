import React, { useState, useEffect } from 'react'
import { API_URL } from '../../../ConfigPort&Host'
import UseCrud from '../../hook/Crud'
import DashboardSidebar from './SidebarCliente';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTheme } from '../../../DarkMode'
import { Brush } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../AuthContext'
import { useTranslation } from 'react-i18next'

const Post = () => {
    const { darkMode } = useTheme();
    const { t } = useTranslation();
    const BASEURL = `${API_URL}/form/obtener-todo`
    const { getApi, response, loading, error } = UseCrud(BASEURL)
    
    const BASEURL2 = `${API_URL}/form/obtener-filtro`
    const { getApi: filtrarXfecha, response: responseFiltro, loading: loadingFiltro } = UseCrud(BASEURL2)

    const [fechaPost, setFechaPost] = useState({
        fecha_post: ''
    })

    const navigate = useNavigate()
    const { auth } = useAuth();

    const [posts, setPosts] = useState([])
    const [todosLosPosts, setTodosLosPosts] = useState([])
    const [mostrarFiltro, setMostrarFiltro] = useState(false)
    const [filtroActivo, setFiltroActivo] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 6
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
    const totalPages = Math.ceil(posts.length / postsPerPage)

    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0') 
    const dd = String(today.getDate()).padStart(2, '0')
    const maxDate = `${yyyy}-${mm}-${dd}`

    const formatearFecha = (fecha) => {
        if (!fecha) return ''
        const opciones = { 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric',
            timeZone: 'UTC'
        }
       
         try {
            const date = new Date(fecha);
            if (isNaN(date.getTime())) {
                return t('fecha_invalida');
            }
            return date.toLocaleDateString('es-ES', opciones);
        } catch (e) {
            console.error('Error formateando fecha:', fecha, e);
            return t('fecha_invalida');
        }
    }

    const formatearHora = (hora) => {
        if (!hora) return ''
        const tiempoSinSegundos = hora.split('.')[0]; 
        const [horas, minutos] = tiempoSinSegundos.split(':');

        const horasNum = parseInt(horas, 10);
        const minutosNum = parseInt(minutos, 10);
        
        if (isNaN(horasNum) || isNaN(minutosNum)) return t('hora_invalida');

        const horasFormateadas = horasNum === 0 ? '0' : String(horasNum);
        const minutosFormateados = minutosNum < 10 ? '0' + minutosNum : String(minutosNum);

        return `${horasFormateadas}:${minutosFormateados}`;
    }

    const formatearNumero = (numero) => {
        if (!numero && numero !== 0) return "--";
        const num = Number(numero);
        if (isNaN(num)) return "--";
        if (Number.isInteger(num)) return num.toLocaleString();
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 5,
            maximumFractionDigits: 10
        });
    };

    useEffect(() => {
        cargarPosts()
    }, [])

    useEffect(() => {
        if (response) {
            setTodosLosPosts(response)
            if (!filtroActivo) {
                setPosts(response)
            }
        }
    }, [response, filtroActivo])

    useEffect(() => {
        if (filtroActivo) {
            if (responseFiltro && responseFiltro.length > 0) {
                setPosts(responseFiltro)
                setCurrentPage(1)
            } else {
                setPosts([])
                setCurrentPage(1)
            }
        } else {
            setPosts(todosLosPosts)
            setCurrentPage(1)
        }
    }, [responseFiltro, filtroActivo, todosLosPosts])

    const cargarPosts = async () => {
        try {
            setFiltroActivo(false)
            setFechaPost({ fecha_post: '' })
            await getApi()
        } catch (error) {
            notifyError(t('error_cargar_posts'))
        }
    }

    const handleFechaChange = (e) => {
        setFechaPost({
            ...fechaPost,
            [e.target.name]: e.target.value
        })
    }

    const handleFiltrar = async (e) => {
        e.preventDefault()
        
        if (!fechaPost.fecha_post) {
            notifyError(t('ingresa_fecha'))
            return
        }

        try {
            setFiltroActivo(true)
            const url = `${BASEURL2}?fecha_post=${fechaPost.fecha_post}`
            await filtrarXfecha(url)
            setMostrarFiltro(false)
        } catch (error) {
            setFiltroActivo(false)
            notifyError(error.response?.data?.message || t('error_filtrar_fecha'))
        }
    }

    const limpiarFiltro = () => {
        setFiltroActivo(false)
        setFechaPost({ fecha_post: '' })
        notifyInfo(t('filtro_limpiado'))
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

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
        })
    }

    const notifyInfo = (message) => {
        toast.info(message, {
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
        })
    }

    const crearformu = () => {
        navigate('/admin-formulario')
    }

    return (
        <>
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
            <div className={`flex h-screen ${darkMode ? 'bg-[#0B0F18]' : 'bg-gray-100'} text-gray-900 dark:text-white`}>
                <DashboardSidebar isAdmin={true} />

                <div className="flex-1  overflow-y-auto p-6">
                    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 ml- space-y-4 md:space-y-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
                        <div>
                            <h1 className={` text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('operaciones_registradas')}</h1>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                                {filtroActivo 
                                    ? posts.length > 0 
                                        ? t('mostrando_operaciones_fecha', { count: posts.length, fecha: formatearFecha(fechaPost.fecha_post) })
                                        : t('no_operaciones_fecha', { fecha: formatearFecha(fechaPost.fecha_post) })
                                    : t('mostrando_operaciones_total', { count: todosLosPosts.length })
                                }
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            {filtroActivo && (todosLosPosts.length > 0 || posts.length > 0) && (
                                <button
                                    onClick={limpiarFiltro}
                                    className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                                        darkMode 
                                            ? 'bg-gray-700 text-white hover:bg-gray-600' 
                                            : 'bg-gray-600 text-white hover:bg-gray-700'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    {t('limpiar_filtro')}
                                </button>
                            )}

                            {auth.isAuthenticated && (
                                <button onClick={crearformu} className={`px-4 py-2 cursor-pointer rounded-md transition-colors flex items-center ${
                                        darkMode 
                                            ? 'bg-blue-700 text-white hover:bg-blue-600' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}>
                                    {t('crear_post')}
                                </button>
                            )}

                            <button
                                onClick={() => setMostrarFiltro(!mostrarFiltro)}
                                className={`px-4 py-2 cursor-pointer rounded-md transition-colors flex items-center ${
                                    darkMode 
                                        ? 'bg-blue-700 text-white hover:bg-blue-600' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                </svg>
                                {mostrarFiltro ? t('ocultar_filtro') : t('filtrar_por_fecha')}
                            </button>
                        </div>
                    </div>

                    {mostrarFiltro && (
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg mb-6 max-w-md mx-auto transform transition-all duration-300 ease-in-out border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <form onSubmit={handleFiltrar} className="space-y-4">
                                <div className="relative">
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        {t('fecha_operacion')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="fecha_post"
                                            value={fechaPost.fecha_post}
                                            onChange={handleFechaChange}
                                            max={maxDate}
                                            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                darkMode 
                                                    ? 'bg-gray-700 border-gray-600 text-white' 
                                                    : 'bg-gray-50 border-gray-300 text-gray-900'
                                            }`}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMostrarFiltro(false)
                                            setFechaPost({ fecha_post: '' })
                                        }}
                                        className={`px-4 py-2 border rounded-lg transition-colors ${
                                            darkMode 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {t('cancelar')}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loadingFiltro}
                                        className={`px-4 py-2 rounded-lg text-white transition-colors ${
                                            darkMode 
                                                ? 'bg-blue-700 hover:bg-blue-600' 
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        } ${loadingFiltro ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loadingFiltro ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {t('filtrando')}
                                            </div>
                                        ) : (
                                            t('filtrar')
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                        {loading || loadingFiltro ? (
                            <div className="col-span-full flex justify-center items-center py-12">
                                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
                            </div>
                        ) : (
                            currentPosts.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                                        {filtroActivo 
                                            ? t('no_operaciones_fecha', { fecha: formatearFecha(fechaPost.fecha_post) })
                                            : t('no_operaciones_total')
                                        }
                                    </p>
                                </div>
                            ) : (
                                currentPosts.map((post, index) => (
                                    <div 
                                        key={`post-${post.id_formulario}-${post.fecha_post}-${index}`} 
                                        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                                    >
                                        {post.imagen && (
                                            <div className="relative h-48">
                                                <img
                                                    src={`${API_URL}/uploads/${post.imagen}`}
                                                    alt={t('grafico_operacion')}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {post.divisa_operada}
                                                    </h3>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {formatearFecha(post.fecha_post)}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    post.tipo_operacion === 'buy' 
                                                        ? darkMode
                                                            ? 'bg-green-900 text-green-200'
                                                            : 'bg-green-100 text-green-800'
                                                        : darkMode
                                                            ? 'bg-red-900 text-red-200'
                                                            : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {post.tipo_operacion === 'buy' ? t('compra') : t('venta')}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('precio_apertura')}</p>
                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatearNumero(post.precio_apertura)}</p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('precio_cierre')}</p>
                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatearNumero(post.precio_cierre)}</p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('stop_loss')}</p>
                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatearNumero(post.stop_loss)}</p>
                                                </div>
                                                <div>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('take_profit')}</p>
                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatearNumero(post.take_profit)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('resultado')}</p>
                                                    <span className={`font-medium ${
                                                        post.resultado === 'ganancia' 
                                                            ? darkMode ? 'text-green-400' : 'text-green-600'
                                                            : post.resultado === 'perdida'
                                                            ? darkMode ? 'text-red-400' : 'text-red-600'
                                                            : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                                                    }`}>
                                                        {post.resultado === 'ganancia' ? t('ganancia') : 
                                                         post.resultado === 'perdida' ? t('perdida') : 
                                                         post.resultado === 'breakeven' ? t('breakeven') : '--'}
                                                    </span>
                                                </div>
                                                <div className="mr-20">
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('profit')}</p>
                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                       $ {formatearNumero(post.profit)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('horario')}</p>
                                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {formatearHora(post.hora_apertura)} - {formatearHora(post.hora_cierre)}
                                                    </p>
                                                </div>
                                            </div>

                                            {post.notas && (
                                                <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('notas')}</p>
                                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{post.notas}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>

                    {posts.length > 0 && (
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 rounded-md transition-colors ${
                                    currentPage === 1
                                        ? darkMode
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : darkMode
                                            ? 'bg-blue-700 text-white hover:bg-blue-600'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {t('anterior')}
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`px-3 py-1 rounded-md transition-colors ${
                                        currentPage === number
                                            ? darkMode
                                                ? 'bg-blue-700 text-white'
                                                : 'bg-blue-600 text-white'
                                            : darkMode
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 rounded-md transition-colors ${
                                    currentPage === totalPages
                                        ? darkMode
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : darkMode
                                            ? 'bg-blue-700 text-white hover:bg-blue-600'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {t('siguiente')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Post