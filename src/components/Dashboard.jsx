import React, { useState } from 'react';
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
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles
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
    setIsReportMaintenanceOpen,
    setSelectedCategoryFilter,
    setViewMode
  } = useInventory();

  // Metrics
  const totalDevices = devices.length;
  const inUseDevices = devices.filter(d => d.status === 'In Use').length;
  const availableDevices = devices.filter(d => d.status === 'Available').length;
  const maintenanceDevices = devices.filter(d => d.status === 'Maintenance').length;
  const activeCheckouts = checkouts.filter(c => c.status === 'Active').length;

  const totalValuation = devices.reduce((sum, d) => sum + (d.purchaseCost || 0), 0);

  // Warranty Warning Count (Expiring within 6 months or 2026)
  const expiringWarrantyCount = devices.filter(d => d.warrantyExpiry && d.warrantyExpiry.startsWith('2026')).length;

  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  // Categories Count
  const categories = [
    { name: 'Server', icon: Server, color: 'text-purple', bg: 'bg-purple-soft' },
    { name: 'Industrial PC', icon: Cpu, color: 'text-amber', bg: 'bg-amber-soft' },
    { name: 'Laptop', icon: Monitor, color: 'text-blue', bg: 'bg-blue-soft' },
    { name: 'Desktop PC', icon: Monitor, color: 'text-cyan', bg: 'bg-cyan-soft' },
    { name: 'Printer & Scanner', icon: Printer, color: 'text-emerald', bg: 'bg-emerald-soft' },
    { name: 'Network Equipment', icon: Wifi, color: 'text-indigo', bg: 'bg-purple-soft' },
    { name: 'Mobile & Handheld', icon: Tablet, color: 'text-pink', bg: 'bg-gold-soft' },
  ];

  const getCategoryCount = (catName) => devices.filter(d => d.category === catName).length;

  const handleCategoryQuickFilter = (catName) => {
    setSelectedCategoryFilter(catName);
    setActiveTab('devices');
    setViewMode('portal');
  };

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
      {/* FEATURED DASHBOARD HERO BANNER WITH PT. TORAY INDUSTRIAL BACKGROUND */}
      <div className="dashboard-hero-banner">
        <div className="hero-banner-bg"></div>
        <div className="hero-banner-content">
          <div className="hero-top-bar">
            <div className="hero-live-pill">
              <span className="live-pulse"></span>
              <Activity size={14} />
              <span>PT. INDONESIA TORAY SYNTHETICS • COMMAND CENTER ONLINE</span>
            </div>
            <div className="hero-date-badge">
              <Globe size={14} />
              <span>Tangerang Plant, Banten</span>
            </div>
          </div>

          <div className="hero-main-title-row">
            <div>
              <h1 className="hero-heading">
                IT Device Infrastructure Dashboard
              </h1>
              <p className="hero-subheading">
                Sistem Pengawasan & Management Asset IT Terpadu Unit Operasional PT. Indonesia Toray Synthetics
              </p>
            </div>

            <div className="hero-quick-actions">
              <button className="btn-hero-action primary" onClick={() => { setEditingDevice(null); setIsDeviceFormOpen(true); }}>
                <Plus size={16} />
                <span>+ Asset Baru</span>
              </button>
              <button className="btn-hero-action secondary" onClick={() => setIsQRScannerOpen(true)}>
                <QrCode size={16} />
                <span>Scan QR</span>
              </button>
              <button className="btn-hero-action outline" onClick={exportToCSV}>
                <FileSpreadsheet size={16} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* PLANT TICKER BAR */}
          <div className="plant-ticker-row">
            <div className="ticker-item">
              <Zap size={14} className="text-cyan" />
              <span>Plant 1 Polymerization: <strong>124 Devices</strong></span>
            </div>
            <div className="ticker-item">
              <Cpu size={14} className="text-emerald" />
              <span>Plant 2 Filament Yarn: <strong>148 Devices</strong></span>
            </div>
            <div className="ticker-item">
              <Wrench size={14} className="text-amber" />
              <span>Power & Utility Center: <strong>62 Devices</strong></span>
            </div>
            <div className="ticker-item">
              <Server size={14} className="text-purple" />
              <span>Main Office & Data Center: <strong>118 Devices</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* METRICS KPI GRID */}
      <div className="kpi-grid margin-top-lg">
        <div className="kpi-card glowing-card-blue" onClick={() => setActiveTab('devices')}>
          <div className="kpi-header">
            <span className="kpi-title">Total Asset IT</span>
            <div className="kpi-icon-box bg-blue-soft"><HardDrive className="text-blue" size={22} /></div>
          </div>
          <div className="kpi-value">{totalDevices}</div>
          <div className="kpi-subtext">
            <TrendingUp size={14} className="text-emerald" />
            <span>Terdaftar di Sistem ITS</span>
          </div>
          <div className="kpi-mini-bar"><div className="bar-fill blue" style={{ width: '100%' }}></div></div>
        </div>

        <div className="kpi-card glowing-card-emerald" onClick={() => setActiveTab('devices')}>
          <div className="kpi-header">
            <span className="kpi-title">Perangkat Aktif (In Use)</span>
            <div className="kpi-icon-box bg-emerald-soft"><CheckCircle2 className="text-emerald" size={22} /></div>
          </div>
          <div className="kpi-value">{inUseDevices}</div>
          <div className="kpi-subtext">
            <span>{Math.round((inUseDevices / (totalDevices || 1)) * 100)}% dari total perangkat</span>
          </div>
          <div className="kpi-mini-bar"><div className="bar-fill emerald" style={{ width: `${Math.round((inUseDevices / (totalDevices || 1)) * 100)}%` }}></div></div>
        </div>

        <div className="kpi-card glowing-card-cyan" onClick={() => setActiveTab('devices')}>
          <div className="kpi-header">
            <span className="kpi-title">Stok Tersedia (Stock)</span>
            <div className="kpi-icon-box bg-cyan-soft"><ShieldCheck className="text-cyan" size={22} /></div>
          </div>
          <div className="kpi-value">{availableDevices}</div>
          <div className="kpi-subtext">Siap dialokasikan cepat</div>
          <div className="kpi-mini-bar"><div className="bar-fill cyan" style={{ width: `${Math.round((availableDevices / (totalDevices || 1)) * 100)}%` }}></div></div>
        </div>

        <div className="kpi-card glowing-card-amber" onClick={() => setActiveTab('maintenance')}>
          <div className="kpi-header">
            <span className="kpi-title">Perbaikan & Service</span>
            <div className="kpi-icon-box bg-amber-soft"><Wrench className="text-amber" size={22} /></div>
          </div>
          <div className="kpi-value">{maintenanceDevices}</div>
          <div className="kpi-subtext">
            <span className="text-amber"><strong>{maintenance.filter(m => m.status === 'In Progress').length}</strong> Ticket aktif</span>
          </div>
          <div className="kpi-mini-bar"><div className="bar-fill amber" style={{ width: '40%' }}></div></div>
        </div>

        <div className="kpi-card glowing-card-purple" onClick={() => setActiveTab('checkout')}>
          <div className="kpi-header">
            <span className="kpi-title">Peminjaman Sementara</span>
            <div className="kpi-icon-box bg-purple-soft"><Clock className="text-purple" size={22} /></div>
          </div>
          <div className="kpi-value">{activeCheckouts}</div>
          <div className="kpi-subtext">Perangkat luar kantor</div>
          <div className="kpi-mini-bar"><div className="bar-fill purple" style={{ width: '60%' }}></div></div>
        </div>

        <div className="kpi-card highlight-card glowing-card-gold">
          <div className="kpi-header">
            <span className="kpi-title">Estimasi Nilai Asset</span>
            <div className="kpi-icon-box bg-gold-soft"><DollarSign className="text-gold" size={22} /></div>
          </div>
          <div className="kpi-value format-idr">{formatIDR(totalValuation)}</div>
          <div className="kpi-subtext">Capital expenditure IT</div>
          <div className="kpi-mini-bar"><div className="bar-fill gold" style={{ width: '100%' }}></div></div>
        </div>
      </div>

      {/* WARNING ALERT BANNER FOR EXPIRING WARRANTIES */}
      {expiringWarrantyCount > 0 && (
        <div className="warranty-alert-card">
          <div className="w-alert-left">
            <AlertTriangle size={24} className="icon-amber-pulse" />
            <div>
              <h4>Peringatan Masa Garansi Asset Terdeteksi!</h4>
              <p>Terdapat <strong>{expiringWarrantyCount} perangkat</strong> yang masa garansinya berakhir di tahun 2026. Pertimbangkan perpanjangan garansi vendor atau peremajaan perangkat.</p>
            </div>
          </div>
          <button className="btn-secondary-sm" onClick={() => setActiveTab('devices')}>
            Periksa Garansi Perangkat →
          </button>
        </div>
      )}

      {/* CATEGORY & DISTRIBUTION ROW */}
      <div className="dashboard-two-col margin-top">
        {/* Categories Breakdown */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-with-icon">
              <Sparkles size={18} className="text-cyan" />
              <h3>Kategori Perangkat & Akses Cepat</h3>
            </div>
            <button className="btn-link" onClick={() => setActiveTab('devices')}>Lihat Semua Katalog →</button>
          </div>
          <div className="categories-list">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const count = getCategoryCount(cat.name);
              const pct = totalDevices ? Math.round((count / totalDevices) * 100) : 0;
              return (
                <div key={idx} className="category-item" onClick={() => handleCategoryQuickFilter(cat.name)}>
                  <div className="cat-icon-name">
                    <div className={`cat-icon-badge ${cat.bg}`}>
                      <Icon size={16} className={cat.color} />
                    </div>
                    <span>{cat.name}</span>
                  </div>
                  <div className="cat-progress-wrapper">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="cat-count-pill">{count} unit ({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Asset Allocation */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-with-icon">
              <Building2 size={18} className="text-blue" />
              <h3>Distribusi Asset per Departemen ITS</h3>
            </div>
            <button className="btn-link" onClick={() => setActiveTab('departments')}>Detail Unit →</button>
          </div>
          <div className="departments-widget-list">
            {departments.map((dept) => {
              const deptDevices = devices.filter(d => d.departmentId === dept.id);
              const pct = totalDevices ? Math.round((deptDevices.length / totalDevices) * 100) : 0;
              return (
                <div key={dept.id} className="dept-widget-item">
                  <div className="dept-info">
                    <div className="dept-icon-mini"><Building2 size={16} className="text-cyan" /></div>
                    <div>
                      <div className="dept-name">{dept.name}</div>
                      <div className="dept-head">Head: {dept.head}</div>
                    </div>
                  </div>
                  <div className="dept-count-right">
                    <div className="dept-count-badge">
                      <strong>{deptDevices.length}</strong> Perangkat
                    </div>
                    <div className="mini-pct">{pct}% dari total</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: RECENT ACTIVITY & MAINTENANCE TICKETS */}
      <div className="dashboard-two-col">
        {/* Maintenance Tickets & Alerts */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-with-icon">
              <Wrench size={18} className="text-amber" />
              <h3>Status Service & Maintenance Ticket</h3>
            </div>
            <button className="btn-secondary-sm" onClick={() => setIsReportMaintenanceOpen(true)}>+ Laporkan Rusak</button>
          </div>
          <div className="maintenance-alerts-list">
            {maintenance.length === 0 ? (
              <div className="empty-state-sm">
                <CheckCircle2 size={32} className="text-emerald" />
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
            <div className="panel-title-with-icon">
              <Activity size={18} className="text-cyan" />
              <h3>Aktivitas Sistem & Audit Trail</h3>
            </div>
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
