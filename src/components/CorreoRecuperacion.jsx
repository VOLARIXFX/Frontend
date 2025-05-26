import React, { useState } from "react";
import { API_URL } from "../../ConfigPort&Host";
import UseCrud from "../hook/Crud";
import { useTranslation } from 'react-i18next'

const RecuperarContraseña = () => {
    const BASEURL = `${API_URL}/users/password`;
    const { postApi } = UseCrud(BASEURL);
    const { t } = useTranslation();

    const [Correo, setCorreo] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        if (!Correo) {
            setMensaje(t('Por favor ingresa tu correo electrónico.'));
            return;
        }
        try {
            await postApi({ Correo });
            setMensaje(t('Correo de recuperación enviado. Revisa tu bandeja de entrada.'));
        } catch (error) {
            setMensaje(t('No se pudo enviar el correo. Intenta nuevamente.'));
        }
    };

    return (
        <div className="flex bg-blue-200 justify-center items-center h-screen">
            <div className="bg-blue-100 shadow-md rounded-lg p-8 m-4 max-w-md">
                <h1 className="text-3xl font-bold mb-4 text-blue-500">{t('Recuperar contraseña')}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
                            {t('Correo electrónico asociado a tu cuenta:')}
                        </label>
                        <input
                            type="email"
                            placeholder={t('Correo')}
                            value={Correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            name="correo"
                            className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {t('Enviar')}
                        </button>
                    </div>
                </form>
                {mensaje && <div className="mt-4 text-center text-blue-600">{mensaje}</div>}
            </div>
        </div>
    );
};

export default RecuperarContraseña;
