import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'es', label: 'Español', flagImg: 'https://www.banderas-mundo.es/data/flags/w1600/es.png' },
  { code: 'en', label: 'English', flagImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png' },
  { code: 'pt', label: 'Português', flagImg: 'https://img.freepik.com/vector-gratis/ilustracion-bandera-brasil_53876-27017.jpg?semt=ais_hybrid&w=740' },
]

function LanguageSelector() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0]

  // Helper para mostrar bandera (imagen)
  const renderFlag = lang =>
    <img src={lang.flagImg} alt={lang.label} className="inline w-5 h-5 rounded-full object-cover" />

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded font-semibold flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 shadow transition-all"
      >
        {renderFlag(currentLang)}
        <span>{currentLang.label}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[#181e2a] border border-gray-700 rounded shadow-lg z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left font-semibold transition
                ${i18n.language === lang.code
                  ? 'bg-green-500 text-white'
                  : 'text-white hover:bg-gray-800'
                }`}
            >
              {renderFlag(lang)}
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector