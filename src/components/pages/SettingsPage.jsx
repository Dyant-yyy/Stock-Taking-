import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  Settings,
  Building2,
  Database,
  Globe,
  User,
  Shield,
  Download,
  RotateCcw,
  LogOut,
  Plus,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export const SettingsPage = () => {
  const {
    currentUser,
    logoutUser,
    departments = [],
    devices = [],
    resetToSeedData
  } = useInventory();

  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [deptSavedMsg, setDeptSavedMsg] = useState(false);

  // Backup database to JSON file
  const handleBackupJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      plant: 'PT. Indonesia Toray Synthetics - Tangerang Plant',
      devices,
      departments
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `ITS_Inventory_Backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const handleResetData = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data inventaris ke data awal bawaan pabrik ITS? Perubahan kustom akan dikembalikan ke data awal.')) {
      resetToSeedData();
      alert('Data inventaris berhasil direset ke konfigurasi bawaan pabrik ITS.');
    }
  };

  return (
    <div className="page-fade-in settings-page-shell">
      {/* Page Header */}
      <div className="inventory-section-header">
        <div className="section-title-wrap">
          <h1 className="section-main-title">
            <Settings size={24} style={{ color: '#94a3b8' }} />
            <span>Pengaturan Sistem & Master Data</span>
          </h1>
          <p className="section-subtitle-text">
            Konfigurasi Fasilitas Pabrik, Manajemen Departemen & Pemeliharaan Database PT. Indonesia Toray Synthetics
          </p>
        </div>
      </div>

      <div className="settings-grid-layout">
        {/* Left Column: Departemen Management & Plant Profile */}
        <div className="settings-left-stack">
          {/* Section 1: Daftar Departemen ITS */}
          <div className="bento-surface">
            <div className="bento-card-header">
              <div className="card-header-left">
                <Building2 size={18} style={{ color: '#3b82f6' }} />
                <h3 className="card-header-title">Master Departemen / Section ({departments.length})</h3>
              </div>
            </div>

            <div className="settings-dept-table-wrap">
              <table className="settings-dept-table">
                <thead>
                  <tr>
                    <th>KODE</th>
                    <th>NAMA DEPARTEMEN</th>
                    <th style={{ textAlign: 'right' }}>TOTAL UNIT</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => {
                    const unitCount = devices.filter(dev => dev.department === d.code).length;
                    return (
                      <tr key={d.id || d.code}>
                        <td>
                          <span className={`dept-badge-pill dept-${d.code.toLowerCase()}`}>
                            {d.code}
                          </span>
                        </td>
                        <td style={{ color: '#f1f5f9', fontWeight: 500 }}>{d.name}</td>
                        <td style={{ textAlign: 'right', color: '#38bdf8', fontWeight: 700 }}>
                          {unitCount} Unit
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Informasi Fasilitas Pabrik & Jaringan */}
          <div className="bento-surface">
            <div className="bento-card-header">
              <div className="card-header-left">
                <Globe size={18} style={{ color: '#38bdf8' }} />
                <h3 className="card-header-title">Informasi Pabrik & Jaringan IT</h3>
              </div>
            </div>

            <div className="plant-info-details">
              <div className="plant-info-row">
                <span className="plant-info-label">Perusahaan</span>
                <span className="plant-info-val">PT. Indonesia Toray Synthetics</span>
              </div>
              <div className="plant-info-row">
                <span className="plant-info-label">Lokasi Fasilitas</span>
                <span className="plant-info-val">Tangerang Plant, Banten, Indonesia</span>
              </div>
              <div className="plant-info-row">
                <span className="plant-info-label">Alamat Pabrik</span>
                <span className="plant-info-val">Jl. Moch. Toha Km. 1, Pasar Baru, Tangerang 15112</span>
              </div>
              <div className="plant-info-row">
                <span className="plant-info-label">Divisi Penanggung Jawab</span>
                <span className="plant-info-val">Information System (IS) Section</span>
              </div>
              <div className="plant-info-row">
                <span className="plant-info-label">Subnet Jaringan Internal</span>
                <span className="plant-info-val">192.168.10.0/24 & 10.20.0.0/16</span>
              </div>
              <div className="plant-info-row">
                <span className="plant-info-label">Versi Sistem</span>
                <span className="plant-info-val">v2.8.0 (Toray IT Device Stock Taking)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Database Maintenance & User Session */}
        <div className="settings-right-stack">
          {/* User Session Profile Card */}
          <div className="bento-surface user-session-profile-card">
            <div className="bento-card-header">
              <div className="card-header-left">
                <User size={18} style={{ color: '#60a5fa' }} />
                <h3 className="card-header-title">Akun & Sesi Login Aktif</h3>
              </div>
              <span className="session-online-pill">
                <span className="user-status-dot-inline"></span>
                <span>Aktif</span>
              </span>
            </div>

            <div className="user-profile-display">
              <div className="user-profile-avatar-large">
                {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'IT'}
              </div>
              <div className="user-profile-meta">
                <h4 className="user-profile-name">{currentUser?.name || 'Administrator IT'}</h4>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                  <span className="dept-badge-pill dept-is">{currentUser?.deptCode || 'IS'}</span>
                  <span style={{ fontSize: '12px', color: '#727885' }}>Auditor / IT Staff</span>
                </div>
              </div>
            </div>

            <button
              className="btn-settings-logout"
              onClick={logoutUser}
            >
              <LogOut size={16} />
              <span>Keluar dari Sesi Sistem</span>
            </button>
          </div>

          {/* Database Maintenance & Backup */}
          <div className="bento-surface db-maintenance-card">
            <div className="bento-card-header">
              <div className="card-header-left">
                <Database size={18} style={{ color: '#fbbf24' }} />
                <h3 className="card-header-title">Cadangan Data & Database</h3>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '18px' }}>
              Seluruh data inventaris tersimpan di browser secara lokal. Lakukan backup berkala ke file JSON untuk pengarsipan dan pemulihan data.
            </p>

            <div className="db-action-buttons-group">
              <button
                className="btn-inventory-action btn-blue-solid"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleBackupJSON}
              >
                <Download size={16} />
                <span>Cadangkan Database (Backup JSON)</span>
              </button>

              <button
                className="btn-danger-outline"
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                onClick={handleResetData}
              >
                <RotateCcw size={15} />
                <span>Reset ke Data Awal Pabrik ITS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
