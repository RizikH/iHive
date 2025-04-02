"use client";

import React from 'react';

// Next.js
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

// Components
import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer';
import AvatarCirclesDemo from '@/components/avatar-circles-demo';
import AnimatedListDemo from "@/components/animated-list-demo";

// Chart.js
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Styles
import styles from '../styles/sponsors.module.css';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// =============================================
// Main Component
// =============================================
const Sponsors = () => {
  // Profile state
  const [currentAvatar, setCurrentAvatar] = React.useState('https://avatar.vercel.sh/jack');

  // =============================================
  // Chart Configuration
  // =============================================
  // Chart configuration data
  const chartData = {
    labels: ['Gold Sponsors', 'Silver Sponsors', 'Bronze Sponsors'],
    datasets: [{
      data: [300, 200, 100],
      backgroundColor: ['#ffd700', '#c0c0c0', '#cd7f32'],
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

  // =============================================
  // Render Component
  // =============================================
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0;" />
        <title>iHive | Your Sponsors</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.container}>
        {/* Navigation */}
        <NavBar 
          title="iHive-Entrepreneur"
          links={[
            { href: "/ideas", label: "Repositories" },
            { href: "/setting", label: "Setting" },
            { href: "/entrepreneur", label: "Profile" },
            { href: "/get-started", label: "Sign Out" }
          ]}
        />

        {/* Main Content */}
        <main className={styles.main}>
          {/* Profile and Recent Sponsors Section */}
          <div className={styles.profileSection}>
            <div className={styles.profileImage}>
              <Image
                src={currentAvatar}
                alt="Avatar"
                width={150}
                height={150}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>

            <h1 className={styles.recently}>Recent Sponsors...</h1>

            {/* Sponsor Avatar Circles */}
            <div className={styles.avatarCircles}>
              <AvatarCirclesDemo />
            </div>

            {/* Notifications and Messages */}
            <div className={styles.notifications}>
              <AnimatedListDemo />
            </div>
          </div>

          {/* Sponsorship Analytics */}
          <div className={styles.graph}>
            <h2 className={styles.graphTitle}>Your Sponsors Graph</h2>
            <div className={styles.graphContainer}>
              <Pie data={chartData} options={options} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer 
          role="Entrepreneur"
          links={[
            { href: "/terms", label: "Terms" },
            { href: "/privacy", label: "Privacy" }
          ]}
        />
      </div>
    </>
  );
};

export default Sponsors;