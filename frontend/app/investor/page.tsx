"use client";

import React, { useEffect, useState } from "react";
import Head from 'next/head';
import Link from 'next/link';
import styles from "../styles/investor.module.css";
import "../styles/globals.css";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5432/api";

interface Idea {
    id: number;
    title: string;
    description: string;
    category?: string;
    funding_progress?: number;
    tags_name?: { id: number; tag_id: number }[]; 
}

interface Tag {
    id: number;
    name: string;
}

const InvestorPage = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loadingIdeas, setLoadingIdeas] = useState(true);
    const [errorIdeas, setErrorIdeas] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await fetch(`${API_URL}/ideas`);
                if (!response.ok) throw new Error('Failed to fetch ideas');
                const data = await response.json();
                setIdeas(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setErrorIdeas(err.message);
                } else {
                    setErrorIdeas("An unknown error occurred.");
                }
            } finally {
                setLoadingIdeas(false);
            }
        };

        fetchIdeas();
    }, []);

    const handleSearch = async () => {
        if (!searchTerm) return;
        try {
            const response = await fetch(`${API_URL}/ideas/search/title/${searchTerm}`);

            if (!response.ok) throw new Error('Failed to fetch search results');
            const data = await response.json();
            setIdeas(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorIdeas(err.message);
            } else {
                setErrorIdeas("An unknown error occurred.");
            }
        }
    };

    return (
        <>
            <Head>
                <title>Investor Profile</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

            <nav className={styles.navbar}>
                <div className={styles.logo}>iHive - Investor</div>
                <div className={styles['nav-links']}>
                    <Link href="#investments">Investments</Link>
                    <Link href="#setting">Settings</Link>
                    <Link href="#get-started">Signout</Link>
                </div>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search ideas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch} className={styles.searchButton}>Search</button>
                </div>
            </nav>

            <main className={styles.pageContainer}>
                <div className={styles.postsGrid}>
                    {loadingIdeas && <p>Loading ideas...</p>}
                    {errorIdeas && <p>Error: {errorIdeas}</p>}
                    {!loadingIdeas && !errorIdeas && ideas.length === 0 && <p>No ideas found.</p>}

                    {ideas.map((idea) => (
                        <div className={styles.postCard} key={idea.id}>
                            <h3>{idea.title}</h3>
                            <p>{idea.description}</p>
                            <button className={styles.investButton}>💰 Invest</button>
                        </div>
                    ))}
                </div>

                <div className={styles.profile}>
                    <h2>Investor Profile</h2>
                    <div className={styles.profileContent}>
                        <div className={styles['profile-image']} title="Change Your Avatar">
                            <Image
                                src="/Images/investor-avatar.png"
                                alt="Investor Avatar"
                                className={styles.avatar}
                                width={100}
                                height={100}
                            />
                        </div>
                        <h1>Investor Name</h1>
                    </div>
                </div>
            </main>
        </>
    );
};

export default InvestorPage;
