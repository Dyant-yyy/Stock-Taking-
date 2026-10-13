import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  X,
  QrCode,
  Search,
  CheckCircle2,
  Monitor,
  Building2,
  User,
  Wifi,
  AlertTriangle,
  RotateCcw,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Camera,
  CameraOff
} from 'lucide-react';

export const BarcodeScannerModal = () => {
  const {
    isScannerOpen,
    closeScannerModal,
    devices = [],
    updateDeviceStatus,
    scannedDevice,
    setScannedDevice,
    statusOptions = []
  } = useInventory();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [verificationFeedback, setVerificationFeedback] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (scannedDevice) {
      setSelectedDevice(scannedDevice);
    }
  }, [scannedDevice]);

  // Clean up camera on unmount or modal close
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError('Kamera tidak dapat diakses atau izin ditolak browser.');
    }
  };

  const handleClose = () => {
    stopCamera();
    closeScannerModal();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isScannerOpen) return null;

  const handleProcessScan = (inputVal) => {
    const clean = (inputVal || '').trim();
    if (!clean) return;

    // Extract device identifier from raw code or URL (e.g. http://localhost:5173/?scan=ITS-IS-PC01)
    let searchKey = clean;
    if (clean.includes('scan=')) {
      searchKey = clean.split('scan=')[1].split('&')[0];
    } else if (clean.includes('device=')) {
      searchKey = clean.split('device=')[1].split('&')[0];
    }

    const matched = devices.find(d => 
      (d.computerName || '').toLowerCase() === searchKey.toLowerCase() ||
      (d.id || '').toLowerCase() === searchKey.toLowerCase() ||
      (d.ipAddress || '').toLowerCase() === searchKey.toLowerCase()
    );

    if (matched) {
      setSelectedDevice(matched);
      setVerificationFeedback({
        type: 'success',
        message: `Barcode terverifikasi! Perangkat [${matched.computerName}] berhasil terhubung ke sistem.`
      });
    } else {
      setVerificationFeedback({
        type: 'error',
        message: `Barcode "${clean}" tidak terdaftar di sistem inventaris PT. Indonesia Toray Synthetics.`
      });
    }
  };

  const handleUpdateStatusVerified = (newStatus) => {
    if (selectedDevice) {
      updateDeviceStatus(selectedDevice.id, newStatus);
      setSelectedDevice(prev => ({ ...prev, status: newStatus }));
      setVerificationFeedback({
        type: 'success',
        message: `Status berhasil diverifikasi & diubah menjadi "${newStatus}"!`
      });
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Online': return { bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', color: '#34d399' };
      case 'In': return { bg: 'rgba(0, 163, 224, 0.2)', border: '#00a3e0', color: '#38bdf8' };
      case 'Out': return { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', color: '#fbbf24' };
      case 'Not Used': return { bg: 'rgba(100, 116, 139, 0.25)', border: '#64748b', color: '#cbd5e1' };
      case 'Broken': return { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', color: '#f87171' };
      case 'Disposal': return { bg: 'rgba(147, 51, 234, 0.2)', border: '#9333ea', color: '#c084fc' };
      default: return { bg: 'rgba(15, 23, 42, 0.6)', border: '#334155', color: '#fff' };
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-icon">
              <QrCode size={20} className="icon-toray" />
            </div>
            <div>
              <h3>Scan Barcode & Verifikasi Status Komputer</h3>
              <p className="modal-sub-text">Integrasi Barcode Fisik ke Database Web PT. Indonesia Toray Synthetics</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* CAMERA / SCANNER SIMULATION FRAME */}
          <div className="scanner-camera-frame">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="scanner-live-video"
              />
            ) : null}
            <div className="scanner-laser-line"></div>
            {!isCameraActive && (
              <div className="scanner-overlay-grid">
                <QrCode size={70} className="qr-scanner-icon" />
                <p className="scanner-instruction">
                  Arahkan Barcode / QR Code Asset Tag pada Komputer atau Gunakan Barcode Gun
                </p>
              </div>
            )}
          </div>

          {/* MOBILE CAMERA TOGGLE */}
          <div className="camera-toggle-row margin-top-sm">
            <button
              type="button"
              className={`btn-camera-toggle ${isCameraActive ? 'active' : ''}`}
              onClick={isCameraActive ? stopCamera : startCamera}
            >
              {isCameraActive ? <CameraOff size={16} /> : <Camera size={16} />}
              <span>{isCameraActive ? 'Matikan Kamera HP' : '📷 Buka Kamera HP / Scanner'}</span>
            </button>
            {cameraError && (
              <span className="camera-err-msg">{cameraError}</span>
            )}
          </div>

          {/* INPUT BARCODE FIELD (AUTO-TRIGGER FROM BARCODE GUN) */}
          <div className="barcode-input-section margin-top">
            <div className="search-box-wrapper full-width">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                autoFocus
                placeholder="Scan dengan Barcode Gun atau ketik Computer Name (cth: ITS-IS-PC01)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleProcessScan(barcodeInput);
                  }
                }}
                className="search-input-field code-font"
              />
              <button
                className="btn-primary-sm"
                onClick={() => handleProcessScan(barcodeInput)}
              >
                Cari & Verifikasi
              </button>
            </div>

            {/* QUICK TEST SELECTOR FOR DEMO */}
            <div className="scanner-quick-select margin-top-sm">
              <span className="text-muted text-xs font-semibold">Simulasi Cepat (Pilih Komputer):</span>
              <select
                className="control-select text-xs"
                onChange={(e) => {
                  if (e.target.value) {
                    setBarcodeInput(e.target.value);
                    handleProcessScan(e.target.value);
                  }
                }}
              >
                <option value="">-- Pilih Komputer untuk Di-Scan --</option>
                {devices.map((d) => (
                  <option key={d.id} value={d.computerName}>
                    {d.computerName} (Dept: {d.department} • Status: {d.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FEEDBACK ALERT */}
          {verificationFeedback && (
            <div className={`auth-alert margin-top-sm ${verificationFeedback.type === 'success' ? 'success' : 'error'}`}>
              {verificationFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{verificationFeedback.message}</span>
            </div>
          )}

          {/* VERIFIED DEVICE CARD RESULT */}
          {selectedDevice && (
            <div className="verified-result-card margin-top">
              <div className="verified-result-header">
                <div>
                  <div className="text-xs text-muted font-bold uppercase tracking-wider">Hasil Verifikasi Barcode:</div>
                  <h3 className="code-font text-xl text-white">{selectedDevice.computerName}</h3>
                </div>

                {/* CURRENT LIVE STATUS BADGE */}
                {(() => {
                  const style = getStatusBadgeStyle(selectedDevice.status);
                  return (
                    <div
                      className="verified-status-display"
                      style={{ background: style.bg, borderColor: style.border, color: style.color }}
                    >
                      <span className="live-pulse" style={{ background: style.border, boxShadow: `0 0 10px ${style.border}` }}></span>
                      <span className="verified-status-text">Status: <strong>{selectedDevice.status}</strong></span>
                    </div>
                  );
                })()}
              </div>

              {/* SPECIFICATION MATRIX */}
              <div className="specs-grid-two margin-top-sm">
                <div className="verified-info-row">
                  <span className="text-muted text-xs">Departemen / Section:</span>
                  <span className="dept-pill-badge">[{selectedDevice.department}]</span>
                </div>
                <div className="verified-info-row">
                  <span className="text-muted text-xs">IP Address Jaringan:</span>
                  <span className="code-font font-bold text-cyan">{selectedDevice.ipAddress || '-'}</span>
                </div>
                <div className="verified-info-row">
                  <span className="text-muted text-xs">Tipe Perangkat:</span>
                  <span className="font-semibold text-white">{selectedDevice.type}</span>
                </div>
                <div className="verified-info-row">
                  <span className="text-muted text-xs">User / Pengguna:</span>
                  <span className="font-bold text-white">{selectedDevice.user}</span>
                </div>
              </div>

              <div className="verified-info-row margin-top-sm">
                <span className="text-muted text-xs">Remark / Keterangan:</span>
                <span className="text-sm text-slate-300">{selectedDevice.remark || '-'}</span>
              </div>

              {/* QUICK STATUS UPDATE BUTTONS IN SCANNER */}
              <div className="quick-verify-status-section margin-top">
                <div className="text-xs font-bold text-cyan mb-2">
                  ⚡ Verifikasi / Ubah Status Perangkat Ini di Lapangan:
                </div>
                <div className="quick-status-buttons-grid">
                  {statusOptions.map((st) => {
                    const isCurrent = selectedDevice.status === st.value;
                    return (
                      <button
                        key={st.value}
                        type="button"
                        className={`btn-quick-status ${isCurrent ? 'current' : ''}`}
                        onClick={() => handleUpdateStatusVerified(st.value)}
                      >
                        {isCurrent && <Check size={14} />}
                        <span>Set {st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
