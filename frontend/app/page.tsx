'use client';
import Link from 'next/link';
import styles from '../styles/home.module.css';
import '../styles/globals.css';
import React from "react";

export default function Home() {
  return (
    <div className={styles.container}>

      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>iHive - Home</div>
        <div className={styles['nav-links']}>
          <Link href="#investments">Investments</Link>
          <Link href="#setting">Settings</Link>
          <Link href="#get-started">Signout</Link>
        </div>
      </nav>

      {/* Split Layout */}
      <div className={styles.splitContainer}>

        {/* Entrepreneur Side */}
        <section className={styles.entrepreneurSide}>
          <h1>For Entrepreneurs</h1>
          <p>🚀 Launch your startup and find investors.</p>
          <Link href="/entrepreneur">
            <button className={styles.entrepreneurButton}>Explore Entrepreneurs</button>
          </Link>

          <div className={styles.featuredProjects}>
            <h2>Featured Startups</h2>
            <article className={styles.projectCard}>
              <h3>Startup Name</h3>
              <p>Brief description of the startup...</p>
            </article>
            <article className={styles.projectCard}>
              <h3>Startup Name</h3>
              <p>Brief description of the startup...</p>
            </article>
          </div>
        </section>

        {/* Investor Side */}
        <section className={styles.investorSide}>
          <h1>For Investors</h1>
          <p>💰 Discover innovative startups to invest in.</p>
          <Link href="/investor">
            <button className={styles.investorButton}>Explore Investor</button>
          </Link>

          <div className={styles.featuredInvestments}>
            <h2>Top Investments</h2>
            <article className={styles.investmentCard}>
              <h3>Investment Opportunity</h3>
              <p>Brief description of the opportunity...</p>
            </article>
            <article className={styles.investmentCard}>
              <h3>Investment Opportunity</h3>
              <p>Brief description of the opportunity...</p>
            </article>
          </div>
        </section>

      </div>
    </div>
  );
}