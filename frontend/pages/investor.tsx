import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/investor.module.css';
import '../styles/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const InvestorPage = () => {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="Author" content="Yixi Xie" />
                <meta name="Description" content="Investor profile page." />
                <title>Investor Profile</title>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
                />
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

            <nav className={styles.navbar}>
                <div className={styles.logo}>iHive - Profile</div>
                <div className={styles['nav-links']}>
                    <Link href="#about">Search</Link>
                    <Link href="#repo">Investments</Link>
                    <Link href="#setting">Setting</Link>
                    <Link href="#get-started">Signout</Link>
                </div>
            </nav>

            <main className={styles['profile-container']}>
                <div className={styles['profile-content']}>
                    {/* Avatar Section */}
                    <div className={styles['profile-image']} title="Change Your Avatar">
                        <img
                            src="/Images/investor-avatar.png"
                            alt="Investor Avatar"
                            className={styles.avatar}
                        />
                    </div>
                    <h1 title="Investor Name">Investor Name</h1>

                    {/* Investor Stats */}
                    <div className={styles['investor-stats']}>
                        <p>Investments: <strong>$50,000</strong></p>
                        <p>Projects Followed: <strong>12</strong></p>
                        <p>Investment Return: <strong>18%</strong></p>
                    </div>
                </div>

                {/* Posts Grid Section */}
                <div className={styles.postsGrid}>
                    {[1, 2, 3, 4].map((post) => (
                        <div className={styles.postCard} key={post}>
                            <h3>Project {post}</h3>
                            <p>This is a temporary post with relevant details.</p>
                            <div className={styles.tags}>
                                <span>#AI</span> <span>#FinTech</span>
                            </div>
                            <div className={styles.fundingProgress}>
                                <div className={styles.fundingBar} style={{ width: '70%' }}></div>
                            </div>
                            <button className={styles.investButton}>💰 Invest</button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>@iHive · Investor</p>
            </footer>
        </>
    );
};

export default InvestorPage;
