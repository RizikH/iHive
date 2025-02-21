import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/app/styles/get-started.module.css';
import '@/app/styles/globals.css';

const GetStartedPage: React.FC = () => {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="Author" content="Yixi Xie" />
                <meta name="Description" content="Main profile page." />
                <title>iHive - Get Started</title>
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

            <nav className={styles.nav}>
                <div className={styles.logo}>iHive</div>
                <div className={styles['nav-links']}>
                    <Link href="/get-started#about"><span>About</span></Link>
                    <Link href="/get-started#features"><span>Features</span></Link>
                    <Link href="/get-started#contact"><span>Contact</span></Link>
                </div>
            </nav>

            <main className={styles['main-content']}>
                <div className={styles['intro-text']}>
                    <h1>
                        WELCOME TO<br />
                        THE iHIVE.<br />
                        GET STARTED.
                    </h1>
                    <p>
                        Connect, collaborate, and create in our digital repo-system.
                        Join the community of investors and entrepreneurs.
                    </p>
                    <Link href="/get-started" title="Login/Signup Page">
                        <span className={styles['cta-button']}>Get Started</span>
                    </Link>
                </div>
                <div className={styles['ihive-icon']}>
                    <Image 
                        src="/Images/iHive.png" 
                        alt="iHive Logo"
                        width={300}
                        height={300}
                        priority
                    />
                </div>
            </main>
        </>
    );
};

export default GetStartedPage;
