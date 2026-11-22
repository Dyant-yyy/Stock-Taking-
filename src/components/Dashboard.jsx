import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { StockTakingTable } from './StockTakingTable';
import { PcLedgerTable } from './PcLedgerTable';
import { downloadPcLedgerWordDoc, downloadStockTakingWordDoc } from '../utils/wordExport';
import {
  Search,
  Plus,
  Printer,
  Calendar,
  Filter,
  Layers,
  FileSpreadsheet,
  FileText,
  LogIn,
  LogOut,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building,
  CalendarCheck,
  ClipboardList,
  QrCode,
  Camera
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const {
    activeView,
    setActiveView,
    currentYear,
    setCurrentYear,
    currentMonth,
    currentMonthRecord,
    monthOptions,
    statusColumns,
    signatures,
    availableYears,
    searchQuery,
    setSearchQuery,
    filterDept,
    setFilterDept,
    departments,
    openAddModal,
    openScannerModal,
    devices,
    currentUser,
    logoutUser,
    setCurrentScreen
  } = useInventory();

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    if (activeView === 'ledger') {
      downloadPcLedgerWordDoc({
        devices,
        currentMonthRecord,
        currentYear,
        currentMonth,
        monthOptions,
        signatures
      });
    } else {
      downloadStockTakingWordDoc({
        devices,
        currentMonthRecord,
        currentYear,
        currentMonth,
        monthOptions,
        statusColumns,
        signatures
      });
    }
  };

  return (
    <div className="stock-system-shell synergy-theme">
      {/* -------------------------------------------------------------
          1. TOP APP BAR (DEEP NAVY - AS IN REFERENCE IMAGE)
          ------------------------------------------------------------- */}
      <header className="app-primary-navbar print-hide">
        <div className="navbar-top-row">
          <div className="navbar-left">
            {/* Logo Circle Emblem */}
            <div className="brand-emblem-container" title="PT Indonesia Toray Synthetics">
              <svg viewBox="0 0 64 64" fill="none" className="brand-emblem-svg">
                <line x1="32" y1="7" x2="32" y2="57" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <line x1="7" y1="32" x2="57" y2="32" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <line x1="14.3" y1="14.3" x2="49.7" y2="49.7" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <line x1="49.7" y1="14.3" x2="14.3" y2="49.7" stroke="white" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>

            <div className="brand-text-block">
              <h1 className="brand-title">PT. INDONESIA TORAY SYNTHETICS</h1>
              <span className="brand-subtitle">IT Asset Stock Taking & Hardware Ledger System</span>
            </div>
          </div>

          <div className="navbar-top-controls">
            {/* Year Selector Ribbon */}
            <div className="year-selector-pill">
              <Calendar size={14} className="pill-icon" />
              <span className="pill-label">Tahun:</span>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="year-select-dropdown"
              >
                {availableYears.map(yr => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* User Session & Switch to Login View Button */}
            <div className="user-nav-box">
              <button
                className="btn-nav-portal-switch"
                onClick={() => setCurrentScreen('login')}
                title="Kembali ke Tampilan Login Portal"
              >
                <LogIn size={13} />
                <span className="portal-text-label">Portal</span>
              </button>

              <button
                className="btn-nav-user-pill"
                onClick={() => setCurrentScreen('login')}
                title="User aktif. Klik untuk ganti akun"
              >
                <span className="user-live-indicator" />
                <User size={13} />
                <span className="user-name-text">{currentUser?.name || 'Admin IT'}</span>
              </button>

              <button
                className="btn-nav-logout-icon"
                onClick={logoutUser}
                title="Keluar / Logout dan kembali ke Portal Login"
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Ribbon */}
        <div className="navbar-action-buttons">
          <button
            className="btn-scan-barcode-nav highlight-scan-nav"
            onClick={() => openScannerModal()}
            title="Scan Barcode & QR Code Perangkat IT via Kamera HP / Webcam / Barcode Gun untuk Pendataan 1 per 1"
          >
            <QrCode size={15} />
            <span>Scan Barcode (1 per 1)</span>
          </button>

          <button
            className="btn-export-word-nav"
            onClick={handleExportWord}
            title="Download & Cetak Dokumen Microsoft Word (.doc) Lengkap dengan Tabel & Slot Tanda Tangan"
          >
            <FileText size={15} />
            <span>Cetak ke Word (.doc)</span>
          </button>

          <button
            className="btn-print-doc"
            onClick={handlePrint}
            title="Cetak Formulir Standar Toray via Browser / PDF"
          >
            <Printer size={15} />
            <span>Cetak PDF</span>
          </button>

          <button
            className="btn-add-primary"
            onClick={openAddModal}
            title="Tambah Perangkat Komputer Baru"
          >
            <Plus size={15} />
            <span>+ Tambah Komputer</span>
          </button>
        </div>
      </header>

      {/* -------------------------------------------------------------
          2. COMPACT HORIZONTAL HERO BANNER (MENYAMPING & STREAMLINED)
          ------------------------------------------------------------- */}
      <section className="dashboard-hero-banner compact-horizontal print-hide">
        <div className="hero-banner-inner horizontal-layout">
          <div className="hero-text-side">
            <div className="hero-banner-tag">
              <span className="banner-tag-beacon" />
              <Sparkles size={13} />
              <span>
                {activeView === 'stock-taking'
                  ? 'AUDIT & PENDATAAN BULANAN (12 BULAN)'
                  : 'DOKUMEN MASTER FINAL PC LEDGER'}
              </span>
            </div>
            <h2 className="hero-banner-title">
              {activeView === 'stock-taking'
                ? 'FORMULIR PENDATAAN STOCK TAKING BULANAN'
                : 'FINAL PC LEDGER & MASTER ASSET TORAY'}
            </h2>
            <p className="hero-banner-desc">
              {activeView === 'stock-taking'
                ? 'Formulir pendataan fisik rutin dan checklist status operasional komputer (Januari s/d Desember 2026).'
                : 'Dokumen master final rekapitulasi status operasional (Online / Offline), spesifikasi hardware lengkap, dan tag stiker barcode aset PT. Indonesia Toray Synthetics.'}
            </p>
          </div>

          <div className="hero-quick-status-side">
            <button
              className="btn-hero-scan-cta"
              onClick={() => openScannerModal()}
              title="Mulai Scan Barcode untuk Pendataan Komputer 1 per 1"
            >
              <QrCode size={18} className="hero-scan-icon" />
              <div className="hero-scan-cta-text">
                <span className="hero-scan-cta-title">Mulai Scan Barcode</span>
                <span className="hero-scan-cta-sub">Pendataan 1 per 1 ➔</span>
              </div>
            </button>
            <div className="hero-stat-badge">
              <span className="stat-num">{devices.length}</span>
              <span className="stat-label">Total Komputer</span>
            </div>
            <div className="hero-stat-badge">
              <span className="stat-num">{currentYear}</span>
              <span className="stat-label">Tahun Audit</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. DEDICATED 2-PAGE SELECTOR & FILTERS (STICKY TOOLBAR)
          ------------------------------------------------------------- */}
      <section className="control-toolbar print-hide">
        {/* Dedicated 2 Pages Switcher */}
        <div className="view-mode-tabs two-pages-selector">
          <button
            className={`view-mode-btn page-tab-btn ${activeView === 'stock-taking' ? 'active' : ''}`}
            onClick={() => setActiveView('stock-taking')}
            title="Buka Pendataan Stock Taking Bulanan"
          >
            <CalendarCheck size={16} className="page-tab-icon" />
            <div className="page-tab-text">
              <span className="page-tab-title">Pendataan Stock Taking</span>
              <span className="page-tab-subtitle">Formulir Audit Bulanan (Jan - Des)</span>
            </div>
            <span className="page-tab-badge">Audit</span>
          </button>

          <button
            className={`view-mode-btn page-tab-btn ${activeView === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveView('ledger')}
            title="Buka Final PC Ledger Toray"
          >
            <FileSpreadsheet size={16} className="page-tab-icon" />
            <div className="page-tab-text">
              <span className="page-tab-title">Final PC Ledger Toray</span>
              <span className="page-tab-subtitle">Master Rekapitulasi & Asset Tag</span>
            </div>
            <span className="page-tab-badge">Final</span>
          </button>
        </div>

        {/* Search & Dept Filter */}
        <div className="filter-tools-cluster">
          {/* Search Box */}
          <div className="search-field-pill">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Cari nama PC, user, dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery('')}
                title="Hapus pencarian"
              >
                ×
              </button>
            )}
          </div>

          {/* Department Filter & Scan Row */}
          <div className="filter-controls-subrow">
            <div className="dept-filter-dropdown">
              <Filter size={14} className="filter-icon" />
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="dept-select"
              >
                <option value="All">Semua Dept ({devices.length})</option>
                {departments.map(d => (
                  <option key={d.id} value={d.code}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Scan Action Button in Toolbar */}
            <button
              className="btn-toolbar-quick-scan"
              onClick={() => openScannerModal()}
              title="Buka Kamera Barcode & QR Code Scanner"
            >
              <Camera size={14} />
              <span>Scan Unit</span>
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          4. MAIN DATA PAGES CONTAINER (DEDICATED 2 SEPARATE PAGES)
          ------------------------------------------------------------- */}
      <main className="tables-content-area">
        {/* Page 1: Stock Taking Bulanan (Januari - Desember) */}
        {activeView === 'stock-taking' && (
          <div className="table-section-block page-view-wrapper">
            <StockTakingTable />
          </div>
        )}

        {/* Page 2: PC Ledger Toray (Online / Offline) */}
        {activeView === 'ledger' && (
          <div className="table-section-block page-view-wrapper">
            <PcLedgerTable />
          </div>
        )}
      </main>

      {/* -------------------------------------------------------------
          5. DEEP NAVY FOOTER
          ------------------------------------------------------------- */}
      <footer className="synergy-footer-dark print-hide">
        <div className="footer-bottom-bar">
          <span>PT INDONESIA TORAY SYNTHETICS • INFORMATION SYSTEM DEPARTMENT • DOKUMEN INTERNAL PERUSAHAAN</span>
          <span>© 2026 PT. Indonesia Toray Synthetics • Versi 2.1 (Synergy Light Theme)</span>
        </div>
      </footer>

      {/* -------------------------------------------------------------
          6. FLOATING QUICK ACTION BAR (FOR MOBILE & TABLET AUDITORS)
          ------------------------------------------------------------- */}
      <aside className="mobile-floating-bar print-hide" aria-label="Aksi Cepat Mobile">
        <button
          className="mobile-fab-btn scan"
          onClick={() => openScannerModal()}
          title="Buka Kamera Scan Barcode"
        >
          <Camera size={17} />
          <span>Scan Barcode</span>
        </button>
        <button
          className="mobile-fab-btn add"
          onClick={openAddModal}
          title="Tambah Perangkat Komputer"
        >
          <Plus size={17} />
          <span>Tambah</span>
        </button>
      </aside>
    </div>
  );
};
