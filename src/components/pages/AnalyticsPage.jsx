import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Monitor,
  Laptop,
  Server,
  Zap,
  Printer,
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  HardDrive,
  PieChart as PieIcon,
  Layers,
  Sparkles
} from 'lucide-react';
import { ThreeDPieChart } from '../ThreeDPieChart';

export const AnalyticsPage = ({ onNavigate }) => {
  const {
    devices = [],
    departments = [],
    logs = [],
    setFilterDept
  } = useInventory();

  // Mode for the 3D Pie Chart: 'status' | 'dept' | 'type'
  const [pieMode, setPieMode] = useState('status');
  // Visual presentation toggle: '3d-chart' | 'cards'
  const [viewMode, setViewMode] = useState('3d-chart');

  const totalCount = devices.length;
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const inCount = devices.filter(d => d.status === 'In').length;
  const outCount = devices.filter(d => d.status === 'Out').length;
  const notUsedCount = devices.filter(d => d.status === 'Not Used').length;
  const brokenCount = devices.filter(d => d.status === 'Broken').length;
  const disposalCount = devices.filter(d => d.status === 'Disposal').length;

  const operationalReady = onlineCount + inCount;
  const readyRate = totalCount > 0 ? Math.round((operationalReady / totalCount) * 100) : 0;
  const attentionCount = brokenCount + disposalCount + notUsedCount;

  // Breakdown by Department
  const deptStats = departments.map((dept) => {
    const deptDevices = devices.filter(d => d.department === dept.code);
    const count = deptDevices.length;
    const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    const online = deptDevices.filter(d => d.status === 'Online').length;
    const inDevices = deptDevices.filter(d => d.status === 'In').length;
    const attention = deptDevices.filter(d => ['Broken', 'Disposal', 'Not Used'].includes(d.status)).length;

    return {
      code: dept.code,
      name: dept.name,
      count,
      percentage,
      online,
      inDevices,
      attention
    };
  }).sort((a, b) => b.count - a.count);

  // Breakdown by Device Type
  const typeCategories = [
    { name: 'Desktop PC', icon: Monitor, color: '#3b6bb5' },
    { name: 'Laptop', icon: Laptop, color: '#e06828' },
    { name: 'Server', icon: Server, color: '#71717a' },
    { name: 'Industrial PC', icon: Zap, color: '#eab308' },
    { name: 'Printer & Scanner', icon: Printer, color: '#16a34a' }
  ];

  const typeStats = typeCategories.map(cat => {
    const count = devices.filter(d => d.type === cat.name).length;
    const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return { ...cat, count, pct };
  });

  // -------------------------------------------------------------------------
  // 3D PIE CHART DATASETS (MATCHING COLOR PALETTE & PROPORTIONS OF IMAGE 2)
  // -------------------------------------------------------------------------
  // 1. Status Dataset (Default)
  const statusColors = {
    'Online': '#3b6bb5',      // Royal Blue (Facebook in Img 2)
    'In': '#e06828',          // Warm Orange (YouTube in Img 2)
    'Disposal': '#71717a',    // Steel Gray (Twitter in Img 2)
    'Broken': '#eab308',      // Warm Gold (Reddit in Img 2)
    'Not Used': '#38bdf8',    // Sky Blue (Instagram in Img 2)
    'Out': '#16a34a'          // Green (Pinterest in Img 2)
  };

  const statusPieData = [
    { id: 'online', label: 'Online', value: onlineCount, color: statusColors['Online'] },
    { id: 'in', label: 'In (Standby)', value: inCount, color: statusColors['In'] },
    { id: 'disposal', label: 'Disposal', value: disposalCount, color: statusColors['Disposal'] },
    { id: 'broken', label: 'Broken', value: brokenCount, color: statusColors['Broken'] },
    { id: 'not-used', label: 'Not Used', value: notUsedCount, color: statusColors['Not Used'] },
    { id: 'out', label: 'Out', value: outCount, color: statusColors['Out'] }
  ].filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  // 2. Department Dataset (8 slices, matching Image 2's social media pie)
  const deptPalette = [
    '#3b6bb5', // Royal Blue
    '#e06828', // Warm Orange
    '#71717a', // Steel Gray
    '#eab308', // Warm Gold
    '#0ea5e9', // Cyan
    '#16a34a', // Forest Green
    '#1e3a8a', // Deep Navy
    '#9a3412', // Saddle Brown
    '#475569', // Charcoal
    '#d97706'  // Ochre
  ];

  const deptPieData = deptStats.map((d, i) => ({
    id: d.code,
    label: d.code,
    value: d.count,
    color: deptPalette[i % deptPalette.length]
  })).filter(d => d.value > 0);

  // 3. Hardware Type Dataset
  const typePieData = typeStats.map((t) => ({
    id: t.name,
    label: t.name,
    value: t.count,
    color: t.color
  })).filter(d => d.value > 0);

  // Select active data for 3D Pie
  const activePieData =
    pieMode === 'dept' ? deptPieData :
    pieMode === 'type' ? typePieData :
    statusPieData;

  const handleFilterDeptJump = (deptCode) => {
    setFilterDept(deptCode);
    if (onNavigate) onNavigate('devices');
  };

  return (
    <div className="page-fade-in analytics-page-shell">
      {/* Page Header */}
      <div className="inventory-section-header">
        <div className="section-title-wrap">
          <h1 className="section-main-title">
            <BarChart3 size={24} style={{ color: '#3b82f6' }} />
            <span>Statistik & Analisis Stock Opname IT</span>
          </h1>
          <p className="section-subtitle-text">
            Laporan Kesiapan Operasional, Distribusi Departemen & Kesehatan Hardware • PT. Indonesia Toray Synthetics
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* View Mode Toggle: 3D Chart vs Classic Cards */}
          <div className="three-d-view-toggle">
            <button
              className={`three-d-view-btn ${viewMode === '3d-chart' ? 'active' : ''}`}
              onClick={() => setViewMode('3d-chart')}
              title="Tampilkan Diagram 3D Pie"
            >
              <PieIcon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
              <span>Diagram 3D Pie</span>
            </button>
            <button
              className={`three-d-view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Tampilkan Kartu Metrik Ringkasan"
            >
              <Layers size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '5px' }} />
              <span>Kartu Metrik</span>
            </button>
          </div>

          <button
            className="btn-inventory-action btn-blue-solid"
            onClick={() => onNavigate && onNavigate('devices')}
          >
            <HardDrive size={15} />
            <span>Lihat Tabel Perangkat</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          1. COMPACT EXECUTIVE SUMMARY KPI STRIP
          ------------------------------------------------------------------ */}
      <div className="analytics-compact-metric-strip">
        <div className="compact-metric-card">
          <div className="compact-metric-left">
            <span className="compact-metric-label">Kesiapan Operasional</span>
            <span className="compact-metric-val">{readyRate}%</span>
          </div>
          <span className="compact-metric-badge" style={{ background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa' }}>
            Optimal ({operationalReady}/{totalCount})
          </span>
        </div>

        <div className="compact-metric-card">
          <div className="compact-metric-left">
            <span className="compact-metric-label">Unit Online & Aktif</span>
            <span className="compact-metric-val" style={{ color: '#3b82f6' }}>{onlineCount} Unit</span>
          </div>
          <span className="compact-metric-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            ● Live Network
          </span>
        </div>

        <div className="compact-metric-card">
          <div className="compact-metric-left">
            <span className="compact-metric-label">Unit Standby (In)</span>
            <span className="compact-metric-val" style={{ color: '#38bdf8' }}>{inCount} Unit</span>
          </div>
          <span className="compact-metric-badge" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
            Ready Deploy
          </span>
        </div>

        <div className="compact-metric-card">
          <div className="compact-metric-left">
            <span className="compact-metric-label">Perlu Cek / Repair</span>
            <span className="compact-metric-val" style={{ color: '#fbbf24' }}>{attentionCount} Unit</span>
          </div>
          <span className="compact-metric-badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}>
            Action Required
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. THE "MID BAR" SECTION: 3D ISOMETRIC PIE CHART (IMAGE 2 STYLE)
          ------------------------------------------------------------------ */}
      {viewMode === '3d-chart' ? (
        <div className="three-d-pie-panel">
          <div className="three-d-pie-panel-header">
            <div className="three-d-pie-title-wrap">
              <h2 className="three-d-pie-title">
                <PieIcon size={20} style={{ color: '#3b82f6' }} />
                <span>
                  {pieMode === 'status' ? 'Diagram 3D Sebaran Status Kesiapan Perangkat IT' :
                   pieMode === 'dept' ? 'Diagram 3D Sebaran Perangkat per Departemen Pabrik' :
                   'Diagram 3D Komposisi Jenis Hardware IT'}
                </span>
              </h2>
              <span className="three-d-pie-subtitle">
                Model isometrik 3D dengan pemisahan irisan (exploded slices) & callout label persentase (Gaya Gambar ke-2)
              </span>
            </div>

            {/* Filter Toggle: Status vs Departemen vs Tipe */}
            <div className="three-d-view-toggle">
              <button
                className={`three-d-view-btn ${pieMode === 'status' ? 'active' : ''}`}
                onClick={() => setPieMode('status')}
              >
                Status Perangkat ({statusPieData.length})
              </button>
              <button
                className={`three-d-view-btn ${pieMode === 'dept' ? 'active' : ''}`}
                onClick={() => setPieMode('dept')}
              >
                Departemen ({deptPieData.length})
              </button>
              <button
                className={`three-d-view-btn ${pieMode === 'type' ? 'active' : ''}`}
                onClick={() => setPieMode('type')}
              >
                Tipe Hardware ({typePieData.length})
              </button>
            </div>
          </div>

          {/* THE 3D PIE COMPONENT */}
          <ThreeDPieChart data={activePieData} />
        </div>
      ) : (
        /* Classic 4 Metric Cards View */
        <div className="analytics-metrics-grid">
          <div className="analytics-stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">TINGKAT KESIAPAN OPERASIONAL</span>
              <div className="stat-card-icon-wrap blue">
                <ShieldCheck size={18} />
              </div>
            </div>
            <div className="stat-card-body">
              <span className="stat-card-number">{readyRate}%</span>
              <span className="stat-card-badge success">Optimal</span>
            </div>
            <p className="stat-card-desc">
              {operationalReady} dari {totalCount} unit berstatus Online atau In
            </p>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill blue" style={{ width: `${readyRate}%` }}></div>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">UNIT ONLINE & AKTIF</span>
              <div className="stat-card-icon-wrap green">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="stat-card-body">
              <span className="stat-card-number">{onlineCount}</span>
              <span className="stat-card-badge live-pulse">Live</span>
            </div>
            <p className="stat-card-desc">
              Perangkat terhubung aktif ke jaringan pabrik Tangerang
            </p>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill cyan" style={{ width: `${totalCount > 0 ? (onlineCount / totalCount) * 100 : 0}%` }}></div>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">UNIT STANDBY / CADANGAN (IN)</span>
              <div className="stat-card-icon-wrap cyan">
                <Cpu size={18} />
              </div>
            </div>
            <div className="stat-card-body">
              <span className="stat-card-number">{inCount}</span>
              <span className="stat-card-badge neutral">Ready</span>
            </div>
            <p className="stat-card-desc">
              Tersimpan di ruang IT / siap dideploy sewaktu-waktu
            </p>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill blue" style={{ width: `${totalCount > 0 ? (inCount / totalCount) * 100 : 0}%` }}></div>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="stat-card-header">
              <span className="stat-card-label">PERLU PERHATIAN / REPAIR</span>
              <div className="stat-card-icon-wrap amber">
                <AlertTriangle size={18} />
              </div>
            </div>
            <div className="stat-card-body">
              <span className="stat-card-number">{attentionCount}</span>
              <span className="stat-card-badge warning">Action</span>
            </div>
            <p className="stat-card-desc">
              {brokenCount} Rusak, {notUsedCount} Nonaktif, {disposalCount} Usul Scrap
            </p>
            <div className="stat-progress-bar">
              <div className="stat-progress-fill amber" style={{ width: `${totalCount > 0 ? (attentionCount / totalCount) * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          3. COLUMNS GRID: DEPARTEMEN BREAKDOWN & HARDWARE COMPOSITION
          ------------------------------------------------------------------ */}
      <div className="analytics-columns-grid">
        {/* Left Column: Distribusi Departemen */}
        <div className="bento-surface analytics-dept-panel">
          <div className="bento-card-header" style={{ marginBottom: '20px' }}>
            <div className="card-header-left">
              <Building2 size={18} style={{ color: '#3b82f6' }} />
              <h3 className="card-header-title">Sebaran Perangkat per Departemen</h3>
            </div>
            <span style={{ fontSize: '12px', color: '#727885' }}>
              {departments.length} Departemen Terdaftar
            </span>
          </div>

          <div className="dept-distribution-list">
            {deptStats.map(dept => (
              <div
                key={dept.code}
                className="dept-dist-row"
                onClick={() => handleFilterDeptJump(dept.code)}
                title={`Klik untuk filter tabel ke departemen [${dept.code}]`}
              >
                <div className="dept-dist-info">
                  <div className="dept-dist-tag-group">
                    <span className={`dept-badge-pill dept-${dept.code.toLowerCase()}`}>
                      {dept.code}
                    </span>
                    <span className="dept-dist-name">{dept.name}</span>
                  </div>
                  <div className="dept-dist-counts">
                    <span className="dept-dist-total"><strong>{dept.count}</strong> unit ({dept.percentage}%)</span>
                    <ArrowUpRight size={14} className="dept-dist-arrow" />
                  </div>
                </div>

                <div className="dept-progress-track">
                  <div
                    className="dept-progress-bar"
                    style={{ width: `${Math.max(dept.percentage, 4)}%` }}
                  ></div>
                </div>

                <div className="dept-sub-pills">
                  <span className="sub-pill online">{dept.online} Online</span>
                  <span className="sub-pill in">{dept.inDevices} In</span>
                  {dept.attention > 0 && (
                    <span className="sub-pill attention">{dept.attention} Perlu Cek</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hardware Composition & Audit Log */}
        <div className="analytics-right-stack">
          {/* Hardware Composition Card */}
          <div className="bento-surface">
            <div className="bento-card-header">
              <div className="card-header-left">
                <Cpu size={18} style={{ color: '#38bdf8' }} />
                <h3 className="card-header-title">Komposisi Tipe Hardware</h3>
              </div>
            </div>

            <div className="type-composition-list">
              {typeStats.map(item => {
                const IconComponent = item.icon;
                return (
                  <div key={item.name} className="type-comp-row">
                    <div className="type-comp-left">
                      <div className="type-icon-box" style={{ color: item.color }}>
                        <IconComponent size={16} />
                      </div>
                      <span className="type-comp-name">{item.name}</span>
                    </div>
                    <div className="type-comp-right">
                      <span className="type-comp-count">{item.count} Unit</span>
                      <span className="type-comp-pct">({item.pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit History / Live Log */}
          <div className="bento-surface" style={{ flex: 1 }}>
            <div className="bento-card-header">
              <div className="card-header-left">
                <Clock size={18} style={{ color: '#fbbf24' }} />
                <h3 className="card-header-title">Log Aktivitas Audit Terakhir</h3>
              </div>
            </div>

            <div className="audit-logs-mini-list">
              {(logs.length > 0 ? logs.slice(0, 6) : [
                { id: '1', action: 'Update Status', details: 'ITS-IS-PC01 diverifikasi menjadi Online', timestamp: '2026-10-18 20:30' },
                { id: '2', action: 'Barcode Scan', details: 'Verifikasi stiker ITS-HRGA-NB02', timestamp: '2026-10-18 19:15' },
                { id: '3', action: 'Audit Fisik', details: 'Pemeriksaan rutin server SIS Tangerang', timestamp: '2026-10-18 17:40' },
                { id: '4', action: 'Tambah Device', details: 'Registrasi Laptop QA-Tech Lab', timestamp: '2026-10-18 14:10' }
              ]).map((log, i) => (
                <div key={log.id || i} className="log-mini-row">
                  <div className="log-mini-dot"></div>
                  <div className="log-mini-text">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong className="log-mini-action">{log.action}</strong>
                      <span className="log-mini-time">{log.timestamp}</span>
                    </div>
                    <p className="log-mini-desc">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
