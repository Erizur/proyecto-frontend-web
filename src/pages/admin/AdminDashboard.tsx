import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { adminService } from '../../api/admin.service';
import type { Report, Appeal, FailedTask } from '../../types/admin.types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Link, Navigate } from 'react-router-dom';

export default function AdminDashboard() {
    const { role } = useAuth();
    const [activeTab, setActiveTab] = useState<'REPORTS' | 'APPEALS' | 'TASKS_PLACE' | 'TASKS_AI'>('REPORTS');
    
    // Estados de datos
    const [reports, setReports] = useState<Report[]>([]);
    const [appeals, setAppeals] = useState<Appeal[]>([]);
    const [tasks, setTasks] = useState<FailedTask[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Permisos
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
        return <Navigate to="/" replace />;
    }

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const pageParams = { page: 0, size: 20 };
            if (activeTab === 'REPORTS') {
                const data = await adminService.getReports('PENDING', pageParams);
                setReports(data.content);
            } else if (activeTab === 'APPEALS') {
                const data = await adminService.getAppeals(pageParams);
                setAppeals(data.content);
            } else if (activeTab === 'TASKS_PLACE') {
                const data = await adminService.getFailedPlaceTasks(pageParams);
                setTasks(data.content);
            } else if (activeTab === 'TASKS_AI') {
                const data = await adminService.getFailedAiTasks(pageParams);
                setTasks(data.content);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLERS ---

    const handleResolveReport = async (id: number, status: 'ACTION_TAKEN' | 'DISMISSED') => {
        setActionLoading(id);
        try {
            await adminService.resolveReport(id, status, "Resuelto desde dashboard");
            setReports(prev => prev.filter(r => r.id !== id));
        } finally { setActionLoading(null); }
    };

    const handleResolveAppeal = async (id: number, status: 'APPROVED' | 'REJECTED') => {
        setActionLoading(id);
        try {
            await adminService.resolveAppeal(id, status, "Resuelto desde dashboard");
            setAppeals(prev => prev.filter(a => a.id !== id));
        } finally { setActionLoading(null); }
    };

    const handleTaskAction = async (id: number, action: 'RETRY' | 'DISMISS', type: 'AI' | 'PLACE') => {
        setActionLoading(id);
        try {
            if (type === 'PLACE') {
                action === 'RETRY' ? await adminService.retryPlaceTask(id) : await adminService.dismissPlaceTask(id);
            } else {
                action === 'RETRY' ? await adminService.retryAiTask(id) : await adminService.dismissAiTask(id);
            }
            setTasks(prev => prev.filter(t => t.id !== id));
        } finally { setActionLoading(null); }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                🛡️ Panel de Moderación
                <div className="badge badge-secondary">{role}</div>
            </h1>

            <div className="tabs tabs-boxed mb-6 bg-base-200">
                <a className={`tab ${activeTab === 'REPORTS' ? 'tab-active' : ''}`} onClick={() => setActiveTab('REPORTS')}>Reportes</a>
                <a className={`tab ${activeTab === 'APPEALS' ? 'tab-active' : ''}`} onClick={() => setActiveTab('APPEALS')}>Apelaciones</a>
                <a className={`tab ${activeTab === 'TASKS_PLACE' ? 'tab-active' : ''}`} onClick={() => setActiveTab('TASKS_PLACE')}>Fallos Lugares</a>
                <a className={`tab ${activeTab === 'TASKS_AI' ? 'tab-active' : ''}`} onClick={() => setActiveTab('TASKS_AI')}>Fallos IA</a>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div className="space-y-4">
                    {activeTab === 'REPORTS' && (
                        reports.length === 0 ? <p className="text-center opacity-50">No hay reportes pendientes!</p> :
                        reports.map(report => (
                            <div key={report.id} className="card bg-base-100 shadow-sm border border-base-300">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="badge badge-error gap-2 mb-2">
                                                {report.reason}
                                            </div>
                                            <p className="font-bold">Reportado por: @{report.reporter.username}</p>
                                            <p className="text-sm mt-1">{report.details || "Sin detalles adicionales"}</p>
                                            
                                            {report.publication && (
                                                <div className="mt-3 p-3 bg-base-200 rounded-lg">
                                                    <p className="text-xs font-bold mb-1">Publicación reportada:</p>
                                                    <Link to={`/post/${report.publication.id}`} className="link link-primary text-sm" target="_blank">
                                                        Ver Publicación #{report.publication.id}
                                                    </Link>
                                                    <p className="text-xs opacity-60 mt-1 line-clamp-2">{report.publication.description}</p>
                                                </div>
                                            )}
                                            
                                            {report.reportedUser && (
                                                <div className="mt-3 p-3 bg-base-200 rounded-lg">
                                                    <p className="text-xs font-bold mb-1">Usuario reportado:</p>
                                                    <Link to={`/profile/${report.reportedUser.username}`} className="link link-primary text-sm" target="_blank">
                                                        @{report.reportedUser.username}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button 
                                                className="btn btn-sm btn-error"
                                                disabled={actionLoading === report.id}
                                                onClick={() => handleResolveReport(report.id, 'ACTION_TAKEN')}
                                            >
                                                Sancionar / Borrar
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-ghost"
                                                disabled={actionLoading === report.id}
                                                onClick={() => handleResolveReport(report.id, 'DISMISSED')}
                                            >
                                                Descartar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* VISTA APELACIONES */}
                    {activeTab === 'APPEALS' && (
                        appeals.length === 0 ? <p className="text-center opacity-50">No hay apelaciones pendientes.</p> :
                        appeals.map(appeal => (
                            <div key={appeal.id} className="card bg-base-100 shadow-sm border border-base-300">
                                <div className="card-body">
                                    <h3 className="font-bold">Apelación de IA - Publicación #{appeal.publication.id}</h3>
                                    <p className="text-sm italic my-2 bg-base-200 p-3 rounded">"{appeal.justification}"</p>
                                    <Link to={`/post/${appeal.publication.id}`} className="btn btn-xs btn-link pl-0" target="_blank">Ver evidencia visual</Link>
                                    
                                    <div className="card-actions justify-end mt-2">
                                        <button 
                                            className="btn btn-sm btn-success text-white"
                                            disabled={actionLoading === appeal.id}
                                            onClick={() => handleResolveAppeal(appeal.id, 'APPROVED')}
                                        >
                                            Aprobar (Es Humano)
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-error text-white"
                                            disabled={actionLoading === appeal.id}
                                            onClick={() => handleResolveAppeal(appeal.id, 'REJECTED')}
                                        >
                                            Rechazar (Es IA)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {(activeTab === 'TASKS_PLACE' || activeTab === 'TASKS_AI') && (
                        tasks.length === 0 ? <p className="text-center opacity-50">El sistema funciona correctamente.</p> :
                        tasks.map(task => (
                            <div key={task.id} className="alert alert-warning shadow-sm items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 mt-1" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                <div className="flex-1">
                                    <h3 className="font-bold">Error en Pub #{task.publicationId}</h3>
                                    <div className="text-xs font-mono bg-black/10 p-2 rounded mt-1 overflow-x-auto">
                                        {task.errorMessage}
                                    </div>
                                    <div className="text-xs mt-1 opacity-60">
                                        {activeTab === 'TASKS_PLACE' ? `OSM: ${task.osmType}/${task.osmId}` : `User: ${task.username}`}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button 
                                        className="btn btn-xs btn-neutral"
                                        disabled={actionLoading === task.id}
                                        onClick={() => handleTaskAction(task.id, 'RETRY', activeTab === 'TASKS_PLACE' ? 'PLACE' : 'AI')}
                                    >
                                        Reintentar
                                    </button>
                                    <button 
                                        className="btn btn-xs btn-ghost"
                                        disabled={actionLoading === task.id}
                                        onClick={() => handleTaskAction(task.id, 'DISMISS', activeTab === 'TASKS_PLACE' ? 'PLACE' : 'AI')}
                                    >
                                        Ignorar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}