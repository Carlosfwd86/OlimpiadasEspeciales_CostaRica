import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import '../../style/AdminDashboard.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

type DataSource = 'atletas' | 'registros' | 'usuarios';

interface ReportFilters {
  region: string;
  deporte: string;
}

type DataRow = Record<string, unknown>;

interface ReportsSectionProps {
    searchQuery?: string;
}

export default function ReportsSection({ searchQuery = '' }: ReportsSectionProps): React.JSX.Element {
    const [source, setSource] = useState<DataSource>('atletas');
    const [data, setData] = useState<DataRow[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<Set<unknown>>(new Set());
    const [filters, setFilters] = useState<ReportFilters>({ region: 'Todas', deporte: 'Todos' });

    useEffect(() => { loadData(); }, [source]);

    const loadData = async (): Promise<void> => {
        setLoading(true);
        try {
            let results: DataRow[];
            if (source === 'atletas') {
                const atletas = await ServicesAdmin.getAtletas();
                results = atletas as unknown as DataRow[];
            } else if (source === 'registros') {
                // Usar el endpoint real de registros pendientes
                const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
                const token = localStorage.getItem('token') ?? '';
                const res = await fetch(`${BACKEND_URL}/registros-pendientes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const json = await res.json() as { data?: DataRow[] } | DataRow[];
                results = (Array.isArray(json) ? json : (json as { data?: DataRow[] }).data) ?? [];
            } else {
                results = await ServicesAdmin.getUsers() as DataRow[];
            }
            setData(results);
            setSelectedRows(new Set());
        } catch (err) {
            console.error('Error cargando datos de reporte:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(item => {
        // Filtros de categoría
        if (filters.region !== 'Todas' && item.region !== filters.region) return false;
        if (filters.deporte !== 'Todos' && (item.sport || item.deporte) !== filters.deporte) return false;
        
        // Filtro de búsqueda global
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const name = String(item.name || item.nombre || '').toLowerCase();
            const email = String(item.email || item.correo_electronico || item.correo || '').toLowerCase();
            const id = String(item.id || '').toLowerCase();
            return name.includes(q) || email.includes(q) || id.includes(q);
        }
        
        return true;
    });

    const toggleRow = (id: unknown): void => {
        const newSelection = new Set(selectedRows);
        if (newSelection.has(id)) { newSelection.delete(id); } else { newSelection.add(id); }
        setSelectedRows(newSelection);
    };

    const toggleAll = (): void => {
        if (selectedRows.size === filteredData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(filteredData.map(r => r.id)));
        }
    };

    const handleExportCSV = (): void => {
        const dataToExport = selectedRows.size > 0 ? data.filter(r => selectedRows.has(r.id)) : filteredData;
        if (dataToExport.length === 0) { Swal.fire({ title: 'Atención', text: 'No hay datos cargados para exportar.', icon: 'warning', confirmButtonColor: '#e62334' }); return; }

        const headers = Object.keys(dataToExport[0]).join(",") + "\n";
        const csvContent = dataToExport.map(row => Object.values(row).map(v => `"${String(v ?? '')}"`).join(",")).join("\n");

        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `reporte_${source}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        ServicesAdmin.logActivity("Reporte", `Exportación CSV de ${dataToExport.length} registros (${source})`, "fa-solid fa-file-csv", "green");
    };

    const handleExportPDF = (): void => {
        const dataToExport = selectedRows.size > 0 ? data.filter(r => selectedRows.has(r.id)) : filteredData;
        if (dataToExport.length === 0) { Swal.fire({ title: 'Atención', text: 'No hay datos para generar el PDF.', icon: 'warning', confirmButtonColor: '#e62334' }); return; }

        const doc = new jsPDF();
        doc.setFillColor(230, 35, 52);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Olimpiadas Especiales Costa Rica", 15, 25);
        doc.setFontSize(10);
        doc.text(`Reporte de ${source.toUpperCase()} - Generado el ${new Date().toLocaleDateString()}`, 15, 33);

        let tableHeaders: string[][];
        let tableRows: string[][];

        if (source === 'usuarios') {
            tableHeaders = [['ID', 'Nombre', 'Email', 'Rol', 'Estado']];
            tableRows = dataToExport.map(u => [String(u.id ?? ''), String(u.nombre ?? ''), String(u.email ?? ''), String(u.rol ?? ''), String(u.estado ?? '')]);
        } else {
            tableHeaders = [['ID', 'Nombre', 'Deporte', 'Región', 'Estado']];
            tableRows = dataToExport.map(r => [String(r.id ?? ''), String(r.name ?? r.nombre ?? ''), String(r.sport ?? r.deporte ?? ''), String(r.region ?? ''), String(r.status ?? 'Activo')]);
        }

        autoTable(doc, { startY: 50, head: tableHeaders, body: tableRows, theme: 'striped', headStyles: { fillColor: [230, 35, 52] }, styles: { fontSize: 9 } });
        doc.save(`reporte_${source}_${new Date().toISOString().split('T')[0]}.pdf`);
        ServicesAdmin.logActivity("Reporte", `Exportación PDF de ${dataToExport.length} registros (${source})`, "fa-solid fa-file-pdf", "red");
    };

    return (
        <div className="tab-container" style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ flex: 1, padding: '25px', background: 'var(--admin-white)', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: 'var(--admin-text-main)', marginBottom: '15px' }}>Configuración del Reporte</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '5px' }}>Fuente de Datos</label>
                            <select value={source} onChange={(e) => setSource(e.target.value as DataSource)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}>
                                <option value="atletas">Atletas Oficiales</option>
                                <option value="registros">Registros Pendientes</option>
                                <option value="usuarios">Usuarios del Sistema</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '5px' }}>Región</label>
                            <select value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}>
                                <option value="Todas">Todas las Regiones</option>
                                {['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ width: '300px', padding: '25px', background: 'var(--admin-white)', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--admin-text-main)' }}>Resumen de Selección</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#e62334' }}>{selectedRows.size || filteredData.length}</p>
                    <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginBottom: '20px' }}>Registros listos para exportar</p>
                    <button className="btn-export" onClick={handleExportCSV} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                        <i className="fa-solid fa-file-csv"></i> Descargar CSV
                    </button>
                    <button className="btn-export" onClick={handleExportPDF} style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}>
                        <i className="fa-solid fa-file-pdf"></i> Generar PDF
                    </button>
                </div>
            </div>

            <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: 'var(--admin-text-main)' }}>Previsualización de Datos</h3>
                    <button onClick={toggleAll} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                        {selectedRows.size === filteredData.length ? 'Desmarcar Todos' : 'Seleccionar Todos'}
                    </button>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid var(--admin-border)', borderRadius: '8px' }}>
                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>Cargando datos...</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'var(--admin-bg)', position: 'sticky', top: 0 }}>
                                <tr style={{ textAlign: 'left', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                                    <th style={{ padding: '12px' }}></th>
                                    <th style={{ padding: '12px' }}>ID</th>
                                    <th style={{ padding: '12px' }}>Nombre</th>
                                    <th style={{ padding: '12px' }}>{source === 'usuarios' ? 'Email' : 'Deporte/Rol'}</th>
                                    <th style={{ padding: '12px' }}>Región</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(row => (
                                    <tr key={String(row.id)} style={{ borderBottom: '1px solid var(--admin-border)', fontSize: '13px', color: 'var(--admin-text-main)', cursor: 'pointer' }}
                                        onClick={() => toggleRow(row.id)}>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <input type="checkbox" checked={selectedRows.has(row.id)} readOnly style={{ cursor: 'pointer' }} />
                                        </td>
                                        <td style={{ padding: '12px' }}>#{String(row.id ?? '')}</td>
                                        <td style={{ padding: '12px', fontWeight: '600' }}>{String(row.name ?? row.nombre ?? '')}</td>
                                        <td style={{ padding: '12px' }}>{String(row.sport ?? row.deporte ?? row.rol ?? row.email ?? '')}</td>
                                        <td style={{ padding: '12px' }}>{String(row.region ?? 'Sede Central')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
