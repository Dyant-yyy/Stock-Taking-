import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { StockTakingTable } from './StockTakingTable';
import { PcLedgerTable } from './PcLedgerTable';
import {
  Search,
  Plus,
  Printer,
  Calendar,
  Filter,
  Layers,
  FileSpreadsheet,
  LogIn,
  LogOut,
  User,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Building,
  CalendarCheck,
  ClipboardList
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const {
    activeView,
    setActiveView,
    currentYear,
    setCurrentYear,
    availableYears,
    searchQuery,
    setSearchQuery,
    filterDept,
    setFilterDept,
    departments,
    openAddModal,
    devices,
    currentUser,
    logoutUser,
    setCurrentScreen
  } = useInventory();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="stock-system-shell synergy-theme">
      {/* -------------------------------------------------------------
          1. TOP APP BAR (DEEP NAVY - AS IN REFERENCE IMAGE)
          ------------------------------------------------------------- */}
      <header className="app-primary-navbar print-hide">
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

        {/* Year Selector Ribbon */}
        <div className="year-selector-pill">
          <Calendar size={15} className="pill-icon" />
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

        {/* Right Actions: Print, Add Computer & Login/User Profile */}
        <div className="navbar-right">
          <button
            className="btn-print-doc"
            onClick={handlePrint}
            title="Cetak Formulir Standar Toray (Print / PDF)"
          >
            <Printer size={16} />
            <span>Cetak Dokumen</span>
          </button>

          <button
            className="btn-add-primary"
            onClick={openAddModal}
            title="Tambah Perangkat Komputer Baru"
          >
            <Plus size={16} />
            <span>+ Tambah Komputer</span>
          </button>

          {/* User Session & Switch to Login View Button */}
          <div className="user-nav-box">
            <button
              className="btn-nav-portal-switch"
              onClick={() => setCurrentScreen('login')}
              title="Kembali ke Tampilan Login Portal"
            >
              <LogIn size={14} />
              <span>Portal Login</span>
            </button>

            <button
              className="btn-nav-user-pill"
              onClick={() => setCurrentScreen('login')}
              title="User aktif. Klik untuk ganti akun"
            >
              <User size={14} />
              <span>{currentUser?.name || 'Admin IT'}</span>
            </button>

            <button
              className="btn-nav-logout-icon"
              onClick={logoutUser}
              title="Keluar / Logout dan kembali ke Portal Login"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------
          2. COMPACT HORIZONTAL HERO BANNER (MENYAMPING & STREAMLINED)
          ------------------------------------------------------------- */}
      <section className="dashboard-hero-banner compact-horizontal print-hide">
        <div className="hero-banner-inner horizontal-layout">
          <div className="hero-text-side">
            <div className="hero-banner-tag">
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
                : 'Dokumen master final rekapitulasi status operasional (Online / Offline), spesifikasi hardware lengkap, dan tag stiker barcode aset PT. ITS.'}
            </p>
          </div>

          <div className="hero-quick-status-side">
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

          {/* Department Filter */}
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
    </div>
  );
};
