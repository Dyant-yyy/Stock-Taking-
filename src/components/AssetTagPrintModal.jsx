import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Printer, QrCode, Cpu } from 'lucide-react';

export const AssetTagPrintModal = () => {
  const {
    isPrintModalOpen,
    setIsPrintModalOpen,
    devices,
    selectedDevice
  } = useInventory();

  if (!isPrintModalOpen) return null;

  const printDevices = selectedDevice ? [selectedDevice] : devices.slice(0, 8);

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsPrintModalOpen(false)}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Cetak Label Asset Tag & QR Code</h3>
          <button className="btn-modal-close" onClick={() => setIsPrintModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="margin-bottom">
            Label stiker siap dicetak dengan printer thermal / standar. Menampilkan QR Code dan data identifikasi resmi PT. Indonesia Toray Synthetics.
          </p>

          <div className="print-stickers-grid">
            {printDevices.map((device) => (
              <div key={device.id} className="asset-sticker-card">
                <div className="sticker-header">
                  <Cpu size={14} className="icon-toray-sm" />
                  <span>PT. INDONESIA TORAY SYNTHETICS</span>
                </div>
                <div className="sticker-body">
                  <div className="sticker-qr-box">
                    <QrCode size={54} />
                  </div>
                  <div className="sticker-info">
                    <div className="sticker-tag">{device.assetTag}</div>
                    <div className="sticker-name">{device.name}</div>
                    <div className="sticker-sn">S/N: {device.serialNumber}</div>
                    <div className="sticker-loc">Loc: {device.location}</div>
                  </div>
                </div>
                <div className="sticker-footer">PROPERTY OF PT. INDONESIA TORAY SYNTHETICS • DO NOT REMOVE</div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsPrintModalOpen(false)}>Batal</button>
          <button className="btn-primary" onClick={handleTriggerPrint}>
            <Printer size={16} />
            <span>Cetak Stiker Label Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
