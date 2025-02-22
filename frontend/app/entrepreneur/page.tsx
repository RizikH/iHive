import React from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/entrepreneur-profile.module.css";
<<<<<<< HEAD
import "../styles/globals.css";
=======
import "../styles/globals.css"; // ✅ Fixed Import Path
>>>>>>> 1b1ca75 (Modified the pages)
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const EntrepreneurProfile: React.FC = () => {
  return (
    <>
      <Head>
        <title>Entrepreneur Profile</title>
      </Head>

      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>iHive - Profile</div>
        <div className={styles["nav-links"]}>
          <Link href="/entrepreneur#about"><span>About/Bio</span></Link>
          <Link href="/entrepreneur#repo"><span>Repository</span></Link>
          <Link href="/entrepreneur#settings"><span>Settings</span></Link>
          <Link href="/"><span>Sign Out</span></Link>
        </div>
      </nav>

      {/* Profile Section */}
      <main className={styles["profile-container"]}>
        <div className={styles["profile-content"]}>
          <h1 title="Username">UserName</h1>
          <div className={styles["social-links"]}>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default EntrepreneurProfile;
