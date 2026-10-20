import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  X,
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  Camera,
  CameraOff,
  FlipHorizontal,
  Zap,
  Volume2,
  VolumeX,
  Smartphone,
  Upload,
  Info,
  ExternalLink,
  Laptop,
  Server,
  Monitor,
  Printer
} from 'lucide-react';

export const BarcodeScannerModal = () => {
  const {
    isScannerOpen,
    closeScannerModal,
    devices = [],
    updateDeviceStatus,
    scannedDevice,
    setScannedDevice,
    statusOptions = [],
    openBarcodePrint
  } = useInventory();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [verificationFeedback, setVerificationFeedback] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) | 'user' (front)
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState('');
  const [isScanningSuccessAnim, setIsScanningSuccessAnim] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastScanTimeRef = useRef(0);

  // Initialize selected device if passed via prop / context
  useEffect(() => {
    if (scannedDevice) {
      setSelectedDevice(scannedDevice);
    }
  }, [scannedDevice]);

  // Audio synthesizer beep for barcode scan feedback (Works offline, no audio asset needed)
  const playScannerBeep = () => {
    if (isSoundMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, ctx.currentTime); // High-pitch POS beep
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  };

  // Haptic feedback for mobile phones
  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([70, 40, 70]);
      }
    } catch (e) {}
  };

  // List available video devices on load or when permissions change
  const enumerateCameras = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const devicesList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devicesList.filter(d => d.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCameraId) {
        // Prefer back camera if label hints at it
        const backCam = videoDevices.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('rear') ||
          d.label.toLowerCase().includes('belakang') ||
          d.label.toLowerCase().includes('environment')
        );
        setSelectedCameraId(backCam ? backCam.deviceId : videoDevices[0].deviceId);
      }
    } catch (err) {
      console.warn('Could not enumerate cameras:', err);
    }
  };

  // Clean up camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      } catch (e) {}
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsTorchOn(false);
  };

  // Start live camera stream with cross-device fallbacks
  const startCamera = async (preferredFacing = facingMode, deviceId = selectedCameraId) => {
    try {
      setCameraError(null);
      stopCamera();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Akses kamera langsung (getUserMedia) tidak didukung pada browser ini atau koneksi non-HTTPS. Silakan gunakan tombol "Ambil Foto Barcode (Kamera HP)" di bawah!');
      }

      let stream = null;

      // Primary attempt: targeted device or facingMode with HD resolution
      try {
        const constraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : {
                facingMode: { ideal: preferredFacing },
                width: { ideal: 1280 },
                height: { ideal: 720 }
              },
          audio: false
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstErr) {
        console.warn('Targeted camera constraint failed, attempting generic video fallback...', firstErr);
        // Secondary attempt: loose facingMode
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: preferredFacing },
            audio: false
          });
        } catch (secErr) {
          console.warn('Loose facingMode failed, falling back to basic video: true...', secErr);
          // Final fallback: any video stream available
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
      }

      if (!stream) {
        throw new Error('Tidak dapat memperoleh video stream dari perangkat kamera.');
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS Safari
        videoRef.current.play().catch(e => console.warn('Video play error:', e));
      }

      setIsCameraActive(true);
      enumerateCameras();
    } catch (err) {
      console.error('Camera startup error:', err);
      let userMsg = 'Kamera tidak dapat dibuka.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userMsg = 'Izin kamera ditolak oleh browser. Mohon izinkan akses kamera di pengaturan browser Anda.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        userMsg = 'Tidak ada perangkat kamera / webcam yang terdeteksi di perangkat ini.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        userMsg = 'Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi lain dan coba lagi.';
      } else if (err.message) {
        userMsg = err.message;
      }
      setCameraError(userMsg);
      setIsCameraActive(false);
    }
  };

  // Flip between front and rear cameras
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode, '');
  };

  // Switch selected camera device
  const handleSelectCameraDevice = (devId) => {
    setSelectedCameraId(devId);
    startCamera(facingMode, devId);
  };

  // Toggle Torch / Flashlight (where hardware allows, e.g. Android Chrome)
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    try {
      const track = streamRef.current.getVideoTracks()[0];
      if (track && track.getCapabilities && track.getCapabilities().torch) {
        const nextTorch = !isTorchOn;
        await track.applyConstraints({
          advanced: [{ torch: nextTorch }]
        });
        setIsTorchOn(nextTorch);
      } else {
        alert('Fitur lampu flash/senter tidak didukung pada hardware kamera perangkat ini.');
      }
    } catch (err) {
      console.warn('Torch error:', err);
    }
  };

  // Handle successful barcode / QR detection
  const handleBarcodeSuccess = (rawCode) => {
    const clean = (rawCode || '').trim();
    if (!clean) return;

    // Debounce scans within 1.5 seconds to prevent rapid duplicate beeps
    const now = Date.now();
    if (clean === lastScannedCode && now - lastScanTimeRef.current < 1500) {
      return;
    }
    lastScanTimeRef.current = now;
    setLastScannedCode(clean);

    // Audio & Haptic feedback
    playScannerBeep();
    triggerHaptic();

    // Trigger visual success pulse
    setIsScanningSuccessAnim(true);
    setTimeout(() => setIsScanningSuccessAnim(false), 900);

    // Process matching
    handleProcessScan(clean);
  };

  // Process barcode input and match against database
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
        message: `Barcode Terdeteksi! Perangkat [${matched.computerName}] terverifikasi dari Dept ${matched.department}.`
      });
    } else {
      setVerificationFeedback({
        type: 'error',
        message: `Barcode / Kode "${clean}" tidak terdaftar di database inventaris PT. ITS.`
      });
    }
  };

  // Continuous BarcodeDetector frame analysis loop
  useEffect(() => {
    let animId;
    let detector = null;

    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        detector = new window.BarcodeDetector({
          formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'data_matrix', 'upc_a']
        });
      } catch (e) {
        console.warn('BarcodeDetector initialization error:', e);
      }
    }

    const scanVideoFrame = async () => {
      if (isCameraActive && videoRef.current && videoRef.current.readyState >= 2) {
        if (detector) {
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              handleBarcodeSuccess(barcodes[0].rawValue);
            }
          } catch (e) {
            // Frame skip is normal during rapid movement
          }
        }
      }
      if (isCameraActive) {
        animId = requestAnimationFrame(scanVideoFrame);
      }
    };

    if (isCameraActive) {
      animId = requestAnimationFrame(scanVideoFrame);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isCameraActive, devices]);

  // Handle Mobile Native Camera Photo Capture (<input capture="environment">)
  const handleNativeCameraPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVerificationFeedback({
      type: 'info',
      message: 'Menganalisis foto barcode dari kamera HP...'
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        // Attempt detection via BarcodeDetector
        if ('BarcodeDetector' in window) {
          try {
            const detector = new window.BarcodeDetector({
              formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'data_matrix']
            });
            const barcodes = await detector.detect(img);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              handleBarcodeSuccess(barcodes[0].rawValue);
              return;
            }
          } catch (err) {
            console.warn('Image detection error:', err);
          }
        }

        // If automatic detection in photo couldn't find barcode, provide quick helper
        setVerificationFeedback({
          type: 'info',
          message: 'Foto berhasil diambil. Jika barcode tidak terbaca otomatis karena resolusi kamera, silakan pilih nama unit pada simulasi atau ketik nama komputer di bawah.'
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateStatusVerified = (newStatus) => {
    if (selectedDevice) {
      updateDeviceStatus(selectedDevice.id, newStatus);
      setSelectedDevice(prev => ({ ...prev, status: newStatus }));
      setVerificationFeedback({
        type: 'success',
        message: `Status perangkat ${selectedDevice.computerName} berhasil diubah menjadi "${newStatus}"!`
      });
      playScannerBeep();
      triggerHaptic();
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

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-container modal-lg scanner-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* HEADER */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-icon">
              <QrCode size={20} className="icon-toray" />
            </div>
            <div>
              <h3>Scan Barcode & Kamera Device IT</h3>
              <p className="modal-sub-text">Bisa dibuka dari Smartphone (Android/iOS), Laptop Webcam & Barcode Gun Fisik</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={handleClose} title="Tutup">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* CAMERA VIEWPORT FRAME */}
          <div className={`scanner-camera-frame ${isScanningSuccessAnim ? 'scan-success-pulse' : ''}`}>
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="scanner-live-video"
              />
            ) : null}

            {/* Red Laser Scanner Animation Bar */}
            <div className={`scanner-laser-line ${isCameraActive ? 'active' : ''}`}></div>

            {/* Centered Reticle / Target Box */}
            <div className="scanner-target-reticle">
              <span className="reticle-corner top-left"></span>
              <span className="reticle-corner top-right"></span>
              <span className="reticle-corner bottom-left"></span>
              <span className="reticle-corner bottom-right"></span>
            </div>

            {/* Offline / Inactive Placeholder Overlay */}
            {!isCameraActive && (
              <div className="scanner-overlay-grid">
                <div className="scanner-idle-icon-wrap">
                  <Camera size={48} className="qr-scanner-icon" />
                </div>
                <p className="scanner-instruction">
                  Kamera Belum Aktif. Klik tombol <strong>"Buka Kamera Langsung"</strong> atau <strong>"Ambil Foto Kamera HP"</strong> di bawah.
                </p>
                <div className="scanner-device-compatibility-badge">
                  <Smartphone size={13} />
                  <span>Mendukung Android • iPhone (iOS) • Windows Laptop • Barcode Gun</span>
                </div>
              </div>
            )}
          </div>

          {/* HARDWARE CAMERA CONTROLS STRIP */}
          <div className="camera-controls-action-bar">
            {/* Primary Toggle: Start/Stop Live Stream */}
            <button
              type="button"
              className={`btn-camera-toggle-main ${isCameraActive ? 'active-stop' : 'active-start'}`}
              onClick={isCameraActive ? stopCamera : () => startCamera(facingMode, selectedCameraId)}
            >
              {isCameraActive ? <CameraOff size={16} /> : <Camera size={16} />}
              <span>{isCameraActive ? 'Matikan Kamera' : '📷 Buka Kamera Langsung'}</span>
            </button>

            {/* Direct Mobile Native Camera Button (Guaranteed to work on ALL mobile browsers & HTTP) */}
            <button
              type="button"
              className="btn-camera-native-mobile"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              title="Gunakan kamera bawaan smartphone untuk foto stiker barcode"
            >
              <Smartphone size={16} />
              <span>Ambil Foto Barcode (Kamera HP)</span>
            </button>

            {/* Hidden Input for Native Camera File Capture */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleNativeCameraPhoto}
            />

            {/* Secondary Controls (Shown when camera is active) */}
            {isCameraActive && (
              <div className="camera-sub-controls">
                {/* Flip Camera (Front/Rear) */}
                <button
                  type="button"
                  className="btn-camera-mini-tool"
                  onClick={handleToggleFacingMode}
                  title="Balik Kamera (Depan / Belakang)"
                >
                  <FlipHorizontal size={15} />
                  <span>{facingMode === 'environment' ? 'Belakang' : 'Depan'}</span>
                </button>

                {/* Torch / Flashlight Toggle */}
                <button
                  type="button"
                  className={`btn-camera-mini-tool ${isTorchOn ? 'torch-active' : ''}`}
                  onClick={handleToggleTorch}
                  title="Nyalakan Lampu Senter / Flash Kamera"
                >
                  <Zap size={15} />
                  <span>Flash</span>
                </button>
              </div>
            )}

            {/* Sound Mute Toggle */}
            <button
              type="button"
              className="btn-camera-mini-tool"
              onClick={() => setIsSoundMuted(prev => !prev)}
              title={isSoundMuted ? 'Nyalakan Bunyi Beep' : 'Bisukan Bunyi Beep'}
            >
              {isSoundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          {/* Camera Device Switcher Dropdown (If multiple cameras detected) */}
          {availableCameras.length > 1 && (
            <div className="camera-device-selector-row">
              <span className="text-xs text-muted">Pilih Sensor Kamera:</span>
              <select
                value={selectedCameraId}
                onChange={(e) => handleSelectCameraDevice(e.target.value)}
                className="camera-device-select"
              >
                {availableCameras.map((cam, idx) => (
                  <option key={cam.deviceId || idx} value={cam.deviceId}>
                    {cam.label || `Kamera ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error Message Alert */}
          {cameraError && (
            <div className="camera-error-banner">
              <AlertTriangle size={16} className="text-amber-400" />
              <div className="camera-error-text">
                <strong>Pemberitahuan Kamera:</strong> {cameraError}
              </div>
            </div>
          )}

          {/* SEARCH & PHYSICAL BARCODE GUN INPUT SECTION */}
          <div className="barcode-input-section">
            <div className="search-box-wrapper full-width">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                autoFocus
                placeholder="Scan dengan Barcode Gun USB atau ketik nama komputer (cth: ITS-IS-PC01)..."
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

            {/* QUICK TEST SIMULATION CHIPS */}
            <div className="scanner-quick-chips-wrap">
              <span className="text-muted text-xs font-semibold">Simulasi Cepat (Klik untuk Uji Scan):</span>
              <div className="quick-chips-scroll">
                {devices.slice(0, 6).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className="chip-barcode-test"
                    onClick={() => {
                      setBarcodeInput(d.computerName);
                      handleBarcodeSuccess(d.computerName);
                    }}
                  >
                    {d.computerName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FEEDBACK STATUS ALERT */}
          {verificationFeedback && (
            <div className={`auth-alert margin-top-sm ${verificationFeedback.type === 'success' ? 'success' : verificationFeedback.type === 'info' ? 'info' : 'error'}`}>
              {verificationFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{verificationFeedback.message}</span>
            </div>
          )}

          {/* VERIFIED DEVICE INSPECTION CARD */}
          {selectedDevice && (
            <div className="verified-result-card margin-top">
              <div className="verified-result-header">
                <div>
                  <div className="text-xs text-muted font-bold uppercase tracking-wider">Perangkat Terverifikasi:</div>
                  <h3 className="code-font text-xl text-white" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                    {selectedDevice.type === 'Notebook' ? <Laptop size={20} style={{ color: '#38bdf8' }} /> : selectedDevice.type === 'Server' ? <Server size={20} style={{ color: '#f59e0b' }} /> : <Monitor size={20} style={{ color: '#60a5fa' }} />}
                    <span>{selectedDevice.computerName}</span>
                  </h3>
                </div>

                {/* CURRENT LIVE STATUS BADGE */}
                <div className={`status-badge-capsule status-${(selectedDevice.status || 'online').toLowerCase().replace(/\s+/g, '-')}`}>
                  <span className="live-pulse"></span>
                  <span>{selectedDevice.status}</span>
                </div>
              </div>

              {/* SPECIFICATION MATRIX */}
              <div className="specs-grid-two margin-top-sm">
                <div className="verified-info-row">
                  <span className="text-muted text-xs">Departemen:</span>
                  <span className={`dept-badge-pill dept-${(selectedDevice.department || 'is').toLowerCase()}`}>
                    {selectedDevice.department}
                  </span>
                </div>
                <div className="verified-info-row">
                  <span className="text-muted text-xs">IP Address:</span>
                  <span className="code-font font-bold text-cyan">{selectedDevice.ipAddress || '-'}</span>
                </div>
                <div className="verified-info-row">
                  <span className="text-muted text-xs">Tipe Perangkat:</span>
                  <span className="font-semibold text-white">{selectedDevice.type}</span>
                </div>
                <div className="verified-info-row">
                  <span className="text-muted text-xs">User / PIC:</span>
                  <span className="font-bold text-white">{selectedDevice.user}</span>
                </div>
              </div>

              <div className="verified-info-row margin-top-sm">
                <span className="text-muted text-xs">Keterangan / Remark:</span>
                <span className="text-sm text-slate-300">{selectedDevice.remark || '-'}</span>
              </div>

              {/* QUICK STATUS UPDATE BUTTONS IN SCANNER */}
              <div className="quick-verify-status-section margin-top">
                <div className="text-xs font-bold text-cyan mb-2" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} />
                  <span>Ubah / Verifikasi Status Operasional Unit Ini di Lapangan:</span>
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
                        <span>{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTION BUTTON: PRINT LABEL */}
              <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-inventory-action btn-blue-solid"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => openBarcodePrint(selectedDevice)}
                >
                  <Printer size={15} />
                  <span>Cetak Stiker Barcode Komputer Ini</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn-secondary" onClick={handleClose}>
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
