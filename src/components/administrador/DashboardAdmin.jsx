import React, { useEffect, useState } from "react";
import DashboardSidebar from "./Sidebar";
import { useTheme } from "../../../DarkMode";
import CirclePhoto from "../CirclePhoto";
import { API_URL } from "../../../ConfigPort&Host";
import UseCrud from "../../hook/Crud";
import { useAuth } from "../../../AuthContext";
import Volarix from "../../Img/Volarix.png";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function formatearFecha(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearHora(hora) {
  if (!hora) return "";
  return hora.slice(0, 5);
}

const DashboardAdmin = () => {
  const { darkMode } = useTheme();
  const { auth } = useAuth();

  const BASEURL_USUARIOS = `${API_URL}/users/totalusuarios`;
  const BASEURL_ULTIMA_OP = `${API_URL}/users/ultimopostadmin/${auth.user.id}`;
  const BASEURL_ESTADISTICAS = `${API_URL}/estadisticas/mensual`;
  const BASEURL_USUARIOS_ACTIVOS = `${API_URL}/users/usuariosActivos`;
  const BASEURL_USUARIOS_INACTIVOS = `${API_URL}/users/inactivosSemana`;

  const { getApi: getUsuarios } = UseCrud(BASEURL_USUARIOS);
  const { getApi: getUltimaOperacion } = UseCrud(BASEURL_ULTIMA_OP);
  const { getApi: getEstadisticas } = UseCrud(BASEURL_ESTADISTICAS);
  const { getApi: getUsuariosActivos } = UseCrud(BASEURL_USUARIOS_ACTIVOS);
  const { getApi: getUsuariosInactivosWeek } = UseCrud(
    BASEURL_USUARIOS_INACTIVOS
  );
  const [tiempoPromedio, setTiempoPromedio] = useState(0);

  const [usuarios, setUsuarios] = useState(0);
  const [operaciones, setOperaciones] = useState(0);
  const [rentabilidad, setRentabilidad] = useState(0);
  const [drawdown, setDrawdown] = useState(0);
  const [ultimaOperacion, setUltimaOperacion] = useState(null);
  const [usuariosActivos, setUsuariosActivos] = useState(null);
  const [usuariosInactivos, setUsuariosInactivos] = useState(null);

  useEffect(() => {
    getUsuarios().then((data) => {
      if (Array.isArray(data) && data[0]?.total) setUsuarios(data[0].total);
    });

    getUltimaOperacion().then((data) => setUltimaOperacion(data));
    getUsuariosActivos().then((data) => {
      if (typeof data === "object" && data !== null) {
        setUsuariosActivos(data.total || 0);
      } else {
        setUsuariosActivos(0);
      }
    });
    getUsuariosInactivosWeek().then((data) => {
      if (typeof data === "object" && data !== null) {
        setUsuariosInactivos(data.total || 0);
      } else {
        setUsuariosInactivos(0);
      }
    });

    // FUncion para ☝️ recorrer un objecto que esta enviando la Api

    getEstadisticas().then((data) => {
      if (Array.isArray(data) && data[0]) {
        setOperaciones(data[0].operaciones_totales || 0);
        setRentabilidad(data[0].rentabilidad || 0);
        setDrawdown(data[0].drawdown_max || 0);
      }
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const inicioSesion = Date.now();

    const handleBeforeUnload = () => {
      const finSesion = Date.now();
      const duracion = finSesion - inicioSesion;

      const hoy = new Date().toISOString().split("T")[0];

      const sesionesGuardadas = JSON.parse(
        localStorage.getItem("tiemposSesion") || "[]"
      );

      sesionesGuardadas.push({ tiempo: duracion, fecha: hoy });

      localStorage.setItem("tiemposSesion", JSON.stringify(sesionesGuardadas));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    calcularPromedio();

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const calcularPromedio = () => {
    const hoy = new Date().toISOString().split("T")[0];
    const sesionesGuardadas = JSON.parse(
      localStorage.getItem("tiemposSesion") || "[]"
    );

    const sesionesHoy = sesionesGuardadas.filter((s) => s.fecha === hoy);

    if (sesionesHoy.length === 0) return;

    const total = sesionesHoy.reduce((acc, s) => acc + s.tiempo, 0);
    const promedioMs = total / sesionesHoy.length;

    setTiempoPromedio(promedioMs);
  };

  const formatoTiempo = (ms) => {
    const totalSegundos = Math.floor(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}m ${segundos}s`;
  };

  return (
    <>
      <div
        className={`flex h-screen ${darkMode ? "bg-[#0B0F18]" : "bg-gray-100"}`}
      >
        <DashboardSidebar isAdmin={true} />
          
        <div className="flex-1 p-8 overflow-y-auto">
          <CirclePhoto />
          <h1
            className={`text-center text-6xl font-bold mb-8 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Panel Administración
          </h1>
          <div className="flex justify-end mb-6">
            <Link to="/admin-formulario">
            <button 
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl ${
                darkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <span className="text-xl">+</span>
              Crear operación
            </button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div
              className={`rounded-2xl p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl duration-200 border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👥</span>
                <span className="font-semibold text-lg">Usuarios activos</span>
              </div>
              <div className="text-4xl font-extrabold">{usuarios}</div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-red-500 text-lg">↓</span>
                <span className="text-red-500 text-sm">
                  {usuariosInactivos} Desactivados esta semana
                </span>
              </div>
            </div>
            <div
              className={`rounded-2xl p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl duration-200 border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📊</span>
                <span className="font-semibold text-lg">Operaciones</span>
              </div>
              <div className="text-4xl font-extrabold">{operaciones}</div>
            </div>
            <div
              className={`rounded-2xl p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl duration-200 border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💹</span>
                <span className="font-semibold text-lg">Rentabilidad</span>
              </div>
              <div className="text-4xl font-extrabold">{rentabilidad.toFixed(2)}%</div>
            </div>
            <div
              className={`rounded-2xl p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl duration-200 border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📉</span>
                <span className="font-semibold text-lg">Drawdown</span>
              </div>
              <div className="text-4xl font-extrabold">{drawdown.toFixed(2)}%</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`rounded-2xl p-8 shadow-lg ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Última operación hecha</h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    ultimaOperacion?.tipo_operacion === "LONG"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {ultimaOperacion?.tipo_operacion || "N/A"}
                </span>
              </div>
              {ultimaOperacion ? (
                <>
                  <Link to="/obtener-post">
                    <div className="mb-4 flex justify-center">
                      <img
                        src={`${API_URL}/uploads/${ultimaOperacion.imagen}`}
                        alt="Gráfico operación"
                        className={`rounded-lg  h-64 w-[90%] object-contain ${
                          darkMode
                            ? "bg-gray-900 text-white"
                            : "bg-blue-100 text-gray-900"
                        }`}
                      />
                    </div>
                  </Link>

                  <div className="text-xl ml-6 font-semibold">
                    {ultimaOperacion.divisa_operada || "error"}
                  </div>
                  <div className="text-gray-400 ml-6">
                    {formatearFecha(ultimaOperacion.fecha)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 ">
                    <div>
                      <div className="text-xs ml-6 text-gray-400">
                        Precio Apertura
                      </div>
                      <div className="ml-6">
                        {ultimaOperacion.precio_apertura}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs  text-gray-400">
                        Precio Cierre
                      </div>
                      <div className="">{ultimaOperacion.precio_cierre}</div>
                    </div>
                    <div>
                      <div className="text-xs ml-6 text-gray-400">
                        Stop Loss
                      </div>
                      <div className="ml-6">{ultimaOperacion.stop_loss}</div>
                    </div>
                    <div>
                      <div className="text-xs  text-gray-400">Take Profit</div>
                      <div className="">{ultimaOperacion.take_profit}</div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div>
                      <div className="text-xs ml-6 text-gray-400">
                        Resultado
                      </div>
                      <div
                        className={
                          ultimaOperacion.resultado === "ganancia"
                            ? "text-green-400 ml-6 font-bold"
                            : "text-red-400 font-bold"
                        }
                      >
                        {ultimaOperacion.resultado === "ganancia"
                          ? "Ganancia"
                          : "Pérdida"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs mr-56 text-gray-400">Horario</div>
                      <div>
                        {formatearHora(ultimaOperacion.hora_apertura)} -{" "}
                        {formatearHora(ultimaOperacion.hora_cierre)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs ml-6 text-gray-400">Notas</div>
                    <div className="ml-6">{ultimaOperacion.notas || "-"}</div>
                  </div>
                </>
              ) : (
                <div className="text-gray-400">
                  No hay operaciones publicadas
                </div>
              )}
            </div>
            <div
              className={`rounded-2xl p-8 shadow-lg border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>👤</span> Resumen de usuarios
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-4xl font-extrabold">{usuarios}</span>
                  <span className="ml-2 text-gray-400">Usuarios totales</span>
                </div>
                <div>
                  <span className="text-2xl font-bold">12</span>
                  <span className="ml-2 text-gray-400">Nuevos este mes</span>
                </div>
                <div>
                  <span className="text-2xl font-bold">
                    {formatoTiempo(tiempoPromedio)}
                  </span>
                  <span className="ml-2 text-gray-400">Tiempo promedio</span>
                </div>
                <div>
                  <span className="text-2xl font-bold">{usuariosActivos}</span>
                  <span className="ml-2 text-gray-400">Usuarios activos</span>
                </div>
              </div>
              <div className="w-full mt-20 flex justify-center mb-2">
                <Bar
                  data={{
                    labels: ["Totales", "Activos", "Inactivos"],
                    datasets: [
                      {
                        label: "Usuarios",
                        data: [usuarios, usuariosActivos, usuariosInactivos],
                        backgroundColor: [
                          darkMode ? "#38bdf8" : "#2563eb",
                          darkMode ? "#22d3ee" : "#0ea5e9",
                          "#ef4444",
                        ],
                        borderRadius: 10,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { color: darkMode ? "#fff" : "#222" },
                      },
                      x: { ticks: { color: darkMode ? "#fff" : "#222" } },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                  height={120}
                />
              </div>
              <div className="flex justify-around mt-8">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-xl">▲</span>
                  <span className="text-sm text-gray-400">
                    Activos: {usuariosActivos}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-xl">▼</span>
                  <span className="text-sm text-gray-400">
                    Inactivos: {usuariosInactivos}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500 text-xl">⏱️</span>
                  <span className="text-sm text-gray-400">
                    Promedio: {formatoTiempo(tiempoPromedio)}
                  </span>
                </div>
              </div>
              <div className=" h-24 w-24 mt-6 relative  ml-[40%]  text-gray-400 text-xs text-center">
                <img src={Volarix} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAdmin;

