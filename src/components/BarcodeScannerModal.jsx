import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import jsQR from 'jsqr';
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
  Laptop,
  Server,
  Monitor,
  Printer,
  Cpu,
  HardDrive,
  Network,
  Shield,
  MapPin,
  Tag,
  User,
  Hash,
  Edit3,
  ExternalLink,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

export const BarcodeScannerModal = () => {
  const {
    isScannerOpen,
    closeScannerModal,
    devices = [],
    scannedDevice,
    setScannedDevice,
    scannerNotice,
    setScannerNotice,
    getDeviceCurrentStatus,
    getDeviceCurrentRemark,
    updateDeviceCondition,
    statusOptions = [],
    openBarcodePrint,
    openEditModal,
    openAddModal,
    currentMonth,
    currentYear,
    monthOptions = []
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
  const [auditRemarkInput, setAuditRemarkInput] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastScanTimeRef = useRef(0);
  const keyBufferRef = useRef('');
  const lastKeyTimeRef = useRef(0);

  // Sync selected device when context's scannedDevice changes
  useEffect(() => {
    if (scannedDevice) {
      setSelectedDevice(scannedDevice);
      const currentRemark = getDeviceCurrentRemark ? getDeviceCurrentRemark(scannedDevice.id) : (scannedDevice.remark || '');
      setAuditRemarkInput(currentRemark);
    }
  }, [scannedDevice, isScannerOpen]);

  // Audio synthesizer beep for scan feedback (Works completely offline on any browser)
  const playScannerBeep = () => {
    if (isSoundMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1850, ctx.currentTime);
      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      // Audio playback might be restricted without user interaction
    }
  };

  // Haptic feedback for mobile phones
  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([70, 30, 70]);
      }
    } catch (e) {}
  };

  // Hardware Barcode Scanner Gun Keyboard-Wedge Listener (USB / Bluetooth POS Guns)
  useEffect(() => {
    if (!isScannerOpen) return;

    const handleGlobalKeyDown = (e) => {
      // Ignore if typing inside the text input field
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      const now = Date.now();
      // Most physical barcode scanners type characters in rapid succession (< 50ms per key)
      if (now - lastKeyTimeRef.current > 120) {
        keyBufferRef.current = '';
      }
      lastKeyTimeRef.current = now;

      if (e.key === 'Enter') {
        if (keyBufferRef.current.length >= 2) {
          e.preventDefault();
          const scannedCode = keyBufferRef.current;
          keyBufferRef.current = '';
          handleBarcodeSuccess(scannedCode);
        }
      } else if (e.key.length === 1) {
        keyBufferRef.current += e.key;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isScannerOpen, devices]);

  // Enumerate cameras (support multiple lenses on modern smartphones: ultra-wide, tele, main rear)
  const enumerateCameras = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const devicesList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devicesList.filter(d => d.kind === 'videoinput');
      setAvailableCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCameraId) {
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

  // Start live camera stream with universal mobile fallbacks
  const startCamera = async (preferredFacing = facingMode, deviceId = selectedCameraId) => {
    try {
      setCameraError(null);
      stopCamera();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Akses kamera langsung (getUserMedia) tidak didukung pada browser ini atau koneksi non-HTTPS. Silakan gunakan tombol "Ambil Foto Barcode (Kamera HP)" di bawah!');
      }

      let stream = null;

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
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: preferredFacing },
            audio: false
          });
        } catch (secErr) {
          console.warn('Loose facingMode failed, falling back to basic video: true...', secErr);
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
        userMsg = 'Izin kamera ditolak oleh browser. Mohon klik "Izinkan Akses Kamera" di pengaturan browser Anda.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        userMsg = 'Tidak ada perangkat kamera / webcam yang terdeteksi di perangkat ini.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        userMsg = 'Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi kamera lain dan coba lagi.';
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

  // Successful Barcode / QR detection
  const handleBarcodeSuccess = (rawCode) => {
    const clean = (rawCode || '').trim();
    if (!clean) return;

    // Debounce scans within 1.5s
    const now = Date.now();
    if (clean === lastScannedCode && now - lastScanTimeRef.current < 1500) {
      return;
    }
    lastScanTimeRef.current = now;
    setLastScannedCode(clean);

    playScannerBeep();
    triggerHaptic();

    setIsScanningSuccessAnim(true);
    setTimeout(() => setIsScanningSuccessAnim(false), 800);

    handleProcessScan(clean);
  };

  // Parse raw barcode / QR code / URL into device match and transition to Form Input
  const handleProcessScan = (inputVal) => {
    const clean = (inputVal || '').trim();
    if (!clean) return;

    // Extract device identifier from raw code, deep-link URL, or pipe-delimited payload
    let searchKey = clean;
    if (clean.includes('scan=')) {
      searchKey = clean.split('scan=')[1].split('&')[0];
    } else if (clean.includes('device=')) {
      searchKey = clean.split('device=')[1].split('&')[0];
    } else if (clean.includes('|')) {
      // Format: "PT. ITS | ITS_ESXi01 | IS | Administrator | ..."
      const parts = clean.split('|').map(p => p.trim());
      if (parts.length >= 2) {
        searchKey = parts[1];
      }
    }

    const rawKey = decodeURIComponent(searchKey).trim();
    const normalizedKey = rawKey.toLowerCase();

    // Match against devices
    const matched = devices.find(d => 
      (d.computerName || '').toLowerCase() === normalizedKey ||
      (d.id || '').toLowerCase() === normalizedKey ||
      (d.specs?.assetTag || '').toLowerCase() === normalizedKey ||
      (d.specs?.serialNumber || '').toLowerCase() === normalizedKey ||
      (d.ipAddress || '').toLowerCase() === normalizedKey
    );

    if (matched) {
      setSelectedDevice(matched);
      setScannedDevice(matched);
      const currentRemark = getDeviceCurrentRemark ? getDeviceCurrentRemark(matched.id) : (matched.remark || '');
      setAuditRemarkInput(currentRemark);
      setVerificationFeedback({
        type: 'success',
        message: `✓ Barcode Terverifikasi! Komputer [${matched.computerName}] (${matched.department}). Membuka formulir pendataan...`
      });
    } else {
      setVerificationFeedback({
        type: 'info',
        message: `★ Barcode Baru: [${rawKey.toUpperCase()}]. Membuka formulir pendaftaran perangkat baru...`
      });
    }

    // Alur Baru: Langsung masuk ke form input untuk didata 1 per 1!
    setTimeout(() => {
      stopCamera();
      closeScannerModal();
      if (matched) {
        openEditModal({
          ...matched,
          _isFromScan: true,
          _scannedCode: rawKey
        });
      } else {
        openAddModal({
          computerName: rawKey.toUpperCase(),
          assetTag: `ITS-${rawKey.toUpperCase()}`,
          department: 'IS',
          type: 'Notebook',
          user: '',
          status: 'Online',
          remark: '',
          _isFromScan: true,
          _scannedCode: rawKey
        });
      }
    }, 420);
  };

  // Continuous frame analysis loop: uses jsQR (works everywhere) + BarcodeDetector fallback
  useEffect(() => {
    let animId;
    let detector = null;

    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        detector = new window.BarcodeDetector({
          formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'data_matrix', 'upc_a']
        });
      } catch (e) {
        console.warn('BarcodeDetector init error:', e);
      }
    }

    const scanVideoFrame = async () => {
      if (isCameraActive && videoRef.current && videoRef.current.readyState >= 2) {
        const video = videoRef.current;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (videoWidth > 0 && videoHeight > 0) {
          // 1. First attempt: jsQR via offscreen canvas (ultra-reliable QR decoding across ALL browsers)
          try {
            if (!canvasRef.current) {
              canvasRef.current = document.createElement('canvas');
            }
            const canvas = canvasRef.current;
            // Downscale frame slightly for faster FPS processing on mobile CPUs
            const scanWidth = Math.min(videoWidth, 640);
            const scanHeight = Math.floor((videoHeight / videoWidth) * scanWidth);
            canvas.width = scanWidth;
            canvas.height = scanHeight;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(video, 0, 0, scanWidth, scanHeight);
              const imageData = ctx.getImageData(0, 0, scanWidth, scanHeight);
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert'
              });

              if (code && code.data) {
                handleBarcodeSuccess(code.data);
              }
            }
          } catch (qrErr) {
            // Frame skip normal
          }

          // 2. Second attempt: BarcodeDetector for 1D Barcodes (Code 128 / Code 39) if available
          if (detector) {
            try {
              const barcodes = await detector.detect(video);
              if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                handleBarcodeSuccess(barcodes[0].rawValue);
              }
            } catch (dErr) {
              // Frame skip normal
            }
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
        let detectedCode = null;

        // 1. Try jsQR on image
        try {
          const testCanvas = document.createElement('canvas');
          testCanvas.width = img.naturalWidth || img.width;
          testCanvas.height = img.naturalHeight || img.height;
          const ctx = testCanvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, testCanvas.width, testCanvas.height);
          const qrResult = jsQR(imgData.data, imgData.width, imgData.height);
          if (qrResult && qrResult.data) {
            detectedCode = qrResult.data;
          }
        } catch (e) {
          console.warn('Canvas jsQR error:', e);
        }

        // 2. Try BarcodeDetector on image
        if (!detectedCode && 'BarcodeDetector' in window) {
          try {
            const detector = new window.BarcodeDetector({
              formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'data_matrix']
            });
            const barcodes = await detector.detect(img);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              detectedCode = barcodes[0].rawValue;
            }
          } catch (err) {
            console.warn('BarcodeDetector image error:', err);
          }
        }

        if (detectedCode) {
          handleBarcodeSuccess(detectedCode);
        } else {
          setVerificationFeedback({
            type: 'info',
            message: 'Foto barcode berhasil diambil. Jika barcode buram, Anda dapat memilih unit pada daftar simulasi atau mengetik nama komputer di bawah.'
          });
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Update Status & Condition directly from Scanner modal
  const handleUpdateStatus = (newStatus) => {
    if (!selectedDevice) return;
    setIsUpdatingStatus(true);

    if (updateDeviceCondition) {
      updateDeviceCondition(selectedDevice.id, newStatus, auditRemarkInput);
    }

    setSelectedDevice(prev => ({
      ...prev,
      status: newStatus,
      remark: auditRemarkInput
    }));

    setVerificationFeedback({
      type: 'success',
      message: `Status perangkat [${selectedDevice.computerName}] berhasil diubah menjadi "${newStatus}" untuk audit bulan ini!`
    });

    playScannerBeep();
    triggerHaptic();

    setTimeout(() => {
      setIsUpdatingStatus(false);
    }, 400);
  };

  // Save updated Remark
  const handleSaveRemark = (e) => {
    e.preventDefault();
    if (!selectedDevice) return;
    const currentStatus = getDeviceCurrentStatus ? getDeviceCurrentStatus(selectedDevice.id) : (selectedDevice.status || 'Online');
    if (updateDeviceCondition) {
      updateDeviceCondition(selectedDevice.id, currentStatus, auditRemarkInput);
    }
    setVerificationFeedback({
      type: 'success',
      message: `Catatan temuan audit [${selectedDevice.computerName}] berhasil disimpan!`
    });
    playScannerBeep();
  };

  const handleClose = () => {
    stopCamera();
    closeScannerModal();
  };

  useEffect(() => {
    if (isScannerOpen) {
      startCamera(facingMode, selectedCameraId);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isScannerOpen]);

  if (!isScannerOpen) return null;

  // Real-time live status of selected device
  const currentLiveStatus = selectedDevice
    ? (getDeviceCurrentStatus ? getDeviceCurrentStatus(selectedDevice.id) : (selectedDevice.status || 'Online'))
    : 'Online';

  const specs = selectedDevice?.specs || {};
  const currentMonthLabel = monthOptions.find(m => m.value === currentMonth)?.label || 'Januari';

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-container modal-lg scanner-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '740px',
          width: '95%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-icon barcode-accent">
              <QrCode size={20} className="icon-toray" />
            </div>
            <div>
              <h3>Scan Barcode & Spesifikasi Perangkat IT</h3>
              <p className="modal-sub-text">
                Kamera Smartphone (Android / iOS) • Laptop Webcam • Barcode Scanner Gun Fisik
              </p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={handleClose} title="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="modal-body" style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
          
          {/* STEP WORKFLOW GUIDANCE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '12px',
            fontSize: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
              <strong style={{ color: '#38bdf8' }}>Alur Pendataan:</strong>
              <span style={{ color: '#e2e8f0' }}>1. Scan Barcode ➔ 2. Form Input Perangkat ➔ 3. Simpan & Lanjut Scan</span>
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Auto-Direct Aktif</span>
          </div>

          {/* DYNAMIC SUCCESS / NOTICE BANNER (AFTER SAVING PREVIOUS DEVICE OR LOGIN) */}
          {scannerNotice && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.45)',
              color: '#34d399',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, color: '#10b981' }} />
              <span style={{ flex: 1, fontWeight: 500 }}>{scannerNotice}</span>
              <button
                type="button"
                onClick={() => setScannerNotice('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px 4px' }}
                title="Tutup Pesan"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* CAMERA VIEWPORT FRAME */}
          <div className={`scanner-camera-frame ${isScanningSuccessAnim ? 'scan-success-pulse' : ''}`} style={{ minHeight: '180px' }}>
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="scanner-live-video"
              />
            ) : null}

            {/* Red Laser Scanning Animation Line */}
            <div className={`scanner-laser-line ${isCameraActive ? 'active' : ''}`}></div>

            {/* Centered Reticle Target */}
            <div className="scanner-target-reticle">
              <span className="reticle-corner top-left"></span>
              <span className="reticle-corner top-right"></span>
              <span className="reticle-corner bottom-left"></span>
              <span className="reticle-corner bottom-right"></span>
            </div>

            {/* Idle Overlay when camera is off */}
            {!isCameraActive && (
              <div className="scanner-overlay-grid">
                <div className="scanner-idle-icon-wrap">
                  <Camera size={44} className="qr-scanner-icon" />
                </div>
                <p className="scanner-instruction">
                  Arahkan kamera ke stiker Barcode / QR Code Asset Tag komputer, atau pilih tombol di bawah.
                </p>
                <div className="scanner-device-compatibility-badge">
                  <Smartphone size={13} />
                  <span>Kompatibel: Android (Samsung, Xiaomi, Oppo, Vivo) • iPhone / iPad (iOS) • Windows PC</span>
                </div>
              </div>
            )}
          </div>

          {/* HARDWARE CAMERA CONTROLS ACTION BAR */}
          <div className="camera-controls-action-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {/* Live Camera Stream Toggle */}
            <button
              type="button"
              className={`btn-camera-toggle-main ${isCameraActive ? 'active-stop' : 'active-start'}`}
              onClick={isCameraActive ? stopCamera : () => startCamera(facingMode, selectedCameraId)}
              style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px' }}
            >
              {isCameraActive ? <CameraOff size={16} /> : <Camera size={16} />}
              <span>{isCameraActive ? 'Matikan Kamera' : '📷 Buka Kamera Langsung'}</span>
            </button>

            {/* Native Mobile Camera Photo Button (100% universal on every smartphone) */}
            <button
              type="button"
              className="btn-camera-native-mobile"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              title="Gunakan kamera bawaan smartphone untuk foto stiker barcode"
              style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px' }}
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

            {/* Sub-controls when camera is active */}
            {isCameraActive && (
              <div className="camera-sub-controls" style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-camera-mini-tool"
                  onClick={handleToggleFacingMode}
                  title="Balik Kamera (Depan / Belakang)"
                >
                  <FlipHorizontal size={15} />
                  <span>{facingMode === 'environment' ? 'Belakang' : 'Depan'}</span>
                </button>

                <button
                  type="button"
                  className={`btn-camera-mini-tool ${isTorchOn ? 'torch-active' : ''}`}
                  onClick={handleToggleTorch}
                  title="Nyalakan Lampu Flash Kamera"
                >
                  <Zap size={15} />
                  <span>Flash</span>
                </button>
              </div>
            )}

            {/* Sound Toggle */}
            <button
              type="button"
              className="btn-camera-mini-tool"
              onClick={() => setIsSoundMuted(prev => !prev)}
              title={isSoundMuted ? 'Nyalakan Bunyi Beep' : 'Bisukan Bunyi Beep'}
            >
              {isSoundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          {/* Camera Device Switcher (Multi-lens smartphones & external webcams) */}
          {availableCameras.length > 1 && (
            <div className="camera-device-selector-row" style={{ marginTop: '8px' }}>
              <span className="text-xs text-muted">Lensa Kamera:</span>
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

          {/* Camera Error Banner */}
          {cameraError && (
            <div className="camera-error-banner" style={{ marginTop: '10px' }}>
              <AlertTriangle size={16} className="text-amber-400" />
              <div className="camera-error-text">
                <strong>Pemberitahuan Kamera:</strong> {cameraError}
              </div>
            </div>
          )}

          {/* MANUAL SEARCH & HARDWARE BARCODE GUN INPUT */}
          <div className="barcode-input-section" style={{ marginTop: '12px' }}>
            <div className="search-box-wrapper full-width" style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} className="search-icon" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Scan dengan Barcode Gun USB/Bluetooth atau ketik nama komputer..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleProcessScan(barcodeInput);
                    }
                  }}
                  className="search-input-field code-font"
                  style={{ width: '100%', paddingLeft: '36px', height: '38px', borderRadius: '6px' }}
                />
              </div>
              <button
                className="btn-primary-sm"
                onClick={() => handleProcessScan(barcodeInput)}
                style={{ padding: '0 16px', height: '38px' }}
              >
                Cari & Hubungkan
              </button>
            </div>

            {/* Quick Test Chips for Plant Simulation */}
            <div className="scanner-quick-chips-wrap" style={{ marginTop: '8px' }}>
              <span className="text-muted text-xs font-semibold">Uji Coba Scan Cepat (Klik salah satu unit):</span>
              <div className="quick-chips-scroll" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginTop: '4px' }}>
                {devices.slice(0, 8).map((d) => (
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
            <div
              className={`auth-alert margin-top-sm ${
                verificationFeedback.type === 'success'
                  ? 'success'
                  : verificationFeedback.type === 'info'
                  ? 'info'
                  : 'error'
              }`}
              style={{ marginTop: '10px' }}
            >
              {verificationFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{verificationFeedback.message}</span>
            </div>
          )}

          {/* =========================================================================
              VERIFIED DEVICE INSPECTION CARD & COMPLETE HARDWARE SPECIFICATIONS
              ========================================================================= */}
          {selectedDevice ? (
            <div className="verified-result-card" style={{ marginTop: '16px' }}>
              {/* CARD TOP BAR */}
              <div className="verified-result-header">
                <div>
                  <div className="text-xs text-muted font-bold uppercase tracking-wider" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                    <span>Perangkat IT Terverifikasi di Database Web:</span>
                  </div>
                  <h3
                    className="code-font text-xl text-white"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}
                  >
                    {selectedDevice.type === 'Notebook' ? (
                      <Laptop size={20} style={{ color: '#38bdf8' }} />
                    ) : selectedDevice.type === 'Server' ? (
                      <Server size={20} style={{ color: '#f59e0b' }} />
                    ) : (
                      <Monitor size={20} style={{ color: '#60a5fa' }} />
                    )}
                    <span>{selectedDevice.computerName}</span>
                    <span className="text-xs text-muted" style={{ fontWeight: 400 }}>
                      ({selectedDevice.type})
                    </span>
                  </h3>
                </div>

                {/* CURRENT LIVE REAL-TIME CONDITION BADGE */}
                <div style={{ textAlign: 'right' }}>
                  <div className="text-xs text-muted" style={{ marginBottom: '4px' }}>
                    Kondisi ({currentMonthLabel} {currentYear}):
                  </div>
                  <div className={`status-badge-capsule status-${currentLiveStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span className="live-pulse"></span>
                    <span style={{ fontWeight: 700 }}>{currentLiveStatus}</span>
                  </div>
                </div>
              </div>

              {/* COMPLETE HARDWARE SPECIFICATIONS MATRIX */}
              <div style={{ marginTop: '14px', background: 'rgba(0, 0, 0, 0.25)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div className="text-xs font-bold text-cyan" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Cpu size={14} />
                  <span>Spesifikasi Hardware & Jaringan Lengkap:</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px 16px',
                    fontSize: '0.82rem'
                  }}
                >
                  <div className="verified-info-row">
                    <span className="text-muted text-xs">Departemen:</span>
                    <span className={`dept-badge-pill dept-${(selectedDevice.department || 'is').toLowerCase()}`}>
                      {selectedDevice.department}
                    </span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">User / PIC:</span>
                    <span className="font-bold text-white">{selectedDevice.user || '-'}</span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">Merk & Tipe:</span>
                    <span className="font-semibold text-white">
                      {specs.brand || 'Lenovo'} {specs.model || '-'}
                    </span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">Processor (CPU):</span>
                    <span className="text-slate-200">{specs.cpu || 'Intel Core i5'}</span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">Memory (RAM):</span>
                    <span className="font-bold text-cyan">{specs.ram || '16 GB DDR4'}</span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">Penyimpanan (Storage):</span>
                    <span className="text-slate-200">{specs.storage || '512 GB SSD'}</span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">Operating System:</span>
                    <span className="text-slate-200">{specs.os || 'Windows 11 Pro 64-bit'}</span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">IP Address:</span>
                    <span className="code-font font-bold text-cyan">{selectedDevice.ipAddress || specs.ipAddress || '-'}</span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">MAC Address:</span>
                    <span className="code-font text-slate-300">{specs.macAddress || '-'}</span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">Serial Number (SN):</span>
                    <span className="code-font text-amber-300">{specs.serialNumber || selectedDevice.serialNumber || '-'}</span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">Asset Tag Resmi:</span>
                    <span className="code-font text-white">{specs.assetTag || selectedDevice.assetTag || `ITS-${selectedDevice.computerName}`}</span>
                  </div>

                  <div className="verified-info-row">
                    <span className="text-muted text-xs">Lokasi Fisik:</span>
                    <span className="text-slate-200">{specs.location || `${selectedDevice.department} Area`}</span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC CONDITION & STATUS UPDATER (ONE-CLICK FIELD AUDIT) */}
              <div className="quick-verify-status-section" style={{ marginTop: '14px', background: 'rgba(0, 163, 224, 0.06)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(0, 163, 224, 0.25)' }}>
                <div className="text-xs font-bold text-cyan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} />
                    <span>Ubah Kondisi Unit Ini di Lapangan (Audit {currentMonthLabel} {currentYear}):</span>
                  </div>
                  <span className="text-muted text-xs">Klik untuk perbarui</span>
                </div>

                {/* STATUS BUTTONS GRID */}
                <div className="quick-status-buttons-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                  {statusOptions.map((st) => {
                    const isCurrent = currentLiveStatus === st.value;
                    return (
                      <button
                        key={st.value}
                        type="button"
                        className={`btn-quick-status ${isCurrent ? 'current' : ''}`}
                        onClick={() => handleUpdateStatus(st.value)}
                        disabled={isUpdatingStatus}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: isCurrent ? `2px solid ${st.color || '#00a3e0'}` : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isCurrent ? 'rgba(0, 163, 224, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                          color: isCurrent ? '#ffffff' : '#cbd5e1',
                          fontWeight: isCurrent ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isCurrent && <Check size={14} style={{ color: st.color || '#38bdf8' }} />}
                        <span>{st.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* REMARKS INPUT FORM */}
                <form onSubmit={handleSaveRemark} style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Tambah catatan kondisi fisik / temuan audit (cth: Layar bergaris, kipas bunyi, siap pakai)..."
                    value={auditRemarkInput}
                    onChange={(e) => setAuditRemarkInput(e.target.value)}
                    className="search-input-field"
                    style={{ flex: 1, height: '36px', fontSize: '0.82rem', borderRadius: '6px' }}
                  />
                  <button type="submit" className="btn-primary-sm" style={{ height: '36px', whiteSpace: 'nowrap' }}>
                    Simpan Catatan
                  </button>
                </form>
              </div>

              {/* ACTION BUTTONS (PRINT STIKER & EDIT SPECS) */}
              <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-inventory-action btn-blue-solid"
                  style={{ flex: '1 1 200px', justifyContent: 'center', padding: '9px 14px' }}
                  onClick={() => {
                    handleClose();
                    if (openBarcodePrint) openBarcodePrint(selectedDevice);
                  }}
                >
                  <Printer size={15} />
                  <span>Cetak Stiker Barcode & Tag Resmi</span>
                </button>

                <button
                  type="button"
                  className="btn-inventory-action btn-secondary"
                  style={{ flex: '1 1 200px', justifyContent: 'center', padding: '9px 14px' }}
                  onClick={() => {
                    handleClose();
                    if (openEditModal) openEditModal(selectedDevice);
                  }}
                >
                  <Edit3 size={15} />
                  <span>Edit Data Spesifikasi Komputer</span>
                </button>
              </div>
            </div>
          ) : (
            /* EMPTY / UNKNOWN BARCODE PROMPT */
            verificationFeedback?.type === 'error' && (
              <div
                style={{
                  marginTop: '16px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px dashed rgba(239, 68, 68, 0.4)',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <AlertTriangle size={32} style={{ color: '#ef4444', margin: '0 auto 8px auto' }} />
                <h4 style={{ color: '#f87171', margin: '0 0 6px 0' }}>Perangkat Belum Terdaftar</h4>
                <p className="text-xs text-slate-300" style={{ maxWidth: '440px', margin: '0 auto 12px auto' }}>
                  Barcode atau kode yang di-scan belum ada di sistem inventaris. Anda dapat mendaftarkannya sekarang sebagai perangkat baru.
                </p>
                <button
                  type="button"
                  className="btn-primary-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    handleClose();
                    if (openAddModal) openAddModal();
                  }}
                >
                  <PlusCircle size={15} />
                  <span>+ Daftarkan Sebagai Perangkat Baru</span>
                </button>
              </div>
            )
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          className="modal-footer"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(2, 6, 23, 0.8)'
          }}
        >
          <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
            <span>Database PT. Indonesia Toray Synthetics Online • {devices.length} Perangkat Terhubung</span>
          </div>
          <button className="btn-secondary" onClick={handleClose} style={{ padding: '8px 18px' }}>
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
