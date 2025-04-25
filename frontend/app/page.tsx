"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "@/app/styles/home.module.css";
import React from "react";
import NavBar from "@/components/nav-bar";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <nav className={styles.navBar}>
        <NavBar />
      </nav>

      {/* Hero Section */}
      <div className={styles.landingContent}>
        <h1 className={styles.welcomeTitle}>
          Hi, welcome to <span className={styles.brandName}>iHive</span>
          <Image
            src="/Images/iHive.png"
            alt="iHive Logo"
            width={40}
            height={40}
            className={styles.inlineLogo}
          />
        </h1>

        <p className={styles.description}>
          iHive is your collaborative launchpad for turning bold ideas into reality. Think of it as GitHub for innovation — a platform where entrepreneurs can showcase their projects, collaborate with others, and connect with investors ready to support the next big thing.
        </p>

        <h2 className={styles.callToActionTitle}>
          Are you ready to embark on a journey and make your goals come true?
        </h2>
        <p className={styles.callToActionText}>
          Join iHive today and break through the limits. Whether you're building or backing, your future starts here.
        </p>

        <Link href="/get-started">
          <button className={styles.getStartedButton}>Login / Register</button>
        </Link>
      </div>
    </div>
  );
}
