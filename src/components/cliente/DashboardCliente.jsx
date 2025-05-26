import { useEffect, useState } from "react"
import { API_URL } from "../../../ConfigPort&Host"
import SidebarCliente from "../cliente/SidebarCliente"
import { useTheme } from "../../../DarkMode"
import UseCrud from "../../hook/Crud"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import React from "react"
import { useTranslation } from 'react-i18next'

const DashboardCliente = () => {
  const { darkMode } = useTheme()
  const { t } = useTranslation()
  const [kpis, setKpis] = useState(null)
  const [ultimasOperaciones, setUltimasOperaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingOps, setLoadingOps] = useState(true)
  const [expandedOperationId, setExpandedOperationId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const { getApi: getKpis } = UseCrud(`${API_URL}`)
  const BASEURL_ULTIMOS_POST = `${API_URL}/users/ultimospost`
  const { getApi: getUltimasOps } = UseCrud(BASEURL_ULTIMOS_POST, false)

  useEffect(() => {
    const fetchKpis = async () => {
      setLoading(true)
      try {
        const fechaActual = new Date();
        const fechaReferencia = fechaActual.toISOString().split('T')[0];
        const kpisUrl = `${API_URL}/estadisticas/mensual?fecha_referencia=${fechaReferencia}`;

        const data = await getKpis(kpisUrl, false)
   
        if (data && data[0]) {
          const kpisData = {
            ...data[0],
            rentabilidad: Number.parseFloat(data[0].rentabilidad) || 0,
            drawdown_max: Number.parseFloat(data[0].drawdown_max) || 0,
            drawdown_pct: Number.parseFloat(data[0].drawdown_pct) || 0,
            balance_final: Number.parseFloat(data[0].balance_final) || 0,
            max_balance: Number.parseFloat(data[0].max_balance) || 0,
            operaciones_totales: Number.parseInt(data[0].operaciones_totales) || 0,
            operaciones_ganadoras: Number.parseInt(data[0].operaciones_ganadoras) || 0,
            operaciones_perdedoras: Number.parseInt(data[0].operaciones_perdedoras) || 0,
            win_rate: Number.parseFloat(data[0].win_rate) || 0,
            promedio_ganancia: Number.parseFloat(data[0].promedio_ganancia) || 0,
            promedio_perdida: Number.parseFloat(data[0].promedio_perdida) || 0,
            rr_ratio: Number.parseFloat(data[0].rr_ratio) || 0
          }
          setKpis(kpisData)
        } else {
          setKpis(null)
        }
      } catch (err) {
        console.error('Error al obtener KPIs:', err);
        setKpis(null)
      }
      setLoading(false)
    }
    fetchKpis()
  }, [])
  useEffect(() => {
    const fetchUltimas = async () => {
      setLoadingOps(true)
      try {
        const data = await getUltimasOps(BASEURL_ULTIMOS_POST, false)
        if (data && data.formularios) {
          setUltimasOperaciones(data.formularios)
        } else {
          setUltimasOperaciones([])
        }
      } catch (err) {
        setUltimasOperaciones([])
      }
      setLoadingOps(false)
    }
    fetchUltimas()
  }, [])

  const totalPages = Math.ceil(ultimasOperaciones.length / itemsPerPage);

  const currentItems = ultimasOperaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "--"
    try {
      const date = new Date(fecha)
      if (isNaN(date.getTime())) {
        return t("fecha_invalida")
      }
      const options = { year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }
      return date.toLocaleString("es-ES", options)
    } catch (e) {
      return t("fecha_invalida")
    }
  }

  const formatearHora = (hora) => {
    if (!hora) return ''
    const tiempoSinSegundos = hora.split('.')[0]; 
    const [horas, minutos] = tiempoSinSegundos.split(':');

    const horasNum = parseInt(horas, 10);
    const minutosNum = parseInt(minutos, 10);
    
    if (isNaN(horasNum) || isNaN(minutosNum)) return t("hora_invalida");

    const horasFormateadas = horasNum < 10 ? '0' + horasNum : String(horasNum);
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

  return (
    <div className="flex h-screen">
      <SidebarCliente/>
      <div
        className={`flex-1 p-6 ${darkMode ? "bg-[#0B0F18] w-full text-white" : "bg-gray-100 w-full text-gray-900"} transition-colors`}
      >
        <h1 className="text-3xl font-bold mb-2">{t("dashboard")}</h1>
        <p className="mb-6 text-base text-blue-300">{t("bienvenido_de_nuevo")}</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div
            className={`rounded-xl p-5 shadow-lg border ${darkMode ? "bg-[#232846] border-blue-700" : "bg-white border-blue-300"}`}
          >
            <div className="text-sm text-blue-400 font-semibold mb-1 flex items-center gap-1">
              {t("balance")} <span className="text-xs">$</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {loading
                ? "..."
                : kpis
                  ? `$${kpis.balance_final?.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  : "--"}
            </div>
            <div className="text-xs text-green-400">
              {loading ? "" : kpis ? `↑ ${Number(kpis.rentabilidad).toFixed(2)}% ${t("este_mes")}` : ""}
            </div>
          </div>
          <div
            className={`rounded-xl p-5 shadow-lg border ${darkMode ? "bg-[#232846] border-blue-700" : "bg-white border-blue-300"}`}
          >
            <div className="text-sm text-blue-400 font-semibold mb-1">{t("rentabilidad")}</div>
            <div className="text-2xl font-bold mb-1">
              {loading ? "..." : kpis ? `${Number(kpis.rentabilidad).toFixed(2)}%` : "--"}
            </div>
            <div className="text-xs text-green-400">
              {loading ? "" : kpis ? t("win_rate", { value: Number(kpis.win_rate).toFixed(1) }) : ""}
            </div>
          </div>
          <div
            className={`rounded-xl p-5 shadow-lg border ${darkMode ? "bg-[#232846] border-blue-700" : "bg-white border-blue-300"}`}
          >
            <div className="text-sm text-blue-400 font-semibold mb-1">{t("drawdown")}</div>
            <div className="text-2xl font-bold mb-1">
              {loading ? "..." : kpis ? `${Number(kpis.drawdown_pct).toFixed(2)}%` : "--"}
            </div>
            <div className="text-xs text-red-400">{loading ? "" : kpis ? t("max_mensual") : ""}</div>
          </div>
          <div
            className={`rounded-xl p-5 shadow-lg border ${darkMode ? "bg-[#232846] border-blue-700" : "bg-white border-blue-300"}`}
          >
            <div className="text-sm text-blue-400 font-semibold mb-1">{t("operaciones")}</div>
            <div className="text-2xl font-bold mb-1">
              {loading ? "..." : kpis ? `${kpis.operaciones_ganadoras}/${kpis.operaciones_totales}` : "--"}
            </div>
            <div className="text-xs text-blue-400">
              {loading ? "" : kpis ? `${kpis.operaciones_perdedoras} ${t("perdidas")}` : ""}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-6">{t("ultimas_operaciones")}</h2>
          {loadingOps ? (
            <div className={darkMode ? 'text-blue-400' : 'text-blue-700'}>{t("cargando_operaciones")}</div>
          ) : ultimasOperaciones.length === 0 ? (
            <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t("no_operaciones_recientes")}</div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((op, idx) => (
                <div
                  key={op.id_operacion || idx}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm px-4 py-3 cursor-pointer transform transition-all duration-300 hover:scale-[1.01] border flex flex-col`}
                  onClick={() => setExpandedOperationId(expandedOperationId === op.id_operacion ? null : op.id_operacion)}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex-shrink-0 mr-4">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {op.divisa_operada || t("sin_divisa")}
                      </h3>
                    </div>

                    <div className="flex items-center justify-center flex-grow gap-6">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatearFecha(op.fecha_post)}
                      </p>

                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <strong>{t("resultado")} : </strong>
                         <span className={`font-semibold ${op.resultado === 'ganancia'
                              ? darkMode ? 'text-green-400' : 'text-green-600'
                              : op.resultado === 'perdida'
                              ? darkMode ? 'text-red-400' : 'text-red-600'
                              : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                          }`}>
                          {op.resultado ? t(op.resultado) : "--"}
                        </span>
                      </p>

                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <strong>{t("profit")}:</strong> ${formatearNumero(op.profit)}
                      </p>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${op.tipo_operacion?.toLowerCase() === 'buy'
                          ? darkMode
                            ? 'bg-green-900 text-green-200'
                            : 'bg-green-100 text-green-800'
                          : darkMode
                            ? 'bg-red-900 text-red-200'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {op.tipo_operacion?.toUpperCase() || "N/A"}
                      </span>
                    </div>
                  </div>

                  {expandedOperationId === op.id_operacion && (
                    <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} w-full text-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-b-lg`}>
                      <div className="flex flex-col md:flex-row gap-4">
                        {op.imagen && (
                          <div className="md:w-1/3 flex justify-center items-start">
                            <div className="max-h-40 overflow-hidden rounded-md flex justify-center items-center bg-gray-700">
                              <img
                                src={`${API_URL}/uploads/${op.imagen}`}
                                alt={t("grafico_operacion")}
                                className="max-h-40 object-contain"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="md:w-2/3">
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t("tipo")}</p>
                                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                  op.tipo_operacion?.toLowerCase() === 'buy'
                                    ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                    : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                }`}>
                                  {op.tipo_operacion?.toUpperCase() || "N/A"}
                                </span>
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t("resultado")}</p>
                                <span className={`font-semibold ${
                                  op.resultado === 'ganancia'
                                    ? darkMode ? 'text-green-400' : 'text-green-600'
                                    : op.resultado === 'perdida'
                                    ? darkMode ? 'text-red-400' : 'text-red-600'
                                    : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                                }`}>
                                  {op.resultado ? t(op.resultado) : "--"}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t("precio_apertura")}</p>
                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{op.precio_apertura || "--"}</p>
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t("precio_cierre")}</p>
                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{op.precio_cierre || "--"}</p>
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t("stop_loss")}</p>
                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{op.stop_loss || "--"}</p>
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t("take_profit")}</p>
                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{op.take_profit || "--"}</p>
                              </div>
                            </div>

                            <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t("horario")}</p>
                              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {op.hora_apertura && op.hora_cierre ? `${formatearHora(op.hora_apertura)} - ${formatearHora(op.hora_cierre)}` : "--"}
                              </p>
                            </div>
                          </div>

                          {op.notas && (
                            <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t("notas")}</p>
                              <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{op.notas}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {ultimasOperaciones.length > itemsPerPage && (
            <div className={`flex justify-center items-center mt-6 space-x-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300'} text-white disabled:text-gray-400`}
              >
                {t("anterior")}
              </button>
              <span>{t("pagina", { current: currentPage, total: totalPages })}</span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300'} text-white disabled:text-gray-400`}
              >
                {t("siguiente")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardCliente