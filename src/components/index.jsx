import React from 'react'
import { Link } from 'react-router-dom'
import logo2 from '../Img/logo2.png'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../i18n/LanguageSelector'

const Index = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-[#0a0e17] min-h-screen flex flex-col">
      <header className="flex justify-between items-center px-8 py-6 relative">
        <div className="flex items-center space-x-2">
          <span className="h-[10%] w-[10%]"> <img src={logo2} alt="" /></span>
          <span className="text-white font-bold text-xl">Volarix Capital</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="/index-soporte" className="text-gray-300 hover:text-white">{t('contacto')}</a>
          <div className="ml-4">
            <LanguageSelector />
          </div>
        </div>
      </header>   

      <main className="flex flex-1 flex-col md:flex-row items-center justify-between px-8 md:px-24">
        <div className="max-w-xl mt-16 md:mt-0">
          <h1 className="text-[#06DE73] text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            {t('potencia_tu_trading')}
          </h1>
          <h1 className="text-white text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            {t('con_estadisticas_y_analisis_modernos')}
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            {t('descubre_paneles_avanzados')}
          </p>
          <div className="flex space-x-4">
            <Link to='/cliente-dashboard'>
              <button className="bg-transparent border border-gray-600 text-white font-semibold px-6 py-3 rounded hover:bg-gray-800 transition">
                {t('conocer_mas')}
              </button>
            </Link>
          </div>
        </div>
        <div className="hidden md:flex flex-1 justify-center">
          <div className="bg-black ml-7 rounded-2xl shadow-lg w-[550px] h-[400px] mt-12 p-4 relative overflow-hidden border border-cyan-500/30">
            {/* Grid holográfico */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }, (_, i) => (
                  <div key={i} className="border border-cyan-500/20" />
                ))}
              </div>
            </div>

            <div className="absolute inset-0">
              <div
                className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"
                style={{
                  animation: "scan 3s linear infinite",
                  top: "30%",
                }}
              />
              <div
                className="h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse"
                style={{
                  animation: "scan 4s linear infinite reverse",
                  top: "70%",
                }}
              />
            </div>

            {/* Contenido central */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="text-4xl font-mono font-bold text-cyan-400 mb-2 tracking-wider">VOLARIX</div>
                  <div className="text-sm text-green-400 font-mono">SYSTEM ONLINE</div>
                </div>

                {/* Indicadores */}
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1 animate-pulse" />
                    <div className="text-xs text-gray-400 font-mono">ACTIVE</div>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full mx-auto mb-1 animate-pulse" />
                    <div className="text-xs text-gray-400 font-mono">SYNC</div>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1 animate-pulse" />
                    <div className="text-xs text-gray-400 font-mono">READY</div>
                  </div>
                </div>
              </div>
            </div>

            <style jsx>{`
              @keyframes scan {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(400px); }
              }
            `}</style>
          </div>
        </div>
      </main>

      <section
        id="beneficios"
        className="w-full flex flex-col items-center py-20 px-4 bg-gradient-to-b from-transparent to-[#181e2a]"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-green-400 mb-10 text-center drop-shadow-lg">
          {t('beneficios_volarix')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
          <BenefitCard
            icon="📊"
            title={t('panel_en_tiempo_real')}
            desc={t('visualiza_estadisticas_resultados')}
          />
          <BenefitCard
            icon="🔔"
            title={t('alertas_automaticas')}
            desc={t('recibe_notificaciones_senales')}
          />
          <BenefitCard
            icon="📈"
            title={t('historial_y_comparativas')}
            desc={t('analiza_progreso_compara')}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#181e2a] text-gray-400 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sección de la empresa */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logo2} alt="Volarix Capital" className="h-8 w-8" />
              <span className="text-white font-bold text-xl">Volarix Capital</span>
            </div>
            <p className="text-sm">
              {t('potenciando_trading')}
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('enlaces_rapidos')}</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-green-400 transition">{t('iniciar_sesion')}</Link></li>
              <li><Link to="/index-estaditica" className="hover:text-green-400 transition">{t('estadisticas')}</Link></li>
              <li><Link to="/index-soporte" className="hover:text-green-400 transition">{t('soporte')}</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('contacto')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <a href="mailto:soporte@volarix.com" className="hover:text-green-400 transition">soporte@volarix.com</a>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('siguenos')}</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-400 transition">{t('twitter')}</a>
              <a href="#" className="hover:text-green-400 transition">{t('linkedin')}</a>
              <a href="#" className="hover:text-green-400 transition">{t('instagram')}</a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Volarix Capital. {t('todos_los_derechos_reservados')}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm hover:text-green-400 transition">{t('terminos_condiciones')}</a>
              <a href="#" className="text-sm hover:text-green-400 transition">{t('politica_privacidad')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Componente para beneficios
function BenefitCard({ icon, title, desc }) {
  return (
    <div className="bg-[#23293a] rounded-xl p-6 flex flex-col items-start shadow border border-[#23293a] hover:border-green-400 transition min-h-[170px]">
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-bold text-gray-100 mb-1 text-lg">{title}</div>
      <div className="text-gray-400 text-sm">{desc}</div>
    </div>
  )
}

export default Index
