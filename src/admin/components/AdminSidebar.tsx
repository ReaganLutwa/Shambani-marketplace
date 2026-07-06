/**
 * ShambaNi Admin Sidebar - Updated with Buyers Menu
 * Add this to your existing admin sidebar component
 * 
 * This adds the Buyers menu item with badge count for pending verifications
 */

import React from 'react';
import './AdminSidebar.css';

// ===== ADMIN NAVIGATION CONFIG =====
// Updated to include Buyers section

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  path: string;
  badge?: number;
  children?: NavItem[];
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    icon: '◆',
    label: 'Dashboard',
    path: '/admin'
  },
  {
    id: 'farmers',
    icon: '👨‍🌾',
    label: 'Farmers',
    path: '/admin/farmers',
    badge: 0 // Dynamic: count of pending farmer registrations
  },
  {
    id: 'buyers',
    icon: '🏢',
    label: 'Buyers',
    path: '/admin/buyers',
    badge: 0, // Dynamic: count of pending buyer registrations
    children: [
      { id: 'buyers_all', icon: '•', label: 'All Buyers', path: '/admin/buyers' },
      { id: 'buyers_pending', icon: '•', label: 'Pending Verification', path: '/admin/buyers?filter=pending' },
      { id: 'buyers_verified', icon: '•', label: 'Verified Buyers', path: '/admin/buyers?filter=approved' },
      { id: 'buyers_institutional', icon: '•', label: 'Institutional', path: '/admin/buyers?type=institutional' },
    ]
  },
  {
    id: 'verification',
    icon: '✓',
    label: 'Verification Queue',
    path: '/admin/verification',
    badge: 0, // Dynamic: total pending (farmers + buyers)
    children: [
      { id: 'verify_farmers', icon: '•', label: 'Farmers to Verify', path: '/admin/verification?tab=farmers' },
      { id: 'verify_buyers', icon: '•', label: 'Buyers to Verify', path: '/admin/verification?tab=buyers' },
    ]
  },
  {
    id: 'orders',
    icon: '🛒',
    label: 'Orders',
    path: '/admin/orders',
    badge: 0 // Dynamic: count of pending orders
  },
  {
    id: 'products',
    icon: '📦',
    label: 'Products',
    path: '/admin/products',
    children: [
      { id: 'products_all', icon: '•', label: 'All Products', path: '/admin/products' },
      { id: 'products_pending', icon: '•', label: 'Pending Approval', path: '/admin/products?filter=pending' },
      { id: 'categories', icon: '•', label: 'Categories', path: '/admin/categories' },
    ]
  },
  {
    id: 'printdrop',
    icon: '🖨️',
    label: 'PrintDrop',
    path: '/admin/printdrop'
  },
  {
    id: 'payments',
    icon: '💳',
    label: 'Payments',
    path: '/admin/payments',
    badge: 0 // Dynamic: count of pending/disputed payments
  },
  {
    id: 'analytics',
    icon: '📊',
    label: 'Analytics',
    path: '/admin/analytics'
  },
  {
    id: 'settings',
    icon: '⚙️',
    label: 'Settings',
    path: '/admin/settings'
  }
];

// ===== SIDEBAR COMPONENT =====

interface AdminSidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
  counts?: {
    farmers?: number;
    buyers?: number;
    verification?: number;
    orders?: number;
    payments?: number;
  };
}

export function AdminSidebar({ activePath, onNavigate, counts = {} }: AdminSidebarProps) {
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getBadge = (item: NavItem): number | undefined => {
    if (!item.badge) return undefined;
    switch (item.id) {
      case 'farmers': return counts.farmers || item.badge;
      case 'buyers': return counts.buyers || item.badge;
      case 'verification': return counts.verification || item.badge;
      case 'orders': return counts.orders || item.badge;
      case 'payments': return counts.payments || item.badge;
      default: return item.badge;
    }
  };

  const isActive = (path: string) => activePath.startsWith(path);

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🌱</span>
        <div>
          <span className="brand-name">ShambaNi</span>
          <span className="brand-sub">Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {ADMIN_NAV_ITEMS.map(item => (
          <div key={item.id} className="nav-group">
            <button
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => {
                if (item.children) {
                  toggleExpand(item.id);
                } else {
                  onNavigate(item.path);
                }
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {getBadge(item) ? (
                <span className={`nav-badge ${item.id}`}>{getBadge(item)}</span>
              ) : null}
              {item.children && (
                <span className={`nav-chevron ${expanded.includes(item.id) ? 'expanded' : ''}`}>›</span>
              )}
            </button>

            {item.children && expanded.includes(item.id) && (
              <div className="nav-submenu">
                {item.children.map(child => (
                  <button
                    key={child.id}
                    className={`nav-subitem ${isActive(child.path) ? 'active' : ''}`}
                    onClick={() => onNavigate(child.path)}
                  >
                    <span className="sub-icon">{child.icon}</span>
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="signout-btn" onClick={() => {/* handle signout */}}>
          <span>↪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
