import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  ClipboardCheck,
  Plus,
  QrCode,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  Filter,
  UserCheck
} from 'lucide-react';

export const StockTakingManagement = () => {
  const {
    stockTakings = [],
    departments = [],
    setIsStockTakingModalOpen,
    setIsQRScannerOpen
  } = useInventory();

  const safeStockTakings = Array.isArray(stockTakings) ? stockTakings : [];
  const safeDepts = Array.isArray(departments) ? departments : [];

  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRecords = safeStockTakings.filter(rec => {
    const matchesDept = deptFilter === 'All' || rec.departmentCode === deptFilter || rec.departmentId === deptFilter;
    const matchesStatus = statusFilter === 'All' || rec.auditResultStatus === statusFilter;
    return matchesDept && matchesStatus;
  });

  const verifiedCount = safeStockTakings.filter(r => r.auditResultStatus === 'Verified').length;
  const discrepancyCount = safeStockTakings.filter(r => r.auditResultStatus === 'Discrepancy').length;
  const missingCount = safeStockTakings.filter(r => r.auditResultStatus === 'Missing').length;

  const exportStockTakingCSV = () => {
    const headers = ["Audit ID", "Tanggal Opname", "Petugas Auditor", "Departemen Code", "Asset Tag", "Nama Perangkat", "Lokasi Seharusnya", "Lokasi Hasil Scan", "Kondisi Fisik", "Hasil Audit", "Catatan Temuan"];
    const rows = filteredRecords.map(r => [
      r.id,
      r.stockTakingDate,
      `"${r.auditorName}"`,
      r.departmentCode || '',
      r.assetTag || '',
      `"${(r.deviceName || '').replace(/"/g, '""')}"`,
      `"${r.expectedLocation || ''}"`,
      `"${r.scannedLocation || ''}"`,
      r.physicalCondition || '',
      r.auditResultStatus || '',
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ITS_Stock_Taking_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="stocktaking-view">
      {/* HEADER */}
      <div className="view-header">
        <div>
          <h2>Stock Taking & Stock Opname Physical Verification</h2>
          <p className="sub-header-text">
            Formulir & Rekam Jejak Pemeriksaan Fisik Inventaris Perangkat IT per Departemen ITS.
          </p>
        </div>
        <div className="view-header-actions">
          <button className="btn-secondary" onClick={exportStockTakingCSV}>
            <FileSpreadsheet size={16} />
            <span>Export CSV Report</span>
          </button>

          <button className="btn-secondary" onClick={() => setIsQRScannerOpen(true)}>
            <QrCode size={16} />
            <span>Scan QR Opname</span>
          </button>

          <button className="btn-primary" onClick={() => setIsStockTakingModalOpen(true)}>
            <Plus size={16} />
            <span>+ Input Stock Taking Baru</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS */}
      <div className="kpi-grid">
        <div className="kpi-card glowing-card-blue">
          <div className="kpi-header">
            <span className="kpi-title">Total Audit Stock Opname</span>
            <ClipboardCheck className="text-cyan" size={20} />
          </div>
          <div className="kpi-value">{safeStockTakings.length}</div>
          <div className="kpi-subtext">Record audit tersimpan</div>
        </div>

        <div className="kpi-card glowing-card-emerald">
          <div className="kpi-header">
            <span className="kpi-title">Terverifikasi (Verified)</span>
            <CheckCircle2 className="text-emerald" size={20} />
          </div>
          <div className="kpi-value">{verifiedCount}</div>
          <div className="kpi-subtext">Fisik & lokasi sesuai</div>
        </div>

        <div className="kpi-card glowing-card-amber">
          <div className="kpi-header">
            <span className="kpi-title">Ada Selisih (Discrepancy)</span>
            <AlertTriangle className="text-amber" size={20} />
          </div>
          <div className="kpi-value">{discrepancyCount}</div>
          <div className="kpi-subtext">Spesifikasi/lokasi beda</div>
        </div>

        <div className="kpi-card glowing-card-purple">
          <div className="kpi-header">
            <span className="kpi-title">Tidak Ditemukan (Missing)</span>
            <XCircle className="text-rose" size={20} />
          </div>
          <div className="kpi-value">{missingCount}</div>
          <div className="kpi-subtext">Perlu investigasi lapangan</div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-group">
          <label><Building2 size={14} /> Master Departemen:</label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">Semua Departemen Master ({safeDepts.length})</option>
            {safeDepts.map(d => (
              <option key={d.id} value={d.code}>
                [{d.code}] - {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label><Filter size={14} /> Status Hasil Audit:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">Semua Status</option>
            <option value="Verified">Verified (Cocok)</option>
            <option value="Discrepancy">Discrepancy (Selisih)</option>
            <option value="Missing">Missing (Hilang)</option>
          </select>
        </div>
      </div>

      {/* STOCK TAKING TABLE */}
      <div className="table-responsive">
        <table className="device-table">
          <thead>
            <tr>
              <th>Audit ID & Date</th>
              <th>Dept Master</th>
              <th>Asset Tag & Device</th>
              <th>Lokasi Seharusnya</th>
              <th>Lokasi Hasil Scan</th>
              <th>Kondisi Fisik</th>
              <th>Hasil Stock Opname</th>
              <th>Auditor / Petugas</th>
              <th>Catatan Audit</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-muted">
                  Belum ada data Stock Taking yang sesuai filter.
                </td>
              </tr>
            ) : (
              filteredRecords.map((rec) => (
                <tr key={rec.id}>
                  <td>
                    <div>
                      <strong className="code-font">{rec.id}</strong>
                      <div className="text-muted text-sm">{rec.stockTakingDate}</div>
                    </div>
                  </td>
                  <td>
                    <span className="dept-pill">{rec.departmentCode || 'IS'}</span>
                  </td>
                  <td>
                    <div>
                      <span className="asset-tag-badge">{rec.assetTag}</span>
                      <div className="text-sm font-semibold">{rec.deviceName}</div>
                    </div>
                  </td>
                  <td className="text-sm">{rec.expectedLocation}</td>
                  <td className="text-sm">
                    <span className={rec.locationStatus === 'Moved' ? 'text-amber font-semibold' : ''}>
                      {rec.scannedLocation}
                    </span>
                  </td>
                  <td>
                    <span className={`condition-pill cond-${(rec.physicalCondition || 'Good').toLowerCase().replace(' ', '-')}`}>
                      {rec.physicalCondition}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      rec.auditResultStatus === 'Verified' ? 'status-in-use' :
                      rec.auditResultStatus === 'Discrepancy' ? 'status-maintenance' : 'status-decommissioned'
                    }`}>
                      {rec.auditResultStatus}
                    </span>
                  </td>
                  <td>
                    <div className="user-cell text-sm">
                      <UserCheck size={14} />
                      <span>{rec.auditorName}</span>
                    </div>
                  </td>
                  <td className="text-sm text-muted max-width-desc">{rec.notes}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
