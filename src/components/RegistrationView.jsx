import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import torayLogo from '../assets/toray-logo.jpg';
import './RegistrationView.css';

export const RegistrationView = () => {
  const { loginUser } = useInventory();

  // Login credentials state
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const identifier = loginForm.identifier.trim();
    if (!identifier) {
      setErrorMessage('Silakan masukkan Nama, NIK, atau Email terdaftar.');
      return;
    }

    if (loginUser) {
      const ok = loginUser(identifier);
      if (ok) {
        setSuccessMessage(`Berhasil masuk sebagai ${identifier}. Membuka Dashboard...`);
      }
    }
  };

  const handleQuickDemo = (name, dept) => {
    if (loginUser) {
      loginUser(`${name} (${dept})`);
    }
  };

  return (
    <div className="saleskip-auth-wrapper">
      {/* ====================================================================
          LEFT HERO PANE: VIBRANT COBALT BLUE WITH GEOMETRIC WIREFRAME & EMBLEM
          ==================================================================== */}
      <section className="saleskip-hero-pane" aria-label="Hero Showcase">
        {/* Concentric angled wireframe SVG background matching screenshot */}
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

        {/* 8-pointed star / asterisk logo icon from screenshot */}
        <div className="saleskip-asterisk-icon">
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

        {/* Center Main Headline & Description */}
        <div className="saleskip-hero-center">
          <h1 className="saleskip-hero-title">
            Hello<br />
            Toray! <span className="saleskip-hand-emoji">👋</span>
          </h1>
          <p className="saleskip-hero-subtitle">
            IT Device Stock Taking & Audit System. Kelola inventarisasi komputer, barcode scanner audit,
            dan verifikasi fisik perangkat IT dengan cepat, akurat, dan transparan.
          </p>
        </div>

        {/* Bottom Copyright Footer */}
        <footer className="saleskip-hero-footer">
          © 2026 PT. Indonesia Toray Synthetics. All rights reserved.
        </footer>
      </section>

      {/* ====================================================================
          RIGHT FORM PANE: PURE MINIMAL WHITE WITH TORAY LOGO & CLEAN INPUTS
          ==================================================================== */}
      <main className="saleskip-form-pane">
        {/* Top Brand Area with Large Official Toray Logo */}
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
        </header>

        {/* Main Login Form Card */}
        <div className="saleskip-form-card">
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

          <form onSubmit={handleLoginSubmit} noValidate>
            <h2 className="saleskip-form-heading">Welcome Back!</h2>
            <p className="saleskip-form-subtext">
              Silakan masukkan kredensial akun Anda untuk mengakses sistem stock taking & audit perangkat IT.
            </p>

            {/* Email / Username / NIK input field with screenshot underline style */}
            <div className="saleskip-input-group">
              <label htmlFor="saleskip-identifier-input" className="saleskip-input-label">
                Username / NIK / Email:
              </label>
              <div className="saleskip-input-box">
                <input
                  type="text"
                  id="saleskip-identifier-input"
                  className="saleskip-input active-field"
                  value={loginForm.identifier}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, identifier: e.target.value }))
                  }
                  placeholder="Contoh: hisalim.ux@gmail.com atau Ahmad Rizky"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password input field */}
            <div className="saleskip-input-group">
              <label htmlFor="saleskip-password-input" className="saleskip-input-label">
                Password / PIN:
              </label>
              <div className="saleskip-input-box">
                <input
                  type="password"
                  id="saleskip-password-input"
                  className="saleskip-input"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Solid Matte Black Login Button matching screenshot */}
            <button type="submit" className="saleskip-btn-primary">
              Login Now
            </button>

            {/* Forget Password link */}
            <div className="saleskip-forget-password-box">
              Lupa password?{' '}
              <button
                type="button"
                className="saleskip-inline-link"
                onClick={() => setIsHelpOpen(!isHelpOpen)}
              >
                Click here
              </button>
            </div>

            {isHelpOpen && (
              <div className="saleskip-help-notice">
                Untuk reset password atau pendaftaran akun audit baru, silakan hubungi <strong>Information System (IS) Division Ext. 204</strong> atau kirim email ke <code>its-admin@toray.co.id</code>.
              </div>
            )}

            {/* Quick Access Demo Accounts for testing */}
            <div className="saleskip-demo-switcher">
              <span className="saleskip-demo-label">Akses Cepat Penguji (Demo):</span>
              <div className="saleskip-demo-chips">
                <button
                  type="button"
                  className="saleskip-demo-chip"
                  onClick={() => handleQuickDemo('Ahmad Rizky', 'IS')}
                >
                  Ahmad Rizky [IS]
                </button>
                <button
                  type="button"
                  className="saleskip-demo-chip"
                  onClick={() => handleQuickDemo('Ir. Agus Rahardjo', 'RSN')}
                >
                  Ir. Agus [RSN]
                </button>
                <button
                  type="button"
                  className="saleskip-demo-chip"
                  onClick={() => handleQuickDemo('Dr. Retno Astuti', 'QATECH')}
                >
                  Dr. Retno [QA]
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Bottom spacing anchor */}
        <div style={{ height: '24px' }}></div>
      </main>
    </div>
  );
};
