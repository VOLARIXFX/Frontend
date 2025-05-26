import React, { useState } from "react";
import { API_URL } from "../../ConfigPort&Host";
import UseCrud from "../hook/Crud";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import "../i18n"; // Asegúrate de que la ruta sea correcta

const Soporte = () => {
  const { t } = useTranslation();
  const BASEURL = `${API_URL}/soport/soporte-admin`;
  const { postApi } = UseCrud(BASEURL);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await postApi(form);
      toast.success(t("mensaje_enviado"));
      setForm({
        nombre: "",
        email: "",
        mensaje: "",
      });
    } catch (error) {
      toast.error(t("mensaje_error"));
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e17] py-12 px-4">
        <div className="w-full max-w-md bg-[#0a0e17] rounded-2xl shadow-xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            {t("soporte")}
          </h2>
          <p className="text-gray-400 text-center mb-6">
            {t("soporte_desc")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-semibold text-gray-300 mb-1"
              >
                {t("nombre")}
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#0f172a] text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                placeholder={t("placeholder_nombre")}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-300 mb-1"
              >
                {t("correo_electronico")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-[#0f172a] text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition"
                placeholder={t("placeholder_email")}
              />
            </div>

            <div>
              <label
                htmlFor="mensaje"
                className="block text-sm font-semibold text-gray-300 mb-1"
              >
                {t("mensaje")}
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-[#0f172a] text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition resize-none"
                placeholder={t("placeholder_mensaje")}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition text-lg mt-2"
            >
              {t("enviar_mensaje")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Soporte;