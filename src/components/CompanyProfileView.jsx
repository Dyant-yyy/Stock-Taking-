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
  ClipboardCheck,
  QrCode,
  CheckCircle2,
  Award,
  Globe,
  Flame,
  Zap,
  Server,
  Wrench
} from 'lucide-react';

export const CompanyProfileView = () => {
  const {
    companyProfileData = {},
    setViewMode,
    setActiveTab,
    setSelectedDeptFilter,
    devices = [],
    stockTakings = [],
    setIsQRScannerOpen
  } = useInventory();

  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeStockTakings = Array.isArray(stockTakings) ? stockTakings : [];
  const safeStats = Array.isArray(companyProfileData?.stats) ? companyProfileData.stats : [];
  const safePlants = Array.isArray(companyProfileData?.plants) ? companyProfileData.plants : [];

  const handleLaunchPortal = (tab = 'dashboard', deptCode = null) => {
    if (deptCode && setSelectedDeptFilter) setSelectedDeptFilter(deptCode);
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
            Pelopor Serat Sintetis & System Stock Taking Device Terpadu
          </h1>

          <p className="hero-description">
            {companyProfileData?.description || 'PT. Indonesia Toray Synthetics (ITS) memproduksi Polyester Staple Fiber (PSF), Polyester Filament Yarn (PFY), Nylon Filament Yarn (NFY), dan Resin (RSN) berkualitas tinggi dengan dukungan audit fisik Stock Opname IT berstandar internasional.'}
          </p>

          <div className="hero-actions">
            <button
              className="btn-hero-primary"
              onClick={() => handleLaunchPortal('stocktaking')}
            >
              <ClipboardCheck size={20} />
              <span>Buka Stock Opname Portal</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => handleLaunchPortal('devices')}
            >
              <HardDrive size={18} />
              <span>Katalog Perangkat ({safeDevices.length})</span>
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
          <h2>Infrastruktur IT Per Pabrik & Master Departemen ITS</h2>
          <p>
            Setiap unit pabrik PT. Indonesia Toray Synthetics di Tangerang (IS, RSN, QATECH, SIS, NFY, PFY) terhubung dalam sistem pemantauan dan Stock Opname fisik terpusat.
          </p>
        </div>

        <div className="plants-grid">
          {safePlants.map((plant) => (
            <div key={plant.id} className="plant-card">
              <div className="plant-header">
                <div className="plant-icon-wrapper">
                  {plant.id.includes('rsn') && <Flame size={24} />}
                  {plant.id.includes('pfy') && <Zap size={24} />}
                  {plant.id.includes('nfy') && <Boxes size={24} />}
                  {plant.id.includes('sis') && <Wrench size={24} />}
                  {plant.id.includes('is') && <Server size={24} />}
                </div>
                <span className="plant-status-pill">{plant.status}</span>
              </div>
              <h3 className="plant-title">{plant.name}</h3>
              <p className="plant-desc">{plant.description}</p>
              <div className="plant-footer">
                <div className="device-count-info">
                  <Cpu size={16} />
                  <span><strong>{plant.managedDevices} Asset IT</strong> Diaudit</span>
                </div>
                <button
                  className="btn-plant-action"
                  onClick={() => handleLaunchPortal('stocktaking', plant.id.toUpperCase())}
                >
                  Audit Opname <ArrowRight size={14} />
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
            <ClipboardCheck size={16} />
            <span>Modul Stock Opname Terintegrasi</span>
          </div>
          <h2>Modul Utama Stock Taking Device ITS</h2>
          <p>
            Pencatatan verifikasi fisik, status keberadaan lokasi, kondisi perangkat, dan berita acara Stock Opname fisik.
          </p>
        </div>

        <div className="launchpad-grid">
          <div className="launchpad-card" onClick={() => handleLaunchPortal('dashboard')}>
            <div className="card-badge">Live Dashboard</div>
            <div className="launchpad-icon text-cyan"><HardDrive size={32} /></div>
            <h3>Dashboard Opname Metrics</h3>
            <p>Ringkasan persentase verifikasi perangkat, status selisih (discrepancy), dan progress audit per departemen master.</p>
            <span className="launchpad-link">Buka Dashboard →</span>
          </div>

          <div className="launchpad-card" onClick={() => handleLaunchPortal('stocktaking')}>
            <div className="card-badge">{safeStockTakings.length} Audit Records</div>
            <div className="launchpad-icon text-emerald"><ClipboardCheck size={32} /></div>
            <h3>Form & Record Stock Opname</h3>
            <p>Formulir input hasil verifikasi fisik auditor, cek kebenaran lokasi, kondisi perangkat, dan cetak laporan CSV.</p>
            <span className="launchpad-link">Input Stock Opname →</span>
          </div>

          <div className="launchpad-card" onClick={() => handleLaunchPortal('devices')}>
            <div className="card-badge">{safeDevices.length} Perangkat</div>
            <div className="launchpad-icon text-blue"><Cpu size={32} /></div>
            <h3>Katalog Perangkat ITS</h3>
            <p>Katalog lengkap PC, Laptop, Server, IPC Industri, Network Switch, dan Printer Barcode dengan status audit fisik.</p>
            <span className="launchpad-link">Lihat Katalog →</span>
          </div>

          <div className="launchpad-card" onClick={() => handleLaunchPortal('departments')}>
            <div className="card-badge">Master Departemen</div>
            <div className="launchpad-icon text-purple"><Building2 size={32} /></div>
            <h3>Master Departemen (IS, RSN, QATECH...)</h3>
            <p>Struktur master departemen resmi ITS: Information System (IS), Resin (RSN), QA Tech (QATECH), SIS, NFY, PFY.</p>
            <span className="launchpad-link">Kelola Departemen →</span>
          </div>
        </div>
      </section>

      {/* CORPORATE VALUES & IT COMMITMENT */}
      <section className="profile-section">
        <div className="commitment-banner">
          <div className="commitment-text">
            <Award size={36} className="commitment-icon" />
            <div>
              <h3>Komitmen Keamanan & Akurasi Stock Opname Berkuaitas ISO</h3>
              <p>
                PT. Indonesia Toray Synthetics menerapkan standar akurasi pengawasan inventaris berstandar ISO 9001:2015. Stock Opname teratur menjamin ketersediaan & keandalan infrastruktur IT pabrik Tangerang.
              </p>
            </div>
          </div>
          <button
            className="btn-commitment"
            onClick={() => handleLaunchPortal('stocktaking')}
          >
            Masuk Portal Stock Opname
          </button>
        </div>
      </section>
    </div>
  );
};
