import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/entrepreneur-profile.module.css';
import '../styles/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

/*
To install FontAwesome, run:
npm install @fortawesome/fontawesome-svg-core \
            @fortawesome/free-brands-svg-icons \
            @fortawesome/react-fontawesome
*/

const EntrepreneurProfile: React.FC = () => {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="Author" content="Yixi Xie" />
                <meta name="Description" content="Entrepreneur Profile Page." />
                <title>Entrepreneur Profile</title>
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

            <nav className={styles.navbar}>
                <div className={styles.logo}>iHive - Profile</div>
                <div className={styles['nav-links']}>
                    <Link href="/#about"><span>About/Bio</span></Link>
                    <Link href="/#repo"><span>Repository</span></Link>
                    <Link href="/#setting"><span>Settings</span></Link>
                    <Link href="/"><span>Sign Out</span></Link>
                </div>
            </nav>

            <main className={styles['profile-container']}>
                <div className={styles['profile-content']}>
                    <div className={styles['profile-image']} title="Change Your Avatar">
                        <Image 
                            src="/Images/Yixi.jpeg" 
                            alt="User's Avatar"
                            width={150}
                            height={150}
                            priority
                        />
                    </div>
                    <h1 title="Username">UserName</h1>
                    <div className={styles.skills} title="Job Titles/Skills">
                        <p>Front-End</p>
                        <p>Machine Learning</p>
                        <p>Artificial Intelligence</p>
                    </div>
                    <div className={styles['social-links']}>
                        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faGithub} title="GitHub" />
                        </a>
                        <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} title="Twitter" />
                        </a>
                        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} title="LinkedIn" />
                        </a>
                    </div>
                </div>
            </main>

            <footer className={styles.footer} title="Footer">
                <p>@iHive · Username</p>
            </footer>
        </>
    );
};

export default EntrepreneurProfile;
