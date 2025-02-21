import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/get-started.module.css"; // ✅ Fixed Import Path
import "@/styles/globals.css"; // ✅ Fixed Import Path

const GetStartedPage: React.FC = () => {
    return (
        <>
            <Head>
                <title>iHive - Get Started</title>
                <link rel="icon" href="/ihive.png" />
            </Head>

            <nav className={styles.nav}>
                <div className={styles.logo}>iHive</div>
                <div className={styles["nav-links"]}>
                    <Link href="/get-started#about"><span>About</span></Link>
                    <Link href="/get-started#features"><span>Features</span></Link>
                    <Link href="/get-started#contact"><span>Contact</span></Link>
                </div>
            </nav>

            <main className={styles["main-content"]}>
                <div className={styles["intro-text"]}>
                    <h1>WELCOME TO<br /> THE iHIVE.<br /> GET STARTED.</h1>
                    <Link href="/get-started">
                        <span className={styles["cta-button"]}>Get Started</span>
                    </Link>
                </div>

                <Image src="/ihive.png" alt="iHive Logo" width={300} height={300} priority />
            </main>
        </>
    );
};

export default GetStartedPage;
