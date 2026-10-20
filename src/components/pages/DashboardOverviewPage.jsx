import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Plus,
  Copy,
  Check,
  ArrowUpRight,
  HardDrive,
  CalendarCheck,
  QrCode,
  FileSpreadsheet,
  Monitor,
  Laptop,
  Server,
  Zap,
  Printer,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Layers
} from 'lucide-react';

export const DashboardOverview = ({ onNavigate }) => {
  const {
    devices = [],
    monthlyInspections = [],
    openAddModal,
    openScannerModal,
    setFilterStatus,
    filteredDevices = []
  } = useInventory();

  const [copiedSerial, setCopiedSerial] = useState(false);

  // Counts & status metrics
  const totalCount = devices.length;
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const inCount = devices.filter(d => d.status === 'In').length;
  const outCount = devices.filter(d => d.status === 'Out').length;
  const notUsedCount = devices.filter(d => d.status === 'Not Used').length;
  const brokenCount = devices.filter(d => d.status === 'Broken').length;
  const disposalCount = devices.filter(d => d.status === 'Disposal').length;

  const readyRate = totalCount > 0 ? Math.round(((onlineCount + inCount) / totalCount) * 100) : 0;

  // Copy Serial Asset Code
  const handleCopySerial = () => {
    navigator.clipboard.writeText('ITS-TNG-2026-0911');
    setCopiedSerial(true);
    setTimeout(() => setCopiedSerial(false), 2000);
  };

  // Recent 4 live device activities
  const recentActivities = devices.slice(0, 4).map((d, idx) => ({
    id: d.id,
    name: `${d.computerName} (${d.user})`,
    time: idx === 0 ? 'Hari ini, 08:30 AM' : idx === 1 ? 'Hari ini, 08:15 AM' : idx === 2 ? 'Kemarin, 14:20 PM' : 'Kemarin, 10:05 AM',
    status: d.status,
    dept: d.department,
    type: d.type
  }));

  // Handle jump to devices with status filter
  const handleStatusFilterJump = (status) => {
    setFilterStatus(status);
    if (onNavigate) onNavigate('devices');
  };

  return (
    <div className="page-fade-in">
      {/* ------------------------------------------------------------------
          1. THE 2-COLUMN BENTO GRID (FAITHFUL TO IMAGE 1)
          ------------------------------------------------------------------ */}
      <div className="fintech-bento-grid">
        {/* ================================================================
            COLUMN 1 (LEFT): VIBRANT BLUE CARD + RECENT AUDIT ACTIVITIES
            ================================================================ */}
        <div className="bento-surface bento-col-primary">
          {/* VIBRANT BLUE CARD (Toray Cobalt & Royal Navy Brand Gradient) */}
          <div className="blue-balance-card">
            {/* Subtle Toray Asterisk Watermark */}
            <svg
              className="blue-card-watermark"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line x1="32" y1="7" x2="32" y2="57" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" />
              <line x1="7" y1="32" x2="57" y2="32" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" />
              <line x1="14.3" y1="14.3" x2="49.7" y2="49.7" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" />
              <line x1="49.7" y1="14.3" x2="14.3" y2="49.7" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" />
            </svg>

            <div className="blue-card-top-row">
              <div className="card-dual-pills">
                <span className="card-pill-dot"></span>
                <span className="card-pill-dot circle"></span>
              </div>
              <button
                className="blue-card-add-circle"
                onClick={openAddModal}
                title="Tambah Komputer Baru"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="blue-card-metric-wrap">
              <h1 className="blue-card-balance-text">
                {totalCount} <span className="metric-unit">Unit</span>
              </h1>
              <div className="blue-card-sub-label">
                <span>Total Perangkat IT • PT. Indonesia Toray Synthetics</span>
              </div>
            </div>
          </div>

          {/* Serial / Asset Tag Master Code with Copy Button */}
          <div className="serial-info-row">
            <div className="serial-digits-group">
              <span className="serial-number-code">ITS-TNG-2026-0911</span>
              <button
                className={`btn-copy-serial ${copiedSerial ? 'copied' : ''}`}
                onClick={handleCopySerial}
                title={copiedSerial ? 'Tersalin!' : 'Salin Kode Master Tag'}
              >
                {copiedSerial ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <span className="serial-expiry-date">03/26</span>
          </div>

          {/* Transactions Section (Real Devices Audit Log) */}
          <div className="transactions-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h2 className="transactions-heading" style={{ margin: 0 }}>Transactions</h2>
              <button
                onClick={() => onNavigate && onNavigate('devices')}
                className="btn-text-link"
                title="Buka Daftar Lengkap"
              >
                Lihat Semua ({totalCount})
              </button>
            </div>
            <div className="transactions-list">
              {recentActivities.map((tx) => (
                <div key={tx.id} className="transaction-item-row">
                  <div className="transaction-user-info">
                    <div className={`transaction-avatar avatar-${(tx.dept || 'default').toLowerCase()}`}>
                      {tx.dept}
                    </div>
                    <div className="transaction-text-meta">
                      <span className="transaction-user-name">{tx.name}</span>
                      <span className="transaction-date-time">{tx.time}</span>
                    </div>
                  </div>
                  <div className="transaction-amount-col">
                    <span className={`transaction-status-tag ${tx.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {tx.status}
                    </span>
                    <span className="transaction-device-type">{tx.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================
            COLUMN 2 (RIGHT): STATUS DONUT + AKTIVITAS AUDIT HISTOGRAM
            ================================================================ */}
        <div className="bento-col-middle" id="bento-audit-stats">
          {/* TOP CARD: STATUS PERANGKAT / DONUT CHART */}
          <div className="bento-surface bento-card-spendings">
            <div className="bento-card-header">
              <div className="card-header-left">
                <div className="card-header-icon-circle">
                  <PieIcon />
                </div>
                <h3 className="card-header-title">Spendings</h3>
              </div>
              <button
                className="card-arrow-btn"
                onClick={() => onNavigate && onNavigate('analytics')}
                title="Lihat Detail Statistik"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>

            {/* DONUT PROGRESS GAUGE (Segmented: Striped, Vibrant Blue, Amber) */}
            <div className="spendings-chart-wrapper">
              <div className="donut-svg-container">
                <svg viewBox="0 0 100 100" width="165" height="165">
                  <defs>
                    <pattern
                      id="donutDiagonalStripes"
                      patternUnits="userSpaceOnUse"
                      width="6"
                      height="6"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" strokeWidth="2.5" />
                      <line x1="0" y1="0" x2="6" y2="0" stroke="#0a1744" strokeWidth="3.5" />
                    </pattern>
                  </defs>

                  {/* Deep Navy Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="11"
                  />

                  {/* Segment 1: Striped Pattern Arc (Online Devices) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="url(#donutDiagonalStripes)"
                    strokeWidth="11"
                    strokeDasharray="90 150"
                    strokeDashoffset="35"
                    strokeLinecap="round"
                  />

                  {/* Segment 2: VIBRANT BLUE ARC (In Devices) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="11"
                    strokeDasharray="60 180"
                    strokeDashoffset="-70"
                    strokeLinecap="round"
                  />

                  {/* Segment 3: Warm Amber Arc (Out / Broken / Disposal) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="11"
                    strokeDasharray="40 200"
                    strokeDashoffset="-140"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Centered Donut Value */}
                <div className="donut-center-content">
                  <span className="donut-percentage-val">{readyRate}%</span>
                  <span className="donut-percentage-caption">of total balance</span>
                </div>
              </div>
            </div>

            {/* Legend Row */}
            <div className="spendings-legend-row">
              <div className="legend-item" title="Perangkat Operasional">
                <span className="legend-dot striped"></span>
                <span>Rent</span>
              </div>
              <div className="legend-item" title="Perangkat Standby / In">
                <span className="legend-dot blue-accent"></span>
                <span>Medical Insurance</span>
              </div>
              <div className="legend-item" title="Perangkat Out / Broken / Disposal">
                <span className="legend-dot yellow-accent"></span>
                <span>Other</span>
              </div>
            </div>
          </div>

          {/* BOTTOM CARD: INCOME / AKTIVITAS AUDIT HISTOGRAM */}
          <div className="bento-surface bento-card-income">
            <div className="income-header-row">
              <div className="income-metric-group">
                <span className="income-label-text">Income</span>
                <div className="income-val-badge-row">
                  <span className="income-big-amount">{totalCount} Unit</span>
                  <span className="income-pill-badge">+14%</span>
                </div>
              </div>
              <button
                className="card-arrow-btn"
                onClick={() => onNavigate && onNavigate('analytics')}
                title="Buka Analisis Departemen"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>

            {/* 8 Vertical Rounded Bars (Peak bars in VIBRANT BLUE!) */}
            <div className="histogram-bars-container">
              <div className="histogram-bar-col">
                <div className="bar-pill blue-peak" style={{ height: '48%' }} title="IS: 8 Unit"></div>
              </div>
              <div className="histogram-bar-col">
                <div className="bar-pill blue-peak" style={{ height: '32%' }} title="RSN: 3 Unit"></div>
              </div>
              <div className="histogram-bar-col">
                <div className="bar-pill blue-peak" style={{ height: '42%' }} title="QATECH: 4 Unit"></div>
              </div>
              <div className="histogram-bar-col">
                <div className="bar-pill dark-base" style={{ height: '58%' }} title="SIS: 2 Unit"></div>
              </div>
              <div className="histogram-bar-col">
                <div className="bar-pill blue-peak" style={{ height: '100%' }} title="HRGA: 5 Unit (Peak)"></div>
              </div>
              <div className="histogram-bar-col">
                <div className="bar-pill blue-peak" style={{ height: '82%' }} title="NFY: 3 Unit"></div>
              </div>
              <div className="histogram-bar-col">
                <div className="bar-pill blue-peak" style={{ height: '38%' }} title="PFY: 2 Unit"></div>
              </div>
              <div className="histogram-bar-col">
                <div className="bar-pill blue-peak" style={{ height: '22%' }} title="FIN: 2 Unit"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          2. QUICK KPI SUMMARY DECK (WITH 1-CLICK JUMP TO DEVICES TAB)
          ------------------------------------------------------------------ */}
      <div className="overview-kpi-strip">
        <div className="overview-kpi-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} style={{ color: '#3b82f6' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Ringkasan Status Inventaris IT
            </h3>
          </div>
          <button
            className="btn-text-action"
            onClick={() => onNavigate && onNavigate('devices')}
          >
            <span>Buka Tabel Master Inventaris →</span>
          </button>
        </div>

        <div className="kpi-cards-grid-7">
          <div className="kpi-card-box" onClick={() => handleStatusFilterJump('All')}>
            <span className="kpi-box-label">TOTAL UNIT</span>
            <span className="kpi-box-num">{totalCount}</span>
          </div>
          <div className="kpi-card-box" onClick={() => handleStatusFilterJump('Online')}>
            <div className="kpi-box-label-row">
              <span className="kpi-blue-dot"></span>
              <span className="kpi-box-label">1. ONLINE</span>
            </div>
            <span className="kpi-box-num" style={{ color: '#3b82f6' }}>{onlineCount}</span>
          </div>
          <div className="kpi-card-box" onClick={() => handleStatusFilterJump('In')}>
            <span className="kpi-box-label">2. IN</span>
            <span className="kpi-box-num" style={{ color: '#38bdf8' }}>{inCount}</span>
          </div>
          <div className="kpi-card-box" onClick={() => handleStatusFilterJump('Out')}>
            <span className="kpi-box-label">3. OUT</span>
            <span className="kpi-box-num" style={{ color: '#fbbf24' }}>{outCount}</span>
          </div>
          <div className="kpi-card-box" onClick={() => handleStatusFilterJump('Not Used')}>
            <span className="kpi-box-label">4. NOT USED</span>
            <span className="kpi-box-num" style={{ color: '#848a96' }}>{notUsedCount}</span>
          </div>
          <div className="kpi-card-box" onClick={() => handleStatusFilterJump('Broken')}>
            <span className="kpi-box-label">5. BROKEN</span>
            <span className="kpi-box-num" style={{ color: '#f87171' }}>{brokenCount}</span>
          </div>
          <div className="kpi-card-box" onClick={() => handleStatusFilterJump('Disposal')}>
            <span className="kpi-box-label">6. DISPOSAL</span>
            <span className="kpi-box-num" style={{ color: '#c084fc' }}>{disposalCount}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          3. QUICK SHORTCUTS DOCK
          ------------------------------------------------------------------ */}
      <div className="overview-shortcuts-grid">
        <div
          className="overview-shortcut-card"
          onClick={() => onNavigate && onNavigate('devices')}
        >
          <div className="shortcut-icon-circle blue">
            <HardDrive size={20} />
          </div>
          <div className="shortcut-meta">
            <h4>Tabel Master Perangkat</h4>
            <p>Kelola, cari, dan update seluruh data inventaris IT ({totalCount} unit)</p>
          </div>
          <ArrowUpRight size={18} className="shortcut-arrow" />
        </div>

        <div
          className="overview-shortcut-card"
          onClick={() => onNavigate && onNavigate('scanner')}
        >
          <div className="shortcut-icon-circle cyan">
            <QrCode size={20} />
          </div>
          <div className="shortcut-meta">
            <h4>Pusat Scan & Cetak Barcode</h4>
            <p>Scan kamera HP & cetak label sticker inventaris Toray ITS</p>
          </div>
          <ArrowUpRight size={18} className="shortcut-arrow" />
        </div>

        <div
          className="overview-shortcut-card"
          onClick={() => onNavigate && onNavigate('analytics')}
        >
          <div className="shortcut-icon-circle amber">
            <TrendingUp size={20} />
          </div>
          <div className="shortcut-meta">
            <h4>Statistik Stock Opname</h4>
            <p>Pantau kesiapan unit per departemen & kesehatan hardware</p>
          </div>
          <ArrowUpRight size={18} className="shortcut-arrow" />
        </div>

        <div
          className="overview-shortcut-card"
          onClick={() => onNavigate && onNavigate('monthly')}
        >
          <div className="shortcut-icon-circle emerald">
            <CalendarCheck size={20} />
          </div>
          <div className="shortcut-meta">
            <h4>Pemeriksaan Bulanan</h4>
            <p>Tabel audit rutin & matriks 12 bulan device ITS</p>
          </div>
          <ArrowUpRight size={18} className="shortcut-arrow" />
        </div>
      </div>
    </div>
  );
};

// Simple Pie Icon for Spendings header
const PieIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);
