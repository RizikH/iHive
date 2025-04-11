'use client';

import React, { useState, useEffect, useCallback } from 'react';

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

// Utils
import { fetcher } from '@/app/utils/fetcher';

// Styles
import styles from '../styles/entrepreneur-profile.module.css';

import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/app/utils/isAuthenticated";


const EntrepreneurProfile = () => {
  // =============================================
  // State Management
  // =============================================
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState('https://avatar.vercel.sh/jack');
  const [username, setUsername] = useState('user');
  const [userId, setUserId] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await isAuthenticated();
      if (!currentUser) {
        router.push("/get-started");
      } else {
        setUser(currentUser);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);


  const loadFromLocalStorage = () => {
    const username = localStorage.getItem('username') || 'user';
    const jobTitle = localStorage.getItem('jobTitle') || '';
    const skills = localStorage.getItem('skills') || '';
    const bio = localStorage.getItem('bio') || '';
    const avatar = localStorage.getItem('avatar') || 'https://avatar.vercel.sh/jack';
    const github = localStorage.getItem('github') || 'https://github.com';
    const linkedin = localStorage.getItem('linkedin') || 'https://linkedin.com';
    const twitter = localStorage.getItem('twitter') || 'https://twitter.com';

    setUsername(username);
    setJobTitle(jobTitle);
    setSkills(skills);
    setBio(bio);
    setCurrentAvatar(avatar);
    setSocialLinks({ github, linkedin, twitter });
  };

  const getAuthHeaders = (): Record<string, string> | undefined => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };

  const normalizeUserData = useCallback((user: any) => {
    const {
      username = 'user',
      job_title,
      jobTitle,
      skills = '',
      bio = '',
      avatar_url,
      avatarUrl,
      avatar,
      github_url,
      githubUrl,
      github,
      linkedin_url,
      linkedinUrl,
      linkedin,
      twitter_url,
      twitterUrl,
      twitter
    } = user;

    const normalizedAvatar = avatar_url || avatarUrl || avatar || 'https://avatar.vercel.sh/jack';

    setUsername(username);
    setJobTitle(job_title || jobTitle || '');
    setSkills(skills);
    setBio(bio);
    setCurrentAvatar(normalizedAvatar);

    const social = {
      github: github_url || githubUrl || github || 'https://github.com',
      linkedin: linkedin_url || linkedinUrl || linkedin || 'https://linkedin.com',
      twitter: twitter_url || twitterUrl || twitter || 'https://twitter.com'
    };
    setSocialLinks(social);

    storeEssentialProfileData({ username, jobTitle, skills, bio, avatar: normalizedAvatar, ...social });
  }, []);


  // =============================================
  // API Functions
  // =============================================
  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      const userId = localStorage.getItem('user_id');
      const headers = getAuthHeaders();

      if (!userId) {
        loadFromLocalStorage();
        return;
      }

      setUserId(userId);
      setDebugInfo('Fetching user data...');
      const userData = await fetcher(`/users/get/${userId}`, 'GET', undefined, headers);
      setDebugInfo(null);

      normalizeUserData(userData);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(`Failed to load profile data: ${err.message || 'Unknown error'}`);
      setDebugInfo(JSON.stringify(err, null, 2));
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, [normalizeUserData]);

  const storeEssentialProfileData = (data: any) => {
    localStorage.setItem('username', data.username);
    localStorage.setItem('jobTitle', data.jobTitle || '');
    localStorage.setItem('skills', data.skills || '');
    localStorage.setItem('bio', data.bio || '');
    localStorage.setItem('avatar', data.avatar || '');
    localStorage.setItem('github', data.github || '');
    localStorage.setItem('linkedin', data.linkedin || '');
    localStorage.setItem('twitter', data.twitter || '');
  };

  const updateUserProfile = async (data: any) => {
    if (!userId) return;

    try {
      await fetcher(`/users/update/${userId}`, 'PUT', data);
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      fetchUserProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  // =============================================
  // Event Handlers
  // =============================================
  const handleAvatarChange = async (newAvatarUrl: string) => {
    if (currentAvatar.startsWith('blob:')) URL.revokeObjectURL(currentAvatar);
    const sanitizedUrl = DOMPurify.sanitize(newAvatarUrl);

    if (sanitizedUrl.startsWith('blob:')) {
      setCurrentAvatar(sanitizedUrl);
      // TODO: Implement backend avatar upload if needed
    } else {
      console.error('Invalid avatar URL');
    }

    setIsAvatarModalOpen(false);
  };

  // =============================================
  // Effects
  // =============================================
  useEffect(() => {
    loadFromLocalStorage(); // Load immediately to prevent flicker
    fetchUserProfile();

    return () => {
      if (currentAvatar?.startsWith('blob:')) {
        URL.revokeObjectURL(currentAvatar);
      }
    };
  }, [fetchUserProfile, currentAvatar]);

  if (!authChecked) return <p>Checking authentication...</p>;

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
        <NavBar
          title="iHive-Entrepreneur"
          extraLinks={[
            { href: "/ideas", label: "Repositories" },
            { href: "/sponsors", label: "Sponsors" },
          ]}
        />

        <main className={styles.main}>
          {isLoading ? (
            <div className={styles.loading}>Loading profile...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
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
                  {bio && <p className={styles.bio}>{bio}</p>}
                </div>
                <div className={styles.socialLinks}>
                  <Link href={socialLinks.github} title="GitHub" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} className={styles.socialIcon} />
                  </Link>
                  <Link href={socialLinks.linkedin} title="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} className={styles.socialIcon} />
                  </Link>
                  <Link href={socialLinks.twitter} title="X" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faXTwitter} className={styles.socialIcon} />
                  </Link>
                </div>
              </div>

              <div className={styles.marquee}>
                <h2 className={styles.marqueeTitle}>Popular Repositories</h2>
                <MarqueeDemo />
              </div>
            </>
          )}
        </main>

        <Footer role="Entrepreneur" />
      </div>
    </>
  );
};

export default EntrepreneurProfile;
