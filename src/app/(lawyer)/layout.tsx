'use client';

import RouteGuard from '@/components/RouteGuard';
import LawyerSidebar from '@/components/layout/LawyerSidebar';
import TopBar from '@/components/layout/TopBar';
import styles from '@/components/layout/sidebar.module.css';

export default function LawyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="LAWYER">
      <LawyerSidebar />
      <div className={styles.main}>
        <TopBar />
        <main style={{ padding: '28px' }}>{children}</main>
      </div>
    </RouteGuard>
  );
}
