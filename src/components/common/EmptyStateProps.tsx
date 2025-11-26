interface EmptyStateProps {
    message: string;
    icon?: React.ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
    return <>
        <div className="flex flex-col items-center justify-center p-12 text-center">
            {icon && <div className="mb-4 opacity-50">{icon}</div>}
            <p className="text-base-content/60">{message}</p>
        </div>
    </>
}