'use client';

import RouteGuard from '@/components/RouteGuard';
import AdminSidebar from '@/components/layout/AdminSidebar';
import TopBar from '@/components/layout/TopBar';
import styles from '@/components/layout/sidebar.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="ADMIN">
      <AdminSidebar />
      <div className={styles.main}>
        <TopBar />
        <main style={{ padding: '28px' }}>{children}</main>
      </div>
    </RouteGuard>
  );
}
