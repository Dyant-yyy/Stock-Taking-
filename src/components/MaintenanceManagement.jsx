import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Wrench,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  User,
  X
} from 'lucide-react';

export const MaintenanceManagement = () => {
  const {
    maintenance,
    devices,
    createMaintenanceTicket,
    updateMaintenanceStatus,
    isReportMaintenanceOpen,
    setIsReportMaintenanceOpen
  } = useInventory();

  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTicketForUpdate, setSelectedTicketForUpdate] = useState(null);
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [updateStatusVal, setUpdateStatusVal] = useState('Completed');

  // Form state for reporting broken device
  const [reportForm, setReportForm] = useState({
    deviceId: '',
    reportedBy: '',
    issueCategory: 'Hardware Malfunction',
    description: '',
    technician: 'Tim IT Plant Maintenance',
    costEstimate: 500000
  });

  const filteredTickets = maintenance.filter(m => {
    if (filterStatus === 'In Progress') return m.status === 'In Progress';
    if (filterStatus === 'Completed') return m.status === 'Completed';
    return true;
  });

  const totalCost = maintenance.reduce((sum, m) => sum + (m.costEstimate || 0), 0);

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const handleOpenReportModal = () => {
    if (devices.length > 0) {
      setReportForm(prev => ({
        ...prev,
        deviceId: devices[0].id,
        reportedBy: devices[0].assignedTo || 'Karyawan ITS'
      }));
    }
    setIsReportMaintenanceOpen(true);
  };

  const handleCreateReportSubmit = (e) => {
    e.preventDefault();
    const targetDev = devices.find(d => d.id === reportForm.deviceId);
    if (!targetDev) return;

    createMaintenanceTicket({
      deviceId: targetDev.id,
      assetTag: targetDev.assetTag,
      deviceName: targetDev.name,
      reportedBy: reportForm.reportedBy,
      issueCategory: reportForm.issueCategory,
      description: reportForm.description,
      technician: reportForm.technician,
      costEstimate: Number(reportForm.costEstimate),
      partsReplaced: 'Dalam pemeriksaan hardware'
    });

    setIsReportMaintenanceOpen(false);
  };

  const handleStatusUpdateSubmit = (e) => {
    e.preventDefault();
    if (selectedTicketForUpdate) {
      updateMaintenanceStatus(selectedTicketForUpdate.id, updateStatusVal, technicianNotes);
      setSelectedTicketForUpdate(null);
    }
  };

  return (
    <div className="maintenance-view">
      <div className="view-header">
        <div>
          <h2>Ticketing Perbaikan & Maintenance Perangkat</h2>
          <p className="sub-header-text">
            Pengawasan servis teknisi, klaim garansi, dan preventive maintenance mesin pabrik ITS.
          </p>
        </div>
        <div className="view-header-actions">
          <button className="btn-primary" onClick={handleOpenReportModal}>
            <Plus size={16} />
            <span>+ Laporkan Kerusakan / Service</span>
          </button>
        </div>
      </div>

      {/* COST SUMMARY CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Ticket Service</span>
            <Wrench className="text-amber" size={20} />
          </div>
          <div className="kpi-value">{maintenance.length}</div>
          <div className="kpi-subtext">Histori servis terdaftar</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Sedang Dikerjakan</span>
            <Clock className="text-blue" size={20} />
          </div>
          <div className="kpi-value">{maintenance.filter(m => m.status === 'In Progress').length}</div>
          <div className="kpi-subtext">Perbaikan aktif</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Selesai Diperbaiki</span>
            <CheckCircle className="text-emerald" size={20} />
          </div>
          <div className="kpi-value">{maintenance.filter(m => m.status === 'Completed').length}</div>
          <div className="kpi-subtext">Perangkat kembali normal</div>
        </div>

        <div className="kpi-card highlight-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Biaya Service</span>
            <DollarSign className="text-gold" size={20} />
          </div>
          <div className="kpi-value format-idr">{formatIDR(totalCost)}</div>
          <div className="kpi-subtext">Opex pemeliharaan IT</div>
        </div>
      </div>

      {/* TABS */}
      <div className="filter-bar">
        <div className="filter-tabs">
          <button className={`tab-btn ${filterStatus === 'All' ? 'active' : ''}`} onClick={() => setFilterStatus('All')}>
            Semua Ticket ({maintenance.length})
          </button>
          <button className={`tab-btn ${filterStatus === 'In Progress' ? 'active' : ''}`} onClick={() => setFilterStatus('In Progress')}>
            Dalam Perbaikan ({maintenance.filter(m => m.status === 'In Progress').length})
          </button>
          <button className={`tab-btn ${filterStatus === 'Completed' ? 'active' : ''}`} onClick={() => setFilterStatus('Completed')}>
            Selesai ({maintenance.filter(m => m.status === 'Completed').length})
          </button>
        </div>
      </div>

      {/* TICKET TABLE */}
      <div className="table-responsive">
        <table className="device-table">
          <thead>
            <tr>
              <th>Ticket ID & Date</th>
              <th>Asset Tag / Device</th>
              <th>Kategori Masalah</th>
              <th>Deskripsi Kendala</th>
              <th>Pelapor & Teknisi</th>
              <th>Est. Biaya</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t.id}>
                <td>
                  <div>
                    <strong>{t.id}</strong>
                    <div className="text-muted text-sm">{t.reportDate}</div>
                  </div>
                </td>
                <td>
                  <div>
                    <strong>{t.assetTag}</strong>
                    <div className="text-muted text-sm">{t.deviceName}</div>
                  </div>
                </td>
                <td><span className="dept-pill">{t.issueCategory}</span></td>
                <td className="max-width-desc">{t.description}</td>
                <td>
                  <div className="text-sm">
                    <div>Pelapor: <strong>{t.reportedBy}</strong></div>
                    <div className="text-muted">Teknisi: {t.technician}</div>
                  </div>
                </td>
                <td className="format-idr">{formatIDR(t.costEstimate)}</td>
                <td>
                  <span className={`status-badge status-${t.status.toLowerCase().replace(' ', '-')}`}>
                    {t.status}
                  </span>
                </td>
                <td className="text-right">
                  {t.status === 'In Progress' ? (
                    <button
                      className="btn-secondary-sm"
                      onClick={() => {
                        setSelectedTicketForUpdate(t);
                        setTechnicianNotes(t.notes || '');
                      }}
                    >
                      Update Status
                    </button>
                  ) : (
                    <span className="text-muted text-sm">Selesai {t.completionDate}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL LAPOR KERUSAKAN */}
      {isReportMaintenanceOpen && (
        <div className="modal-backdrop" onClick={() => setIsReportMaintenanceOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Laporkan Kerusakan / Permintaan Maintenance</h3>
              <button className="btn-modal-close" onClick={() => setIsReportMaintenanceOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateReportSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Pilih Perangkat Bermasalah *:</label>
                  <select
                    required
                    value={reportForm.deviceId}
                    onChange={(e) => {
                      const dev = devices.find(d => d.id === e.target.value);
                      setReportForm(prev => ({
                        ...prev,
                        deviceId: e.target.value,
                        reportedBy: dev ? dev.assignedTo : prev.reportedBy
                      }));
                    }}
                    className="form-select"
                  >
                    {devices.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.assetTag} - {d.name} ({d.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group margin-top">
                  <label>Pelapor (Pegawai) *:</label>
                  <input
                    type="text"
                    required
                    value={reportForm.reportedBy}
                    onChange={(e) => setReportForm(prev => ({ ...prev, reportedBy: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group margin-top">
                  <label>Kategori Gejala / Masalah *:</label>
                  <select
                    value={reportForm.issueCategory}
                    onChange={(e) => setReportForm(prev => ({ ...prev, issueCategory: e.target.value }))}
                    className="form-select"
                  >
                    <option value="Hardware Malfunction">Hardware Malfunction (Kerusakan Fisik/Mati)</option>
                    <option value="Software & OS Error">Software & OS Error (System Crash/Blue Screen)</option>
                    <option value="Network & Connectivity">Network & Connectivity (Putus Jaringan)</option>
                    <option value="Preventive Cleaning">Preventive Maintenance & Cleaning</option>
                    <option value="Printhead & Thermal Repair">Printhead & Thermal Printer Repair</option>
                  </select>
                </div>

                <div className="form-group margin-top">
                  <label>Deskripsi Detail Kerusakan *:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Deskripsikan gejala kerusakan secara jelas..."
                    value={reportForm.description}
                    onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group margin-top">
                  <label>Teknisi / Vendor Penanggung Jawab:</label>
                  <input
                    type="text"
                    value={reportForm.technician}
                    onChange={(e) => setReportForm(prev => ({ ...prev, technician: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group margin-top">
                  <label>Estimasi Biaya Perbaikan (IDR):</label>
                  <input
                    type="number"
                    value={reportForm.costEstimate}
                    onChange={(e) => setReportForm(prev => ({ ...prev, costEstimate: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsReportMaintenanceOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary">Kirim Ticket Perbaikan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL UPDATE STATUS TICKET */}
      {selectedTicketForUpdate && (
        <div className="modal-backdrop" onClick={() => setSelectedTicketForUpdate(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Status Service - {selectedTicketForUpdate.id}</h3>
              <button className="btn-modal-close" onClick={() => setSelectedTicketForUpdate(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleStatusUpdateSubmit}>
              <div className="modal-body">
                <p className="margin-bottom">Update status teknisi untuk perangkat <strong>{selectedTicketForUpdate.assetTag}</strong></p>

                <div className="form-group">
                  <label>Status Perbaikan *:</label>
                  <select
                    value={updateStatusVal}
                    onChange={(e) => setUpdateStatusVal(e.target.value)}
                    className="form-select"
                  >
                    <option value="Completed">Completed (Servis Selesai & Normal)</option>
                    <option value="In Progress">In Progress (Masih Dikerjakan / Menunggu Sparepart)</option>
                  </select>
                </div>

                <div className="form-group margin-top">
                  <label>Catatan Teknisi / Sparepart Ditukar:</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Penggantian RAM 16GB DDR4 & pembersihan thermal paste..."
                    value={technicianNotes}
                    onChange={(e) => setTechnicianNotes(e.target.value)}
                    className="form-textarea"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setSelectedTicketForUpdate(null)}>Batal</button>
                <button type="submit" className="btn-primary">Simpan Status Teknisi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
