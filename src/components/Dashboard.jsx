import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  HardDrive,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  DollarSign,
  Plus,
  QrCode,
  FileSpreadsheet,
  Building2,
  TrendingUp,
  Cpu,
  Server,
  Monitor,
  Printer,
  Wifi,
  Tablet,
  ChevronRight
} from 'lucide-react';

export const Dashboard = () => {
  const {
    devices,
    checkouts,
    maintenance,
    spareParts,
    logs,
    departments,
    setActiveTab,
    setIsDeviceFormOpen,
    setEditingDevice,
    setIsQRScannerOpen,
    setIsReportMaintenanceOpen
  } = useInventory();

  // Metrics
  const totalDevices = devices.length;
  const inUseDevices = devices.filter(d => d.status === 'In Use').length;
  const availableDevices = devices.filter(d => d.status === 'Available').length;
  const maintenanceDevices = devices.filter(d => d.status === 'Maintenance').length;
  const activeCheckouts = checkouts.filter(c => c.status === 'Active').length;

  const totalValuation = devices.reduce((sum, d) => sum + (d.purchaseCost || 0), 0);

  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  // Categories Count
  const categories = [
    { name: 'Server', icon: Server, color: 'text-purple' },
    { name: 'Industrial PC', icon: Cpu, color: 'text-amber' },
    { name: 'Laptop', icon: Monitor, color: 'text-blue' },
    { name: 'Desktop PC', icon: Monitor, color: 'text-cyan' },
    { name: 'Printer & Scanner', icon: Printer, color: 'text-emerald' },
    { name: 'Network Equipment', icon: Wifi, color: 'text-indigo' },
    { name: 'Mobile & Handheld', icon: Tablet, color: 'text-pink' },
  ];

  const getCategoryCount = (catName) => devices.filter(d => d.category === catName).length;

  // Export to CSV Function
  const exportToCSV = () => {
    const headers = ["ID Asset", "Asset Tag", "Nama Perangkat", "Kategori", "Merk/Model", "Serial Number", "Departemen", "Lokasi", "Pengguna", "Status", "Kondisi", "Harga Beli (IDR)"];
    const rows = devices.map(d => [
      d.id,
      d.assetTag,
      `"${d.name.replace(/"/g, '""')}"`,
      d.category,
      `"${d.brand} ${d.model}"`,
      d.serialNumber,
      d.departmentId,
      `"${d.location}"`,
      `"${d.assignedTo}"`,
      d.status,
      d.condition,
      d.purchaseCost || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ITS_Device_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-view">
      {/* PAGE HEADER */}
      <div className="view-header">
        <div>
          <h2>Executive IT Asset Dashboard</h2>
          <p className="sub-header-text">
            Ringkasan Inventarisasi Device & Status Operasional PT. Indonesia Toray Synthetics
          </p>
        </div>
        <div className="view-header-actions">
          <button className="btn-secondary" onClick={exportToCSV}>
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
          <button className="btn-secondary" onClick={() => setIsQRScannerOpen(true)}>
            <QrCode size={16} />
            <span>Scan QR</span>
          </button>
          <button className="btn-primary" onClick={() => { setEditingDevice(null); setIsDeviceFormOpen(true); }}>
            <Plus size={16} />
            <span>+ Asset Baru</span>
          </button>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="kpi-grid">
        <div className="kpi-card" onClick={() => setActiveTab('devices')}>
          <div className="kpi-header">
            <span className="kpi-title">Total Asset IT</span>
            <div className="kpi-icon-box bg-blue-soft"><HardDrive className="text-blue" size={22} /></div>
          </div>
          <div className="kpi-value">{totalDevices}</div>
          <div className="kpi-subtext"><TrendingUp size={14} className="text-success" /> Terdaftar di Sistem ITS</div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('devices')}>
          <div className="kpi-header">
            <span className="kpi-title">Perangkat Aktif (In Use)</span>
            <div className="kpi-icon-box bg-emerald-soft"><CheckCircle2 className="text-emerald" size={22} /></div>
          </div>
          <div className="kpi-value">{inUseDevices}</div>
          <div className="kpi-subtext">{Math.round((inUseDevices / (totalDevices || 1)) * 100)}% Dari total asset</div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('devices')}>
          <div className="kpi-header">
            <span className="kpi-title">Stok Tersedia (Stock)</span>
            <div className="kpi-icon-box bg-cyan-soft"><CheckCircle2 className="text-cyan" size={22} /></div>
          </div>
          <div className="kpi-value">{availableDevices}</div>
          <div className="kpi-subtext">Siap dialokasikan</div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('maintenance')}>
          <div className="kpi-header">
            <span className="kpi-title">Perbaikan & Service</span>
            <div className="kpi-icon-box bg-amber-soft"><Wrench className="text-amber" size={22} /></div>
          </div>
          <div className="kpi-value">{maintenanceDevices}</div>
          <div className="kpi-subtext">{maintenance.filter(m => m.status === 'In Progress').length} Ticket aktif</div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab('checkout')}>
          <div className="kpi-header">
            <span className="kpi-title">Peminjaman Sementara</span>
            <div className="kpi-icon-box bg-purple-soft"><Clock className="text-purple" size={22} /></div>
          </div>
          <div className="kpi-value">{activeCheckouts}</div>
          <div className="kpi-subtext">Perangkat luar kantor</div>
        </div>

        <div className="kpi-card highlight-card">
          <div className="kpi-header">
            <span className="kpi-title">Estimasi Nilai Asset</span>
            <div className="kpi-icon-box bg-gold-soft"><DollarSign className="text-gold" size={22} /></div>
          </div>
          <div className="kpi-value format-idr">{formatIDR(totalValuation)}</div>
          <div className="kpi-subtext">Capital expenditure IT</div>
        </div>
      </div>

      {/* CATEGORY & DISTRIBUTION ROW */}
      <div className="dashboard-two-col">
        {/* Categories Breakdown */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Kategori Perangkat</h3>
            <button className="btn-link" onClick={() => setActiveTab('devices')}>Lihat Semua →</button>
          </div>
          <div className="categories-list">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const count = getCategoryCount(cat.name);
              const pct = totalDevices ? Math.round((count / totalDevices) * 100) : 0;
              return (
                <div key={idx} className="category-item" onClick={() => setActiveTab('devices')}>
                  <div className="cat-icon-name">
                    <Icon size={18} className={cat.color} />
                    <span>{cat.name}</span>
                  </div>
                  <div className="cat-progress-wrapper">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="cat-count-pill">{count} ({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Distribusi Asset per Departemen</h3>
            <button className="btn-link" onClick={() => setActiveTab('departments')}>Lihat Unit →</button>
          </div>
          <div className="departments-widget-list">
            {departments.map((dept) => {
              const deptDevices = devices.filter(d => d.departmentId === dept.id);
              return (
                <div key={dept.id} className="dept-widget-item">
                  <div className="dept-info">
                    <Building2 size={18} className="text-blue" />
                    <div>
                      <div className="dept-name">{dept.name}</div>
                      <div className="dept-head">Head: {dept.head}</div>
                    </div>
                  </div>
                  <div className="dept-count-badge">
                    <strong>{deptDevices.length}</strong> Perangkat
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: RECENT ACTIVITY & MAINTENANCE ALERTS */}
      <div className="dashboard-two-col">
        {/* Maintenance Tickets & Alerts */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Perbaikan & Maintenance Aktif</h3>
            <button className="btn-secondary-sm" onClick={() => setIsReportMaintenanceOpen(true)}>+ Laporkan Rusak</button>
          </div>
          <div className="maintenance-alerts-list">
            {maintenance.length === 0 ? (
              <div className="empty-state-sm">
                <CheckCircle2 size={32} className="text-success" />
                <p>Tidak ada ticket perbaikan aktif saat ini.</p>
              </div>
            ) : (
              maintenance.slice(0, 4).map((ticket) => (
                <div key={ticket.id} className="maintenance-card-sm">
                  <div className="m-card-header">
                    <span className={`status-badge status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                      {ticket.status}
                    </span>
                    <span className="m-date">{ticket.reportDate}</span>
                  </div>
                  <h4 className="m-title">{ticket.assetTag} - {ticket.deviceName}</h4>
                  <p className="m-desc">{ticket.description}</p>
                  <div className="m-footer">
                    <span>Pelapor: <strong>{ticket.reportedBy}</strong></span>
                    <span>Teknisi: <strong>{ticket.technician}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Log Feed */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Aktivitas Sistem Terbaru</h3>
            <button className="btn-link" onClick={() => setActiveTab('audit')}>Semua Audit Log →</button>
          </div>
          <div className="audit-feed-list">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="audit-feed-item">
                <div className="audit-dot"></div>
                <div className="audit-content">
                  <div className="audit-meta">
                    <strong>{log.action}</strong>
                    <span className="audit-time">{log.timestamp}</span>
                  </div>
                  <p className="audit-details">{log.details}</p>
                  <div className="audit-user">Oleh: {log.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
