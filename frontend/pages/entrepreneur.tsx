import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/entrepreneur-profile.module.css';
import '../styles/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';


/*
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
                <meta name="Description" content="Main profile page." />
                <title>Entrepreneur Profile</title>
                <link 
                    rel="stylesheet" 
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
                />
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

            <nav className={styles.navbar}>
                <div className={styles.logo}>iHive - Profile</div>
                <div className={styles['nav-links']}>
                    <Link href="#about">About/Bio</Link>
                    <Link href="#repo">Repository</Link>
                    <Link href="#setting">Setting</Link>
                    <Link href="#get-started">Signout</Link>
                </div>
            </nav>

            <main className={styles['profile-container']}>
                <div className={styles['profile-content']}>
                    <div className={styles['profile-image']} title="Change Your Avatar">
                        <Image 
                            src="/Images/Yixi.jpeg" 
                            alt="User's Avatar"
                            width={150}  // Adjust
                            height={150} // Adjust
                        />
                    </div>
                    <h1 title="Username">UserName</h1>
                    <div className={styles.skills} title="job-titles/skills">
                        <p>Front-End</p>
                        <p>Machine Learning</p>
                        <p>Artificial Intelligence</p>
                    </div>
                    <div className={styles['social-links']}>
                        <FontAwesomeIcon icon={faGithub} />
                        <FontAwesomeIcon icon={faTwitter} />
                        <FontAwesomeIcon icon={faLinkedin} />
                    </div>
                </div>
            </main>

            <footer className={styles.footer} title="footer">
                <p>@iHive · Username</p>
            </footer>
        </>
    );
};

export default EntrepreneurProfile;