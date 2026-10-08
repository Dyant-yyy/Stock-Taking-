import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { History, Filter, User, ShieldCheck } from 'lucide-react';

export const AuditLogView = () => {
  const { logs } = useInventory();
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredLogs = logs.filter(l => {
    if (categoryFilter === 'All') return true;
    return l.category === categoryFilter;
  });

  return (
    <div className="audit-view">
      <div className="view-header">
        <div>
          <h2>Audit Trail & Rekam Jejak Aktivitas</h2>
          <p className="sub-header-text">
            Log aktivitas transaksional perubahan perangkat, peminjaman, perbaikan, dan stok barang.
          </p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label><Filter size={14} /> Filter Kategori Aktivitas:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">Semua Log ({logs.length})</option>
            <option value="Device">Perangkat (Device)</option>
            <option value="Checkout">Peminjaman (Checkout)</option>
            <option value="Maintenance">Perbaikan (Maintenance)</option>
            <option value="Spare Parts">Spare Parts</option>
            <option value="System">System</option>
          </select>
        </div>
      </div>

      <div className="table-responsive margin-top">
        <table className="device-table">
          <thead>
            <tr>
              <th>Waktu Audit</th>
              <th>Pengguna (Operator)</th>
              <th>Aksi / Tindakan</th>
              <th>Deskripsi Detail Activity</th>
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td><span className="code-font text-muted">{log.timestamp}</span></td>
                <td>
                  <div className="user-cell">
                    <User size={14} />
                    <span><strong>{log.user}</strong></span>
                  </div>
                </td>
                <td><span className="bold-action-text">{log.action}</span></td>
                <td>{log.details}</td>
                <td><span className="cat-pill">{log.category}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
