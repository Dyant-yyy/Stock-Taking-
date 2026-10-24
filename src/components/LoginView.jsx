import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  ArrowRight,
  User,
  Lock,
  Building,
  Mail,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import './LoginView.css';

export const LoginView = () => {
  const { loginUser, departments } = useInventory();

  // Completely empty form state - zero dummy data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Silakan isi Nama atau NIK Staff.');
      return;
    }
    if (!formData.department) {
      setErrorMessage('Silakan pilih Departemen / Section.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Silakan masukkan Password sistem.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      loginUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        dept: formData.department,
        role: formData.department === 'IS' ? 'IT Staff' : 'User Staff'
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="synergy-portal-wrapper">
      {/* -------------------------------------------------------------------
          1. TOP APP BAR (DEEP NAVY - AS IN REFERENCE IMAGE)
          ------------------------------------------------------------------- */}
      <header className="synergy-top-navbar">
        <div className="navbar-brand-group">
          {/* Logo Emblem */}
          <div className="synergy-logo-circle">
            <svg viewBox="0 0 64 64" fill="none" className="synergy-logo-svg">
              <line x1="32" y1="7" x2="32" y2="57" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <line x1="7" y1="32" x2="57" y2="32" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <line x1="14.3" y1="14.3" x2="49.7" y2="49.7" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <line x1="49.7" y1="14.3" x2="14.3" y2="49.7" stroke="white" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="synergy-brand-title">
            <strong>PT. INDONESIA TORAY SYNTHETICS</strong>
            <span>IT ASSET & STOCK TAKING PORTAL</span>
          </div>
        </div>

        {/* Right Badge */}
        <div className="synergy-nav-actions">
          <div className="portal-version-badge">
            <ShieldCheck size={14} />
            <span>Sistem Otentikasi Internal</span>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------
          2. HERO SECTION WITH BLUE GRADIENT & CLEAN SIGN IN FLOATING CARD
          ------------------------------------------------------------------- */}
      <section className="synergy-hero-section" id="hero">
        <div className="hero-container-grid">
          {/* Left Column: Big Bold Headline */}
          <div className="hero-left-column">
            <div className="hero-badge-tag">
              <Sparkles size={14} />
              <span>PT. ITS INFORMATION SYSTEM • 2026</span>
            </div>

            <h1 className="hero-giant-title">
              BUILDING YOUR<br />
              DIGITAL FUTURE.
            </h1>

            <p className="hero-description">
              Sistem resmi inventarisasi perangkat, pendataan stock taking Januari hingga Desember,
              dan rekapitulasi status online/offline PC Ledger PT. Indonesia Toray Synthetics.
            </p>

            <div className="hero-corporate-points">
              <div className="point-item">
                <span className="point-dot" />
                <span>Pencatatan Audit Stock Taking Komputer 12 Bulan</span>
              </div>
              <div className="point-item">
                <span className="point-dot" />
                <span>Rekapitulasi PC Ledger Online & Offline Seluruh Departemen</span>
              </div>
              <div className="point-item">
                <span className="point-dot" />
                <span>Label Barcode Code 128 & QR Code Spesifikasi Perangkat</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Sign In Card (Matching the Reference Image) */}
          <div className="hero-right-column">
            <div className="synergy-auth-card" id="signin-card">
              <div className="auth-card-header">
                <h2 className="auth-card-title">SIGN IN / LOGIN</h2>
                <p className="auth-card-subtitle">Masuk ke Sistem Inventaris & Stock Taking IT</p>
              </div>

              {errorMessage && (
                <div className="auth-error-banner">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-card-form">
                {/* Input Name */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Nama / NIK Staff *</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-field-icon" />
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama atau NIK staff"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="auth-text-input"
                    />
                  </div>
                </div>

                {/* Input Email */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Email Perusahaan</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-field-icon" />
                    <input
                      type="email"
                      placeholder="nama@toray.co.id"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="auth-text-input"
                    />
                  </div>
                </div>

                {/* Input Department */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Departemen / Section *</label>
                  <div className="auth-input-wrapper">
                    <Building size={16} className="auth-field-icon" />
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="auth-select-input"
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

                {/* Input Password */}
                <div className="auth-field-group">
                  <label className="auth-field-label">Password Sistem *</label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-field-icon" />
                    <input
                      type="password"
                      required
                      placeholder="Masukkan password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="auth-text-input"
                    />
                  </div>
                </div>

                {/* Submit Gradient Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-auth-gradient-submit"
                >
                  <span>{isSubmitting ? 'Memproses Masuk...' : 'Sign In / Masuk Sistem'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Smooth Organic Wave Divider */}
        <div className="hero-wave-divider">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            preserveAspectRatio="none"
            className="wave-svg"
          >
            <path
              d="M0,32L80,42.7C160,53,320,75,480,80C640,85,800,75,960,58.7C1120,43,1280,21,1360,10.7L1440,0L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="#0c192c"
            />
          </svg>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          3. CLEAN MINIMAL CORPORATE FOOTER (DEEP NAVY)
          ------------------------------------------------------------------- */}
      <footer className="synergy-footer-clean">
        <div className="footer-clean-inner">
          <div className="footer-clean-brand">
            <div className="footer-clean-dot" />
            <span>PT INDONESIA TORAY SYNTHETICS • INFORMATION SYSTEM DEPARTMENT</span>
          </div>
          <div className="footer-clean-meta">
            <span>© 2026 PT. Indonesia Toray Synthetics • Dokumen Internal & Sistem Rahasia Perusahaan</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
