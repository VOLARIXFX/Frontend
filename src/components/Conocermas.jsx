import React, { useState } from 'react'
import { Moon, Sun, TrendingUp, TrendingDown, Percent, BarChart3, Award } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import logonegro from '../Img/logo2.png' // Asegúrate de que la ruta sea correcta
import { useTranslation } from 'react-i18next'

// Simulación de estadísticas reales (puedes traerlas de props o contexto)
const estadisticasReales = {
  operaciones_totales: 120,
  operaciones_ganadoras: 80,
  operaciones_perdedoras: 40,
  win_rate: 66.67,
  rentabilidad: 25.5,
  drawdown_max: 8.2,
  balance_final: 15000,
}

// Demo: 80% de las reales
const estadisticasDemo = {
  operaciones_totales: Math.round(estadisticasReales.operaciones_totales * 0.8),
  operaciones_ganadoras: Math.round(estadisticasReales.operaciones_ganadoras * 0.8),
  operaciones_perdedoras: Math.round(estadisticasReales.operaciones_perdedoras * 0.8),
  win_rate: +(estadisticasReales.win_rate * 0.8).toFixed(2),
  rentabilidad: +(estadisticasReales.rentabilidad * 0.8).toFixed(2),
  drawdown_max: +(estadisticasReales.drawdown_max * 0.8).toFixed(2),
  balance_final: Math.round(estadisticasReales.balance_final * 0.8),
}

const COLORS = ['#22c55e', '#ef4444'];

const ConocerMas = () => {
  const [darkMode, setDarkMode] = useState(true)
  const toggleDarkMode = () => setDarkMode(!darkMode)
  const { t } = useTranslation()

  // Pie chart para win rate
  const pieData = [
    { name: "Ganadoras", value: estadisticasDemo.operaciones_ganadoras },
    { name: "Perdedoras", value: estadisticasDemo.operaciones_perdedoras }
  ];

  // Barras para rentabilidad y drawdown
  const barras = [
    { name: "Rentabilidad", value: estadisticasDemo.rentabilidad, fill: "#22c55e" },
    { name: "Drawdown Máx", value: estadisticasDemo.drawdown_max, fill: "#f472b6" }
  ];

  // Gráfico de barras para operaciones
  const barrasOps = [
    { name: "Totales", value: estadisticasDemo.operaciones_totales, fill: "#3b82f6" },
    { name: "Ganadoras", value: estadisticasDemo.operaciones_ganadoras, fill: "#22c55e" },
    { name: "Perdedoras", value: estadisticasDemo.operaciones_perdedoras, fill: "#ef4444" }
  ];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen w-full p-4 transition-colors duration-300 ${darkMode ? 'bg-[#0a0e17] text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full border ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-300 shadow-md'}`}
          aria-label="Cambiar modo"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      {/* Logo y nombre */}
      <div className="flex justify-center mb-8">
        <div className={`flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <img src={logonegro} alt="Volarix Capital Logo" className="h-12 w-auto mr-2 rounded-xl shadow" />
          <span className="text-3xl font-extrabold tracking-wide">Volarix Capital</span>
        </div>
      </div>
      {/* Card conocer más */}
      <div className={`w-full max-w-3xl p-8 rounded-2xl shadow-xl border ${darkMode ? 'bg-[#181e2a] border-[#23293a]' : 'bg-white border-gray-200'}`}>
        <h2 className="text-2xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-indigo-400">
          {t('conocer_mas')}
        </h2>
        <p className={`text-center mb-8 font-semibold text-lg ${darkMode 
          ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-300 to-indigo-300' 
          : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-500 to-indigo-500'}`}>
          {t('descubre_potencial')}
        </p>
        {/* Estadísticas demo visuales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<BarChart3 size={28} className="text-blue-400" />}
            label={t('operaciones_totales')}
            value={estadisticasDemo.operaciones_totales}
            color="blue"
            darkMode={darkMode}
          />
          <StatCard
            icon={<Percent size={28} className="text-green-400" />}
            label={t('rentabilidad')}
            value={estadisticasDemo.rentabilidad + "%"}
            color="green"
            darkMode={darkMode}
          />
          <StatCard
            icon={<TrendingDown size={28} className="text-pink-400" />}
            label={t('drawdown_max')}
            value={estadisticasDemo.drawdown_max + "%"}
            color="pink"
            darkMode={darkMode}
          />
        </div>
        {/* Gráficos atractivos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* PieChart Win Rate */}
          <div className={`rounded-xl p-4 shadow border flex flex-col items-center ${darkMode ? 'bg-[#23293a] border-[#23293a]' : 'bg-gray-50 border-gray-200'}`}>
            <div className="font-bold text-indigo-300 text-center mb-2 flex items-center justify-center gap-2">
              <Award size={18} /> {t('win_rate')}
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  labelLine={false}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) =>
                    [`${value}`, name]
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Leyenda debajo del gráfico */}
            <div className="flex justify-center gap-6 mt-2 text-sm">
              <span className="flex items-center gap-1 text-green-400">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: COLORS[0] }}></span>
                {t('ganadoras')}: {((estadisticasDemo.operaciones_ganadoras / estadisticasDemo.operaciones_totales) * 100).toFixed(0)}%
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: COLORS[1] }}></span>
                {t('perdedoras')}: {((estadisticasDemo.operaciones_perdedoras / estadisticasDemo.operaciones_totales) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-center text-lg font-bold mt-2 text-indigo-400">
              {estadisticasDemo.win_rate}%
            </div>
          </div>
          {/* Barras Rentabilidad y Drawdown */}
          <div className={`rounded-xl p-4 shadow border flex flex-col items-center ${darkMode ? 'bg-[#23293a] border-[#23293a]' : 'bg-gray-50 border-gray-200'}`}>
            <div className="font-bold text-green-300 text-center mb-2 flex items-center justify-center gap-2">
              <TrendingUp size={18} /> {t('rentabilidad_drawdown')}
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barras}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {barras.map((entry, idx) => (
                    <Cell key={`cell-bar2-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Gráfico de barras de operaciones */}
        <div className={`rounded-xl p-4 shadow border mb-8 mt-2 flex flex-col items-center ${darkMode ? 'bg-[#23293a] border-[#23293a]' : 'bg-gray-50 border-gray-200'}`}>
          <div className="font-bold text-blue-400 text-center mb-2 flex items-center justify-center gap-2">
            <BarChart3 size={18} /> {t('operaciones')}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barrasOps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {barrasOps.map((entry, idx) => (
                  <Cell key={`cell-bar-${idx}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-8 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Volarix Capital. Todos los derechos reservados.
      </div>
    </div>
  )
}

// Tarjeta de estadística visual
function StatCard({ icon, label, value, color, darkMode }) {
  const colorMap = {
    blue: "text-blue-400",
    green: "text-green-400",
    pink: "text-pink-400",
  }
  return (
    <div className={`flex flex-col items-center rounded-xl shadow border w-full p-4 ${darkMode ? 'bg-[#23293a] border-[#23293a]' : 'bg-gray-50 border-gray-200'}`}>
      <div className={`mb-2 ${colorMap[color]}`}>{icon}</div>
      <div className="text-sm font-semibold mb-1">{label}</div>
      <div className={`text-xl font-extrabold ${colorMap[color]}`}>{value}</div>
    </div>
  )
}

export default ConocerMas