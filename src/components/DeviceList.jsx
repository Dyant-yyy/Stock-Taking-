import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Search,
  Filter,
  Plus,
  QrCode,
  Printer,
  FileSpreadsheet,
  Edit2,
  Trash2,
  Eye,
  Grid,
  List as ListIcon,
  CheckCircle,
  Clock,
  Wrench,
  AlertCircle,
  Cpu,
  Server,
  Monitor,
  Wifi,
  Tablet,
  Building2
} from 'lucide-react';

export const DeviceList = () => {
  const {
    devices,
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedDeptFilter,
    setSelectedDeptFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    departments,
    setSelectedDevice,
    setIsDeviceDetailOpen,
    setIsDeviceFormOpen,
    setEditingDevice,
    deleteDevice,
    setIsQRScannerOpen,
    setIsPrintModalOpen
  } = useInventory();

  const [viewStyle, setViewStyle] = useState('table'); // 'table' | 'grid'

  const categories = [
    'All',
    'Server',
    'Industrial PC',
    'Laptop',
    'Desktop PC',
    'Printer & Scanner',
    'Network Equipment',
    'Mobile & Handheld'
  ];

  const statuses = ['All', 'In Use', 'Available', 'Maintenance', 'Decommissioned'];

  // Filtering Logic
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      searchQuery === '' ||
      device.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.specs?.ipAddress && device.specs.ipAddress.includes(searchQuery));

    const matchesCategory = selectedCategoryFilter === 'All' || device.category === selectedCategoryFilter;
    const matchesDept = selectedDeptFilter === 'All' || device.departmentId === selectedDeptFilter;
    const matchesStatus = selectedStatusFilter === 'All' || device.status === selectedStatusFilter;

    return matchesSearch && matchesCategory && matchesDept && matchesStatus;
  });

  const handleEdit = (device, e) => {
    e.stopPropagation();
    setEditingDevice(device);
    setIsDeviceFormOpen(true);
  };

  const handleDelete = (id, assetTag, e) => {
    e.stopPropagation();
    if (window.confirm(`Apakah Anda yakin ingin menghapus / meng-afkir perangkat ${assetTag}?`)) {
      deleteDevice(id);
    }
  };

  const handleViewDetail = (device) => {
    setSelectedDevice(device);
    setIsDeviceDetailOpen(true);
  };

  const exportToCSV = () => {
    const headers = ["Asset Tag", "Nama Perangkat", "Kategori", "Merk/Model", "Serial Number", "Departemen", "Lokasi", "Pengguna", "Status", "Kondisi", "Garansi Berakhir"];
    const rows = filteredDevices.map(d => [
      d.assetTag,
      `"${d.name.replace(/"/g, '""')}"`,
      d.category,
      `"${d.brand} ${d.model}"`,
      d.serialNumber,
      d.departmentId,
      `"${d.location}"`,
      `"${d.assignedTo}"`,
      d.status,
      d.condition,
      d.warrantyExpiry
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Katalog_ITS_Device_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="device-list-view">
      {/* HEADER & TOP CONTROLS */}
      <div className="view-header">
        <div>
          <h2>Katalog & Manajemen Perangkat IT</h2>
          <p className="sub-header-text">
            {filteredDevices.length} Perangkat ditemukan dari total {devices.length} asset terdaftar di ITS Tangerang.
          </p>
        </div>
        <div className="view-header-actions">
          <div className="view-style-toggle">
            <button
              className={`toggle-btn ${viewStyle === 'table' ? 'active' : ''}`}
              onClick={() => setViewStyle('table')}
              title="Tampilan Tabel Data"
            >
              <ListIcon size={16} />
            </button>
            <button
              className={`toggle-btn ${viewStyle === 'grid' ? 'active' : ''}`}
              onClick={() => setViewStyle('grid')}
              title="Tampilan Grid Kartu"
            >
              <Grid size={16} />
            </button>
          </div>

          <button className="btn-secondary" onClick={exportToCSV}>
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>

          <button className="btn-secondary" onClick={() => setIsPrintModalOpen(true)}>
            <Printer size={16} />
            <span>Cetak Tag Asset</span>
          </button>

          <button className="btn-primary" onClick={() => { setEditingDevice(null); setIsDeviceFormOpen(true); }}>
            <Plus size={16} />
            <span>+ Asset Baru</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="filter-group">
          <label><Filter size={14} /> Kategori:</label>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label><Building2 size={14} /> Departemen:</label>
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">Semua Departemen</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label><CheckCircle size={14} /> Status:</label>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statuses.map((st, i) => (
              <option key={i} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {(selectedCategoryFilter !== 'All' || selectedDeptFilter !== 'All' || selectedStatusFilter !== 'All' || searchQuery !== '') && (
          <button
            className="btn-reset-filters"
            onClick={() => {
              setSelectedCategoryFilter('All');
              setSelectedDeptFilter('All');
              setSelectedStatusFilter('All');
              setSearchQuery('');
            }}
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* DEVICE CONTENT AREA */}
      {filteredDevices.length === 0 ? (
        <div className="empty-state-card">
          <Cpu size={48} className="text-muted" />
          <h3>Tidak ada perangkat yang sesuai filter</h3>
          <p>Coba sesuaikan kata kunci pencarian atau reset filter di atas.</p>
        </div>
      ) : viewStyle === 'table' ? (
        /* TABLE VIEW */
        <div className="table-responsive">
          <table className="device-table">
            <thead>
              <tr>
                <th>Asset Tag ID</th>
                <th>Nama Perangkat</th>
                <th>Kategori</th>
                <th>Merk & Model</th>
                <th>Departemen & Lokasi</th>
                <th>Pengguna</th>
                <th>Status</th>
                <th>Kondisi</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => {
                const deptObj = departments.find(d => d.id === device.departmentId);
                return (
                  <tr key={device.id} onClick={() => handleViewDetail(device)} className="clickable-row">
                    <td>
                      <div className="asset-tag-badge">
                        <QrCode size={14} />
                        <span>{device.assetTag}</span>
                      </div>
                    </td>
                    <td>
                      <div className="device-name-cell">
                        <strong>{device.name}</strong>
                        <span className="sn-text">S/N: {device.serialNumber}</span>
                      </div>
                    </td>
                    <td><span className="cat-pill">{device.category}</span></td>
                    <td>{device.brand} {device.model}</td>
                    <td>
                      <div className="loc-cell">
                        <span className="dept-pill">{deptObj ? deptObj.code : device.departmentId}</span>
                        <span className="loc-text">{device.location}</span>
                      </div>
                    </td>
                    <td>{device.assignedTo}</td>
                    <td>
                      <span className={`status-badge status-${device.status.toLowerCase().replace(' ', '-')}`}>
                        {device.status}
                      </span>
                    </td>
                    <td>
                      <span className={`condition-pill cond-${device.condition.toLowerCase().replace(' ', '-')}`}>
                        {device.condition}
                      </span>
                    </td>
                    <td className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons-cell">
                        <button
                          className="btn-icon-action"
                          onClick={() => handleViewDetail(device)}
                          title="Lihat Detail & Spesifikasi"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon-action"
                          onClick={(e) => handleEdit(device, e)}
                          title="Edit Perangkat"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon-action danger"
                          onClick={(e) => handleDelete(device.id, device.assetTag, e)}
                          title="Hapus Perangkat"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID CARD VIEW */
        <div className="device-cards-grid">
          {filteredDevices.map((device) => {
            const deptObj = departments.find(d => d.id === device.departmentId);
            return (
              <div key={device.id} className="device-card-item" onClick={() => handleViewDetail(device)}>
                <div className="card-top">
                  <span className="asset-tag-badge">
                    <QrCode size={14} />
                    {device.assetTag}
                  </span>
                  <span className={`status-badge status-${device.status.toLowerCase().replace(' ', '-')}`}>
                    {device.status}
                  </span>
                </div>

                <h3 className="device-card-title">{device.name}</h3>
                <div className="device-card-sub">{device.brand} {device.model}</div>

                <div className="specs-quick-list">
                  <div><strong>CPU:</strong> {device.specs?.cpu || '-'}</div>
                  <div><strong>RAM:</strong> {device.specs?.ram || '-'}</div>
                  <div><strong>Storage:</strong> {device.specs?.storage || '-'}</div>
                  <div><strong>IP:</strong> {device.specs?.ipAddress || '-'}</div>
                </div>

                <div className="card-info-footer">
                  <div>
                    <div className="info-lbl">Pengguna & Unit</div>
                    <div className="info-val">{device.assignedTo} ({deptObj?.code})</div>
                  </div>
                  <div>
                    <div className="info-lbl">Lokasi</div>
                    <div className="info-val">{device.location}</div>
                  </div>
                </div>

                <div className="card-actions-bar" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-card-action" onClick={() => handleViewDetail(device)}>
                    <Eye size={14} /> Detail
                  </button>
                  <button className="btn-card-action" onClick={(e) => handleEdit(device, e)}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button className="btn-card-action danger" onClick={(e) => handleDelete(device.id, device.assetTag, e)}>
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
