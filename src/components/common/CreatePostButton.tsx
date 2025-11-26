interface CreatePostButtonProps {
    onClick: () => void;
}

export default function CreatePostButton({ onClick }: CreatePostButtonProps) {
    return <>
        <button 
            onClick={onClick}
            className="btn btn-primary btn-circle fixed bottom-6 right-6 w-16 h-16 shadow-lg z-40"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    </>
}
