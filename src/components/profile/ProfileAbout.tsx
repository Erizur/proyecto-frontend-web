interface ProfileAboutProps {
    description?: string;
}

export default function ProfileAbout({ description }: ProfileAboutProps) {
    return (
        <div className="bg-base-100 rounded-lg shadow-sm p-6">
            <h3 className="font-bold mb-2">Sobre mí</h3>
            <p className="text-sm">
                {description || 'Este usuario aún no ha agregado una descripción.'}
            </p>
        </div>
    );
}