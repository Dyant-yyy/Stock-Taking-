import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  LayoutDashboard,
  HardDrive,
  Clock,
  Wrench,
  Package,
  ClipboardCheck,
  Users,
  History,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    devices = [],
    checkouts = [],
    maintenance = [],
    spareParts = [],
    stockTakings = []
  } = useInventory();

  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeCheckouts = Array.isArray(checkouts) ? checkouts : [];
  const safeMaintenance = Array.isArray(maintenance) ? maintenance : [];
  const safeSpareParts = Array.isArray(spareParts) ? spareParts : [];
  const safeStockTakings = Array.isArray(stockTakings) ? stockTakings : [];

  const activeCheckoutsCount = safeCheckouts.filter(c => c?.status === 'Active').length;
  const inProgressMaintenanceCount = safeMaintenance.filter(m => m?.status === 'In Progress').length;
  const lowStockCount = safeSpareParts.filter(p => (p?.stockQuantity || 0) <= (p?.minThreshold || 0)).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, badge: null },
    { id: 'devices', label: 'Katalog Perangkat', icon: HardDrive, badge: safeDevices.length },
    { id: 'stocktaking', label: 'Stock Taking (Opname)', icon: ClipboardCheck, badge: `${safeStockTakings.length} Audit`, badgeColor: 'badge-info' },
    { id: 'checkout', label: 'Peminjaman Asset', icon: Clock, badge: activeCheckoutsCount > 0 ? activeCheckoutsCount : null, badgeColor: 'badge-info' },
    { id: 'maintenance', label: 'Perbaikan & Servis', icon: Wrench, badge: inProgressMaintenanceCount > 0 ? inProgressMaintenanceCount : null, badgeColor: 'badge-warning' },
    { id: 'spareparts', label: 'Stok Spare Parts', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Alert` : null, badgeColor: 'badge-danger' },
    { id: 'departments', label: 'Master Departemen ITS', icon: Users, badge: null },
    { id: 'audit', label: 'Audit Trail & Log', icon: History, badge: null },
    { id: 'print', label: 'Cetak Tag QR Asset', icon: Printer, badge: null },
  ];

  return (
    <aside className="portal-sidebar">
      <div className="sidebar-header">
        <div className="portal-badge">
          <ShieldCheck size={16} />
          <span>ITS IT Asset Portal v2.6</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-title">Sistem Manajerial</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (viewMode !== 'portal') setViewMode('portal');
              }}
            >
              <div className="link-left">
                <Icon size={18} className="link-icon" />
                <span>{item.label}</span>
              </div>
              <div className="link-right">
                {item.badge && (
                  <span className={`nav-badge ${item.badgeColor || ''}`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={14} className="arrow-icon" />
              </div>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="company-footer-card">
          <Building2 size={24} className="footer-company-icon" />
          <div>
            <div className="footer-company-name">PT. Indonesia Toray Synthetics</div>
            <div className="footer-company-loc">Tangerang Plant, Banten</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
