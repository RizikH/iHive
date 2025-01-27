import React from 'react';
import styles from '../styles/investor.module.css';

const InvestorPage = () => {
  return (
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
  );
};

export default InvestorPage;
