import React from 'react';
import styles from '../styles/get-started.module.css';

const GetStarted = () => {
    return (
        <>
            <nav>
                <div className={styles.logo}>iHive</div>
                <div className={styles["nav-links"]}>
                    <a href="#about">About</a>
                    <a href="#features">Features</a>
                    <a href="#contact">Contact</a>
                </div>
            </nav>
            <main className={styles.mainContant}>
                <div className={styles.introText}>
                    <h1>WELCOME TO<br />THE iHIVE.<br />GET STARTED.</h1>
                    <p>Connect, collaborate, and create in our digital repo-system.
                        Join the community of investors and entrepreneurs.</p>
                    <a href="#sign-up" className={styles.ctaButton} title="Sign up">Get Started</a>
                </div>
                <div className={styles.ihiveIcon}>
                    <img src="../app/iHive.png" alt="iHive" />
                </div>
            </main>
        </>
    );
};

export default GetStarted;
