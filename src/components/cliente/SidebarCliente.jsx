import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart2, FileText, Home, ArrowLeft } from 'lucide-react';
import { useTheme } from "../../../DarkMode";
import { Moon, Sun } from "lucide-react";
import logo from '../../Img/logo2.png'
import logo2 from '../../Img/logo.png'
import { useTranslation } from "react-i18next";


const cn = (...classes) => classes.filter(Boolean).join(" ");

function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const links = [
    {
      href: "/cliente-dashboard",
      label: t("sidebar.dashboard"),
      icon: Home,
    },
    {
      href: "/stats",
      label: t("sidebar.estadisticas"),
      icon: BarChart2,
    },
    {
      href: "/obtener-post",
      label: t("sidebar.publicaciones"),
      icon: FileText,
    }
  ];

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r transition-all duration-300 ease-in-out z-10",
        darkMode ? "bg-[#0B0F18] border-gray-700" : "bg-white border-gray-200",
        isExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b transition-all duration-300",
          darkMode ? "border-gray-700" : "border-gray-200",
          isExpanded ? "justify-start" : "justify-center"
        )}
      >
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img 
            src={darkMode ? logo : logo2} 
            className={ cn(
                "h-16 object-contain",
                isExpanded ? "w-auto" : "w-16"
            )}
            alt="Logo VolarixCP" 
          />
          <span
            className={cn(
              "transition-opacity duration-300 whitespace-nowrap",
              darkMode ? "text-white" : "text-gray-900",
              isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
          >
            Volarix Capital
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all my-1",
                  isActive 
                    ? darkMode 
                      ? "bg-gray-800 text-white" 
                      : "bg-gray-100 text-gray-900"
                    : darkMode 
                      ? "text-gray-400 hover:text-white hover:bg-gray-800" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                  isExpanded ? "justify-start" : "justify-center"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span
                  className={cn(
                    "transition-opacity duration-300 whitespace-nowrap",
                    darkMode ? "text-white" : "text-gray-900",
                    isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={cn("mt-auto p-4 flex flex-col gap-2", isExpanded ? "" : "flex justify-center")}>
        <button
          className={cn(
            "flex items-center rounded-lg border transition-all duration-300 mt-2",
            darkMode 
              ? "border-gray-700 hover:bg-gray-800 text-white" 
              : "border-gray-200 hover:bg-gray-100 text-gray-900",
            isExpanded ? "w-full justify-start px-3 py-2" : "w-8 h-8 p-0 justify-center"
          )}
          onClick={() => navigate('/')}
          title={t("sidebar.volver_inicio")}
        >
          <ArrowLeft className={cn("h-4 w-4", isExpanded ? "mr-2" : "")} />
          <span
            className={cn(
              "transition-opacity duration-300 whitespace-nowrap",
              darkMode ? "text-white" : "text-gray-900",
              isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}
          >
            {t("sidebar.volver_inicio")}
          </span>
        </button>
        <button
          className={cn(
            "flex items-center rounded-lg border transition-all duration-300 mt-2",
            darkMode 
              ? "border-gray-700 hover:bg-gray-800 text-white" 
              : "border-gray-200 hover:bg-gray-100 text-gray-900",
            isExpanded ? "w-full justify-start px-3 py-2" : "w-8 h-8 p-0 justify-center"
          )}
          onClick={handleThemeToggle}
          title={darkMode ? t("sidebar.modo_claro") : t("sidebar.modo_oscuro")}
        >
          {darkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-gray-700" />}
          <span
            className={cn(
              "transition-opacity duration-300 whitespace-nowrap",
              darkMode ? "text-white" : "text-gray-900",
              isExpanded ? "opacity-100 ml-2" : "opacity-0 w-0 overflow-hidden"
            )}
          >
            {darkMode ? t("sidebar.modo_claro") : t("sidebar.modo_oscuro")}
          </span>
        </button>
      </div>
    </div>
  );
}

export default DashboardSidebar;