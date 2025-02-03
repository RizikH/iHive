import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
      <nav className={styles.navbar}>
        <Link href="/" className={styles.logo}>iHive</Link>
        <div className={styles.navLinks}>
          <Link href="/repository">Repository</Link>
          <Link href="/setting">Setting</Link>
          <Link href="/sponsor">Your Sponsors</Link>
          <Link href="/get-started">Sign Out</Link>
        </div>
      </nav>

      {/* Profile Section */}
      <main className={styles.profileSection}>
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
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>@iHive · Entrepreneur</p>
      </footer>
    </div>
    </>
  );
}

export default EntrepreneurProfile;