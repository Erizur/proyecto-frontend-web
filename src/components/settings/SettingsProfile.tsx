import { useRef, useState } from "react";
import { userService } from "../../api/user.service";
import { useAuth } from "../../hooks/useAuth"; // Importar useAuth
import UserAvatar from "../user/UserAvatar";

interface SettingsProfileProps {
    userId: number;
    username: string;
    displayName: string;
    description: string;
    onUpdate: (data: any) => void;
}

export default function SettingsProfile({ userId, username, displayName, description, onUpdate }: SettingsProfileProps) {
    const { updateSession, profilePictureUrl } = useAuth(); // Obtenemos la función para actualizar sesión
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localDesc, setLocalDesc] = useState(description);
    const [uploading, setUploading] = useState(false);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            try {
                // Subimos la foto
                const response = await userService.uploadAvatar(e.target.files[0]);
                
                // ✅ CLAVE: Actualizamos la sesión global con la nueva URL que devuelve el backend
                if (response && response.profilePictureUrl) {
                    updateSession({ profilePictureUrl: response.profilePictureUrl });
                } else {
                    // Fallback: forzamos reload si el backend no devolvió el objeto actualizado (aunque debería)
                    window.location.reload();
                }
                
            } catch (error) {
                console.error("Error subiendo avatar", error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
                <h2 className="card-title mb-4">Perfil Público</h2>
                
                <div className="flex items-center gap-6 mb-6">
                    {/* Usamos la URL del contexto o la que venga por props */}
                    <UserAvatar 
                        username={username} 
                        displayName={displayName} 
                        profilePictureUrl={profilePictureUrl} // Se actualizará automáticamente
                        size="lg" 
                        clickable={false} 
                    />
                    <div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()} 
                            className="btn btn-outline btn-sm"
                            disabled={uploading}
                        >
                            {uploading ? "Subiendo..." : "Cambiar Avatar"}
                        </button>
                        <p className="text-xs text-base-content/60 mt-2">Recomendado: 400x400px</p>
                    </div>
                </div>

                {/* ... resto del formulario (inputs) igual ... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label"><span className="label-text">Nombre Visible</span></label>
                        <input type="text" value={displayName} disabled className="input input-bordered opacity-70" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Usuario</span></label>
                        <input type="text" value={username} disabled className="input input-bordered opacity-70" />
                    </div>
                </div>

                <div className="form-control mt-4">
                    <label className="label"><span className="label-text">Biografía</span></label>
                    <textarea 
                        className="textarea textarea-bordered h-24" 
                        placeholder="Cuéntanos sobre ti..."
                        value={localDesc}
                        onChange={(e) => {
                            setLocalDesc(e.target.value);
                            onUpdate({ description: e.target.value });
                        }}
                        maxLength={256}
                    />
                    <div className="label"><span className="label-text-alt">{localDesc.length}/256</span></div>
                </div>
            </div>
        </div>
    );
}