import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Monitor,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  RotateCcw,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Cpu,
  Building2,
  User,
  ArrowUpDown,
  Laptop,
  Server,
  Zap,
  Activity,
  QrCode,
  Wifi,
  LayoutGrid,
  LayoutList,
  Smartphone
} from 'lucide-react';

export const Dashboard = () => {
  const [viewMode, setViewMode] = React.useState('auto'); // 'auto' | 'cards' | 'table'

  const {
    devices = [],
    departments = [],
    statusOptions = [],
    typeOptions = [],
    searchQuery,
    setSearchQuery,
    filterDept,
    setFilterDept,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    openAddModal,
    openEditModal,
    openScannerModal,
    openBarcodePrint,
    updateDeviceStatus,
    deleteDevice,
    resetToSeedData
  } = useInventory();

  // Status Metrics Counting
  const totalCount = devices.length;
  const onlineCount = devices.filter(d => d.status === 'Online').length;
  const inCount = devices.filter(d => d.status === 'In').length;
  const outCount = devices.filter(d => d.status === 'Out').length;
  const notUsedCount = devices.filter(d => d.status === 'Not Used').length;
  const brokenCount = devices.filter(d => d.status === 'Broken').length;
  const disposalCount = devices.filter(d => d.status === 'Disposal').length;

  // Filter Logic
  const filteredDevices = devices.filter((dev) => {
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch =
      query === '' ||
      (dev.computerName || '').toLowerCase().includes(query) ||
      (dev.ipAddress || '').toLowerCase().includes(query) ||
      (dev.user || '').toLowerCase().includes(query) ||
      (dev.department || '').toLowerCase().includes(query) ||
      (dev.type || '').toLowerCase().includes(query) ||
      (dev.remark || '').toLowerCase().includes(query);

    const matchesDept = filterDept === 'All' || dev.department === filterDept;
    const matchesStatus = filterStatus === 'All' || dev.status === filterStatus;
    const matchesType = filterType === 'All' || dev.type === filterType;

    return matchesSearch && matchesDept && matchesStatus && matchesType;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["No", "Departemen / Section", "Computer Name", "IP Address", "Type", "User", "Status", "Remark / Keterangan"];
    const rows = filteredDevices.map((d, index) => [
      index + 1,
      d.department || '',
      d.computerName || '',
      d.ipAddress || '',
      d.type || '',
      `"${(d.user || '').replace(/"/g, '""')}"`,
      d.status || '',
      `"${(d.remark || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ITS_Device_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Online': return 'badge-online';
      case 'In': return 'badge-in';
      case 'Out': return 'badge-out';
      case 'Not Used': return 'badge-not-used';
      case 'Broken': return 'badge-broken';
      case 'Disposal': return 'badge-disposal';
      default: return 'badge-default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Laptop': return <Laptop size={14} className="text-cyan" />;
      case 'Server': return <Server size={14} className="text-purple" />;
      case 'Industrial PC': return <Zap size={14} className="text-amber" />;
      default: return <Monitor size={14} className="text-blue" />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* TOP HEADER TITLE */}
      <div className="dashboard-title-bar">
        <div>
          <h2>Tabel Inventaris Komputer & Device IT</h2>
          <p className="sub-title-text">
            PT. Indonesia Toray Synthetics (ITS) Tangerang Plant • Monitoring Status Perangkat per Departemen
          </p>
        </div>

        <div className="title-actions">
          <button className="btn-secondary scan-btn" onClick={() => openScannerModal()}>
            <QrCode size={16} className="text-cyan" />
            <span>Scan Barcode / QR</span>
          </button>
          <button className="btn-secondary" onClick={handleExportCSV}>
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
          <button className="btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>+ Tambah Komputer</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS BAR: ONLINE, IN, OUT, NOT USED, BROKEN, DISPOSAL */}
      <div className="kpi-status-bar">
        <div
          className={`kpi-status-item total ${filterStatus === 'All' ? 'active' : ''}`}
          onClick={() => setFilterStatus('All')}
          title="Klik untuk tampilkan semua status"
        >
          <span className="kpi-label">Total Unit</span>
          <span className="kpi-num">{totalCount}</span>
        </div>

        <div
          className={`kpi-status-item online ${filterStatus === 'Online' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Online' ? 'All' : 'Online')}
          title="Klik untuk filter Online"
        >
          <div className="kpi-label-row">
            <span className="live-pulse"></span>
            <span className="kpi-label">1. Online</span>
          </div>
          <span className="kpi-num text-emerald">{onlineCount}</span>
        </div>

        <div
          className={`kpi-status-item in ${filterStatus === 'In' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'In' ? 'All' : 'In')}
          title="Klik untuk filter In"
        >
          <span className="kpi-label">2. In</span>
          <span className="kpi-num text-cyan">{inCount}</span>
        </div>

        <div
          className={`kpi-status-item out ${filterStatus === 'Out' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Out' ? 'All' : 'Out')}
          title="Klik untuk filter Out"
        >
          <span className="kpi-label">3. Out</span>
          <span className="kpi-num text-amber">{outCount}</span>
        </div>

        <div
          className={`kpi-status-item not-used ${filterStatus === 'Not Used' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Not Used' ? 'All' : 'Not Used')}
          title="Klik untuk filter Not Used"
        >
          <span className="kpi-label">4. Not Used</span>
          <span className="kpi-num text-muted">{notUsedCount}</span>
        </div>

        <div
          className={`kpi-status-item broken ${filterStatus === 'Broken' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Broken' ? 'All' : 'Broken')}
          title="Klik untuk filter Broken"
        >
          <span className="kpi-label">5. Broken</span>
          <span className="kpi-num text-rose">{brokenCount}</span>
        </div>

        <div
          className={`kpi-status-item disposal ${filterStatus === 'Disposal' ? 'active' : ''}`}
          onClick={() => setFilterStatus(filterStatus === 'Disposal' ? 'All' : 'Disposal')}
          title="Klik untuk filter Disposal"
        >
          <span className="kpi-label">6. Disposal</span>
          <span className="kpi-num text-purple">{disposalCount}</span>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="table-controls-bar">
        <div className="search-box-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Cari Computer Name, IP Address, User, Departemen, atau Remark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input-field"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="filter-selects-group">
          <div className="select-wrapper">
            <Building2 size={14} className="select-icon" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="control-select"
            >
              <option value="All">Semua Departemen ({departments.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.code}>
                  [{d.code}] {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <Activity size={14} className="select-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="control-select"
            >
              <option value="All">Semua Status (6)</option>
              {statusOptions.map((st) => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <Monitor size={14} className="select-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="control-select"
            >
              <option value="All">Semua Type</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {(filterDept !== 'All' || filterStatus !== 'All' || filterType !== 'All' || searchQuery !== '') && (
            <button
              className="btn-reset-filters"
              onClick={() => {
                setFilterDept('All');
                setFilterStatus('All');
                setFilterType('All');
                setSearchQuery('');
              }}
              title="Reset semua filter ke default"
            >
              Reset
            </button>
          )}

          <button
            className="btn-icon-secondary"
            onClick={() => {
              if (window.confirm('Reset data tabel kembali ke data awal bawaan ITS?')) {
                resetToSeedData();
              }
            }}
            title="Reset ke data awal"
          >
            <RotateCcw size={16} />
          </button>

          {/* VIEW MODE TOGGLE (TABEL / KARTU MOBILE) */}
          <div className="view-mode-toggle-group">
            <button
              type="button"
              className={`btn-view-toggle ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode(viewMode === 'table' ? 'auto' : 'table')}
              title="Paksa Tampilan Tabel"
            >
              <LayoutList size={14} />
              <span className="toggle-text">Tabel</span>
            </button>
            <button
              type="button"
              className={`btn-view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode(viewMode === 'cards' ? 'auto' : 'cards')}
              title="Tampilan Kartu Mobile"
            >
              <Smartphone size={14} />
              <span className="toggle-text">Mobile Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN INVENTORY CONTAINER (DESKTOP TABLE & MOBILE CARDS) */}
      <div className="table-wrapper-card">
        {/* 1. DESKTOP TABLE VIEW */}
        <div className={`desktop-table-container ${viewMode === 'cards' ? 'is-hidden' : ''} ${viewMode === 'table' ? 'is-forced' : ''}`}>
          <div className="table-responsive">
            <table className="client-inventory-table">
              <thead>
                <tr>
                  <th className="col-no">No</th>
                  <th className="col-dept">Departemen / Section</th>
                  <th className="col-comp">Computer Name</th>
                  <th className="col-type">Type</th>
                  <th className="col-user">User</th>
                  <th className="col-status">Status</th>
                  <th className="col-remark">Remark / Keterangan</th>
                  <th className="col-action text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-table-cell">
                      <Monitor size={36} className="text-muted mb-2" />
                      <p className="font-semibold">Tidak ada komputer yang sesuai dengan filter.</p>
                      <button
                        className="btn-secondary-sm margin-top-sm"
                        onClick={() => {
                          setFilterDept('All');
                          setFilterStatus('All');
                          setFilterType('All');
                          setSearchQuery('');
                        }}
                      >
                        Reset Semua Filter
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map((device, index) => {
                    return (
                      <tr key={device.id} className="table-data-row">
                        {/* 1. No */}
                        <td className="col-no text-muted font-mono">{index + 1}</td>

                        {/* 2. Departemen / Section */}
                        <td className="col-dept">
                          <span className={`dept-pill-badge dept-${device.department.toLowerCase()}`}>
                            {device.department}
                          </span>
                        </td>

                        {/* 3. Computer Name & IP Address */}
                        <td className="col-comp">
                          <div className="comp-name-wrapper">
                            <span className="comp-name-text">{device.computerName}</span>
                            {device.ipAddress ? (
                              <span className="comp-ip-badge" title="IP Address Jaringan ITS">
                                <Wifi size={11} className="ip-icon" />
                                <span>{device.ipAddress}</span>
                              </span>
                            ) : (
                              <span className="comp-ip-badge none" title="Belum ada IP Address">
                                <span>No IP</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. Type */}
                        <td className="col-type">
                          <div className="type-badge-row">
                            {getTypeIcon(device.type)}
                            <span>{device.type}</span>
                          </div>
                        </td>

                        {/* 5. User */}
                        <td className="col-user">
                          <div className="user-text-row">
                            <User size={13} className="text-muted" />
                            <strong>{device.user}</strong>
                          </div>
                        </td>

                        {/* 6. Status (Online, In, Out, Not Used, Broken, Disposal) */}
                        <td className="col-status">
                          <div className="status-select-container">
                            <select
                              value={device.status}
                              onChange={(e) => updateDeviceStatus(device.id, e.target.value)}
                              className={`status-inline-select ${getStatusBadgeClass(device.status)}`}
                            >
                              {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* 7. Remark / Keterangan */}
                        <td className="col-remark">
                          <span className="remark-text" title={device.remark}>
                            {device.remark || '-'}
                          </span>
                        </td>

                        {/* 8. Aksi */}
                        <td className="col-action text-right">
                          <div className="action-btns-row">
                            <button
                              className="btn-row-action barcode"
                              onClick={() => openBarcodePrint(device)}
                              title="Cetak & Lihat Label Barcode / QR Komputer ini"
                            >
                              <QrCode size={14} />
                            </button>
                            <button
                              className="btn-row-action edit"
                              onClick={() => openEditModal(device)}
                              title="Edit data komputer ini"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="btn-row-action delete"
                              onClick={() => {
                                if (window.confirm(`Hapus komputer [${device.computerName}] dari daftar?`)) {
                                  deleteDevice(device.id);
                                }
                              }}
                              title="Hapus komputer ini"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. MOBILE TOUCH CARDS VIEW */}
        <div className={`mobile-cards-container ${viewMode === 'table' ? 'is-hidden' : ''} ${viewMode === 'cards' ? 'is-forced' : ''}`}>
          {filteredDevices.length === 0 ? (
            <div className="empty-cards-box">
              <Monitor size={36} className="text-muted mb-2" />
              <p className="font-semibold text-white">Tidak ada komputer yang sesuai dengan filter.</p>
              <button
                className="btn-secondary-sm margin-top-sm"
                onClick={() => {
                  setFilterDept('All');
                  setFilterStatus('All');
                  setFilterType('All');
                  setSearchQuery('');
                }}
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="mobile-cards-grid">
              {filteredDevices.map((device, index) => (
                <div key={device.id} className="mobile-device-card">
                  {/* CARD TOP HEADER */}
                  <div className="card-top-header">
                    <div className="card-comp-info">
                      <div className="card-type-avatar">
                        {getTypeIcon(device.type)}
                      </div>
                      <div className="card-name-group">
                        <span className="card-comp-name">{device.computerName}</span>
                        {device.ipAddress ? (
                          <span className="comp-ip-badge">
                            <Wifi size={10} className="ip-icon" />
                            <span>{device.ipAddress}</span>
                          </span>
                        ) : (
                          <span className="comp-ip-badge none">No IP</span>
                        )}
                      </div>
                    </div>

                    <div className="card-dept-badge-group">
                      <span className="card-seq-num font-mono">#{index + 1}</span>
                      <span className={`dept-pill-badge dept-${device.department.toLowerCase()}`}>
                        {device.department}
                      </span>
                    </div>
                  </div>

                  {/* CARD SPECS MATRIX */}
                  <div className="card-specs-body">
                    <div className="card-spec-row">
                      <span className="spec-lbl">User:</span>
                      <span className="spec-val font-bold">
                        <User size={12} className="inline-icon text-muted" />
                        {device.user}
                      </span>
                    </div>
                    <div className="card-spec-row">
                      <span className="spec-lbl">Tipe Unit:</span>
                      <span className="spec-val text-slate-300">{device.type}</span>
                    </div>
                    {device.remark && (
                      <div className="card-spec-row full">
                        <span className="spec-lbl">Remark:</span>
                        <span className="spec-val text-muted text-xs">{device.remark}</span>
                      </div>
                    )}
                  </div>

                  {/* CARD STATUS & QUICK ACTION CONTROLS */}
                  <div className="card-footer-controls">
                    <div className="card-status-control">
                      <span className="status-ctrl-lbl">Status:</span>
                      <select
                        value={device.status}
                        onChange={(e) => updateDeviceStatus(device.id, e.target.value)}
                        className={`status-inline-select mobile ${getStatusBadgeClass(device.status)}`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="card-action-buttons">
                      <button
                        type="button"
                        className="btn-card-action barcode"
                        onClick={() => openBarcodePrint(device)}
                        title="Cetak Barcode / QR Label"
                      >
                        <QrCode size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-card-action edit"
                        onClick={() => openEditModal(device)}
                        title="Edit Data Komputer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-card-action delete"
                        onClick={() => {
                          if (window.confirm(`Hapus [${device.computerName}] dari daftar?`)) {
                            deleteDevice(device.id);
                          }
                        }}
                        title="Hapus Komputer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TABLE FOOTER SUMMARY */}
        <div className="table-footer-bar">
          <div className="text-muted text-sm">
            Menampilkan <strong>{filteredDevices.length}</strong> dari total <strong>{devices.length}</strong> komputer terdaftar di sistem.
          </div>
          <div className="text-muted text-xs">
            PT. Indonesia Toray Synthetics • Device Master Management
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING ACTION BAR (FAB) */}
      <div className="mobile-floating-bar">
        <button
          type="button"
          className="mobile-fab-btn scan"
          onClick={() => openScannerModal()}
          title="Scan Barcode / QR dengan Kamera HP"
        >
          <QrCode size={18} />
          <span>Scan Barcode</span>
        </button>
        <button
          type="button"
          className="mobile-fab-btn add"
          onClick={openAddModal}
          title="Tambah Komputer Baru"
        >
          <Plus size={18} />
          <span>+ Tambah</span>
        </button>
      </div>
    </div>
  );
};
