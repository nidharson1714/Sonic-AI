// @ts-nocheck
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music2, LayoutDashboard, Library, LogOut } from 'lucide-react';
import { useAuthStore } from '../store';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/generate', label: 'Studio', icon: Music2 },
  { path: '/library', label: 'Library', icon: Library },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuthStore();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={{
        width: '220px', flexShrink: 0,
        background: 'rgba(0,0,0,0.4)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex', flexDirection: 'column',
        padding: '2rem 1rem',
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <Music2 size={28} color="var(--primary)" />
          <span style={{ fontSize: '1.3rem', fontWeight: 700, background: 'linear-gradient(45deg, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SonicAI
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '10px',
                  background: active ? 'rgba(157,78,221,0.2)' : 'transparent',
                  border: active ? '1px solid rgba(157,78,221,0.4)' : '1px solid transparent',
                  color: active ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}>
                  <Icon size={18} />
                  <span style={{ fontWeight: active ? 600 : 400 }}>{label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'none', border: '1px solid var(--glass-border)',
          color: 'var(--text-muted)', padding: '10px 14px',
          borderRadius: '10px', cursor: 'pointer', width: '100%',
          fontSize: '0.9rem', transition: 'all 0.2s',
        }}>
          <LogOut size={16} /> Logout
        </button>
      </nav>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};
