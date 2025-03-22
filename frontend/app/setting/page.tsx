'use client';
import React, { Suspense } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/setting.module.css';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useSearchParams } from 'next/navigation';
import BasicInfo from '@/components/basic-form';
import SocialMedia from '@/components/social-media';
import AccountSettings from '@/components/account-settings';
import NotificationPreferences from '@/components/notification';

// =============================================
// Main Component
// =============================================

const Setting = () => {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>iHive | Setting</title>
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

            <div className={styles.pageContainer}>
                {/*Navigation*/}
                <header className={styles.navContainer}>
                    <nav className={styles.navbar}>
                        <div className={styles.logo}>
                            <Image 
                                src="/Images/iHive.png"
                                alt="Logo"
                                title="Home"
                                width={35}
                                height={35}
                                className={styles.logoIcon}
                            />
                            <Link href="/">iHive</Link>
                        </div>
                        <div className={styles['nav-links']}>
                            <Link href="/repository">Repository</Link>
                            <Link href="/entrepreneur">Profile</Link>
                            <Link href="/sponsors">Sponsors</Link>
                            <Link href="/get-started">Sign Out</Link>
                        </div>
                    </nav>
                </header>

                <main className={styles.mainContainer}>
                    {/*Settings Sidebar*/}
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

                    {/*Settings Content*/}
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

// =============================================
// Content Component
// =============================================

/**
 * SettingContent - Dynamic component that renders different setting tabs
 * Uses client-side routing parameters to determine which setting to display
 */
const SettingContent = () => {
    // Get current tab from URL parameters, default to 'basic'
    const searchParams = useSearchParams();
    const tab = searchParams?.get('tab') || 'basic';

    // Render appropriate component based on selected tab
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
