interface SettingsAccountProps {
    email: string;
    onUpdate: (val: string) => void;
}

export default function SettingsAccount({ email, onUpdate }: SettingsAccountProps) {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
                <h2 className="card-title mb-4">Datos de Cuenta</h2>
                <div className="form-control max-w-md">
                    <label className="label"><span className="label-text">Correo Electrónico</span></label>
                    <input 
                        type="email" 
                        className="input input-bordered" 
                        value={email}
                        onChange={(e) => onUpdate(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}