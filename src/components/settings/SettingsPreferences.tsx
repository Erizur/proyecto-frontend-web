interface SettingsPreferencesProps {
    showExplicit: boolean;
    onUpdate: (val: boolean) => void;
}

export default function SettingsPreferences({ showExplicit, onUpdate }: SettingsPreferencesProps) {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
                <h2 className="card-title mb-4">Preferencias de Contenido</h2>
                
                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                        <input 
                            type="checkbox" 
                            className="toggle toggle-error" 
                            checked={showExplicit}
                            onChange={(e) => onUpdate(e.target.checked)}
                        />
                        <div>
                            <span className="label-text font-bold text-base">Mostrar contenido sensible (NSFW)</span>
                            <p className="text-xs text-base-content/60 mt-1">
                                Habilita esto para ver publicaciones marcadas como sensibles.
                            </p>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}