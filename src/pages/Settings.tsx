import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../api/user.service';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

import SettingsProfile from '../components/settings/SettingsProfile';
import SettingsPreferences from '../components/settings/SettingsPreferences';
import SettingsAccount from '../components/settings/SettingsAccount';

export default function Settings() {
    const { userId, username, role, updateSession } = useAuth(); 
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [switchRoleLoading, setSwitchRoleLoading] = useState(false);

    const [formData, setFormData] = useState({
        displayName: '',
        username: '',
        email: '',
        description: '',
        showExplicit: false,
    });

    useEffect(() => {
        if (username) {
            loadUserProfile();
        }
    }, [username]);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const profile = await userService.getCurrent();
            
            setFormData({
                displayName: profile.displayName || '',
                username: profile.username || '',
                email: profile.email || '', 
                description: profile.description || '',
                showExplicit: profile.showExplicit || false,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            await userService.update(Number(userId), {
                displayName: formData.displayName,
                username: formData.username,
                email: formData.email,
                description: formData.description,
                showExplicit: formData.showExplicit
            });
            
            updateSession({ email: formData.email });
            
            setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Error al guardar los cambios' });
        } finally {
            setSaving(false);
        }
    };

    const handleSwitchRole = async () => {
        if (!confirm(`¿Estás seguro de cambiar tu rol? Actualmente eres ${role}.`)) return;
        
        setSwitchRoleLoading(true);
        setMessage(null);
        try {
            const response = await userService.switchRole();
            updateSession({ role: response.role });
            setMessage({ type: 'success', text: `¡Rol cambiado a ${response.role} exitosamente!` });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || "No se pudo cambiar el rol." });
        } finally {
            setSwitchRoleLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Configuración</h1>

            {message && (
                <div role="alert" className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
                    <span>{message.text}</span>
                </div>
            )}

            <div className="grid gap-6">
                {/* Zona de Cambio de Rol */}
                {(role === 'USER' || role === 'ARTIST') && (
                    <div className="card bg-base-100 shadow-sm border border-base-200">
                        <div className="card-body">
                            <h2 className="card-title">Tipo de Cuenta</h2>
                            <p className="text-sm opacity-70">
                                Actualmente eres <strong>{role === 'USER' ? 'Usuario' : 'Artista'}</strong>. 
                                {role === 'USER' 
                                    ? " Cambia a Artista para subir hasta 5 imágenes por post y usar tu propia marca de agua." 
                                    : " Cambia a Usuario si ya no deseas subir arte frecuentemente."}
                            </p>
                            <div className="card-actions justify-end mt-2">
                                <button 
                                    className="btn btn-outline btn-sm" 
                                    onClick={handleSwitchRole}
                                    disabled={switchRoleLoading}
                                >
                                    {switchRoleLoading ? <span className="loading loading-spinner loading-xs"></span> : `Cambiar a ${role === 'USER' ? 'Artista' : 'Usuario'}`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <SettingsProfile 
                    userId={Number(userId)}
                    username={formData.username}
                    displayName={formData.displayName}
                    description={formData.description}
                    onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))}
                />

                <SettingsPreferences 
                    showExplicit={formData.showExplicit}
                    onUpdate={(val) => setFormData(prev => ({ ...prev, showExplicit: val }))}
                />

                <SettingsAccount 
                    email={formData.email}
                    onUpdate={(val) => setFormData(prev => ({ ...prev, email: val }))}
                />

                <div className="sticky bottom-6 flex justify-end z-20">
                    <button 
                        className="btn btn-primary btn-wide shadow-lg"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <span className="loading loading-spinner"></span> : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
}