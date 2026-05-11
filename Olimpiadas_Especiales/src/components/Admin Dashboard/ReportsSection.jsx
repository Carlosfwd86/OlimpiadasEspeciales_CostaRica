import React, { useState, useEffect } from 'react';
import { ServicesAdmin } from '../../services/ServicesAdmin';
import '../../style/AdminDashboard.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ModalDetalleRegistro from './ModalDetalleRegistro';
import Swal from 'sweetalert2';

export default function ReportsSection({ onEdit, onActionSuccess, refreshTrigger }) {
    const [source, setSource] = useState('atletas');
    const [showDetail, setShowDetail] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [filters, setFilters] = useState({
        region: 'Todas',
        deporte: 'Todos'
    });

    useEffect(() => {
        loadData();
    }, [source, refreshTrigger]);

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

    const handleDelete = (item) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar permanentemente a ${item.name || item.nombre}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e62334',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                let deletePromise;
                if (source === 'atletas') {
                    deletePromise = ServicesAdmin.deleteAthlete(item.id);
                } else if (source === 'registros') {
                    deletePromise = ServicesAdmin.deleteRegistro(item.id);
                } else {
                    deletePromise = ServicesAdmin.deleteUser(item.id);
                }
                
                deletePromise.then(() => {
                    Swal.fire('¡Eliminado!', 'El registro ha sido borrado.', 'success');
                    if (onActionSuccess) onActionSuccess();
                    loadData();
                }).catch(err => {
                    Swal.fire('Error', 'Ocurrió un error al eliminar el registro.', 'error');
                });
            }
        });
    };

    const handleExportCSV = () => {
        const dataToExport = selectedRows.size > 0 
            ? data.filter(r => selectedRows.has(r.id)) 
            : filteredData;

        if (dataToExport.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin datos',
                text: 'No hay datos seleccionados o cargados para exportar.',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        const allKeys = new Set();
        dataToExport.forEach(row => Object.keys(row).forEach(k => {
            if (!['password', 'bgColor', 'statusColor', 'initials'].includes(k)) allKeys.add(k);
        }));
        const headersArr = Array.from(allKeys);
        const headers = headersArr.join(",") + "\n";
        
        const csvContent = dataToExport.map(row => {
            return headersArr.map(key => {
                let val = row[key];
                if (val === undefined || val === null) val = '';
                if (typeof val === 'boolean') val = val ? 'Sí' : 'No';
                if (Array.isArray(val)) val = val.join('; ');
                // Escapar comillas dobles y envolver siempre el campo
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(",");
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
        
        ServicesAdmin.logActivity("Reporte", `Exportación CSV Completa de ${dataToExport.length} registros (${source})`, "fa-solid fa-file-csv", "green");
    };

    const handleExportPDF = () => {
        const dataToExport = selectedRows.size > 0 
            ? data.filter(r => selectedRows.has(r.id)) 
            : filteredData;

        if (dataToExport.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin datos',
                text: 'No hay datos suficientes para generar los expedientes PDF.',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        const doc = new jsPDF();
        
        dataToExport.forEach((row, index) => {
            if (index > 0) doc.addPage();
            
            // Diseño de la cabecera por página
            doc.setFillColor(230, 35, 52); // Rojo oficial
            doc.rect(0, 0, 210, 35, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text("Olimpiadas Especiales Costa Rica", 15, 20);
            doc.setFontSize(10);
            doc.text(`Expediente Completo - Generado el ${new Date().toLocaleDateString()}`, 15, 28);
            
            // Título del Expediente
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.text(`Expediente de: ${row.nombre || row.name || 'Usuario'}`, 15, 45);
            doc.setFontSize(11);
            doc.text(`Rol: ${(row.rol || 'Indefinido').toUpperCase()} | ID: #${row.id} | Estado: ${row.status || row.estado || 'Activo'}`, 15, 52);
            
            // Recolectar todos los datos para la tabla, ignorando configuraciones visuales irrelevantes
            const tableRows = [];
            Object.keys(row).forEach(key => {
                if (['password', 'bgColor', 'statusColor', 'initials', 'time', 'id', 'nombre', 'name', 'rol', 'status', 'estado'].includes(key)) return;
                
                let val = row[key];
                if (val === undefined || val === null || val === '') return;
                if (typeof val === 'boolean') val = val ? 'Sí' : 'No';
                if (Array.isArray(val)) val = val.length > 0 ? val.join(', ') : '';
                
                if (val === '') return;

                // Formatear la clave para lectura
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                tableRows.push([formattedKey, String(val)]);
            });

            autoTable(doc, {
                startY: 58,
                head: [['Campo / Etiqueta', 'Valor Registrado']],
                body: tableRows,
                theme: 'striped',
                headStyles: { fillColor: [40, 40, 40] },
                styles: { fontSize: 9, cellPadding: 3 },
                columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } }
            });
        });

        doc.save(`expediente_completo_${source}_${new Date().toISOString().split('T')[0]}.pdf`);
        ServicesAdmin.logActivity("Reporte", `Exportación PDF Expediente Completo de ${dataToExport.length} registros (${source})`, "fa-solid fa-file-pdf", "red");
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
                        onClick={handleExportPDF}
                        style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
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
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
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
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button 
                                                title="Ver Detalles Completos"
                                                onClick={(e) => { e.stopPropagation(); setSelectedDetail(row); setShowDetail(true); }}
                                                style={{ background: '#eff6ff', color: '#2563eb', border: 'none', padding: '6px 10px', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' }}
                                            ><i className="fa-solid fa-eye"></i></button>
                                            
                                            {source !== 'usuarios' && (
                                                <button 
                                                    title="Editar Expediente"
                                                    onClick={(e) => { e.stopPropagation(); onEdit && onEdit(row); }}
                                                    style={{ background: '#fefce8', color: '#eab308', border: 'none', padding: '6px 10px', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' }}
                                                ><i className="fa-solid fa-pen"></i></button>
                                            )}
                                            
                                            <button 
                                                title="Borrar Registro"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
                                                style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '5px', cursor: 'pointer' }}
                                            ><i className="fa-solid fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <ModalDetalleRegistro 
                isOpen={showDetail} 
                onClose={() => setShowDetail(false)} 
                data={selectedDetail || {}} 
            />
        </div>
    );
}
