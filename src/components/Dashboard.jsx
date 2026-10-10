import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  HardDrive,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  QrCode,
  FileSpreadsheet,
  Building2,
  TrendingUp,
  Cpu,
  Server,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

export const Dashboard = () => {
  const {
    devices = [],
    stockTakings = [],
    logs = [],
    departments = [],
    setActiveTab,
    setIsDeviceFormOpen,
    setEditingDevice,
    setIsQRScannerOpen,
    setIsStockTakingModalOpen,
    setSelectedCategoryFilter,
    setSelectedDeptFilter,
    setSelectedStatusFilter,
    setViewMode
  } = useInventory();

  // Safe Arrays
  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeStockTakings = Array.isArray(stockTakings) ? stockTakings : [];
  const safeLogs = Array.isArray(logs) ? logs : [];
  const safeDepts = Array.isArray(departments) ? departments : [];

  // Metrics
  const totalDevices = safeDevices.length;
  const verifiedDevices = safeDevices.filter(d => d && (d.status === 'Verified' || d.status === 'In Use')).length;
  const discrepancyDevices = safeDevices.filter(d => d && d.status === 'Discrepancy').length;
  const missingDevices = safeDevices.filter(d => d && d.status === 'Missing').length;
  const pendingDevices = safeDevices.filter(d => d && (d.status === 'Pending Audit' || !d.status)).length;

  const completionPct = totalDevices ? Math.round((verifiedDevices / totalDevices) * 100) : 0;

  const totalValuation = safeDevices.reduce((sum, d) => sum + (d?.purchaseCost || 0), 0);

  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const handleDepartmentFilter = (code) => {
    if (setSelectedDeptFilter) setSelectedDeptFilter(code);
    if (setActiveTab) setActiveTab('stocktaking');
    if (setViewMode) setViewMode('portal');
  };

  // Export to CSV Function
  const exportStockTakingCSV = () => {
    const headers = ["ID Asset", "Asset Tag", "Nama Perangkat", "Kode Departemen", "Kategori", "Lokasi", "Pengguna", "Status Audit", "Kondisi Fisik", "Tgl Audit Terakhir"];
    const rows = safeDevices.map(d => [
      d.id || '',
      d.assetTag || '',
      `"${(d.name || '').replace(/"/g, '""')}"`,
      d.departmentCode || d.departmentId || '',
      d.category || '',
      `"${d.location || ''}"`,
      `"${d.assignedTo || ''}"`,
      d.status || '',
      d.condition || '',
      d.lastStockTakingDate || 'Belum Opname'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ITS_Stock_Taking_Dashboard_${new Date().toISOString().split('T')[0]}.csv`);
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
              <span>PT. INDONESIA TORAY SYNTHETICS • STOCK TAKING COMMAND CENTER</span>
            </div>
            <div className="hero-date-badge">
              <Globe size={14} />
              <span>Tangerang Plant, Banten</span>
            </div>
          </div>

          <div className="hero-main-title-row">
            <div>
              <h1 className="hero-heading">
                Stock Taking IT Device Dashboard
              </h1>
              <p className="hero-subheading">
                Sistem Verifikasi Fisik & Opname Inventaris Perangkat IT per Master Departemen (IS, RSN, QATECH, SIS, NFY, PFY)
              </p>
            </div>

            <div className="hero-quick-actions">
              <button className="btn-hero-action primary" onClick={() => { if (setIsStockTakingModalOpen) setIsStockTakingModalOpen(true); }}>
                <ClipboardCheck size={16} />
                <span>+ Input Stock Opname</span>
              </button>
              <button className="btn-hero-action secondary" onClick={() => { if (setIsQRScannerOpen) setIsQRScannerOpen(true); }}>
                <QrCode size={16} />
                <span>Scan QR</span>
              </button>
              <button className="btn-hero-action outline" onClick={exportStockTakingCSV}>
                <FileSpreadsheet size={16} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* PROGRESS BAR PROSES STOCK OPNAME */}
          <div className="stocktaking-progress-wrapper margin-top-sm">
            <div className="flex justify-between items-center text-sm font-semibold mb-2">
              <span>Progress Audit Physical Stock Opname ITS: <strong>{completionPct}% Selesai</strong></span>
              <span>{verifiedDevices} dari {totalDevices} Perangkat Terverifikasi</span>
            </div>
            <div className="progress-bar" style={{ height: '10px' }}>
              <div className="progress-fill" style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg, #10b981, #00a3e0)' }}></div>
            </div>
          </div>

          {/* PLANT TICKER BAR */}
          <div className="plant-ticker-row margin-top">
            <div className="ticker-item">
              <Zap size={14} className="text-cyan" />
              <span>[IS] Info System: <strong>118 Devices</strong></span>
            </div>
            <div className="ticker-item">
              <Cpu size={14} className="text-emerald" />
              <span>[RSN] Resin Plant: <strong>124 Devices</strong></span>
            </div>
            <div className="ticker-item">
              <Sparkles size={14} className="text-amber" />
              <span>[QATECH] QA Tech Lab: <strong>95 Devices</strong></span>
            </div>
            <div className="ticker-item">
              <Server size={14} className="text-purple" />
              <span>[SIS] System Integration: <strong>62 Devices</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* METRICS KPI GRID */}
      <div className="kpi-grid margin-top-lg">
        <div className="kpi-card glowing-card-blue" onClick={() => { if (setSelectedStatusFilter) setSelectedStatusFilter('All'); if (setActiveTab) setActiveTab('devices'); if (setViewMode) setViewMode('portal'); }}>
          <div className="kpi-header">
            <span className="kpi-title">Total Asset Perangkat</span>
            <div className="kpi-icon-box bg-blue-soft"><HardDrive className="text-blue" size={22} /></div>
          </div>
          <div className="kpi-value">{totalDevices}</div>
          <div className="kpi-subtext">
            <TrendingUp size={14} className="text-emerald" />
            <span>Terdaftar di Sistem ITS</span>
          </div>
          <div className="kpi-mini-bar"><div className="bar-fill blue" style={{ width: '100%' }}></div></div>
        </div>

        <div className="kpi-card glowing-card-emerald" onClick={() => { if (setSelectedStatusFilter) setSelectedStatusFilter('Verified'); if (setActiveTab) setActiveTab('stocktaking'); if (setViewMode) setViewMode('portal'); }}>
          <div className="kpi-header">
            <span className="kpi-title">Terverifikasi (Verified)</span>
            <div className="kpi-icon-box bg-emerald-soft"><CheckCircle2 className="text-emerald" size={22} /></div>
          </div>
          <div className="kpi-value">{verifiedDevices}</div>
          <div className="kpi-subtext">
            <span>{completionPct}% dari total asset</span>
          </div>
          <div className="kpi-mini-bar"><div className="bar-fill emerald" style={{ width: `${completionPct}%` }}></div></div>
        </div>

        <div className="kpi-card glowing-card-amber" onClick={() => { if (setSelectedStatusFilter) setSelectedStatusFilter('Discrepancy'); if (setActiveTab) setActiveTab('stocktaking'); if (setViewMode) setViewMode('portal'); }}>
          <div className="kpi-header">
            <span className="kpi-title">Ada Selisih (Discrepancy)</span>
            <div className="kpi-icon-box bg-amber-soft"><AlertTriangle className="text-amber" size={22} /></div>
          </div>
          <div className="kpi-value">{discrepancyDevices}</div>
          <div className="kpi-subtext">Spesifikasi / lokasi berbeda</div>
          <div className="kpi-mini-bar"><div className="bar-fill amber" style={{ width: '30%' }}></div></div>
        </div>

        <div className="kpi-card glowing-card-purple" onClick={() => { if (setSelectedStatusFilter) setSelectedStatusFilter('Missing'); if (setActiveTab) setActiveTab('stocktaking'); if (setViewMode) setViewMode('portal'); }}>
          <div className="kpi-header">
            <span className="kpi-title">Tidak Ditemukan (Missing)</span>
            <div className="kpi-icon-box bg-purple-soft"><XCircle className="text-rose" size={22} /></div>
          </div>
          <div className="kpi-value">{missingDevices}</div>
          <div className="kpi-subtext">Perlu penelusuran fisik</div>
          <div className="kpi-mini-bar"><div className="bar-fill purple" style={{ width: '15%' }}></div></div>
        </div>

        <div className="kpi-card glowing-card-cyan" onClick={() => { if (setSelectedStatusFilter) setSelectedStatusFilter('Pending Audit'); if (setActiveTab) setActiveTab('devices'); if (setViewMode) setViewMode('portal'); }}>
          <div className="kpi-header">
            <span className="kpi-title">Belum Opname (Pending)</span>
            <div className="kpi-icon-box bg-cyan-soft"><Clock className="text-cyan" size={22} /></div>
          </div>
          <div className="kpi-value">{pendingDevices}</div>
          <div className="kpi-subtext">Jadwal Opname kuartal ini</div>
          <div className="kpi-mini-bar"><div className="bar-fill cyan" style={{ width: '45%' }}></div></div>
        </div>

        <div className="kpi-card highlight-card glowing-card-gold">
          <div className="kpi-header">
            <span className="kpi-title">Estimasi Nilai Asset</span>
            <div className="kpi-icon-box bg-gold-soft"><ShieldCheck className="text-gold" size={22} /></div>
          </div>
          <div className="kpi-value format-idr">{formatIDR(totalValuation)}</div>
          <div className="kpi-subtext">Capital expenditure IT</div>
          <div className="kpi-mini-bar"><div className="bar-fill gold" style={{ width: '100%' }}></div></div>
        </div>
      </div>

      {/* MASTER DEPARTEMEN STOCK TAKING ALLOCATION */}
      <div className="dashboard-two-col margin-top">
        {/* Master Departemen Opname Distribution */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-with-icon">
              <Building2 size={18} className="text-blue" />
              <h3>Master Departemen & Status Opname</h3>
            </div>
            <button className="btn-link" onClick={() => { if (setActiveTab) setActiveTab('departments'); }}>Detail Master →</button>
          </div>
          <div className="departments-widget-list">
            {safeDepts.map((dept) => {
              const deptDevices = safeDevices.filter(d => d && (d.departmentId === dept.id || d.departmentCode === dept.code));
              const verifiedDeptDevices = deptDevices.filter(d => d.status === 'Verified' || d.status === 'In Use').length;
              const deptPct = deptDevices.length ? Math.round((verifiedDeptDevices / deptDevices.length) * 100) : 0;
              return (
                <div key={dept.id} className="dept-widget-item" onClick={() => handleDepartmentFilter(dept.code)}>
                  <div className="dept-info">
                    <div className="dept-code-pill font-mono font-bold" style={{ width: '60px', textAlign: 'center' }}>
                      {dept.code}
                    </div>
                    <div>
                      <div className="dept-name">{dept.name}</div>
                      <div className="dept-head">Head: {dept.head}</div>
                    </div>
                  </div>
                  <div className="dept-count-right">
                    <div className="dept-count-badge">
                      <strong>{verifiedDeptDevices}/{deptDevices.length}</strong> Verified
                    </div>
                    <div className="mini-pct">{deptPct}% Selesai</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Stock Taking Audit Feed */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-with-icon">
              <Activity size={18} className="text-cyan" />
              <h3>Aktivitas Audit Stock Opname Terbaru</h3>
            </div>
            <button className="btn-link" onClick={() => { if (setActiveTab) setActiveTab('stocktaking'); }}>Semua Record →</button>
          </div>
          <div className="audit-feed-list">
            {safeStockTakings.slice(0, 5).map((stk) => (
              <div key={stk.id} className="audit-feed-item">
                <div className="audit-dot" style={{ background: stk.auditResultStatus === 'Verified' ? '#10b981' : '#f59e0b' }}></div>
                <div className="audit-content">
                  <div className="audit-meta">
                    <strong>[{stk.departmentCode}] {stk.assetTag} - {stk.deviceName}</strong>
                    <span className="audit-time">{stk.stockTakingDate}</span>
                  </div>
                  <p className="audit-details">Hasil: <strong className="text-cyan">{stk.auditResultStatus}</strong> ({stk.physicalCondition}) • {stk.notes}</p>
                  <div className="audit-user">Auditor: {stk.auditorName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
