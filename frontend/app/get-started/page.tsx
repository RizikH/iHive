"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/get-started.module.css"; 
import "../styles/globals.css"; 
import { BoxRevealDemo } from '@/components/box-reveal-demo';

// =============================================
// Main Component
// =============================================

const GetStartedPage: React.FC = () => {
    return (
        <div className={styles.bodyContainer}>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="Description" content="" />
                <title>iHive</title>
                <link rel="icon" href="/Images/iHive.png" />
            </Head>
            
            {/*Navigation*/}
            <nav className={styles.navContainer}>
                <div className={styles.logo}>
                <Image
                    src="/Images/iHive.png"
                    alt="Logo"
                    title="Home"
                    width={35}
                    height={35}
                    className={styles.logoImage}
                />
                <Link href="/">iHive</Link>
                </div>
            </nav>

            {/*Main Content*/}
            <main className={styles['main-content']}>
                {/*Interactive Box Animation*/}
                <BoxRevealDemo />
                
                {/*Logo*/}
                <div className={styles['ihive-icon']}>
                    <Image 
                        src="/Images/iHive.png" 
                        alt="iHive"
                        width={300}
                        height={300}
                        priority
                    />
                </div>
            </main>
        </div>
    );
};

export default GetStartedPage;
