"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/nav-bar';
import MarqueeDemo from '@/components/marquee-demo';
import ChangeAvatar from '@/components/change-avatar';
import Footer from '@/components/footer';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { useAuthStore } from '@/app/stores/useAuthStore';
import styles from '../styles/entrepreneur-profile.module.css';
import { useRouter } from "next/navigation";

const EntrepreneurProfile = () => {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('https://avatar.vercel.sh/jack');
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowRedirectMessage(true);
      setTimeout(() => router.push("/get-started"), 1500);
    }

    if (currentUser.avatar) {
      setCurrentAvatar(currentUser.avatar);
    }

    return () => {
      if (currentAvatar?.startsWith('blob:')) {
        URL.revokeObjectURL(currentAvatar);
      }
    };
  }, [isAuthenticated, currentAvatar, currentUser.avatar, router]);

  const handleAvatarChange = async (newAvatarUrl: string) => {
    if (currentAvatar.startsWith('blob:')) URL.revokeObjectURL(currentAvatar);
    const sanitizedUrl = DOMPurify.sanitize(newAvatarUrl);
    if (sanitizedUrl.startsWith('blob:')) {
      setCurrentAvatar(sanitizedUrl);
    } else {
      console.error('Invalid avatar URL');
    }
    setIsAvatarModalOpen(false);
  };

  if (showRedirectMessage) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Please log in to view this page...</p>;
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Head>
        <title>Entrepreneur Profile</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.container}>
        <NavBar
          title="iHive-Entrepreneur"
          extraLinks={[
            { href: "/ideas", label: "Repositories" },
            { href: "/sponsors", label: "Sponsors" },
          ]}
        />

        <main className={styles.main}>
          <div className={styles.profileSection}>
            <div className={styles.profileImage} onClick={() => setIsAvatarModalOpen(true)}>
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
            <h1 className={styles.username}>{currentUser.username}</h1>
            <div className={styles.titles}>
              <p>{currentUser.bio || 'No bio provided'}</p>
            </div>
            <div className={styles.socialLinks}>
              <Link href="https://github.com" title="GitHub" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} className={styles.socialIcon} />
              </Link>
              <Link href="https://linkedin.com" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className={styles.socialIcon} />
              </Link>
              <Link href="https://twitter.com" title="X" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faXTwitter} className={styles.socialIcon} />
              </Link>
            </div>
          </div>

          <div className={styles.marquee}>
            <h2 className={styles.marqueeTitle}>Popular Repositories</h2>
            <MarqueeDemo />
          </div>
        </main>

        <Footer role="Entrepreneur" />
      </div>
    </>
  );
};

export default EntrepreneurProfile;
