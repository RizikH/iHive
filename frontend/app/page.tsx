'use client';

import Link from 'next/link';
import styles from '../styles/Home.module.css';
import '../styles/globals.css';


export default function Home() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <Link href="/">iHive</Link>
          </div>
          <ul className={styles.navLinks}>
            <li><Link href="#">Discover</Link></li>
            <li><Link href="#">Search</Link></li>
            <li><Link href="#">Tags</Link></li>
            <li><Link href="#">Profile</Link></li>
          </ul>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className={styles.main}>
        {/* Welcome Section */}
        <section className={styles.welcome}>
          <h1 style={{ color: 'azure' }}>iHive's Repo-Square</h1>
          <div className={styles.welcomeContent}>
            <p>👋 Welcome to iHive's Repositories Square!</p>
            <ul>
              <li>⭐ <strong>iHive</strong> serves as a bridge between skills and resources.</li>
              <li>⭐ Feel free to give us suggestions.</li>
              <li>⭐ Enjoy!</li>
            </ul>
            <div className={styles.socialIcons}>
              <Link href="#" className={styles.githubIcon} title="View Source in GitHub">GitHub</Link>
              <Link href="#" className={styles.discordIcon} title="Join us in Discord!">Discord</Link>
              <Link href="#" className={styles.twitterIcon} title="Follow us in Twitter!">Twitter</Link>
            </div>
          </div>
        </section>

        {/* Repo Cards Preview */}
        <section className={styles.repo} style={{ color: '#6C6C6C' }}>
          <article className={styles.postCard}>
            <h2>Title: Repo 1</h2>
            <p>README: Preview of the Repo, Maybe use AI to summarize?</p>
            <footer>
              <span>January 22, 2025</span>
              <span>Yixi</span>
            </footer>
          </article>

          <article className={styles.postCard}>
            <h2>Repo 2</h2>
            <p>README: Preview of the Repo, Maybe use AI to summarize?</p>
            <footer>
              <span>January 22, 2025</span>
              <span>Yixi</span>
            </footer>
          </article>
        </section>
      </main>
    </div>
  );
}
