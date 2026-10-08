import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Clock,
  Plus,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  User,
  Building2,
  Calendar,
  FileText,
  X
} from 'lucide-react';

export const CheckoutManagement = () => {
  const {
    checkouts,
    devices,
    departments,
    employees,
    checkoutDevice,
    returnDevice,
    setIsCheckoutModalOpen,
    isCheckoutModalOpen
  } = useInventory();

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Active' | 'Returned'
  const [selectedReturnId, setSelectedReturnId] = useState(null);
  const [returnCondition, setReturnCondition] = useState('Good');
  const [returnNotes, setReturnNotes] = useState('');

  // Form State for New Borrowing
  const [newBorrowForm, setNewBorrowForm] = useState({
    deviceId: '',
    borrowerName: '',
    department: 'IT & System Automation',
    purpose: 'Dinas Ke Pabrik / Audit',
    expectedReturnDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    notes: 'Diserahkan beserta tas & adapter charger.'
  });

  const filteredCheckouts = checkouts.filter(c => {
    if (activeFilter === 'Active') return c.status === 'Active';
    if (activeFilter === 'Returned') return c.status === 'Returned';
    return true;
  });

  const availableDevices = devices.filter(d => d.status === 'Available' || d.category === 'Laptop' || d.category === 'Mobile & Handheld');

  const handleOpenBorrowModal = () => {
    if (availableDevices.length > 0) {
      setNewBorrowForm(prev => ({
        ...prev,
        deviceId: availableDevices[0].id
      }));
    }
    setIsCheckoutModalOpen(true);
  };

  const handleCreateBorrowSubmit = (e) => {
    e.preventDefault();
    const targetDev = devices.find(d => d.id === newBorrowForm.deviceId);
    if (!targetDev) return;

    checkoutDevice({
      deviceId: targetDev.id,
      assetTag: targetDev.assetTag,
      deviceName: targetDev.name,
      borrowerName: newBorrowForm.borrowerName,
      department: newBorrowForm.department,
      purpose: newBorrowForm.purpose,
      expectedReturnDate: newBorrowForm.expectedReturnDate,
      conditionOnCheckout: targetDev.condition,
      notes: newBorrowForm.notes
    });

    setIsCheckoutModalOpen(false);
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (selectedReturnId) {
      returnDevice(selectedReturnId, returnCondition, returnNotes);
      setSelectedReturnId(null);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="checkout-view">
      <div className="view-header">
        <div>
          <h2>Peminjaman & Form Serah Terima Device</h2>
          <p className="sub-header-text">
            Pencatatan peminjaman perangkat luar kantor, perjalanan dinas, dan inventarisir temporary ITS.
          </p>
        </div>
        <div className="view-header-actions">
          <button className="btn-primary" onClick={handleOpenBorrowModal}>
            <Plus size={16} />
            <span>+ Buat Peminjaman / Serah Terima</span>
          </button>
        </div>
      </div>

      {/* TABS FILTER */}
      <div className="filter-bar">
        <div className="filter-tabs">
          <button
            className={`tab-btn ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            Semua Peminjaman ({checkouts.length})
          </button>
          <button
            className={`tab-btn ${activeFilter === 'Active' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Active')}
          >
            Aktif Dipinjam ({checkouts.filter(c => c.status === 'Active').length})
          </button>
          <button
            className={`tab-btn ${activeFilter === 'Returned' ? 'active' : ''}`}
            onClick={() => setActiveFilter('Returned')}
          >
            Sudah Dikembalikan ({checkouts.filter(c => c.status === 'Returned').length})
          </button>
        </div>
      </div>

      {/* CHECKOUT LIST TABLE */}
      <div className="table-responsive">
        <table className="device-table">
          <thead>
            <tr>
              <th>Perangkat / Asset Tag</th>
              <th>Peminjam (Pegawai)</th>
              <th>Unit / Departemen</th>
              <th>Keperluan / Tujuan</th>
              <th>Tgl Pinjam</th>
              <th>Rencana Kembali</th>
              <th>Status</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCheckouts.map((chk) => {
              const isOverdue = chk.status === 'Active' && chk.expectedReturnDate < todayStr;
              return (
                <tr key={chk.id}>
                  <td>
                    <div>
                      <strong>{chk.deviceName}</strong>
                      <div className="code-font text-muted">{chk.assetTag}</div>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <User size={14} />
                      <span>{chk.borrowerName}</span>
                    </div>
                  </td>
                  <td>{chk.department}</td>
                  <td>{chk.purpose}</td>
                  <td>{chk.checkoutDate}</td>
                  <td>
                    <div className="return-date-cell">
                      <span>{chk.expectedReturnDate}</span>
                      {isOverdue && (
                        <span className="overdue-badge">
                          <AlertTriangle size={12} /> OVERDUE
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${chk.status === 'Active' ? 'status-in-use' : 'status-available'}`}>
                      {chk.status === 'Active' ? 'Dipinjam' : 'Dikembalikan'}
                    </span>
                  </td>
                  <td className="text-right">
                    {chk.status === 'Active' ? (
                      <button
                        className="btn-secondary-sm"
                        onClick={() => {
                          setSelectedReturnId(chk.id);
                          setReturnNotes('');
                        }}
                      >
                        <RotateCcw size={14} /> Process Return
                      </button>
                    ) : (
                      <span className="text-muted text-sm">Dikembalikan {chk.actualReturnDate}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL: BUAT PEMINJAMAN BARU */}
      {isCheckoutModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCheckoutModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Form Serah Terima & Peminjaman Perangkat</h3>
              <button className="btn-modal-close" onClick={() => setIsCheckoutModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateBorrowSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Pilih Perangkat Terdaftar *:</label>
                  <select
                    required
                    value={newBorrowForm.deviceId}
                    onChange={(e) => setNewBorrowForm(prev => ({ ...prev, deviceId: e.target.value }))}
                    className="form-select"
                  >
                    {devices.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.assetTag} - {d.name} ({d.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group margin-top">
                  <label>Nama Peminjam / Pegawai ITS *:</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Pegawai"
                    value={newBorrowForm.borrowerName}
                    onChange={(e) => setNewBorrowForm(prev => ({ ...prev, borrowerName: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group margin-top">
                  <label>Departemen Peminjam *:</label>
                  <select
                    value={newBorrowForm.department}
                    onChange={(e) => setNewBorrowForm(prev => ({ ...prev, department: e.target.value }))}
                    className="form-select"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group margin-top">
                  <label>Tujuan & Keperluan Peminjaman *:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Perjalanan dinas audit Toray Jakarta / Stock Opname"
                    value={newBorrowForm.purpose}
                    onChange={(e) => setNewBorrowForm(prev => ({ ...prev, purpose: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group margin-top">
                  <label>Rencana Tanggal Pengembalian *:</label>
                  <input
                    type="date"
                    required
                    value={newBorrowForm.expectedReturnDate}
                    onChange={(e) => setNewBorrowForm(prev => ({ ...prev, expectedReturnDate: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group margin-top">
                  <label>Catatan Kelengkapan (Kabel / Bag / Charger):</label>
                  <textarea
                    rows={2}
                    value={newBorrowForm.notes}
                    onChange={(e) => setNewBorrowForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="form-textarea"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsCheckoutModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary">Konfirmasi Serah Terima</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROSES PENGEMBALIAN */}
      {selectedReturnId && (
        <div className="modal-backdrop" onClick={() => setSelectedReturnId(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Form Pengembalian Perangkat</h3>
              <button className="btn-modal-close" onClick={() => setSelectedReturnId(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleReturnSubmit}>
              <div className="modal-body">
                <p className="margin-bottom">Pastikan kelengkapan fisik perangkat dan fungsi telah diperiksa oleh tim IT.</p>

                <div className="form-group">
                  <label>Kondisi Saat Dikembalikan *:</label>
                  <select
                    value={returnCondition}
                    onChange={(e) => setReturnCondition(e.target.value)}
                    className="form-select"
                  >
                    <option value="Good">Good (Bagus / Normal)</option>
                    <option value="Like New">Like New (Sangat Baik)</option>
                    <option value="Fair">Fair (Ada Baret/Normal)</option>
                    <option value="Under Repair">Under Repair (Perlu Perbaikan)</option>
                  </select>
                </div>

                <div className="form-group margin-top">
                  <label>Catatan Pengembalian:</label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Perangkat kembali lengkap charger & fisik mulus."
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    className="form-textarea"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setSelectedReturnId(null)}>Batal</button>
                <button type="submit" className="btn-primary">Proses Kembali ke Stok</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
