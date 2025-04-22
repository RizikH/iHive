"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/nav-bar';
import Footer from '@/components/footer';
import AvatarCirclesDemo from '@/components/avatar-circles-demo';
import AnimatedListDemo from "@/components/animated-list-demo";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import styles from '../styles/sponsors.module.css';
import '../styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { useRouter } from 'next/navigation';

ChartJS.register(ArcElement, Tooltip, Legend);

const Sponsors = () => {
  const [currentAvatar, setCurrentAvatar] = useState('https://avatar.vercel.sh/jack');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const timeout = setTimeout(() => router.push("/get-started"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Please log in to view this page...</p>;
  }

  const chartData = {
    labels: ['Gold Sponsors', 'Silver Sponsors', 'Bronze Sponsors'],
    datasets: [{
      data: [300, 200, 100],
      backgroundColor: ['#ffd700', '#c0c0c0', '#cd7f32'],
      borderColor: ['#fff', '#fff', '#fff'],
      borderWidth: 2
    }]
  };

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
        <NavBar 
          title="iHive-Entrepreneur"
          links={[
            { href: "/ideas", label: "Repositories" },
            { href: "/setting", label: "Setting" },
            { href: "/entrepreneur", label: "Profile" },
            { href: "/get-started", label: "Sign Out" }
          ]}
        />

        <main className={styles.main}>
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

            <div className={styles.avatarCircles}>
              <AvatarCirclesDemo />
            </div>

            <div className={styles.notifications}>
              <AnimatedListDemo />
            </div>
          </div>

          <div className={styles.graph}>
            <h2 className={styles.graphTitle}>Your Sponsors Graph</h2>
            <div className={styles.graphContainer}>
              <Pie data={chartData} options={options} />
            </div>
          </div>
        </main>

        <Footer role="Entrepreneur" />
      </div>
    </>
  );
};

export default Sponsors;