import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/sponsors.module.css';
import '../styles/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import AvatarCirclesDemo from '@/components/avatar-circles-demo';
import MarqueeDemo from '@/components/marquee-demo';

const Sponsors = () => {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0;" />
        <title>iHive | Your Sponsors</title>
        <link rel="icon" href="/Images/iHive.png" />
    </Head>

    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.navContainer}>
        <div className={styles.logo}>
          <Image
            src="/Images/iHive.png"
            alt="Logo"
            title="Home"
            width={35}
            height={35}
            className={styles.logoImage}
          />
          <Link href="/">iHive</Link>
        </div>
        <div className={styles['nav-links']}>
          <Link href="/repository">Repository</Link>
          <Link href="/setting">Setting</Link>
          <Link href="/entrepreneur">Profile</Link>
          <Link href="/get-started">Sign Out</Link>
        </div>
      </nav>


      <main className={styles.main}>
        {/* Sidebar */}

        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
              <img src="/Images/sample.jpeg" alt="Profile" title="Change your Avatar"/>
          </div>
          
          <h1 className={styles.rank}>Sponsors Rank? maybe</h1>

          {/* Your Sponsors */}
          <div className={styles.avatarCircles}>
            <AvatarCirclesDemo />
          </div>
        </div>

        {/* Repo-Cards */}
        <div className={styles.graph}>
          <h2 className={styles.graphTitle}>Your Sponsors Graph</h2>
          <div className={styles.graphContainer}>
            <p>Graph here.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          © 2025 iHive · Entrepreneur | <Link href="/terms" target='_blank'>Terms</Link> | <Link href="/Privacy" target='_blank'>Privacy</Link>
        </p>
      </footer>
    </div>
    </>
  );
}

export default Sponsors;