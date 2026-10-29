import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import torayLogo from '../assets/toray-logo.jpg';
import {
  User,
  Lock,
  Building,
  ArrowRight,
  Shield,
  UserCheck,
  Zap,
  KeyRound,
  LayoutDashboard,
  Check,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import './RegistrationView.css';

export const RegistrationView = () => {
  const { loginUser, departments, setCurrentScreen, currentUser } = useInventory();

  // Form State
  const [loginForm, setLoginForm] = useState({
    name: '',
    department: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [autofillSuccess, setAutofillSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form submit handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const name = loginForm.name.trim();
    if (!name) {
      setErrorMessage('Silakan masukkan Nama atau NIK Staff terdaftar.');
      return;
    }
    if (!loginForm.department) {
      setErrorMessage('Silakan pilih Departemen / Section.');
      return;
    }
    if (!loginForm.password) {
      setErrorMessage('Silakan masukkan Password sistem internal.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      loginUser({
        name,
        dept: loginForm.department,
        role: loginForm.department === 'IS' ? 'IT Administrator' : 'Staff Section'
      });
      setIsSubmitting(false);
    }, 250);
  };

  // 1-Click Quick Preset Login
  const handleQuickRole = (name, dept, role) => {
    loginUser({
      name,
      dept,
      role
    });
  };

  // Direct Bypass to Dashboard
  const handleDirectDashboard = () => {
    if (!currentUser) {
      loginUser({
        name: 'Admin IT (Quick Access)',
        dept: 'IS',
        role: 'IT Administrator'
      });
    } else {
      setCurrentScreen('dashboard');
    }
  };

  // Auto-fill form helper
  const handleAutofill = () => {
    setLoginForm({
      name: 'Admin IT (IS Dept)',
      department: 'IS',
      password: 'toray-internal-2026'
    });
    setErrorMessage('');
    setAutofillSuccess(true);
    setTimeout(() => setAutofillSuccess(false), 2000);
  };

  return (
    <div className="saleskip-auth-wrapper">
      {/* ====================================================================
          LEFT HERO PANE: VIBRANT TORAY COBALT WITH PLANT & WIREFRAME
          ==================================================================== */}
      <section className="saleskip-hero-pane" aria-label="Toray Hero Showcase">
        {/* Concentric angled wireframe SVG background */}
        <svg
          className="saleskip-geometric-bg"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g transform="translate(680, 320) rotate(26)">
            <rect x="-190" y="-190" width="380" height="380" rx="38" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
            <rect x="-250" y="-250" width="500" height="500" rx="48" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            <rect x="-310" y="-310" width="620" height="620" rx="58" stroke="rgba(255,255,255,0.11)" strokeWidth="1.5" />
            <rect x="-370" y="-370" width="740" height="740" rx="68" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <rect x="-430" y="-430" width="860" height="860" rx="78" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Top Header Asterisk Icon */}
        <div className="saleskip-hero-top">
          <div className="saleskip-asterisk-icon" title="ITS Synergy Star">
            <svg
              className="saleskip-asterisk-svg"
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
        </div>

        {/* Center Main Headline & Description */}
        <div className="saleskip-hero-center">
          <h1 className="saleskip-hero-title">
            Hello<br />
            ITS! <span className="saleskip-hand-emoji">👋</span>
          </h1>
          <p className="saleskip-hero-subtitle">
            IT Device Stock Taking & PC Ledger System. Kelola inventarisasi komputer, audit bulanan 12 bulan, barcode scanner, dan verifikasi fisik perangkat IT PT. ITS dengan cepat, akurat, dan transparan.
          </p>

          <div className="saleskip-hero-highlights">
            <div className="hero-highlight-item">
              <span className="highlight-bullet" />
              <span>Audit & Checklist 12 Bulan (Januari s/d Desember)</span>
            </div>
            <div className="hero-highlight-item">
              <span className="highlight-bullet" />
              <span>Master PC Ledger Status Online & Offline Seluruh Dept</span>
            </div>
            <div className="hero-highlight-item">
              <span className="highlight-bullet" />
              <span>Label Barcode Code 128 & QR Code Spesifikasi Hardware</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Footer */}
        <footer className="saleskip-hero-footer">
          <div className="hero-footer-content">
            <ShieldCheck size={15} className="hero-shield-icon" />
            <span>© 2026 PT. Indonesia Toray Synthetics • Dokumen Internal Perusahaan</span>
          </div>
        </footer>
      </section>

      {/* ====================================================================
          RIGHT FORM PANE: PURE MINIMAL WHITE WITH TORAY LOGO & CLEAN INPUTS
          ==================================================================== */}
      <main className="saleskip-form-pane">
        {/* Top Navigation Bar: Brand Header + Direct Bypass Button */}
        <header className="saleskip-top-nav">
          <div className="toray-brand-header">
            <img
              src={torayLogo}
              alt="TORAY 'Innovation by Chemistry'"
              className="toray-official-logo"
            />
            <div className="toray-brand-divider"></div>
            <div className="toray-brand-text">
              <span className="toray-sub-name">IT DEVICE STOCK TAKING</span>
              <span className="toray-plant-name">PT. Indonesia Toray Synthetics</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-top-direct-dash"
            onClick={handleDirectDashboard}
            title="Langsung Masuk ke Dashboard (Bypass Login)"
          >
            <LayoutDashboard size={14} />
            <span>Masuk Dashboard</span>
            <ChevronRight size={14} />
          </button>
        </header>

        {/* Main Login Form Card */}
        <div className="saleskip-form-card">
          <div className="form-card-intro">
            <h2 className="saleskip-form-heading">Welcome Back!</h2>
            <p className="saleskip-form-subtext">
              Silakan masukkan kredensial akun Anda untuk mengakses sistem stock taking & audit perangkat IT internal.
            </p>
          </div>

          {errorMessage && (
            <div className="saleskip-alert error" role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="saleskip-alert success" role="alert">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} noValidate className="saleskip-main-form">
            {/* Input 1: Nama / NIK Staff */}
            <div className="saleskip-input-group">
              <label htmlFor="saleskip-name-input" className="saleskip-input-label">
                Nama / NIK Staff *
              </label>
              <div className="saleskip-input-box">
                <User size={16} className="saleskip-field-icon" />
                <input
                  type="text"
                  id="saleskip-name-input"
                  className="saleskip-input"
                  value={loginForm.name}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Contoh: Ahmad Rizky atau NIK 204512"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Input 2: Departemen / Section */}
            <div className="saleskip-input-group">
              <label htmlFor="saleskip-dept-select" className="saleskip-input-label">
                Departemen / Section *
              </label>
              <div className="saleskip-input-box">
                <Building size={16} className="saleskip-field-icon" />
                <select
                  id="saleskip-dept-select"
                  className="saleskip-select"
                  value={loginForm.department}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, department: e.target.value }))
                  }
                  required
                >
                  <option value="">-- Pilih Departemen / Section --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.code}>
                      [{d.code}] - {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input 3: Password / PIN */}
            <div className="saleskip-input-group">
              <label htmlFor="saleskip-password-input" className="saleskip-input-label">
                Password Sistem Internal *
              </label>
              <div className="saleskip-input-box">
                <Lock size={16} className="saleskip-field-icon" />
                <input
                  type="password"
                  id="saleskip-password-input"
                  className="saleskip-input"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Masukkan password atau PIN"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="saleskip-btn-primary"
            >
              <span>{isSubmitting ? 'Memverifikasi...' : 'Sign In / Masuk Sistem'}</span>
              <ArrowRight size={16} />
            </button>

            {/* Forget Password link */}
            <div className="saleskip-forget-password-box">
              <span>Lupa password atau kendala akses? </span>
              <button
                type="button"
                className="saleskip-inline-link"
                onClick={() => setIsHelpOpen(!isHelpOpen)}
              >
                Bantuan IT
              </button>
            </div>

            {isHelpOpen && (
              <div className="saleskip-help-notice">
                <HelpCircle size={15} className="help-icon" />
                <div>
                  Untuk reset password atau pendaftaran user audit baru, silakan hubungi <strong>Information System (IS) Division Ext. 204</strong> atau kirim email ke <code>its-admin@toray.co.id</code>.
                </div>
              </div>
            )}
          </form>

          {/* ==============================================================
              QUICK DEV & PRESET ROLES PANEL (AKSES CEPAT KELUAR MASUK)
              ============================================================== */}
          <div className="saleskip-dev-panel">
            <div className="dev-panel-header">
              <div className="dev-panel-line" />
              <span className="dev-panel-tag">⚡ QUICK TOOLS & PRESET ROLES</span>
              <div className="dev-panel-line" />
            </div>

            <p className="dev-panel-subtext">
              1-Klik masuk sebagai akun penguji tanpa perlu input manual:
            </p>

            <div className="dev-roles-grid">
              <button
                type="button"
                className="dev-role-chip admin"
                onClick={() => handleQuickRole('Admin IT (IS)', 'IS', 'IT Administrator')}
                title="Masuk sebagai Administrator IT"
              >
                <Shield size={14} className="role-icon" />
                <div className="role-text">
                  <span className="role-title">Admin IT</span>
                  <span className="role-meta">Dept IS • Full</span>
                </div>
              </button>

              <button
                type="button"
                className="dev-role-chip manager"
                onClick={() => handleQuickRole('Matheus Djoko', 'IS', 'IT Manager')}
                title="Masuk sebagai IT Manager"
              >
                <UserCheck size={14} className="role-icon" />
                <div className="role-text">
                  <span className="role-title">Matheus D.</span>
                  <span className="role-meta">IT Manager</span>
                </div>
              </button>

              <button
                type="button"
                className="dev-role-chip pic"
                onClick={() => handleQuickRole('Anggit Kurniawan', 'IS', 'PIC Stock Taking')}
                title="Masuk sebagai PIC Stock Taking"
              >
                <Zap size={14} className="role-icon" />
                <div className="role-text">
                  <span className="role-title">Anggit K.</span>
                  <span className="role-meta">PIC Stock Taking</span>
                </div>
              </button>

              <button
                type="button"
                className="dev-role-chip user"
                onClick={() => handleQuickRole('Staff User', 'NFY', 'User Staff')}
                title="Masuk sebagai Staff Departemen"
              >
                <User size={14} className="role-icon" />
                <div className="role-text">
                  <span className="role-title">Staff User</span>
                  <span className="role-meta">NFY Section</span>
                </div>
              </button>
            </div>

            <div className="dev-actions-row">
              <button
                type="button"
                className="btn-dev-direct"
                onClick={handleDirectDashboard}
                title="Langsung lompat ke Dashboard"
              >
                <LayoutDashboard size={14} />
                <span>Langsung Masuk Dashboard</span>
                <ArrowRight size={13} />
              </button>

              <button
                type="button"
                className={`btn-dev-autofill ${autofillSuccess ? 'active' : ''}`}
                onClick={handleAutofill}
                title="Isi form input dengan akun Admin"
              >
                {autofillSuccess ? <Check size={14} /> : <KeyRound size={14} />}
                <span>{autofillSuccess ? 'Terisi!' : 'Auto-Fill Form'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom spacing anchor */}
        <footer className="saleskip-form-footer">
          <span>PT Indonesia Toray Synthetics • Versi 2.2 Portal</span>
        </footer>
      </main>
    </div>
  );
};
