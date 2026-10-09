import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Building2, Save } from 'lucide-react';

export const DepartmentFormModal = () => {
  const {
    isDeptModalOpen,
    setIsDeptModalOpen,
    editingDept,
    addDepartment,
    updateDepartment
  } = useInventory();

  const initialForm = {
    code: 'IS',
    name: 'Information System (IS)',
    head: 'Budi Santoso, S.T.',
    icon: 'Monitor',
    description: 'Divisi Teknologi Informasi & Infrastruktur Komputer'
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (editingDept) {
      setFormData({ ...editingDept });
    } else {
      setFormData(initialForm);
    }
  }, [editingDept, isDeptModalOpen]);

  if (!isDeptModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDept) {
      updateDepartment(formData);
    } else {
      addDepartment(formData);
    }
    setIsDeptModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsDeptModalOpen(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Building2 size={20} className="text-cyan" />
            <h3>{editingDept ? 'Edit Master Departemen' : 'Tambah Master Departemen Baru'}</h3>
          </div>
          <button className="btn-modal-close" onClick={() => setIsDeptModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Kode Master Departemen * (Misal: IS, RSN, QATECH, SIS, NFY, PFY):</label>
              <input
                type="text"
                required
                placeholder="Kode Singkat (Contoh: IS, RSN, QATECH)"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="form-input code-font"
              />
            </div>

            <div className="form-group margin-top">
              <label>Nama Lengkap Departemen *:</label>
              <input
                type="text"
                required
                placeholder="Contoh: Quality Assurance & Tech (QATECH)"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
              />
            </div>

            <div className="form-group margin-top">
              <label>Head / Kepala Departemen *:</label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Head Departemen"
                value={formData.head}
                onChange={(e) => setFormData(prev => ({ ...prev, head: e.target.value }))}
                className="form-input"
              />
            </div>

            <div className="form-group margin-top">
              <label>Deskripsi Unit Kerja:</label>
              <textarea
                rows={2}
                placeholder="Tugas & cakupan operasional divisi..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="form-textarea"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsDeptModalOpen(false)}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Simpan Master Departemen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
