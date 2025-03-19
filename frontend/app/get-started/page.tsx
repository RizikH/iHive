"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/get-started.module.css";
import "../styles/globals.css";
import { BoxRevealDemo } from "@/components/box-reveal-demo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const GetStartedPage: React.FC = () => {
    const [ideaCount, setIdeaCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await fetch(`${API_URL}/ideas`);
                const data = await response.json();
                setIdeaCount(data.length); // Count the number of ideas
            } catch (error) {
                console.error("Failed to fetch ideas", error);
            }
        };

        fetchIdeas();
    }, []);

    return (
        <div className={styles.bodyContainer}>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>iHive</title>
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

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

            <main className={styles["main-content"]}>
                <BoxRevealDemo />
                <div className={styles["ihive-icon"]}>
                    <Image
                        src="/Images/iHive.png"
                        alt="iHive"
                        width={300}
                        height={300}
                        priority
                    />
                </div>
            </main>

            {/* Idea Count Section */}
            <section className={styles.infoSection}>
                <h1>Entrepreneurs & Investors</h1>
                <p>Join a thriving community of innovators sharing their best ideas.</p>
                <p className={styles.stats}>
                    {ideaCount !== null ? `${ideaCount} ideas shared so far!` : "Loading..."}
                </p>

                {/* Two-Column Layout */}
                <div className={styles.columnContainer}>
                    <div className={styles.column}>
                        <h2>For Entrepreneurs</h2>
                        <p>Pitch your next big idea, gain feedback, and connect with investors looking for the next big opportunity.</p>
                        <ul>
                            <li>Post and refine your ideas</li>
                            <li>Get feedback from industry experts</li>
                            <li>Find potential investors</li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h2>For Investors</h2>
                        <p>Discover groundbreaking startup ideas, connect with talented entrepreneurs, and invest in the future.</p>
                        <ul>
                            <li>Browse innovative ideas</li>
                            <li>Connect with entrepreneurs</li>
                            <li>Find high-potential investments</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GetStartedPage;
