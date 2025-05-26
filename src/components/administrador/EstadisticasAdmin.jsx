import React from "react"
import { useState, useEffect } from "react"
import UseCrud from "../../hook/Crud"
import { API_URL } from "../../../ConfigPort&Host"
import { useTheme } from "../../../DarkMode"
import ReactApexChart from "react-apexcharts"
import Sidebar from "./Sidebar"
const EstadisticasAdmin = () => {
  const [filterType, setFilterType] = useState("actual")
  const [actualPeriod, setActualPeriod] = useState("mensual")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [selectedPastMonth, setSelectedPastMonth] = useState(new Date().getMonth() + 1)
  const [selectedPastMonthYear, setSelectedPastMonthYear] = useState(new Date().getFullYear())
  const [selectedSemester, setSelectedSemester] = useState(1)
  const [selectedSemesterYear, setSelectedSemesterYear] = useState(new Date().getFullYear())
  const [selectedPastYear, setSelectedPastYear] = useState(new Date().getFullYear() - 1)
  const [loading, setLoading] = useState(false)
  const [activeChart, setActiveChart] = useState("balance")
  const [activeTab, setActiveTab] = useState("actual")
  const { darkMode } = useTheme()
  const currentYear = new Date().getFullYear()
  const [realtimeStats, setRealtimeStats] = useState(null)

  const { response: estadisticas, getApi } = UseCrud(`${API_URL}/estadisticas`)

  useEffect(() => {
    const fetchRealtimeStats = async () => {
      try {
        const url = `${API_URL}/estadisticas/anual?fecha_referencia=${currentYear}-01-01`
        const { getApi: getApiAux } = UseCrud(url)
        const data = await getApiAux(url, false)
        setRealtimeStats(data?.[0] || null)
      } catch (e) {
        setRealtimeStats(null)
      }
    }
    fetchRealtimeStats()
  }, [currentYear])

  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = 2020; year <= currentYear; year++) {
      years.push(year)
    }
    return years
  }

  const generateAvailableMonths = (year) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const months = [
      { value: 1, label: "Enero" },
      { value: 2, label: "Febrero" },
      { value: 3, label: "Marzo" },
      { value: 4, label: "Abril" },
      { value: 5, label: "Mayo" },
      { value: 6, label: "Junio" },
      { value: 7, label: "Julio" },
      { value: 8, label: "Agosto" },
      { value: 9, label: "Septiembre" },
      { value: 10, label: "Octubre" },
      { value: 11, label: "Noviembre" },
      { value: 12, label: "Diciembre" },
    ]
    if (year === currentYear) {
      return months.filter((month) => month.value <= currentMonth)
    }
    return months
  }

  const getWeeksInMonth = (year, month) => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const firstDayOfWeek = firstDay.getDay()
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    const daysInMonth = lastDay.getDate()
    const totalDays = daysInMonth + adjustedFirstDay
    const weeks = Math.ceil(totalDays / 7)
    return weeks
  }

  const generateAvailableSemesters = (year) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const currentSemester = Math.ceil(currentMonth / 6)
    const semesters = [
      { value: 1, label: "1° Semestre (Ene - Jun)" },
      { value: 2, label: "2° Semestre (Jul - Dic)" },
    ]
    if (year === currentYear) {
      return semesters.filter((semester) => semester.value <= currentSemester)
    }
    return semesters
  }

  const calculateWeekDate = (year, month, weekNumber) => {
    const firstDay = new Date(year, month - 1, 1)
    const firstDayOfWeek = firstDay.getDay()
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    const firstMonday = new Date(firstDay)
    firstMonday.setDate(1 - adjustedFirstDay)
    const targetDate = new Date(firstMonday)
    targetDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7)
    return targetDate.toISOString().split("T")[0]
  }

  const getCurrentPeriodLabel = () => {
    switch (filterType) {
      case "actual":
        const labels = {
          semanal: "Semana Actual",
          mensual: "Mes Actual",
          semestral: "Semestre Actual",
          anual: "Año Actual",
        }
        return labels[actualPeriod]
      case "semanas_pasadas":
        const monthNames = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        return `Semana ${selectedWeek} de ${monthNames[selectedMonth]} ${selectedYear}`
      case "meses_pasados":
        const pastMonthNames = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        return `${pastMonthNames[selectedPastMonth]} ${selectedPastMonthYear}`
      case "semestres_pasados":
        return `${selectedSemester}° Semestre ${selectedSemesterYear}`
      case "años_pasados":
        return `Año ${selectedPastYear}`
      default:
        return ""
    }
  }

  useEffect(() => {
    setLoading(true)
    let endpoint = ""
    const params = new URLSearchParams()
    switch (filterType) {
      case "actual":
        endpoint = `/estadisticas/${actualPeriod}`
        break
      case "semanas_pasadas":
        endpoint = `/estadisticas/semanal`
        const weekDate = calculateWeekDate(selectedYear, selectedMonth, selectedWeek)
        params.append("fecha_referencia", weekDate)
        break
      case "meses_pasados":
        endpoint = `/estadisticas/mensual`
        const monthDate = `${selectedPastMonthYear}-${selectedPastMonth.toString().padStart(2, "0")}-01`
        params.append("fecha_referencia", monthDate)
        break
      case "semestres_pasados":
        endpoint = `/estadisticas/semestral`
        const semesterMonth = selectedSemester === 1 ? "01" : "07"
        const semesterDate = `${selectedSemesterYear}-${semesterMonth}-01`
        params.append("fecha_referencia", semesterDate)
        break
      case "años_pasados":
        endpoint = `/estadisticas/anual`
        const yearDate = `${selectedPastYear}-01-01`
        params.append("fecha_referencia", yearDate)
        break
    }
    const finalUrl = params.toString() ? `${API_URL}${endpoint}?${params.toString()}` : `${API_URL}${endpoint}`
    getApi(finalUrl, false)
      .then((data) => {
        console.log("Estadísticas recibidas:", data)
      })
      .catch((error) => console.error("Error al obtener estadísticas:", error))
      .finally(() => setLoading(false))
  }, [filterType, actualPeriod, selectedMonth, selectedYear, selectedWeek, selectedPastMonth, selectedPastMonthYear, selectedSemester, selectedSemesterYear, selectedPastYear])

  const obtenerAnosConDatos = () => {
    return [2022, 2023, 2024]
  }

  const anosDisponibles = obtenerAnosConDatos()

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`
  }

  // --- Configuración de gráficas ApexCharts ---
  const resumen = estadisticas?.[0] || {}
  const totalOps = Number(resumen.operaciones_totales) || 0
  const ganadoras = Number(resumen.operaciones_ganadoras) || 0
  const perdedoras = Number(resumen.operaciones_perdedoras) || 0
  const winRate = Number(resumen.win_rate) || 0
  const rentabilidad = Number(resumen.rentabilidad) || 0
  const promedioGanancia = Number(resumen.promedio_ganancia) || 0
  const promedioPerdida = Number(resumen.promedio_perdida) || 0
  const rrRatio = Number(resumen.rr_ratio) || 0
  const drawdownMax = Number(resumen.drawdown_max) || 0
  const balanceFinal = Number(resumen.balance_final) || 0

  const balanceData = realtimeStats?.balance_historico?.length > 0 
    ? realtimeStats.balance_historico 
    : []

  const drawdownData = realtimeStats?.drawdown_historico?.length > 0 
    ? realtimeStats.drawdown_historico 
    : []

  const pieData = [
    Number(realtimeStats?.operaciones_ganadoras) || 0,
    Number(realtimeStats?.operaciones_perdedoras) || 0,
  ]

  const pieLabels = ["Ganadoras", "Perdedoras"]

  const chartColors = darkMode
    ? ["#10B981", "#EF4444", "#6366F1", "#F59E42"]
    : ["#22d3ee", "#f87171", "#6366F1", "#F59E42"]

  const balanceChartOptions = {
    chart: {
      type: "line",
      height: 240,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    stroke: {
      lineCap: "round",
      curve: "smooth",
      width: 3
    },
    dataLabels: {
      enabled: false,
    },
    colors: [darkMode ? "#10B981" : "#22d3ee"],
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: darkMode ? "#d1d5db" : "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: ["Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    },
    yaxis: {
      labels: {
        style: {
          colors: darkMode ? "#d1d5db" : "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
        formatter: (value) => `$${value}`
      },
    },
    grid: {
      show: true,
      borderColor: darkMode ? "#374151" : "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: darkMode ? "dark" : "light",
      y: {
        formatter: (value) => `$${value}`
      }
    },
  }
  const drawdownChartOptions = {
    chart: {
      type: "bar",
      height: 240,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: [darkMode ? "#EF4444" : "#f87171"],
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: darkMode ? "#d1d5db" : "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
      },
      categories: ["Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    },
    yaxis: {
      labels: {
        style: {
          colors: darkMode ? "#d1d5db" : "#616161",
          fontSize: "12px",
          fontFamily: "inherit",
          fontWeight: 400,
        },
        formatter: (value) => `${value}%`
      },
    },
    grid: {
      show: true,
      borderColor: darkMode ? "#374151" : "#dddddd",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 5,
        right: 20,
      },
    },
    fill: {
      opacity: 0.8,
    },
    tooltip: {
      theme: darkMode ? "dark" : "light",
      y: {
        formatter: (value) => `${value}%`
      }
    },
  }
  const pieChartOptions = {
    chart: {
      type: "pie",
      width: 280,
      height: 280,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    labels: pieLabels,
    colors: [darkMode ? "#10B981" : "#22d3ee", darkMode ? "#EF4444" : "#f87171"],
    legend: {
      show: true,
      position: 'bottom',
      labels: {
        colors: darkMode ? "#d1d5db" : "#374151"
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontFamily: "inherit",
        fontWeight: "500",
      },
      formatter: function (val) {
        return val.toFixed(1) + "%"
      },
    },
    tooltip: {
      theme: darkMode ? "dark" : "light",
    },
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-[#0B0F18]" : "bg-gradient-to-br from-slate-50 to-slate-100"}`}>
      {/* Sidebar fijo */}
      <div className="flex-shrink-0">
        <Sidebar/>
      </div>

      {/* Main Content - Ahora se ajusta dinámicamente */}
      <div className="flex-1 min-h-screen transition-all duration-300 ease-in-out">
        <div className="p-2 sm:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
            {/* Filtro moderno integrado */}
            <div className={`max-w-6xl mx-auto w-full mb-4`}>
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm p-4 mb-4`}>
                <h2 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-3`}>Tipo de Filtro</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <button
                    onClick={() => setFilterType("actual")}
                    className={`p-4 rounded-lg border-2 transition-all ${filterType === "actual" ? "border-blue-500 bg-blue-50 text-blue-700" : darkMode ? "border-gray-700 text-gray-200 hover:border-gray-500" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="font-medium">Período Actual</div>
                      <div className="text-sm opacity-75">Datos actuales</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setFilterType("semanas_pasadas")}
                    className={`p-4 rounded-lg border-2 transition-all ${filterType === "semanas_pasadas" ? "border-blue-500 bg-blue-50 text-blue-700" : darkMode ? "border-gray-700 text-gray-200 hover:border-gray-500" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📅</div>
                      <div className="font-medium">Semanas Pasadas</div>
                      <div className="text-sm opacity-75">Por mes y semana</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setFilterType("meses_pasados")}
                    className={`p-4 rounded-lg border-2 transition-all ${filterType === "meses_pasados" ? "border-blue-500 bg-blue-50 text-blue-700" : darkMode ? "border-gray-700 text-gray-200 hover:border-gray-500" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🗓️</div>
                      <div className="font-medium">Meses Pasados</div>
                      <div className="text-sm opacity-75">Cualquier mes</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setFilterType("semestres_pasados")}
                    className={`p-4 rounded-lg border-2 transition-all ${filterType === "semestres_pasados" ? "border-blue-500 bg-blue-50 text-blue-700" : darkMode ? "border-gray-700 text-gray-200 hover:border-gray-500" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📆</div>
                      <div className="font-medium">Semestres Pasados</div>
                      <div className="text-sm opacity-75">Por semestre</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setFilterType("años_pasados")}
                    className={`p-4 rounded-lg border-2 transition-all ${filterType === "años_pasados" ? "border-blue-500 bg-blue-50 text-blue-700" : darkMode ? "border-gray-700 text-gray-200 hover:border-gray-500" : "border-gray-200 hover:border-gray-300 text-gray-700"}`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🗃️</div>
                      <div className="font-medium">Años Pasados</div>
                      <div className="text-sm opacity-75">Cualquier año</div>
                    </div>
                  </button>
                </div>
              </div>
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-sm p-4 mb-4`}>
                <h2 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-3`}>Configuración del Filtro</h2>
                {/* Período Actual */}
                {filterType === "actual" && (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                        Selecciona el tipo de período actual
                      </label>
                      <select
                        value={actualPeriod}
                        onChange={(e) => setActualPeriod(e.target.value)}
                        className={`w-full md:w-1/3 px-3 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="semanal">Semana Actual</option>
                        <option value="mensual">Mes Actual</option>
                        <option value="semestral">Semestre Actual</option>
                        <option value="anual">Año Actual</option>
                      </select>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">
                        <strong>Período seleccionado:</strong> {getCurrentPeriodLabel()}
                      </p>
                      <p className="text-blue-600 text-sm mt-1">
                        Este filtro traerá las estadísticas del período actual en curso.
                      </p>
                    </div>
                  </div>
                )}
                {/* Semanas Pasadas */}
                {filterType === "semanas_pasadas" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Año</label>
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className={`w-full px-3 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {generateYears().map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Mes</label>
                        <select
                          value={selectedMonth}
                          onChange={(e) => {
                            setSelectedMonth(Number(e.target.value))
                            setSelectedWeek(1)
                          }}
                          className={`w-full px-3 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {generateAvailableMonths(selectedYear).map((month) => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Semana</label>
                        <select
                          value={selectedWeek}
                          onChange={(e) => setSelectedWeek(Number(e.target.value))}
                          className={`w-full px-3 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {Array.from({ length: getWeeksInMonth(selectedYear, selectedMonth) }, (_, i) => (
                            <option key={i + 1} value={i + 1}>Semana {i + 1}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800">
                        <strong>Período seleccionado:</strong> {getCurrentPeriodLabel()}
                      </p>
                      <p className="text-green-600 text-sm mt-1">Semana específica dentro del mes seleccionado.</p>
                    </div>
                  </div>
                )}
                {/* Meses Pasados */}
                {filterType === "meses_pasados" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Año</label>
                        <select
                          value={selectedPastMonthYear}
                          onChange={(e) => setSelectedPastMonthYear(Number(e.target.value))}
                          className={`w-full px-3 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {generateYears().map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Mes</label>
                        <select
                          value={selectedPastMonth}
                          onChange={(e) => setSelectedPastMonth(Number(e.target.value))}
                          className={`w-full px-3 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {generateAvailableMonths(selectedPastMonthYear).map((month) => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-800">
                        <strong>Período seleccionado:</strong> {getCurrentPeriodLabel()}
                      </p>
                      <p className="text-purple-600 text-sm mt-1">Mes completo del año seleccionado.</p>
                    </div>
                  </div>
                )}
                {/* Semestres Pasados */}
                {filterType === "semestres_pasados" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Año</label>
                        <select
                          value={selectedSemesterYear}
                          onChange={(e) => setSelectedSemesterYear(Number(e.target.value))}
                          className={`w-full px-3 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {generateYears().map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Semestre</label>
                        <select
                          value={selectedSemester}
                          onChange={(e) => setSelectedSemester(Number(e.target.value))}
                          className={`w-full px-3 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {generateAvailableSemesters(selectedSemesterYear).map((semester) => (
                            <option key={semester.value} value={semester.value}>{semester.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-orange-800">
                        <strong>Período seleccionado:</strong> {getCurrentPeriodLabel()}
                      </p>
                      <p className="text-orange-600 text-sm mt-1">Semestre completo (6 meses) del año seleccionado.</p>
                    </div>
                  </div>
                )}
                {/* Años Pasados */}
                {filterType === "años_pasados" && (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Selecciona el año</label>
                      <select
                        value={selectedPastYear}
                        onChange={(e) => setSelectedPastYear(Number(e.target.value))}
                        className={`w-full md:w-1/3 px-3 py-2 border ${darkMode ? "border-gray-700 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-900"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        {generateYears().filter((year) => year < new Date().getFullYear()).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">
                        <strong>Período seleccionado:</strong> {getCurrentPeriodLabel()}
                      </p>
                      <p className="text-red-600 text-sm mt-1">Año completo (12 meses) seleccionado.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Chart */}
            <div className={`${darkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-xl border ${darkMode ? "border-gray-700" : "border-gray-200"} p-3 sm:p-4 lg:p-6`}>
              <div className="mb-2">
                <h3 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Resumen visual de tus estadísticas</h3>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Gráficas generadas con los datos actuales. ¡Explora tu rendimiento!</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gráfica de barras: Ganadoras vs Perdedoras */}
                <div className="flex flex-col items-center justify-center">
                  <h4 className={`mb-2 font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Operaciones</h4>
                  <ReactApexChart
                    options={{
                      chart: { type: 'bar', toolbar: { show: false } },
                      xaxis: { categories: ['Ganadoras', 'Perdedoras'] },
                      colors: ['#10B981', '#EF4444'],
                      plotOptions: { bar: { borderRadius: 6, columnWidth: '50%' } },
                      dataLabels: { enabled: true },
                      legend: { show: false },
                    }}
                    series={[
                      {
                        name: 'Operaciones',
                        data: [ganadoras, perdedoras]
                      }
                    ]}
                    type="bar"
                    height={220}
                  />
                </div>
                {/* Gráfica de barras horizontales: Promedio de ganancia vs pérdida */}
                <div className="flex flex-col items-center justify-center">
                  <h4 className={`mb-2 font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Promedio</h4>
                  <ReactApexChart
                    options={{
                      chart: { type: 'bar', toolbar: { show: false } },
                      xaxis: { categories: ['Ganancia', 'Pérdida'] },
                      colors: ['#3B82F6', '#F59E42'],
                      plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '50%' } },
                      dataLabels: { enabled: true },
                      legend: { show: false },
                    }}
                    series={[
                      {
                        name: 'Promedio',
                        data: [promedioGanancia, Math.abs(promedioPerdida)]
                      }
                    ]}
                    type="bar"
                    height={220}
                  />
                </div>
                {/* Gráfica de pastel: Distribución de operaciones */}
                <div className="flex flex-col items-center justify-center">
                  <h4 className={`mb-2 font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Distribución</h4>
                  {(ganadoras + perdedoras) > 0 ? (
                    <ReactApexChart
                      options={{
                        chart: { type: 'pie', toolbar: { show: false } },
                        labels: ['Ganadoras', 'Perdedoras'],
                        colors: [darkMode ? "#10B981" : "#22d3ee", darkMode ? "#EF4444" : "#f87171"],
                        legend: { show: true, position: 'bottom', labels: { colors: darkMode ? "#d1d5db" : "#374151" } },
                        dataLabels: { enabled: true, style: { fontSize: "14px", fontFamily: "inherit", fontWeight: "500" }, formatter: function (val) { return val.toFixed(1) + "%" } },
                        tooltip: { theme: darkMode ? "dark" : "light" },
                      }}
                      series={[ganadoras, perdedoras]}
                      type="pie"
                      width={220}
                    />
                  ) : (
                    <span className="text-gray-400 text-sm mt-4">No hay datos de operaciones para mostrar distribución.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <div
                className={`bg-gradient-to-br ${darkMode ? "from-green-900/30 to-green-800/20" : "from-green-50 to-green-100"} rounded-xl lg:rounded-2xl shadow-xl border ${darkMode ? "border-green-800/30" : "border-green-200"} p-3 sm:p-4 hover:shadow-2xl transition-all transform hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-xs font-medium ${darkMode ? "text-green-300" : "text-green-700"} mb-1`}
                    >
                      Rentabilidad
                    </p>
                    <p
                      className={`text-lg sm:text-xl lg:text-2xl font-bold ${rentabilidad >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatPercentage(rentabilidad)}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 ${darkMode ? "bg-green-800/30" : "bg-green-200"} rounded-full`}>
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-green-400" : "text-green-600"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <span
                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                      rentabilidad >= 0
                        ? `${darkMode ? "bg-green-800/50 text-green-300" : "bg-green-200 text-green-800"}`
                        : `${darkMode ? "bg-red-800/50 text-red-300" : "bg-red-200 text-red-800"}`
                    }`}
                  >
                    {rentabilidad >= 0 ? "Positiva" : "Negativa"}
                  </span>
                </div>
              </div>

              <div
                className={`bg-gradient-to-br ${darkMode ? "from-blue-900/30 to-blue-800/20" : "from-blue-50 to-blue-100"} rounded-xl lg:rounded-2xl shadow-xl border ${darkMode ? "border-blue-800/30" : "border-blue-200"} p-3 sm:p-4 hover:shadow-2xl transition-all transform hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-xs font-medium ${darkMode ? "text-blue-300" : "text-blue-700"} mb-1`}
                    >
                      Win Rate
                    </p>
                    <p
                      className={`text-lg sm:text-xl lg:text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                    >
                      {formatPercentage(winRate)}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 ${darkMode ? "bg-blue-800/30" : "bg-blue-200"} rounded-full`}>
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <span
                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${darkMode ? "bg-blue-800/50 text-blue-300" : "bg-blue-200 text-blue-800"}`}
                  >
                    {ganadoras} / {totalOps} ops
                  </span>
                </div>
              </div>

              <div
                className={`bg-gradient-to-br ${darkMode ? "from-yellow-900/30 to-yellow-800/20" : "from-yellow-50 to-yellow-100"} rounded-xl lg:rounded-2xl shadow-xl border ${darkMode ? "border-yellow-800/30" : "border-yellow-200"} p-3 sm:p-4 hover:shadow-2xl transition-all transform hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-xs font-medium ${darkMode ? "text-yellow-300" : "text-yellow-700"} mb-1`}
                    >
                      Balance Final
                    </p>
                    <p
                      className={`text-lg sm:text-xl lg:text-2xl font-bold ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                    >
                      {formatCurrency(balanceFinal)}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 ${darkMode ? "bg-yellow-800/30" : "bg-yellow-200"} rounded-full`}>
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <span
                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${darkMode ? "bg-yellow-800/50 text-yellow-300" : "bg-yellow-200 text-yellow-800"}`}
                  >
                    Capital actual
                  </span>
                </div>
              </div>

              <div
                className={`bg-gradient-to-br ${darkMode ? "from-red-900/30 to-red-800/20" : "from-red-50 to-red-100"} rounded-xl lg:rounded-2xl shadow-xl border ${darkMode ? "border-red-800/30" : "border-red-200"} p-3 sm:p-4 hover:shadow-2xl transition-all transform hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-xs font-medium ${darkMode ? "text-red-300" : "text-red-700"} mb-1`}
                    >
                      Drawdown Máx.
                    </p>
                    <p
                      className={`text-lg sm:text-xl lg:text-2xl font-bold ${darkMode ? "text-red-400" : "text-red-600"}`}
                    >
                      {formatPercentage(Math.abs(drawdownMax))}
                    </p>
                  </div>
                  <div className={`p-2 sm:p-3 ${darkMode ? "bg-red-800/30" : "bg-red-200"} rounded-full`}>
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? "text-red-400" : "text-red-600"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <span
                    className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${darkMode ? "bg-red-800/50 text-red-300" : "bg-red-200 text-red-800"}`}
                  >
                    Pérdida máxima
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              <div
                className={`${darkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-xl border ${darkMode ? "border-gray-700" : "border-gray-200"} p-3 sm:p-4 lg:p-6`}
              >
                <div className="flex items-center space-x-2 mb-3 lg:mb-4">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Métricas de Rendimiento
                  </h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div
                    className={`flex justify-between items-center p-2 sm:p-3 ${darkMode ? "bg-gray-700/50" : "bg-gray-50"} rounded-xl border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
                  >
                    <span
                      className={`${darkMode ? "text-gray-300" : "text-gray-600"} font-medium text-sm sm:text-base`}
                    >
                      Operaciones Totales:
                    </span>
                    <span
                      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${darkMode ? "bg-gray-600 text-gray-200" : "bg-gray-200 text-gray-800"}`}
                    >
                      {totalOps}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between items-center p-2 sm:p-3 ${darkMode ? "bg-green-900/20" : "bg-green-50"} rounded-xl border ${darkMode ? "border-green-800/30" : "border-green-200"}`}
                  >
                    <span
                      className={`${darkMode ? "text-gray-300" : "text-gray-600"} font-medium text-sm sm:text-base`}
                    >
                      Operaciones Ganadoras:
                    </span>
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-green-600 text-white">
                      {ganadoras}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between items-center p-2 sm:p-3 ${darkMode ? "bg-red-900/20" : "bg-red-50"} rounded-xl border ${darkMode ? "border-red-800/30" : "border-red-200"}`}
                  >
                    <span
                      className={`${darkMode ? "text-gray-300" : "text-gray-600"} font-medium text-sm sm:text-base`}
                    >
                      Operaciones Perdedoras:
                    </span>
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-red-600 text-white">
                      {perdedoras}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between items-center p-2 sm:p-3 ${darkMode ? "bg-blue-900/20" : "bg-blue-50"} rounded-xl border ${darkMode ? "border-blue-800/30" : "border-blue-200"}`}
                  >
                    <span
                      className={`${darkMode ? "text-gray-300" : "text-gray-600"} font-medium text-sm sm:text-base`}
                    >
                      RR Ratio:
                    </span>
                    <span
                      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${darkMode ? "bg-blue-800/50 text-blue-300" : "bg-blue-200 text-blue-800"}`}
                    >
                      {rrRatio.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`${darkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-xl border ${darkMode ? "border-gray-700" : "border-gray-200"} p-3 sm:p-4 lg:p-6`}
              >
                <div className="flex items-center space-x-2 mb-3 lg:mb-4">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className={`text-base sm:text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Métricas de Riesgo
                  </h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div
                    className={`flex justify-between items-center p-2 sm:p-3 ${darkMode ? "bg-green-900/20" : "bg-green-50"} rounded-xl border ${darkMode ? "border-green-800/30" : "border-green-200"}`}
                  >
                    <span
                      className={`${darkMode ? "text-gray-300" : "text-gray-600"} font-medium text-sm sm:text-base`}
                    >
                      Promedio Ganancia:
                    </span>
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-green-600 text-white">
                      {formatCurrency(promedioGanancia)}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between items-center p-2 sm:p-3 ${darkMode ? "bg-red-900/20" : "bg-red-50"} rounded-xl border ${darkMode ? "border-red-800/30" : "border-red-200"}`}
                  >
                    <span
                      className={`${darkMode ? "text-gray-300" : "text-gray-600"} font-medium text-sm sm:text-base`}
                    >
                      Promedio Pérdida:
                    </span>
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-red-600 text-white">
                      {formatCurrency(Math.abs(promedioPerdida))}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between items-center p-2 sm:p-3 ${darkMode ? "bg-orange-900/20" : "bg-orange-50"} rounded-xl border ${darkMode ? "border-orange-800/30" : "border-orange-200"}`}
                  >
                    <span
                      className={`${darkMode ? "text-gray-300" : "text-gray-600"} font-medium text-sm sm:text-base`}
                    >
                      Drawdown Máximo:
                    </span>
                    <span
                      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${darkMode ? "bg-orange-800/50 text-orange-300" : "bg-orange-200 text-orange-800"}`}
                    >
                      {formatCurrency(Math.abs(drawdownMax))}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between items-center p-2 sm:p-3 ${darkMode ? "bg-purple-900/20" : "bg-purple-50"} rounded-xl border ${darkMode ? "border-purple-800/30" : "border-purple-200"}`}
                  >
                    <span
                      className={`${darkMode ? "text-gray-300" : "text-gray-600"} font-medium text-sm sm:text-base`}
                    >
                      Drawdown %:
                    </span>
                    <span
                      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${darkMode ? "bg-purple-800/50 text-purple-300" : "bg-purple-200 text-purple-800"}`}
                    >
                      {formatPercentage(Math.abs(drawdownMax))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstadisticasAdmin