import styles from '@/styles/repo.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function Repository() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Link href="/">iHive</Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/repository">Repository</Link>
          <Link href="/entrepreneur">Profile</Link>
          <Link href="/get-started">Sign Out</Link>
        </nav>
        <div className={styles.toolbox}>
          <div className={styles.searchTool}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div className={styles.searchTool}>Search</div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.timelineContainer}>
          <div className={styles.timelineIcon}>
            <Image 
              src="/Images/iHive.png"
              alt="Logo"
              width={80}
              height={80}
            />
          </div>
          
          <div className={styles.timelineLine}></div>
          
          <div className={styles.githubLink}>
            <Link href="https://github.com">
              <svg width="24" height="24" viewBox="0 0 24 24">
                {/* GitHub icon path */}
              </svg>
            </Link>
          </div>

          <div className={styles.description}>
            This is a quote. Briefly describe the repositories.
          </div>

          <div className={styles.timelineSection}>
            <h2>Repositories</h2>
            <div className={styles.card}>
              <ul>
                <li><strong>Repo 1</strong> - description...</li>
                <li><strong>Repo 2</strong> - description...</li>
                <li><strong>Repo 3</strong> - description...</li>
                <li><strong>Repo 4</strong> - description...</li>
              </ul>
            </div>
          </div>

          <div className={styles.acknowledgementSection}>
            <h2>Acknowledgements</h2>
            <div className={styles.card}>
              <ul>

                <li>Acknowledgement</li>
                <li>Acknowledgement</li>
                {/* Add more items */}
              </ul>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
