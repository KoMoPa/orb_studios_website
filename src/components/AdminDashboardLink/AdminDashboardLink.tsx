'use client';

import React from 'react';
import Link from 'next/link';
import styles from './AdminDashboardLink.module.scss';

export function AdminDashboardLink() {
  return (
    <Link href="/admin/invoice-generator" className={styles.card}>
      <div className={styles.content}>
        <div className={styles.icon}>📄</div>
        <h3 className={styles.title}>Invoice Generator</h3>
        <p className={styles.description}>Generate invoices for bookings</p>
      </div>
      <div className={styles.arrow}>→</div>
    </Link>
  );
}
