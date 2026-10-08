import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Building2,
  Users,
  UserCheck,
  Cpu,
  Mail,
  Briefcase
} from 'lucide-react';

export const DepartmentUserManagement = () => {
  const { departments, employees, devices } = useInventory();
  const [selectedDeptId, setSelectedDeptId] = useState('All');

  const filteredEmployees = employees.filter(emp => {
    if (selectedDeptId === 'All') return true;
    return emp.deptId === selectedDeptId;
  });

  return (
    <div className="dept-user-view">
      <div className="view-header">
        <div>
          <h2>Struktur Departemen & Pegawai ITS Tangerang</h2>
          <p className="sub-header-text">
            Pemetaan alokasi perangkat IT berdasarkan unit kerja dan penanggung jawab pegawai.
          </p>
        </div>
      </div>

      {/* DEPARTMENT CARDS GRID */}
      <div className="section-title-sm">Unit Kerja & Departemen Utama</div>
      <div className="dept-cards-grid">
        {departments.map((dept) => {
          const deptDevices = devices.filter(d => d.departmentId === dept.id);
          return (
            <div key={dept.id} className="dept-card">
              <div className="dept-card-header">
                <div className="dept-icon-box"><Building2 size={20} /></div>
                <span className="dept-code-pill">{dept.code}</span>
              </div>
              <h3 className="dept-card-title">{dept.name}</h3>
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
          <label><Building2 size={14} /> Filter Departemen:</label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="filter-select"
          >
            <option value="All">Semua Departemen</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
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
              <th>Departemen</th>
              <th>Email Kantor</th>
              <th>Perangkat Dipegang (Assigned)</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => {
              const deptObj = departments.find(d => d.id === emp.deptId);
              const empDevices = devices.filter(d => d.assignedTo === emp.name);
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
                  <td><span className="dept-pill">{deptObj ? deptObj.name : emp.deptId}</span></td>
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
