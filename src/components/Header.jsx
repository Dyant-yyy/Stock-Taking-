import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Monitor,
  Plus,
  RotateCcw,
  LogOut,
  Globe,
  Cpu
} from 'lucide-react';

export const Header = () => {
  const {
    currentUser,
    logoutUser,
    openAddModal,
    resetToSeedData
  } = useInventory();

  return (
    <header className="header-bar">
      <div className="header-left">
        <div className="brand-logo">
          <div className="brand-icon">
            <Cpu size={20} className="icon-toray" />
          </div>
          <div className="brand-text">
            <div className="company-title">PT. INDONESIA TORAY SYNTHETICS</div>
            <div className="sub-title">IT Device Inventory Management Portal</div>
          </div>
        </div>

        <div className="header-plant-pill">
          <Globe size={14} />
          <span>Tangerang Plant</span>
        </div>
      </div>

      <div className="header-right">
        {/* Quick Add Button */}
        <button
          className="header-action-btn primary"
          onClick={openAddModal}
          title="Tambah Komputer Baru"
        >
          <Plus size={16} />
          <span className="btn-text">+ Tambah Komputer</span>
        </button>

        {/* Logged in User Profile Badge */}
        {currentUser && (
          <div className="current-user-pill">
            <div className="user-avatar-circle">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-pill-text">
              <span className="user-pill-name">{currentUser.name}</span>
              <span className="user-pill-dept">[{currentUser.deptCode || 'IS'}]</span>
            </div>
            <button
              className="btn-pill-logout"
              onClick={logoutUser}
              title="Keluar / Ganti Akun Registrasi"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

        {/* Reset Data Button */}
        <button
          className="header-icon-btn danger-hover"
          onClick={() => {
            if (window.confirm('Apakah Anda yakin ingin mereset seluruh data inventaris ke data awal pabrik ITS?')) {
              resetToSeedData();
            }
          }}
          title="Reset ke Data Bawaan Pabrik"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
};
