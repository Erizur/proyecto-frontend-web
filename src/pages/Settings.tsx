import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../api/user.service';
import LoadingSpinner from '../components/common/LoadingSpinner';

import SettingsProfile from '../components/settings/SettingsProfile';
import SettingsPreferences from '../components/settings/SettingsPreferences';
import SettingsAccount from '../components/settings/SettingsAccount';

export default function Settings() {
    const { userId, username, updateSession } = useAuth(); // Obtenemos username también
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
            // CORREGIDO: Usamos getById (que llama a /user/i/{id}) para obtener UserDetailsDto completo
            // Esto asegura que recibamos email y showExplicit
            const profile = await userService.getById(Number(userId));
            
            setFormData({
                displayName: profile.displayName || '',
                username: profile.username || '',
                email: profile.email || '', 
                description: profile.description || '',
                showExplicit: profile.showExplicit || false,
            });
        } catch (error) {
            // ... manejo de error
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            await userService.update(Number(userId), {
                email: formData.email,
                description: formData.description,
                showExplicit: formData.showExplicit
            });
            
            updateSession({ userEmail: formData.email });
            
            setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Error al guardar los cambios' });
        } finally {
            setSaving(false);
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