import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Building2,
  Users,
  UserCheck,
  Cpu,
  Mail,
  Briefcase,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';

export const DepartmentUserManagement = () => {
  const {
    departments = [],
    employees = [],
    devices = [],
    setIsDeptModalOpen,
    setEditingDept,
    deleteDepartment
  } = useInventory();

  const safeDepts = Array.isArray(departments) ? departments : [];
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeDevices = Array.isArray(devices) ? devices : [];

  const [selectedDeptId, setSelectedDeptId] = useState('All');

  const filteredEmployees = safeEmployees.filter(emp => {
    if (selectedDeptId === 'All') return true;
    return emp.deptId === selectedDeptId || emp.deptId.includes(selectedDeptId);
  });

  const handleEditDept = (dept, e) => {
    e.stopPropagation();
    setEditingDept(dept);
    setIsDeptModalOpen(true);
  };

  const handleDeleteDept = (id, code, e) => {
    e.stopPropagation();
    if (window.confirm(`Apakah Anda yakin ingin menghapus Master Departemen [${code}]?`)) {
      deleteDepartment(id);
    }
  };

  return (
    <div className="dept-user-view">
      <div className="view-header">
        <div>
          <h2>Master Departemen & Direktori Pegawai ITS</h2>
          <p className="sub-header-text">
            Struktur Master Departemen Resmi PT. Indonesia Toray Synthetics (IS, RSN, QATECH, SIS, NFY, PFY) & Alokasi Asset.
          </p>
        </div>
        <div className="view-header-actions">
          <button className="btn-primary" onClick={() => { setEditingDept(null); setIsDeptModalOpen(true); }}>
            <Plus size={16} />
            <span>+ Master Departemen Baru</span>
          </button>
        </div>
      </div>

      {/* DEPARTMENT CARDS GRID */}
      <div className="section-title-sm">Master Departemen Operasional (IS, RSN, QATECH, SIS, NFY, PFY)</div>
      <div className="dept-cards-grid">
        {safeDepts.map((dept) => {
          const deptDevices = safeDevices.filter(d => d && (d.departmentId === dept.id || d.departmentId?.includes(dept.code)));
          return (
            <div key={dept.id} className="dept-card">
              <div className="dept-card-header">
                <div className="dept-icon-box"><Building2 size={20} /></div>
                <div className="flex items-center gap-2">
                  <span className="dept-code-pill font-mono font-bold">{dept.code}</span>
                  <button className="btn-icon-action" onClick={(e) => handleEditDept(dept, e)} title="Edit Master Departemen">
                    <Edit2 size={13} />
                  </button>
                  <button className="btn-icon-action danger" onClick={(e) => handleDeleteDept(dept.id, dept.code, e)} title="Hapus Master Departemen">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <h3 className="dept-card-title">{dept.name}</h3>
              <p className="text-xs text-muted mb-2">{dept.description || 'Unit Kerja Operasional ITS'}</p>
              <div className="dept-head-info">
                <UserCheck size={14} />
                <span>Head: <strong>{dept.head}</strong></span>
              </div>
              <div className="dept-card-footer">
                <div className="stat-pill">
                  <Cpu size={14} />
                  <span><strong>{deptDevices.length}</strong> Perangkat Alokasi</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPLOYEES DIRECTORY */}
      <div className="section-title-sm margin-top-lg">Direktori Pegawai & PIC Asset</div>
      <div className="filter-bar">
        <div className="filter-group">
          <label><Building2 size={14} /> Filter Master Departemen:</label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="filter-select"
          >
            <option value="All">Semua Departemen Master ({safeDepts.length})</option>
            {safeDepts.map(d => (
              <option key={d.id} value={d.id}>[{d.code}] - {d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="device-table">
          <thead>
            <tr>
              <th>ID Pegawai</th>
              <th>Nama Lengkap</th>
              <th>Jabatan / Position</th>
              <th>Master Departemen</th>
              <th>Email Kantor</th>
              <th>Perangkat Dipegang (Assigned)</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => {
              const deptObj = safeDepts.find(d => d.id === emp.deptId);
              const empDevices = safeDevices.filter(d => d && d.assignedTo === emp.name);
              return (
                <tr key={emp.id}>
                  <td><span className="code-font">{emp.id}</span></td>
                  <td><strong>{emp.name}</strong></td>
                  <td>
                    <div className="user-cell">
                      <Briefcase size={14} />
                      <span>{emp.position}</span>
                    </div>
                  </td>
                  <td><span className="dept-pill">{deptObj ? `[${deptObj.code}] ${deptObj.name}` : emp.deptId}</span></td>
                  <td>
                    <div className="user-cell text-muted">
                      <Mail size={14} />
                      <span>{emp.email}</span>
                    </div>
                  </td>
                  <td>
                    {empDevices.length === 0 ? (
                      <span className="text-muted text-sm">- Tidak ada asset -</span>
                    ) : (
                      <div className="assigned-tags-list">
                        {empDevices.map(d => (
                          <span key={d.id} className="asset-mini-tag" title={d.name}>
                            {d.assetTag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
