'use client';

import { useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import LawyerSidebar from '@/components/layout/LawyerSidebar';
import TopBar from '@/components/layout/TopBar';
import styles from '@/components/layout/sidebar.module.css';

export default function LawyerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RouteGuard requiredRole="LAWYER">
      {/* Backdrop overlay on mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
          }}
          className="mobile-backdrop"
        />
      )}
      <LawyerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.content}>{children}</main>
      </div>
    </RouteGuard>
  );
}
