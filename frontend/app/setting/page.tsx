"use client";

import React, { Suspense, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// Components
import NavBar from '@/components/nav-bar';
import BasicInfo from '@/components/basic-form';
import SocialMedia from '@/components/social-media';
import AccountSettings from '@/components/account-settings';
import NotificationPreferences from '@/components/notification';

// Styles
import styles from '../styles/setting.module.css';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useAuthStore } from '@/app/stores/useAuthStore';

const Setting = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const timeout = setTimeout(() => router.push("/get-started"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Please log in to access settings...</p>;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>iHive | Setting</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.pageContainer}>
        {/* Shared NavBar */}
        <NavBar title="iHive" />

        <main className={styles.mainContainer}>
          {/* Settings Sidebar */}
          <div className={styles.sidebar}>
            <ul className={styles.sidebarList}>
              <li className={styles.sidebarItem}>
                <Link href="/setting?tab=basic" className={styles.sidebarLink}>
                  Basic Information
                </Link>
              </li>
              <li className={styles.sidebarItem}>
                <Link href="/setting?tab=account" className={styles.sidebarLink}>
                  Account Settings
                </Link>
              </li>
              <li className={styles.sidebarItem}>
                <Link href="/setting?tab=social" className={styles.sidebarLink}>
                  Social Media
                </Link>
              </li>
              <li className={styles.sidebarItem}>
                <Link href="/setting?tab=notification" className={styles.sidebarLink}>
                  Notification Preferences
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.divider}></div>

          {/* Settings Content */}
          <div className={styles.setting}>
            <Suspense fallback={<div>Loading settings...</div>}>
              <SettingContent />
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
};

const SettingContent = () => {
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') || 'basic';

  switch (tab) {
    case 'social':
      return <SocialMedia />;
    case 'account':
      return <AccountSettings />;
    case 'notification':
      return <NotificationPreferences />;
    default:
      return <BasicInfo />;
  }
};

export default Setting;
