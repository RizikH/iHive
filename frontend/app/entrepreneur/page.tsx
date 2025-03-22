'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import styles from '../styles/entrepreneur-profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import MarqueeDemo from '@/components/marquee-demo';
import ChangeAvatar from '@/components/change-avatar';

const EntrepreneurProfile = () => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('https://avatar.vercel.sh/jack');

  const handleAvatarChange = (newAvatarUrl: string) => {
    if (currentAvatar.startsWith('blob:')) URL.revokeObjectURL(currentAvatar);
    const sanitizedUrl = DOMPurify.sanitize(newAvatarUrl);
    if (sanitizedUrl.startsWith('blob:')) setCurrentAvatar(sanitizedUrl);
    else console.error('Invalid avatar URL');
    setIsAvatarModalOpen(false);
  };

  useEffect(() => {
    return () => {
      if (currentAvatar.startsWith('blob:')) URL.revokeObjectURL(currentAvatar);
    };
  }, [currentAvatar]);

  return (
    <>
      <Head>
        <title>Entrepreneur Profile</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.container}>
        {/* Navigation */}
        <nav className={styles.navContainer}>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Images/iHive.png" alt="Logo" width={35} height={35} />
            <span>iHive-Entrepreneur</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/repository">Repository</Link>
            <Link href="/setting">Setting</Link>
            <Link href="/sponsors">Sponsors</Link>
            <Link href="/get-started">Sign Out</Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Profile Section */}
          <div className={styles.profileSection}>
            <div
              className={styles.profileImage}
              onClick={() => setIsAvatarModalOpen(true)}
            >
              <Image
                src={currentAvatar}
                alt="Avatar"
                width={150}
                height={150}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            <ChangeAvatar
              isOpen={isAvatarModalOpen}
              onClose={() => setIsAvatarModalOpen(false)}
              onAvatarChange={handleAvatarChange}
              currentAvatar={currentAvatar}
            />
            <h1 className={styles.name}>Username</h1>
            <div className={styles.titles}>
              <p>Job Title</p>
              <p>Skills</p>
            </div>
            <div className={styles.socialLinks}>
              <Link href="https://github.com" title="GitHub">
                <FontAwesomeIcon icon={faGithub} />
              </Link>
              <Link href="https://linkedin.com" title="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} />
              </Link>
              <Link href="https://twitter.com" title="X">
                <FontAwesomeIcon icon={faXTwitter} />
              </Link>
            </div>
          </div>

          {/* Repository Showcase */}
          <div className={styles.marquee}>
            <h2 className={styles.marqueeTitle}>Popular Repositories</h2>
            <MarqueeDemo />
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>
            © 2025 iHive · Entrepreneur | <Link href="/terms">Terms</Link> |{' '}
            <Link href="/Privacy">Privacy</Link>
          </p>
        </footer>
      </div>
    </>
  );
};

export default EntrepreneurProfile;