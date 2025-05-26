import React, { useState } from 'react'
import { API_URL } from '../../ConfigPort&Host'
import UseCrud from '../hook/Crud'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const RecuperarContraseña = () => {
    const { t } = useTranslation();

    const { token } = useParams();
    const BASEURL = `${API_URL}/users/passwordGmail`
    const { updateApi } = UseCrud(BASEURL)
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false)
    const [passwordNueva, setPasswordNueva] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    const togglePassword = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        if (!passwordNueva || !confirmarPassword) {
            setMensaje('Por favor completa ambos campos.');
            return;
        }
        if (passwordNueva !== confirmarPassword) {
            setMensaje('Las contraseñas no coinciden');
            return;
        }
        try {
            await updateApi({ token, passwordNueva, confirmarPassword });
            setMensaje('Contraseña cambiada con éxito. Serás redirigido al login.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMensaje('Error al cambiar la contraseña. Intenta nuevamente.');
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-blue-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-4 text-blue-600">{t('Cambiar contraseña')}</h1>
                <label className="block mb-2">{t('Nueva contraseña')}</label>
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t('Nueva contraseña')}
                        value={passwordNueva}
                        onChange={e => setPasswordNueva(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        tabIndex={-1}
                    >
                        {showPassword ? "👀" : "👁️‍🗨️"}
                    </button>
                </div>
                <label className="block mb-2">{t('Confirmar contraseña')}</label>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('Confirmar contraseña')}
                    value={confirmarPassword}
                    onChange={e => setConfirmarPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    {t('Cambiar contraseña')}
                </button>
                {mensaje && <div className="mt-4 text-center text-blue-600">{mensaje}</div>}
            </form>
        </div>
    )
}

export default RecuperarContraseña