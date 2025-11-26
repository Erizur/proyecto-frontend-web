import type { PublicationType } from "../../types/publication.types";

interface ProfileTabsProps {
    // 'ART' agrupará foto e ilustración visualmente
    activeTab: 'ART' | 'COMMUNITY' | 'LIKED';
    onTabChange: (tab: 'ART' | 'COMMUNITY' | 'LIKED') => void;
    isOwnProfile: boolean;
}

export default function ProfileTabs({ activeTab, onTabChange, isOwnProfile }: ProfileTabsProps) {
    return (
        <div role="tablist" className="tabs tabs-bordered mb-6 w-full">
            <a 
                role="tab" 
                className={`tab h-10 ${activeTab === 'ART' ? 'tab-active font-bold border-primary' : ''}`}
                onClick={() => onTabChange('ART')}
            >
                Arte
            </a>
            <a 
                role="tab" 
                className={`tab h-10 ${activeTab === 'COMMUNITY' ? 'tab-active font-bold border-primary' : ''}`}
                onClick={() => onTabChange('COMMUNITY')}
            >
                Comunidad
            </a>
            
            {/* Sugerencia: Tab de Guardados/Likes solo visible para el dueño */}
            {isOwnProfile && (
                <a 
                    role="tab" 
                    className={`tab h-10 ${activeTab === 'LIKED' ? 'tab-active font-bold border-primary' : ''}`}
                    onClick={() => onTabChange('LIKED')}
                >
                    Guardados
                </a>
            )}
        </div>
    );
}