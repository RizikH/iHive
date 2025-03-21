"use client"

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/sponsors.module.css';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import AvatarCirclesDemo from '@/components/avatar-circles-demo';
import AnimatedListDemo from "@/components/animated-list-demo";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend
  
);

// =============================================
// Main Component
// =============================================

const Sponsors = () => {
  // Chart configuration data
  const chartData = {
    labels: ['Gold Sponsors', 'Silver Sponsors', 'Bronze Sponsors'],  // labels for now, maybe sponsors' username
    datasets: [{
      data: [300, 200, 100],  // invest amount
      backgroundColor: ['#ffd700', '#c0c0c0', '#cd7f32'],  // make a random color for each
      borderColor: ['#fff', '#fff', '#fff'],
      borderWidth: 2
    }]
  };

  // Chart display options
  const options = {
    responsive: true, 
    plugins: {
      legend: {
        position: 'bottom' as const, 
      }, 
      title: {
        display: true, 
        text: 'Sponsor Distribution'
      }
    }
  };

  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0;" />
        <title>iHive | Your Sponsors</title>
        <link rel="icon" href="/Images/iHive.png" />
    </Head>

    <div className={styles.container}>
      {/*Navigation*/}
      <nav className={styles.navContainer}>
        <div className={styles.logo}>
          <Link href="/" title="Home" className="flex items-center gap-2">
            <Image
              src="/Images/iHive.png"
              alt="Logo"
              width={35}
              height={35}
              className={styles.logoImage}
            />
            <span>iHive-Entrepreneur</span>
          </Link>
        </div>
        <div className={styles['nav-links']}>
          <Link href="/repository">Repository</Link>
          <Link href="/setting">Setting</Link>
          <Link href="/entrepreneur">Profile</Link>
          <Link href="/get-started">Sign Out</Link>
        </div>
      </nav>

      {/*Main Content*/}
      <main className={styles.main}>
        {/*Profile and Recent Sponsors Section*/}
        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
              <Image src="/Images/sample.jpeg" alt="Profile" title="Change your Avatar"/>
          </div>
          
          <h1 className={styles.recently}>Recent Sponsors...</h1>

          {/*Sponsor Avatar Circles*/}
          <div className={styles.avatarCircles}>
            <AvatarCirclesDemo />
          </div>

          {/*Notifications and Messages*/}
          <div className={styles.notifications}>
            <AnimatedListDemo />
          </div>
        </div>

        {/*Sponsorship Analytics*/}
        <div className={styles.graph}>
          <h2 className={styles.graphTitle}>Your Sponsors Graph</h2>
          <div className={styles.graphContainer}>
            <Pie data={chartData} options={options} />
          </div>
        </div>
      </main>

      {/*Footer*/}
      <footer className={styles.footer}>
        <p>
          © 2025 iHive · Entrepreneur | <Link href="/terms" target='_blank'>Terms</Link> | <Link href="/Privacy" target='_blank'>Privacy</Link>
        </p>
      </footer>
    </div>
    </>
  );
}

export default Sponsors;