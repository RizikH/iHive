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

// Utils
import { fetcher } from '@/app/utils/fetcher';

// Styles
import styles from '../styles/entrepreneur-profile.module.css';

const EntrepreneurProfile = () => {
  // =============================================
  // State Management
  // =============================================
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

  // =============================================
  // API Functions
  // =============================================
  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      // Get user ID from localStorage (set during login)
      const storedUserId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');
      
      // Log information for debugging
      console.log('Attempting to fetch profile with user_id:', storedUserId);
      
      if (!storedUserId) {
        console.log('No user_id found in localStorage, falling back to local data');
        // Add debug info
        setDebugInfo(JSON.stringify({
          message: 'No user_id in localStorage',
          localStorage: {
            username: localStorage.getItem('username'),
            jobTitle: localStorage.getItem('jobTitle'),
            skills: localStorage.getItem('skills'),
            token: token ? 'Present (not shown)' : 'Not present'
          }
        }, null, 2));
        
        // Only load essential profile data from localStorage
        loadEssentialProfileData();
        return;
      }
      
      setUserId(storedUserId);
      
      // Add Authorization header if token exists
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Fetch user data from API
      console.log('Fetching from API endpoint:', `/users/get/${storedUserId}`);
      
      setDebugInfo('Attempting to fetch user data...');
      const userData = await fetcher(`/users/get/${storedUserId}`, 'GET', undefined, headers);
      
      console.log('Received user data:', userData);
      setDebugInfo(null); // Clear debug info on success
      
      // Update state with API data based on the actual backend schema
      if (userData) {
        setUsername(userData.username || 'user');
        
        // Handle potential different field names
        setJobTitle(userData.job_title || userData.jobTitle || '');
        setSkills(userData.skills || '');
        setBio(userData.bio || '');
        
        // User avatar - check multiple possible field names
        if (userData.avatar_url || userData.avatarUrl || userData.avatar) {
          setCurrentAvatar(userData.avatar_url || userData.avatarUrl || userData.avatar);
        }
        
        // Social links - check multiple possible field names
        setSocialLinks({
          github: userData.github_url || userData.githubUrl || userData.github || 'https://github.com',
          linkedin: userData.linkedin_url || userData.linkedinUrl || userData.linkedin || 'https://linkedin.com',
          twitter: userData.twitter_url || userData.twitterUrl || userData.twitter || 'https://twitter.com'
        });
        
        // Store only essential data in localStorage for faster loading on next visit
        storeEssentialProfileData(userData);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      
      // More detailed error logging
      if (err instanceof Error) {
        setError(`Failed to load profile data: ${err.message}`);
        // Add detailed debug info
        setDebugInfo(JSON.stringify({
          error: err.message,
          stack: err.stack,
          userId: localStorage.getItem('user_id'),
          hasToken: !!localStorage.getItem('token'),
          localStorage: {
            username: localStorage.getItem('username'),
            jobTitle: localStorage.getItem('jobTitle'),
            skills: localStorage.getItem('skills')
          }
        }, null, 2));
      } else {
        setError('Failed to load profile data: Unknown error');
        setDebugInfo(JSON.stringify(err, null, 2));
      }
      
      // Load only essential profile data as fallback
      console.log('Falling back to essential profile data due to API error');
      loadEssentialProfileData();
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserProfile = async (data: any) => {
    if (!userId) return;
    
    try {
      // Use the PUT /api/users/update/:id endpoint
      await fetcher(`/users/update/${userId}`, 'PUT', data);
      
      // Update local storage
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      
      // Refresh user data
      fetchUserProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };
  
  // Store only essential profile data in localStorage
  const storeEssentialProfileData = (userData: any) => {
    // Only store minimal data required for UI rendering when offline
    localStorage.setItem('username', userData.username || 'user');
    localStorage.setItem('jobTitle', userData.job_title || userData.jobTitle || '');
    localStorage.setItem('skills', userData.skills || '');
    // Don't store large data like complete user profile or ideas
  };
  
  // Load minimal essential profile data from localStorage
  const loadEssentialProfileData = () => {
    // Get user data from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedJobTitle = localStorage.getItem('jobTitle');
    const storedSkills = localStorage.getItem('skills');
    const storedBio = localStorage.getItem('bio');
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
    
    if (storedBio) {
      setBio(storedBio);
    }
    
    // Update social links if available in localStorage
    setSocialLinks(prev => ({
      github: storedGithub || prev.github,
      linkedin: storedLinkedin || prev.linkedin,
      twitter: storedTwitter || prev.twitter
    }));
  };

  // =============================================
  // Event Handlers
  // =============================================
  const handleAvatarChange = async (newAvatarUrl: string) => {
    if (currentAvatar.startsWith('blob:')) URL.revokeObjectURL(currentAvatar);
    const sanitizedUrl = DOMPurify.sanitize(newAvatarUrl);
    
    if (sanitizedUrl.startsWith('blob:')) {
      setCurrentAvatar(sanitizedUrl);
      
      // Save to backend
      try {
        // const formData = new FormData();
        // const blob = await fetch(sanitizedUrl).then(r => r.blob());
        // formData.append('avatar', blob, 'avatar.jpg');
        // await fetcher('/users/avatar', 'POST', formData);
      } catch (err) {
        console.error('Failed to save avatar:', err);
      }
    } else {
      console.error('Invalid avatar URL');
    }
    
    setIsAvatarModalOpen(false);
  };

  // =============================================
  // Effects
  // =============================================
  useEffect(() => {
    loadEssentialProfileData();
    
    fetchUserProfile();
    
    return () => {
      if (currentAvatar.startsWith('blob:')) URL.revokeObjectURL(currentAvatar);
    };
  }, []);

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
          {isLoading ? (
            <div className={styles.loading}>Loading profile...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
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

              {/* Repository Showcase */}
              <div className={styles.marquee}>
                <h2 className={styles.marqueeTitle}>Popular Repositories</h2>
                <MarqueeDemo />
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <Footer role="Entrepreneur" />
      </div>
    </>
  );
};

export default EntrepreneurProfile;