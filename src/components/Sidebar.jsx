import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  LayoutDashboard,
  ClipboardCheck,
  HardDrive,
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
    departments = [],
    stockTakings = []
  } = useInventory();

  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeDepts = Array.isArray(departments) ? departments : [];
  const safeStockTakings = Array.isArray(stockTakings) ? stockTakings : [];

  const verifiedCount = safeDevices.filter(d => d?.status === 'Verified').length;
  const pendingCount = safeDevices.filter(d => d?.status === 'Pending Audit' || !d?.status).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Opname', icon: LayoutDashboard, badge: null },
    { id: 'stocktaking', label: 'Form & Record Stock Opname', icon: ClipboardCheck, badge: `${safeStockTakings.length} Audit`, badgeColor: 'badge-info' },
    { id: 'devices', label: 'Katalog Perangkat ITS', icon: HardDrive, badge: safeDevices.length },
    { id: 'departments', label: 'Master Departemen ITS', icon: Users, badge: `${safeDepts.length} Unit`, badgeColor: 'badge-info' },
    { id: 'audit', label: 'Audit Trail & Log', icon: History, badge: null },
    { id: 'print', label: 'Cetak Tag QR Asset', icon: Printer, badge: null },
  ];

  return (
    <aside className="portal-sidebar">
      <div className="sidebar-header">
        <div className="portal-badge">
          <ShieldCheck size={16} />
          <span>ITS Device Stock Taking System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-title">Menu Stock Opname</div>
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
