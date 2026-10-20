import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import './Dashboard.css';
import {
  Home,
  HardDrive,
  BarChart3,
  CalendarCheck,
  QrCode,
  Settings,
  LogOut,
  Search,
  Plus,
  Globe
} from 'lucide-react';

import { DashboardOverview } from './pages/DashboardOverviewPage';
import { DevicesCatalogPage } from './pages/DevicesCatalogPage';
import { MonthlyAuditPage } from './pages/MonthlyAuditPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ScannerPage } from './pages/ScannerPage';
import { SettingsPage } from './pages/SettingsPage';

export const Dashboard = () => {
  const {
    currentUser,
    logoutUser,
    searchQuery,
    setSearchQuery,
    openAddModal
  } = useInventory();

  // Navigation dock state: 'dashboard' | 'devices' | 'analytics' | 'scanner' | 'settings'
  const [activeDockTab, setActiveDockTab] = useState('dashboard');

  const handleDockNavigate = (tab) => {
    setActiveDockTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fintech-dashboard-shell">
      {/* Decorative Toray Geometric Wireframe Background (Authentic to login hero) */}
      <svg
        className="dashboard-geometric-bg"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(850, 260) rotate(26)">
          <rect x="-190" y="-190" width="380" height="380" rx="38" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
          <rect x="-250" y="-250" width="500" height="500" rx="48" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          <rect x="-310" y="-310" width="620" height="620" rx="58" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
          <rect x="-370" y="-370" width="740" height="740" rx="68" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
          <rect x="-430" y="-430" width="860" height="860" rx="78" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" />
        </g>
      </svg>

      {/* --------------------------------------------------------------------
          1. LEFT VERTICAL SLIM ICON DOCK (FULL HEIGHT - AS IN IMAGE 1)
          -------------------------------------------------------------------- */}
      <aside className="fintech-sidebar-dock">
        <div className="dock-top">
          {/* Glowing Toray Asterisk Emblem (Exact match to login hero) */}
          <div
            className="dock-logo-mark"
            onClick={() => handleDockNavigate('dashboard')}
            title="PT. Indonesia Toray Synthetics"
          >
            <svg
              className="dock-logo-svg"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="32" y1="7" x2="32" y2="57" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <line x1="7" y1="32" x2="57" y2="32" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <line x1="14.3" y1="14.3" x2="49.7" y2="49.7" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <line x1="49.7" y1="14.3" x2="14.3" y2="49.7" stroke="white" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>

          {/* Navigation Stack */}
          <nav className="dock-nav-stack">
            {/* 1. Home / Dashboard Page Button */}
            <button
              className={`dock-icon-btn ${activeDockTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleDockNavigate('dashboard')}
              title="Dashboard Overview"
            >
              <Home size={19} />
            </button>

            {/* 2. Devices / Master Catalog Page Button */}
            <button
              className={`dock-icon-btn ${activeDockTab === 'devices' ? 'active' : ''}`}
              onClick={() => handleDockNavigate('devices')}
              title="Tabel Master Inventaris IT"
            >
              <HardDrive size={19} />
            </button>

            {/* 3. Monthly Audit / Pemeriksaan Bulanan Page Button */}
            <button
              className={`dock-icon-btn ${activeDockTab === 'monthly' ? 'active' : ''}`}
              onClick={() => handleDockNavigate('monthly')}
              title="Pemeriksaan & Pendataan Bulanan"
            >
              <CalendarCheck size={19} />
            </button>

            {/* 4. Bar Chart / Statistics Page Button */}
            <button
              className={`dock-icon-btn ${activeDockTab === 'analytics' ? 'active' : ''}`}
              onClick={() => handleDockNavigate('analytics')}
              title="Statistik Stock Opname"
            >
              <BarChart3 size={19} />
            </button>

            {/* 4. Camera / Barcode Scanner Page Button */}
            <button
              className={`dock-icon-btn ${activeDockTab === 'scanner' ? 'active' : ''}`}
              onClick={() => handleDockNavigate('scanner')}
              title="Pusat Scan & Cetak Barcode"
            >
              <QrCode size={19} />
            </button>

            {/* 5. Settings / Pengaturan Page Button */}
            <button
              className={`dock-icon-btn ${activeDockTab === 'settings' ? 'active' : ''}`}
              onClick={() => handleDockNavigate('settings')}
              title="Pengaturan Sistem & Master Data"
            >
              <Settings size={19} />
            </button>
          </nav>
        </div>

        {/* Bottom Logout */}
        <div className="dock-bottom">
          <button
            className="dock-logout-btn"
            onClick={logoutUser}
            title="Keluar / Ganti Akun"
          >
            <LogOut size={19} />
          </button>
        </div>
      </aside>

      {/* --------------------------------------------------------------------
          2. MAIN CONTENT CONTAINER
          -------------------------------------------------------------------- */}
      <main className="fintech-main-container">
        {/* Top Navigation Bar */}
        <header className="fintech-top-bar">
          {/* Mobile Only Brand Emblem */}
          <div className="mobile-header-brand" onClick={() => handleDockNavigate('dashboard')}>
            <div className="mobile-brand-emblem">
              <svg viewBox="0 0 64 64" fill="none" className="mobile-brand-svg">
                <line x1="32" y1="7" x2="32" y2="57" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <line x1="7" y1="32" x2="57" y2="32" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <line x1="14.3" y1="14.3" x2="49.7" y2="49.7" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <line x1="49.7" y1="14.3" x2="14.3" y2="49.7" stroke="white" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="mobile-brand-title">
              <strong>PT. TORAY</strong>
              <span>IT Inventory</span>
            </div>
          </div>

          {/* Pill Search Input */}
          <div className="fintech-search-pill">
            <Search size={17} className="search-pill-icon" />
            <input
              type="text"
              placeholder="Search something"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-pill-input"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Hapus pencarian"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Action: Tangerang Plant + Solid White Pill Button + User Avatar */}
          <div className="fintech-top-right">
            <div className="top-plant-capsule">
              <Globe size={14} />
              <span>Tangerang Plant</span>
            </div>

            <button
              className="btn-solid-white-pill"
              onClick={openAddModal}
              title="Tambah Perangkat Komputer Baru"
            >
              <Plus size={16} />
              <span>+ Tambah Komputer</span>
            </button>

            {/* User Avatar Circle */}
            <div
              className="top-user-avatar"
              title={`${currentUser?.name || 'Administrator'} [${currentUser?.deptCode || 'IS'}]`}
              onClick={() => handleDockNavigate('settings')}
            >
              <span>{currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'IT'}</span>
              <span className="user-status-dot" title="Online"></span>
            </div>
          </div>
        </header>

        {/* ------------------------------------------------------------------
            3. DEDICATED SEPARATE PAGES SWITCHER
            ------------------------------------------------------------------ */}
        {activeDockTab === 'dashboard' && (
          <DashboardOverview onNavigate={handleDockNavigate} />
        )}

        {activeDockTab === 'devices' && (
          <DevicesCatalogPage />
        )}

        {activeDockTab === 'monthly' && (
          <MonthlyAuditPage onNavigate={handleDockNavigate} />
        )}

        {activeDockTab === 'analytics' && (
          <AnalyticsPage onNavigate={handleDockNavigate} />
        )}

        {activeDockTab === 'scanner' && (
          <ScannerPage onNavigate={handleDockNavigate} />
        )}

        {activeDockTab === 'settings' && (
          <SettingsPage />
        )}
      </main>
    </div>
  );
};
