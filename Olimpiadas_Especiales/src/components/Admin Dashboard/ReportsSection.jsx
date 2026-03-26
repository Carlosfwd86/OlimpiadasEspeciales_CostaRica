import React, { useState, useEffect } from 'react';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import '../../style/AdminDashboard.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsSection() {
    const [source, setSource] = useState('atletas');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [filters, setFilters] = useState({
        region: 'Todas',
        deporte: 'Todos'
    });

    useEffect(() => {
        loadData();
    }, [source]);

    const loadData = async () => {
        setLoading(true);
        try {
            let res;
            if (source === 'atletas') {
                res = await fetch('http://localhost:3001/atletas');
            } else if (source === 'registros') {
                res = await fetch('http://localhost:3001/registros_pendientes');
            } else {
                res = await ServicesAdmin.getUsers();
            }
            
            const results = Array.isArray(res) ? res : await res.json();
            setData(results);
            setSelectedRows(new Set()); // Reset selection on source change
        } catch (err) {
            console.error("Error cargando datos de reporte:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id) => {
        const newSelection = new Set(selectedRows);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedRows(newSelection);
    };

    const toggleAll = () => {
        if (selectedRows.size === filteredData.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(filteredData.map(r => r.id)));
        }
    };

    const filteredData = data.filter(item => {
        if (filters.region !== 'Todas' && item.region !== filters.region) return false;
        if (filters.deporte !== 'Todos' && (item.sport || item.deporte) !== filters.deporte) return false;
        return true;
    });

    const handleExportCSV = () => {
        const dataToExport = selectedRows.size > 0 
            ? data.filter(r => selectedRows.has(r.id)) 
            : filteredData;

        if (dataToExport.length === 0) {
            alert("No hay datos cargados para exportar.");
            return;
        }

        const headers = Object.keys(dataToExport[0]).join(",") + "\n";
        const csvContent = dataToExport.map(row => {
            return Object.values(row).map(value => `"${value}"`).join(",");
        }).join("\n");

        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `reporte_${source}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        ServicesAdmin.logActivity("Reporte", `Exportación CSV de ${dataToExport.length} registros (${source})`, "fa-solid fa-file-csv", "green");
    };

    const handleExportPDF = () => {
        const dataToExport = selectedRows.size > 0 
            ? data.filter(r => selectedRows.has(r.id)) 
            : filteredData;

        if (dataToExport.length === 0) {
            alert("No hay datos para generar el PDF.");
            return;
        }

        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(230, 35, 52); // Rojo oficial
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Olimpiadas Especiales Costa Rica", 15, 25);
        doc.setFontSize(10);
        doc.text(`Reporte de ${source.toUpperCase()} - Generado el ${new Date().toLocaleDateString()}`, 15, 33);
        
        // Table content based on source
        let tableHeaders = [];
        let tableRows = [];

        if (source === 'usuarios') {
            tableHeaders = [['ID', 'Nombre', 'Email', 'Rol', 'Estado']];
            tableRows = dataToExport.map(u => [u.id, u.nombre, u.email, u.rol, u.estado]);
        } else {
            tableHeaders = [['ID', 'Nombre', 'Deporte', 'Región', 'Estado']];
            tableRows = dataToExport.map(r => [r.id, r.name || r.nombre, r.sport || r.deporte, r.region, r.status || 'Activo']);
        }

        autoTable(doc, {
            startY: 50,
            head: tableHeaders,
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [230, 35, 52] },
            styles: { fontSize: 9 }
        });

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
                            <select 
                                value={source} 
                                onChange={(e) => setSource(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                            >
                                <option value="atletas">Atletas Oficiales</option>
                                <option value="registros">Registros Pendientes</option>
                                <option value="usuarios">Usuarios del Sistema</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: 'var(--admin-text-muted)', marginBottom: '5px' }}>Región</label>
                            <select 
                                value={filters.region} 
                                onChange={(e) => setFilters({...filters, region: e.target.value})}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text-main)' }}
                            >
                                <option value="Todas">Todas las Regiones</option>
                                <option value="San José">San José</option>
                                <option value="Alajuela">Alajuela</option>
                                <option value="Cartago">Cartago</option>
                                <option value="Heredia">Heredia</option>
                                <option value="Guanacaste">Guanacaste</option>
                                <option value="Puntarenas">Puntarenas</option>
                                <option value="Limón">Limón</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ width: '300px', padding: '25px', background: 'var(--admin-white)', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: 'var(--admin-text-main)' }}>Resumen de Selección</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#e62334' }}>{selectedRows.size || filteredData.length}</p>
                    <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginBottom: '20px' }}>Registros listos para exportar</p>
                    
                    <button 
                        className="btn-export" 
                        onClick={handleExportCSV}
                        style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                    >
                        <i className="fa-solid fa-file-csv"></i> Descargar CSV
                    </button>
                    <button 
                        className="btn-export" 
                        onClick={handleExportPDF}
                        style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}
                    >
                        <i className="fa-solid fa-file-pdf"></i> Generar PDF
                    </button>
                </div>
            </div>

            <div style={{ background: 'var(--admin-white)', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, color: 'var(--admin-text-main)' }}>Previsualización de Datos</h3>
                    <button 
                        onClick={toggleAll}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                    >
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
                                    <tr 
                                        key={row.id} 
                                        style={{ borderBottom: '1px solid var(--admin-border)', fontSize: '13px', color: 'var(--admin-text-main)', cursor: 'pointer' }}
                                        onClick={() => toggleRow(row.id)}
                                    >
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedRows.has(row.id)} 
                                                readOnly
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </td>
                                        <td style={{ padding: '12px' }}>#{row.id}</td>
                                        <td style={{ padding: '12px', fontWeight: '600' }}>{row.name || row.nombre}</td>
                                        <td style={{ padding: '12px' }}>{row.sport || row.deporte || row.rol || row.email}</td>
                                        <td style={{ padding: '12px' }}>{row.region || 'Sede Central'}</td>
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
