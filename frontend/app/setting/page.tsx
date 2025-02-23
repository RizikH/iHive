import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/setting.module.css';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

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
                            <Link href="/sponsors">Your Sponsors</Link>
                            <Link href="/get-started">Sign Out</Link>
                        </div>
                    </nav>
                </header>

                <main className={styles.mainContainer}>

                    {/* Sidebar - Category for setting: basic, social-media, account, .. */}
                    <div className={styles.sidebar}>
                        
                    </div>

                    <div className={styles.divider}></div>

                    {/* SettingContent */}
                    <div className={styles.setting}>
                        <h2 className={styles.settingCate}>Basic</h2>
                        <div className={styles.settingContainer}>
                            <p>seeting here..</p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default Setting;