import React from 'react';
import styles from '../styles/get-started.css';

const GetStarted = () => {
    return (
        <nav>
            <div className={styles.logo}>iHive</div>
            <div className={styles.nav-links}>
                <a href="#about">About</a>
                <a href="#features">Features</a>
                <a href="#contact">Contact</a>
            </div>
        </nav>
        <main className={styles.main-contant}>
            <div className={styles.intro-text}>
                <h1>WELCOME TO<br>THE iHIVE.<br>GET STARTED.</h1>
                <p>Connect, collaborate, and create in our digital repo-system. 
                Join the community of investor and entrepreneur.</p>
                <a href="#sign-up" className={styles.cta-button} title="Sign up">Get Started</a>
            </div>
            <div className={ihive-icon}>
                <img src="../app/iHive.png" alt="iHive">
            </div>
        </main>
    );
};