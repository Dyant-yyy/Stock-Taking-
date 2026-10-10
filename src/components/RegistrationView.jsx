import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Building2,
  Cpu,
  User,
  Lock,
  ShieldCheck,
  ArrowRight,
  LogIn,
  UserPlus,
  CheckCircle2,
  Factory,
  Globe,
  Flame,
  Sparkles,
  Zap,
  QrCode
} from 'lucide-react';

export const RegistrationView = () => {
  const {
    registerUser,
    loginUser,
    departments = [],
    setViewMode,
    setActiveTab
  } = useInventory();

  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const scanParam = urlParams ? (urlParams.get('scan') || urlParams.get('device')) : null;

  const [activeTab, setAuthTab] = useState('register'); // 'register' | 'login'

  // Registration Form State (simplified: Nama, Departemen, Password)
  const [regForm, setRegForm] = useState({
    name: '',
    departmentCode: 'IS',
    password: '',
    agreeSOP: true
  });

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const safeDepts = Array.isArray(departments) ? departments : [];

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regForm.name.trim()) {
      setErrorMessage('Silakan isi Nama Lengkap Pegawai / Auditor.');
      return;
    }

    const deptObj = safeDepts.find(d => d.code === regForm.departmentCode);
    const generatedId = `ITS-USR-${Date.now().toString().slice(-4)}`;

    const userData = {
      id: generatedId,
      name: regForm.name.trim(),
      deptId: deptObj ? deptObj.id : `DEPT-${regForm.departmentCode}`,
      deptCode: regForm.departmentCode,
      position: 'Auditor Stock Opname',
      email: `${regForm.name.toLowerCase().replace(/\s+/g, '.')}@toray.co.id`,
      role: 'Auditor Stock Opname',
      loginTime: new Date().toISOString()
    };

    if (registerUser) {
      registerUser(userData);
      setSuccessMessage('Registrasi berhasil! Membuka Dashboard Stock Taking...');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginForm.identifier.trim()) {
      setErrorMessage('Silakan masukkan NIK atau Email terdaftar.');
      return;
    }

    if (loginUser) {
      const success = loginUser(loginForm.identifier);
      if (!success) {
        setErrorMessage('Akun tidak ditemukan. Silakan registrasi terlebih dahulu atau gunakan Akses Demo.');
      }
    }
  };

  const handleQuickDemoLogin = (demoUser) => {
    if (registerUser) {
      registerUser(demoUser);
    }
  };

  const demoAccounts = [
    {
      id: 'EMP-002',
      name: 'Ahmad Rizky',
      deptId: 'DEPT-IS',
      deptCode: 'IS',
      position: 'Auditor Stock Opname (IS)',
      email: 'ahmad.rizky@toray.co.id',
      role: 'Auditor IT'
    },
    {
      id: 'EMP-003',
      name: 'Ir. Agus Rahardjo',
      deptId: 'DEPT-RSN',
      deptCode: 'RSN',
      position: 'RSN Plant Superintendent',
      email: 'agus.rahardjo@toray.co.id',
      role: 'PIC Unit RSN'
    },
    {
      id: 'EMP-004',
      name: 'Dr. Retno Astuti',
      deptId: 'DEPT-QATECH',
      deptCode: 'QATECH',
      position: 'QA Technical Lead',
      email: 'retno.astuti@toray.co.id',
      role: 'Auditor QA Tech'
    }
  ];

  return (
    <div className="auth-portal-page">
      <div className="auth-container">
        {/* BRANDING HEADER */}
        <div className="auth-header-card">
          <div className="auth-logo-badge">
            <div className="brand-icon lg">
              <Cpu size={24} className="icon-toray" />
            </div>
            <div>
              <div className="auth-corporate-name">PT. INDONESIA TORAY SYNTHETICS</div>
              <div className="auth-app-name">ITS IT Device Stock Taking & Audit System</div>
            </div>
          </div>
          <div className="auth-plant-tag">
            <Globe size={14} />
            <span>Tangerang Plant, Banten</span>
          </div>
        </div>

        {/* SCAN DEEP LINK BANNER */}
        {scanParam && (
          <div className="auth-scan-detected-card">
            <div className="scan-detected-left">
              <div className="scan-pulse-icon">
                <QrCode size={22} className="text-cyan animate-pulse" />
              </div>
              <div>
                <div className="scan-title">
                  Barcode Terdeteksi: <span className="code-highlight">[{scanParam}]</span>
                </div>
                <p className="scan-desc">
                  Perangkat fisik di-scan. Masuk sekarang untuk memverifikasi dan memperbarui statusnya.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-quick-scan-login"
              onClick={() => {
                if (registerUser) {
                  registerUser({
                    id: `SCAN-OP-${Date.now().toString().slice(-4)}`,
                    name: 'Operator Barcode Scanner',
                    deptId: 'DEPT-IS',
                    deptCode: 'IS',
                    position: 'Petugas Scan Lapangan',
                    email: 'scanner.field@toray.co.id',
                    role: 'Auditor Stock Opname',
                    loginTime: new Date().toISOString()
                  });
                }
              }}
            >
              <Zap size={15} />
              <span>Masuk Langsung & Verifikasi Status</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* MAIN AUTH CARD */}
        <div className="auth-main-card">
          {/* TAB SWITCHER */}
          <div className="auth-tab-nav">
            <button
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthTab('register'); setErrorMessage(''); }}
            >
              <UserPlus size={18} />
              <span>Form Registrasi Pegawai / Auditor</span>
            </button>
            <button
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthTab('login'); setErrorMessage(''); }}
            >
              <LogIn size={18} />
              <span>Masuk (Login Sesi)</span>
            </button>
          </div>

          {errorMessage && (
            <div className="auth-alert error">
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert success">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB CONTENT 1: REGISTRATION FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="form-info-banner">
                <ShieldCheck size={20} className="text-cyan" />
                <div>
                  <strong>Registrasi Akun Baru Tim Auditor & PIC Unit ITS</strong>
                  <p>Daftarkan profil Anda untuk mencatat verifikasi fisik dan Stock Opname inventaris IT.</p>
                </div>
              </div>

              <div className="form-group">
                <label>Nama Lengkap Pegawai / Auditor *:</label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Farhan"
                    value={regForm.name}
                    onChange={(e) => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="auth-grid-two margin-top-sm">
                <div className="form-group">
                  <label>Master Departemen ITS *:</label>
                  <div className="input-with-icon">
                    <Building2 size={16} className="field-icon" />
                    <select
                      value={regForm.departmentCode}
                      onChange={(e) => setRegForm(prev => ({ ...prev, departmentCode: e.target.value }))}
                      className="form-select"
                    >
                      {safeDepts.map(d => (
                        <option key={d.id} value={d.code}>
                          [{d.code}] - {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Password / PIN Keamanan *:</label>
                  <div className="input-with-icon">
                    <Lock size={16} className="field-icon" />
                    <input
                      type="password"
                      required
                      placeholder="Minimal 6 karakter"
                      value={regForm.password}
                      onChange={(e) => setRegForm(prev => ({ ...prev, password: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="auth-checkbox-row margin-top-sm">
                <input
                  type="checkbox"
                  id="agreeSOP"
                  checked={regForm.agreeSOP}
                  onChange={(e) => setRegForm(prev => ({ ...prev, agreeSOP: e.target.checked }))}
                />
                <label htmlFor="agreeSOP">
                  Saya menyetujui SOP Audit Fisik & Akurasi Stock Taking PT. Indonesia Toray Synthetics (ISO 9001:2015).
                </label>
              </div>

              <button type="submit" className="btn-auth-submit margin-top">
                <UserPlus size={18} />
                <span>Daftar & Masuk ke Dashboard ITS</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* TAB CONTENT 2: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-info-banner">
                <LogIn size={20} className="text-cyan" />
                <div>
                  <strong>Masuk ke Sesi Stock Taking Terdaftar</strong>
                  <p>Masukkan Nama Pegawai atau Akun Anda untuk melanjutkan pekerjaan audit.</p>
                </div>
              </div>

              <div className="form-group margin-top-sm">
                <label>Nama Pegawai / Akun Terdaftar *:</label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Rizky atau Budi Santoso"
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, identifier: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group margin-top-sm">
                <label>Password / PIN *:</label>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon" />
                  <input
                    type="password"
                    placeholder="Masukkan password Anda"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit margin-top">
                <LogIn size={18} />
                <span>Masuk Portal Stock Opname</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* QUICK DEMO LOGIN SHORTCUTS */}
          <div className="auth-demo-section margin-top-lg">
            <div className="demo-section-title">
              <Sparkles size={16} className="text-cyan" />
              <span>Akses Cepat Penguji (One-Click Demo Login):</span>
            </div>
            <div className="demo-buttons-grid">
              {demoAccounts.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  className="btn-demo-account"
                  onClick={() => handleQuickDemoLogin(demo)}
                >
                  <div className="demo-dept-pill">[{demo.deptCode}]</div>
                  <div className="demo-user-meta">
                    <strong>{demo.name}</strong>
                    <span>{demo.position}</span>
                  </div>
                  <ArrowRight size={14} className="demo-arrow" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="auth-footer-text">
          PT. Indonesia Toray Synthetics • Information System (IS) Division • Tangerang Plant
        </div>
      </div>
    </div>
  );
};
