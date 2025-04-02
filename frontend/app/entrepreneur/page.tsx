'use client';

import React, { useState, useEffect } from 'react';

// Next.js
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Components
import NavBar from '@/components/nav-bar';
import MarqueeDemo from '@/components/marquee-demo';
import ChangeAvatar from '@/components/change-avatar';
import Footer from '@/components/footer';

// Libraries
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';

// Styles
import styles from '../styles/entrepreneur-profile.module.css';

const EntrepreneurProfile = () => {
  // =============================================
  // State Management
  // =============================================
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('https://avatar.vercel.sh/jack');
  const [username, setUsername] = useState('user');
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  });

  // =============================================
  // Event Handlers
  // =============================================
  const handleAvatarChange = (newAvatarUrl: string) => {
    if (currentAvatar.startsWith('blob:')) URL.revokeObjectURL(currentAvatar);
    const sanitizedUrl = DOMPurify.sanitize(newAvatarUrl);
    if (sanitizedUrl.startsWith('blob:')) setCurrentAvatar(sanitizedUrl);
    else console.error('Invalid avatar URL');
    setIsAvatarModalOpen(false);
  };

  // =============================================
  // Effects
  // =============================================
  useEffect(() => {
    // Get user data from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedJobTitle = localStorage.getItem('jobTitle');
    const storedSkills = localStorage.getItem('skills');
    const storedGithub = localStorage.getItem('github');
    const storedLinkedin = localStorage.getItem('linkedin');
    const storedTwitter = localStorage.getItem('twitter');
    
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    if (storedJobTitle) {
      setJobTitle(storedJobTitle);
    }
    
    if (storedSkills) {
      setSkills(storedSkills);
    }
    
    // Update social links if available in localStorage
    setSocialLinks(prev => ({
      github: storedGithub || prev.github,
      linkedin: storedLinkedin || prev.linkedin,
      twitter: storedTwitter || prev.twitter
    }));
    
    return () => {
      if (currentAvatar.startsWith('blob:')) URL.revokeObjectURL(currentAvatar);
    };
  }, [currentAvatar]);

  // =============================================
  // Render Component
  // =============================================
  return (
    <>
      <Head>
        <title>Entrepreneur Profile</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.container}>
        {/* Navigation */}
        <NavBar 
          title="iHive-Entrepreneur" 
          links={[
            { href: "/ideas", label: "Repositories" },
            { href: "/setting", label: "Setting" },
            { href: "/sponsors", label: "Sponsors" },
            { href: "/get-started", label: "Sign Out" }
          ]}
        />

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
            <h1 className={styles.name}>{username}</h1>
            <div className={styles.titles}>
              <p>{jobTitle || 'Job Title'}</p>
              <p>{skills || 'Skills'}</p>
            </div>
            <div className={styles.socialLinks}>
              <Link href={socialLinks.github} title="GitHub">
                <FontAwesomeIcon icon={faGithub} className={styles.socialIcon} />
              </Link>
              <Link href={socialLinks.linkedin} title="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} className={styles.socialIcon} />
              </Link>
              <Link href={socialLinks.twitter} title="X">
                <FontAwesomeIcon icon={faXTwitter} className={styles.socialIcon} />
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
        <Footer role="Entrepreneur" />
      </div>
    </>
  );
};

export default EntrepreneurProfile;