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
  Building
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
          2. VIBRANT SKY-BLUE HERO BANNER WITH ORGANIC WAVE DIVIDER
          ------------------------------------------------------------- */}
      <section className="dashboard-hero-banner print-hide">
        <div className="hero-banner-inner">
          <div className="hero-banner-tag">
            <Sparkles size={14} />
            <span>TORAY INFORMATION SYSTEM • INTERNAL PERUSAHAAN</span>
          </div>
          <h2 className="hero-banner-title">
            BUILDING YOUR DIGITAL FUTURE.
          </h2>
          <p className="hero-banner-desc">
            Sistem resmi inventarisasi komputer & server, formulir stock taking Januari s/d Desember, dan rekapitulasi status online/offline PC Ledger.
          </p>
        </div>

        {/* Smooth Organic SVG Wave Divider */}
        <div className="dashboard-wave-divider">
          <svg viewBox="0 0 1440 90" fill="none" preserveAspectRatio="none" className="dash-wave-svg">
            <path
              d="M0,24L80,32C160,40,320,56,480,58.7C640,61,800,51,960,37.3C1120,24,1280,8,1360,0L1440,0L1440,90L1360,90C1280,90,1120,90,960,90C800,90,640,90,480,90C320,90,160,90,80,90L0,90Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* -------------------------------------------------------------
          3. DEDICATED 2-TABLE VIEW SELECTOR & FILTERS (STICKY TOOLBAR)
          ------------------------------------------------------------- */}
      <section className="control-toolbar print-hide">
        {/* Table Selector Tabs */}
        <div className="view-mode-tabs">
          <button
            className={`view-mode-btn ${activeView === 'stock-taking' ? 'active' : ''}`}
            onClick={() => setActiveView('stock-taking')}
          >
            <Layers size={16} />
            <span>1. Stock Taking (Jan - Des)</span>
          </button>

          <button
            className={`view-mode-btn ${activeView === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveView('ledger')}
          >
            <FileSpreadsheet size={16} />
            <span>2. PC Ledger Toray (Online / Offline)</span>
          </button>

          <button
            className={`view-mode-btn ${activeView === 'both' ? 'active' : ''}`}
            onClick={() => setActiveView('both')}
          >
            <span>⊞ Tampilkan 2 Tabel</span>
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
          4. MAIN DATA TABLES CONTAINER (THE 2 AUTHENTIC TABLES)
          ------------------------------------------------------------- */}
      <main className="tables-content-area">
        {/* Table 1: Stock Taking Bulanan (Januari - Desember) */}
        {(activeView === 'stock-taking' || activeView === 'both') && (
          <div className="table-section-block">
            <StockTakingTable />
          </div>
        )}

        {/* Table 2: PC Ledger Toray (Online / Offline) */}
        {(activeView === 'ledger' || activeView === 'both') && (
          <div className="table-section-block margin-top-lg">
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
