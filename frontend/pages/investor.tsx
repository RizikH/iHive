import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import styles from '../styles/investor.module.css';

const InvestorPage = () => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Investor Profile</title>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>iHive - Investor</div>
        <div className={styles['nav-links']}>
          <Link href="#about">About/Bio</Link>
          <Link href="#portfolio">Portfolio</Link>
          <Link href="#setting">Settings</Link>
          <Link href="#get-started">Signout</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className={styles.pageContainer}>
        {/* Left Side: Grid with Posts */}
        <div className={styles.postsGrid}>
          <div className={styles.postCard}>
            <h3>Post 1</h3>
            <p>This is a temporary post with relevant details.</p>
          </div>
          <div className={styles.postCard}>
            <h3>Post 2</h3>
            <p>This is another temporary post with more information.</p>
          </div>
          <div className={styles.postCard}>
            <h3>Post 3</h3>
            <p>Here’s another example of a post.</p>
          </div>
          <div className={styles.postCard}>
            <h3>Post 4</h3>
            <p>This post can be edited with real content later.</p>
          </div>
        </div>

        {/* Right Side: Profile with Buttons */}
        <div className={styles.profile}>
          <h2>Investor Profile</h2>
          <div className={styles.profileContent}>
            <p>Welcome, [Investor Name]! Here's an overview of your portfolio and activity.</p>
            <p>In this section, we provide all the necessary information regarding your investments, returns, and recent updates.</p>
            <div className={styles.buttonsContainer}>
              <button className={styles.profileButton}>View Portfolio</button>
              <button className={styles.profileButton}>Investment History</button>
              <button className={styles.profileButton}>Contact Support</button>
              <button className={styles.profileButton}>Edit Profile</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>@iHive · Investor</p>
      </footer>
    </>
  );
};

export default InvestorPage;
