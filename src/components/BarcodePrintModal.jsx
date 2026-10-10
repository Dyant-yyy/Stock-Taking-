import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Printer, QrCode, Monitor, Building2, User, Globe, Cpu } from 'lucide-react';

export const BarcodePrintModal = () => {
  const {
    isBarcodePrintOpen,
    closeBarcodePrint,
    barcodeDevice
  } = useInventory();

  if (!isBarcodePrintOpen || !barcodeDevice) return null;

  const currentHost = window.location.origin || 'http://localhost:5173';
  const scanUrl = `${currentHost}/?scan=${encodeURIComponent(barcodeDevice.computerName)}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(scanUrl)}&color=00255b`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={closeBarcodePrint}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-icon">
              <Printer size={20} className="icon-toray" />
            </div>
            <div>
              <h3>Label Stiker Barcode & QR Asset</h3>
              <p className="modal-sub-text">PT. Indonesia Toray Synthetics - Asset Tagging</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={closeBarcodePrint}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body text-center">
          <p className="text-sm text-muted mb-4">
            Stiker ini ditempel pada unit casing komputer / laptop fisik. Scan dengan smartphone atau barcode gun untuk langsung memverifikasi statusnya di web.
          </p>

          {/* PHYSICAL STICKER PREVIEW CARD */}
          <div className="physical-barcode-sticker" id="printable-sticker">
            {/* STICKER TOP HEADER */}
            <div className="sticker-header">
              <div className="sticker-toray-badge">PT. INDONESIA TORAY SYNTHETICS</div>
              <div className="sticker-plant">TANGERANG PLANT</div>
            </div>

            {/* STICKER BODY */}
            <div className="sticker-body">
              <div className="sticker-qr-box">
                <img
                  src={qrImageUrl}
                  alt={`QR Code ${barcodeDevice.computerName}`}
                  className="sticker-qr-image"
                />
                <span className="sticker-scan-hint">SCAN STATUS</span>
              </div>

              <div className="sticker-info-box">
                <div className="sticker-comp-name">{barcodeDevice.computerName}</div>
                <div className="sticker-meta-row">
                  <span className="sticker-lbl">DEPT:</span>
                  <span className="sticker-val font-bold">[{barcodeDevice.department}]</span>
                </div>
                <div className="sticker-meta-row">
                  <span className="sticker-lbl">IP:</span>
                  <span className="sticker-val code-font">{barcodeDevice.ipAddress || '-'}</span>
                </div>
                <div className="sticker-meta-row">
                  <span className="sticker-lbl">TYPE:</span>
                  <span className="sticker-val">{barcodeDevice.type}</span>
                </div>
                <div className="sticker-meta-row">
                  <span className="sticker-lbl">USER:</span>
                  <span className="sticker-val">{barcodeDevice.user}</span>
                </div>
              </div>
            </div>

            {/* BARCODE VISUAL BARS (CODE 128 SIMULATION) */}
            <div className="sticker-barcode-bars">
              <div className="barcode-lines-svg">
                <div className="barcode-line w-2"></div>
                <div className="barcode-line w-1"></div>
                <div className="barcode-line w-3"></div>
                <div className="barcode-line w-1"></div>
                <div className="barcode-line w-2"></div>
                <div className="barcode-line w-4"></div>
                <div className="barcode-line w-1"></div>
                <div className="barcode-line w-2"></div>
                <div className="barcode-line w-3"></div>
                <div className="barcode-line w-1"></div>
                <div className="barcode-line w-2"></div>
                <div className="barcode-line w-1"></div>
                <div className="barcode-line w-3"></div>
                <div className="barcode-line w-2"></div>
                <div className="barcode-line w-1"></div>
                <div className="barcode-line w-4"></div>
                <div className="barcode-line w-2"></div>
                <div className="barcode-line w-1"></div>
                <div className="barcode-line w-3"></div>
                <div className="barcode-line w-1"></div>
                <div className="barcode-line w-2"></div>
              </div>
              <div className="barcode-digits-text">{barcodeDevice.computerName}</div>
            </div>

            <div className="sticker-footer-note">
              PROPERTY OF PT. INDONESIA TORAY SYNTHETICS - DO NOT REMOVE
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={closeBarcodePrint}>
            Tutup
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Cetak Stiker Label Barcode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
