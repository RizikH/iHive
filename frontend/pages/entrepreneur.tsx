import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/entrepreneur-profile.module.css';
import '../styles/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { 
  faGithub,
  faLinkedin,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import MarqueeDemo from '@/components/marquee-demo';
import { IconHome, IconUser, IconSettings, IconLogout } from '@tabler/icons-react';

const EntrepreneurProfile = () => {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0;" />
        <title>Entrepreneur Profile</title>
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
          <Link href="/sponsors">Your Sponsors</Link>
          <Link href="/get-started">Sign Out</Link>
        </div>
      </nav>

      {/* Profile Section */}
      <main className={styles.main}>

        {/* Sidebar */}

        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
              <img src="/Images/sample.jpeg" alt="Profile" title="Change your Avatar"/>
          </div>
          
          <h1 className={styles.name}>Yixi Xie</h1>
          <div className={styles.titles}>
            <p>Job Title</p>
            <p>Skills</p>
          </div>

          {/* Social Links */}
          <div className={styles.socialLinks}>
            <Link href="https://github.com" className={styles.socialIcon} title="GitHub">
              <FontAwesomeIcon icon={faGithub} />
            </Link>
            <Link href="https://linkedin.com" className={styles.socialIcon} title="Linkedin">
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
            <Link href="https://twitter.com" className={styles.socialIcon} title="X">
              <FontAwesomeIcon icon={faXTwitter} />
            </Link>
          </div>
        </div>

        {/* Repo-Cards */}
        <div className={styles.marquee}>
          <h2 className={styles.marqueeTitle}>Preview Repositories</h2>
          <div className={styles.marqueeContainer}>
            <MarqueeDemo />
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

export default EntrepreneurProfile;