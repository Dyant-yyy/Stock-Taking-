import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, QrCode, Search, CheckCircle2, Cpu, ArrowRight } from 'lucide-react';

export const QRScannerModal = () => {
  const {
    isQRScannerOpen,
    setIsQRScannerOpen,
    devices,
    setSelectedDevice,
    setIsDeviceDetailOpen
  } = useInventory();

  const [scanInput, setScanInput] = useState('');
  const [scannedDevice, setScannedDevice] = useState(null);
  const [isScanningActive, setIsScanningActive] = useState(true);

  if (!isQRScannerOpen) return null;

  const handleSimulateScan = (assetTag) => {
    const dev = devices.find(d => d.assetTag.toLowerCase() === assetTag.toLowerCase() || d.id === assetTag);
    if (dev) {
      setScannedDevice(dev);
    } else {
      alert(`Asset Tag "${assetTag}" tidak ditemukan di database ITS.`);
    }
  };

  const handleOpenScannedDetail = () => {
    if (scannedDevice) {
      setSelectedDevice(scannedDevice);
      setIsQRScannerOpen(false);
      setIsDeviceDetailOpen(true);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsQRScannerOpen(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Simulator Scanner QR Code Stock Opname</h3>
          <button className="btn-modal-close" onClick={() => setIsQRScannerOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* CAMERA SIMULATION FRAME */}
          <div className="scanner-camera-frame">
            <div className="scanner-laser-line"></div>
            <div className="scanner-overlay-grid">
              <QrCode size={96} className="qr-scanner-icon" />
              <p>Arahkan Barcode / QR Code Asset Tag ke Kamera...</p>
            </div>
          </div>

          {/* SIMULATE SELECTOR */}
          <div className="margin-top">
            <label className="bold-label">Pilih Perangkat untuk Mensimulasikan Scan:</label>
            <div className="scanner-select-wrapper margin-top-sm">
              <select
                className="form-select"
                onChange={(e) => {
                  if (e.target.value) handleSimulateScan(e.target.value);
                }}
              >
                <option value="">-- Scan Asset Tag yang Ada --</option>
                {devices.map(d => (
                  <option key={d.id} value={d.assetTag}>
                    {d.assetTag} - {d.name} ({d.assignedTo})
                  </option>
                ))}
              </select>
            </div>

            <div className="or-divider margin-top margin-bottom">ATAU KETIK ASSET TAG</div>

            <div className="global-search-wrapper">
              <input
                type="text"
                placeholder="Ketik manual Asset Tag (ITS-PC-...)..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSimulateScan(scanInput)}
                className="global-search-input"
              />
              <button className="btn-primary-sm" onClick={() => handleSimulateScan(scanInput)}>
                Scan
              </button>
            </div>
          </div>

          {/* SCANNED RESULT PREVIEW */}
          {scannedDevice && (
            <div className="scanned-result-card margin-top">
              <div className="scanned-header">
                <CheckCircle2 size={24} className="text-success" />
                <div>
                  <h4>Asset Berhasil Ditemukan!</h4>
                  <p className="code-font">{scannedDevice.assetTag}</p>
                </div>
              </div>

              <div className="scanned-body margin-top-sm">
                <div><strong>Perangkat:</strong> {scannedDevice.name}</div>
                <div><strong>Pengguna:</strong> {scannedDevice.assignedTo}</div>
                <div><strong>Lokasi:</strong> {scannedDevice.location}</div>
                <div><strong>Status:</strong> {scannedDevice.status} ({scannedDevice.condition})</div>
              </div>

              <button className="btn-primary full-width margin-top" onClick={handleOpenScannedDetail}>
                <span>Buka Detail & Spesifikasi Perangkat</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsQRScannerOpen(false)}>
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
};
