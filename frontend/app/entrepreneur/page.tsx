'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import styles from '../styles/entrepreneur-profile.module.css';
import '../styles/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { 
  faGithub,
  faLinkedin,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import MarqueeDemo from '@/components/marquee-demo';
import ChangeAvatar from '@/components/change-avatar';

// =============================================
// Helper Functions
// =============================================

const isValidBlobUrl = (url: string) => {
  return url.startsWith('blob:');
};

// =============================================
// Main Component
// =============================================

const EntrepreneurProfile = () => {
  // =============================================
  // State Management
  // =============================================
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('https://avatar.vercel.sh/jack');

  // =============================================
  // Event Handlers
  // =============================================
  const handleAvatarChange = (newAvatarUrl: string) => {
    if (currentAvatar.startsWith('blob:')) {
      URL.revokeObjectURL(currentAvatar);
    }
    const sanitizedUrl = DOMPurify.sanitize(newAvatarUrl);
    if (isValidBlobUrl(sanitizedUrl)) {
      setCurrentAvatar(sanitizedUrl);
    } else {
      console.error('Invalid avatar URL');
    }
    setIsAvatarModalOpen(false);
  };

  // =============================================
  // Effects
  // =============================================
  React.useEffect(() => {
    return () => {
      if (currentAvatar.startsWith('blob:')) {
        URL.revokeObjectURL(currentAvatar);
      }
    };
  }, []);

  // =============================================
  // Render
  // =============================================
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0;" />
        <title>Entrepreneur Profile</title>
        <link rel="icon" href="/Images/iHive.png" />
    </Head>

    <div className={styles.container}>
      {/*Navigation*/}
      <nav className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/" title="Home" className="flex items-center gap-2">
            <Image
              src="/Images/iHive.png"
              alt="Logo"
              width={35}
              height={35}
              className={styles.logoImage}
            />
            <span>iHive-Entrepreneur</span>
          </Link>
        </div>
        <div className={styles['nav-links']}>
          <Link href="/repository">Repository</Link>
          <Link href="/setting">Setting</Link>
          <Link href="/sponsors">Sponsors</Link>
          <Link href="/get-started">Sign Out</Link>
        </div>
      </nav>

      {/*Main Content*/}
      <main className={styles.main}>
        {/*Profile Information Section*/}
        <div className={styles.profileSection}>
          {/*Avatar with Change Functionality*/}
          <div className={styles.profileImage} onClick={() => setIsAvatarModalOpen(true)}>
            <img 
              src={currentAvatar} 
              alt="Avatar" 
              title="Change your Avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          </div>
          
          {/*Avatar Change Modal*/}
          <ChangeAvatar
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            onAvatarChange={handleAvatarChange}
            currentAvatar={currentAvatar}
          />
          
          {/*User Information*/}
          <h1 className={styles.name}>Username</h1>
          <div className={styles.titles}>
            <p>Job Title</p>
            <p>Skills</p>
          </div>

          {/*Social Media Links*/}
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

        {/*Repository Showcase*/}
        <div className={styles.marquee}>
          <h2 className={styles.marqueeTitle}>Popular Repositories</h2>
          <div className={styles.marqueeContainer}>
            <MarqueeDemo />
          </div>
        </div>
      </main>

      {/*Footer*/}
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