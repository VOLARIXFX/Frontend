import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Index from "./components/index";
import Login from "./components/login";
import Usuarioss from "./components/administrador/Usuarios";
import DashAdmin from "./components/administrador/DashboardAdmin";
import ProtectRouter from "../AuhtRoles";
import { AuthProvider } from "../AuthContext";
import PerClientes from "./components/administrador/PerfilClientes";
import Sidebar from "./components/administrador/Sidebar";
import PostUsuario from "./components/administrador/modals/RegistrarUsuario";
import RecuperarContrase from "./components/CorreoRecuperacion";
import CambiarContraseña from "./components/RecuperarContraseña";
import Profile from "./components/Profile";
import Estadisticas from "./components/Estadisticas";
import Soporte from "./components/Soporte";
import Formulario from "./components/administrador/FormularioEnviar";
import Post from "./components/cliente/Post";
import PostAdmin from "./components/administrador/PostAdmin";
import CirclePhoto from "./components/CirclePhoto";
import DashboardCliente from "./components/cliente/DashboardCliente";
import Estadisticass from "./components/Estadisticas";
import ConocerMas from "./components/Conocermas";
import EstadisticasAdmin from "./components/administrador/EstadisticasAdmin";
function App() {
  return (
    <>
      <AuthProvider>
          <Routes>
            <Route
              path="/admin-formulario"
              element={
                <ProtectRouter Roles={["administrador"]}>
                  <Formulario />
                </ProtectRouter>
              }
            />
            <Route path="/trade-admin" element={
              <ProtectRouter Roles={['administrador']}>
              <PostAdmin/>
              </ProtectRouter>
              }
               /> 

               <Route path="/stats-admin" element={
                <ProtectRouter Roles={['administrador']}>
                <EstadisticasAdmin/>
                </ProtectRouter>
                }/>
            <Route path="/obtener-post" element={<Post />} />
            <Route path="/index-soporte" element={<Soporte />} />
            <Route path="/index-estaditica" element={<Estadisticas />} />
            <Route path="/forgot-password" element={<RecuperarContrase />} />
            <Route path="/changepass/:token" element={<CambiarContraseña />} />
            <Route path="/" element={<Index />} />
            
            <Route path="/admin-panelCplogin" element={<Login />} />

            <Route path="/index-conocer" element={<ConocerMas />} />

            <Route
              path="/adminview"
              element={
                <ProtectRouter Roles={["administrador"]}>
                  <DashAdmin />
                </ProtectRouter>
              }
            />
            <Route
              path="/stats"
              element={
                <Estadisticass />
              }
            />
            <Route
              path="/cliente-dashboard"
              element={
                  <DashboardCliente />
              }
            />
            <Route
              path="/profile-by-photo"
              element={
                <ProtectRouter Roles={["administrador", "cliente"]}>
                  <CirclePhoto />
                </ProtectRouter>
              }
            />

            <Route
              path="/usuarios"
              element={
                <ProtectRouter Roles={["administrador"]}>
                  <Usuarioss />
                </ProtectRouter>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectRouter>
                  <Profile />
                </ProtectRouter>
              }
            />

            <Route
              path="/administrador/regisusuario"
              element={
                <ProtectRouter Roles={["administrador"]}>
                  <PostUsuario />
                </ProtectRouter>
              }
            />
            <Route
              path="/profile/:id_user"
              element={
                <ProtectRouter Roles={["administrador"]}>
                  <PerClientes />
                </ProtectRouter>
              }
            />

            <Route
              path="/sidebar"
              element={
                <ProtectRouter Roles={["administrador"]}>
                  <Sidebar />
                </ProtectRouter>
              }
            />
          </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
