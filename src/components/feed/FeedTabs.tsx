import type { PublicationType } from '../../types/publication.types';

interface FeedTabsProps {
    activeTab: 'all' | PublicationType;
    onTabChange: (tab: 'all' | PublicationType) => void;
}

export default function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
    return <>
        <div className="tabs tabs-boxed bg-base-100 mb-6">
            <a 
                className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
                onClick={() => onTabChange('all')}
            >
                Todos
            </a>
            <a 
                className={`tab ${activeTab === 'PHOTOGRAPHY' ? 'tab-active' : ''}`}
                onClick={() => onTabChange('PHOTOGRAPHY')}
            >
                Fotografía
            </a>
            <a 
                className={`tab ${activeTab === 'ILLUSTRATION' ? 'tab-active' : ''}`}
                onClick={() => onTabChange('ILLUSTRATION')}
            >
                Ilustración
            </a>
            <a 
                className={`tab ${activeTab === 'TEXT' ? 'tab-active' : ''}`}
                onClick={() => onTabChange('TEXT')}
            >
                Texto
            </a>
        </div>
    </>
}