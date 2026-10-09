import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Building2,
  Factory,
  Cpu,
  ShieldCheck,
  Users,
  Boxes,
  ArrowRight,
  HardDrive,
  Clock,
  Wrench,
  Package,
  QrCode,
  CheckCircle2,
  Award,
  Globe,
  Flame,
  Zap,
  Server
} from 'lucide-react';

export const CompanyProfileView = () => {
  const {
    companyProfileData = {},
    setViewMode,
    setActiveTab,
    devices = [],
    maintenance = [],
    spareParts = [],
    setIsQRScannerOpen
  } = useInventory();

  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeMaintenance = Array.isArray(maintenance) ? maintenance : [];
  const safeSpareParts = Array.isArray(spareParts) ? spareParts : [];
  const safeStats = Array.isArray(companyProfileData?.stats) ? companyProfileData.stats : [];
  const safePlants = Array.isArray(companyProfileData?.plants) ? companyProfileData.plants : [];

  const handleLaunchPortal = (tab = 'dashboard') => {
    if (setActiveTab) setActiveTab(tab);
    if (setViewMode) setViewMode('portal');
  };

  return (
    <div className="company-profile-wrapper">
      {/* HERO SECTION */}
      <section className="profile-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Globe size={16} />
            <span>Toray Industries Group - PT. Indonesia Toray Synthetics</span>
          </div>

          <h1 className="hero-title">
            Pelopor Industri Serat Sintetis & Polymer Terkemuka di Indonesia
          </h1>

          <p className="hero-description">
            {companyProfileData?.description || 'PT. Indonesia Toray Synthetics (ITS) adalah produsen serat sintetis terkemuka di Indonesia yang memproduksi Polyester Staple Fiber, Polyester Filament Yarn, dan Nylon Filament Yarn berkualitas dunia.'}
          </p>

          <div className="hero-actions">
            <button
              className="btn-hero-primary"
              onClick={() => handleLaunchPortal('dashboard')}
            >
              <span>Buka IT Asset Portal</span>
              <ArrowRight size={20} />
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => handleLaunchPortal('devices')}
            >
              <HardDrive size={18} />
              <span>Lihat Inventaris Device ({safeDevices.length})</span>
            </button>
            <button
              className="btn-hero-outline"
              onClick={() => { if (setIsQRScannerOpen) setIsQRScannerOpen(true); }}
            >
              <QrCode size={18} />
              <span>Scan QR Stock Opname</span>
            </button>
          </div>
        </div>
      </section>

      {/* STATS MATRIX SECTION */}
      <section className="profile-stats-grid">
        {safeStats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon-box">
              {idx === 0 && <Factory size={28} />}
              {idx === 1 && <Boxes size={28} />}
              {idx === 2 && <Users size={28} />}
              {idx === 3 && <Cpu size={28} />}
              {idx === 4 && <Building2 size={28} />}
              {idx === 5 && <ShieldCheck size={28} />}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* PLANT FACILITIES SHOWCASE */}
      <section className="profile-section">
        <div className="section-header">
          <div className="section-tag">
            <Factory size={16} />
            <span>Fasilitas Manufaktur & Unit Operasional</span>
          </div>
          <h2>Integrasi Infrastruktur Teknologi Per Pabrik ITS</h2>
          <p>
            Setiap unit pabrik PT. Indonesia Toray Synthetics di Tangerang dilengkapi dengan sistem otomatisasi terpusat dan inventarisasi IT yang terpantau secara real-time.
          </p>
        </div>

        <div className="plants-grid">
          {safePlants.map((plant) => (
            <div key={plant.id} className="plant-card">
              <div className="plant-header">
                <div className="plant-icon-wrapper">
                  {plant.id === 'plant-1' && <Flame size={24} />}
                  {plant.id === 'plant-2' && <Zap size={24} />}
                  {plant.id === 'utility' && <Wrench size={24} />}
                  {plant.id === 'hq-server' && <Server size={24} />}
                </div>
                <span className="plant-status-pill">{plant.status}</span>
              </div>
              <h3 className="plant-title">{plant.name}</h3>
              <p className="plant-desc">{plant.description}</p>
              <div className="plant-footer">
                <div className="device-count-info">
                  <Cpu size={16} />
                  <span><strong>{plant.managedDevices} Asset IT</strong> Terhubung</span>
                </div>
                <button
                  className="btn-plant-action"
                  onClick={() => handleLaunchPortal('devices')}
                >
                  Lihat Perangkat <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FUNCTIONAL IT MODULES LAUNCHPAD */}
      <section className="profile-section dark-accent-bg">
        <div className="section-header center">
          <div className="section-tag">
            <Cpu size={16} />
            <span>Modul Operasional Terintegrasi</span>
          </div>
          <h2>Akses Langsung Sistem Inventaris Device ITS</h2>
          <p>
            Semua fitur manajemen inventaris IT dapat diakses dan dioperasikan secara langsung dengan update data real-time.
          </p>
        </div>

        <div className="launchpad-grid">
          <div className="launchpad-card" onClick={() => handleLaunchPortal('dashboard')}>
            <div className="card-badge">Live Metrics</div>
            <div className="launchpad-icon text-cyan"><HardDrive size={32} /></div>
            <h3>Dashboard Analytic & Overview</h3>
            <p>Ringkasan performa asset, statistik garansi, grafik distribusi perangkat per departemen, dan alokasi unit.</p>
            <span className="launchpad-link">Buka Dashboard →</span>
          </div>

          <div className="launchpad-card" onClick={() => handleLaunchPortal('devices')}>
            <div className="card-badge">{safeDevices.length} Perangkat</div>
            <div className="launchpad-icon text-blue"><Cpu size={32} /></div>
            <h3>Katalog Perangkat (CRUD & QR)</h3>
            <p>Manajemen lengkap PC, Laptop, Server, IPC Industri, Network Switch, dan Printer Barcode dengan pencarian presisi.</p>
            <span className="launchpad-link">Kelola Perangkat →</span>
          </div>

          <div className="launchpad-card" onClick={() => handleLaunchPortal('checkout')}>
            <div className="card-badge">Borrow Tracking</div>
            <div className="launchpad-icon text-emerald"><Clock size={32} /></div>
            <h3>Peminjaman & Form Serah Terima</h3>
            <p>Pencatatan peminjaman laptop dinas & scanner opname dengan tracking tanggal pengembalian dan notifikasi overdue.</p>
            <span className="launchpad-link">Buka Peminjaman →</span>
          </div>

          <div className="launchpad-card" onClick={() => handleLaunchPortal('maintenance')}>
            <div className="card-badge">{safeMaintenance.filter(m => m?.status === 'In Progress').length} Active Repair</div>
            <div className="launchpad-icon text-amber"><Wrench size={32} /></div>
            <h3>Perbaikan & Maintenance Ticket</h3>
            <p>Sistem ticketing perbaikan perangkat rusak, pencatatan biaya, teknisi/vendor, serta jadwal perawatan preventif.</p>
            <span className="launchpad-link">Buka Maintenance →</span>
          </div>

          <div className="launchpad-card" onClick={() => handleLaunchPortal('spareparts')}>
            <div className="card-badge">{safeSpareParts.length} Kategori</div>
            <div className="launchpad-icon text-purple"><Package size={32} /></div>
            <h3>Stok Spare Parts & Consumable</h3>
            <p>Pengawasan stok RAM, SSD, Ribbon Printer, Kabulator, dan kabel jaringan dengan alert ambang batas minimum.</p>
            <span className="launchpad-link">Buka Stok Sparepart →</span>
          </div>

          <div className="launchpad-card" onClick={() => handleLaunchPortal('audit')}>
            <div className="card-badge">Audit Trail</div>
            <div className="launchpad-icon text-pink"><CheckCircle2 size={32} /></div>
            <h3>Audit Log & Stock Opname</h3>
            <p>Rekam jejak aktivitas perubahan data perangkat, riwayat peminjaman, serta mode pemindai QR untuk audit fisik.</p>
            <span className="launchpad-link">Buka Log Audit →</span>
          </div>
        </div>
      </section>

      {/* CORPORATE VALUES & IT COMMITMENT */}
      <section className="profile-section">
        <div className="commitment-banner">
          <div className="commitment-text">
            <Award size={36} className="commitment-icon" />
            <div>
              <h3>Komitmen Keamanan & Manajemen Aset Berkualitas ISO</h3>
              <p>
                PT. Indonesia Toray Synthetics menerapkan standar manajemen kualitas berbasis ISO 9001:2015 dan sistem manajemen lingkungan ISO 14001. Manajemen IT Device mendukung keberlanjutan operasional 24/7 di seluruh lini pabrik Tangerang.
              </p>
            </div>
          </div>
          <button
            className="btn-commitment"
            onClick={() => handleLaunchPortal('dashboard')}
          >
            Masuk Portal IT Enterprise
          </button>
        </div>
      </section>
    </div>
  );
};
