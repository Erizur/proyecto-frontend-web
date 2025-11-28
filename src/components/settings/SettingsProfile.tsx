import { useRef, useState } from "react";
import { userService } from "../../api/user.service";
import { useAuth } from "../../hooks/useAuth";
import UserAvatar from "../user/UserAvatar";

interface SettingsProfileProps {
    userId: number;
    username: string;
    displayName: string;
    description: string;
    onUpdate: (data: any) => void;
}

export default function SettingsProfile({ userId, username, displayName, description, onUpdate }: SettingsProfileProps) {
    const { updateSession, profilePictureUrl } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localDesc, setLocalDesc] = useState(description);
    const [uploading, setUploading] = useState(false);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            try {
                const response = await userService.uploadAvatar(e.target.files[0]);
                
                if (response && response.profilePictureUrl) {
                    updateSession({ profilePictureUrl: response.profilePictureUrl });
                } else {
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
        <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden transition-shadow hover:shadow-2xl">
            
            {/* Banner Decorativo */}
            <div className="h-32 bg-gradient-to-r from-primary/20 via-base-200 to-secondary/20 relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>
            
            <div className="card-body pt-0 relative">
                <div className="flex justify-between items-end -mt-14 mb-6 px-2">
                    <div className="relative group">
                        <div className="ring-4 ring-base-100 rounded-full bg-base-100 shadow-lg">
                            <UserAvatar 
                                username={username} 
                                displayName={displayName} 
                                profilePictureUrl={profilePictureUrl}
                                size="xl" 
                                clickable={false} 
                            />
                        </div>
                        
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 text-white cursor-pointer backdrop-blur-[2px]"
                        >
                            {uploading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-6 px-1">Tu perfil</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/70">Nombre Visible</span>
                        </label>
                        <input 
                            type="text" 
                            value={displayName} 
                            onChange={(e) => onUpdate({ displayName: e.target.value })} 
                            className="input input-bordered focus:input-primary w-full transition-all"
                            placeholder="Tu nombre artístico"
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/70">Usuario</span>
                        </label>
                        <div className="join w-full">
                            <span className="btn btn-disabled join-item border border-base-300 bg-base-200/50 text-base-content/50">@</span>
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => onUpdate({ username: e.target.value })} 
                                className="input input-bordered join-item w-full bg-base-200/20 text-base-content/60" 
                            />
                        </div>
                    </div>
                </div>

                {/* Biografía Mejorada */}
                <div className="form-control mt-4">
                    <label className="label">
                        <span className="label-text font-medium text-base-content/70">Biografía</span>
                    </label>
                    <div className="relative group">
                        <textarea 
                            className="textarea textarea-bordered w-full h-36 focus:textarea-primary text-base leading-relaxed resize-none pt-3 pb-8 transition-all" 
                            placeholder="Escribe algo sobre ti, tu arte o lo que te inspira..."
                            value={localDesc}
                            onChange={(e) => {
                                setLocalDesc(e.target.value);
                                onUpdate({ description: e.target.value });
                            }}
                            maxLength={256}
                        />
                        <div className={`absolute bottom-3 right-3 text-xs px-2 py-1 rounded transition-colors ${
                            localDesc.length > 200 ? 'text-warning bg-warning/10' : 'text-base-content/40 bg-base-200'
                        }`}>
                            {localDesc.length} / 256
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}