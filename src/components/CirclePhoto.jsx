import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../AuthContext';
import { API_URL } from '../../ConfigPort&Host';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import Avatar from '../Img/AvatarPerfil.jpg'
import { useTranslation } from 'react-i18next';

const CirclePhoto = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const { t } = useTranslation();
    

    const isValidPhoto = auth?.user?.photo && auth.user.photo.trim() !== "";
    const imagen = isValidPhoto
    ? `${API_URL}/uploads/${auth.user.photo}`
    : Avatar;
    console.log('Avatar importado:', Avatar);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleProfile = () => {
        navigate('/profile');
        setIsOpen(false);
    };

    if (!auth.isAuthenticated || !auth.user) {
        return null; 
    }

    return (
        <div 
            className="fixed top-4 right-4 z-10" 
            ref={menuRef}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none"
            >
        <img
        src={imagen}
        alt="Perfil"
        onError={(e) => {
        e.target.onerror = null;
      e.target.src = Avatar;
        }}
     className="rounded-full w-10 h-10"
        />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                    <button
                        onClick={handleProfile}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <User size={18} />
                        {t('Ver Perfil')}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <LogOut size={18} />
                        {t('Cerrar Sesión')}
                    </button>
                </div>
            )}
        </div>
    );
}

export default CirclePhoto
