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
    price?: number;
}

const InvestorPage = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loadingIdeas, setLoadingIdeas] = useState(true);
    const [errorIdeas, setErrorIdeas] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tagsFilter, setTagsFilter] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
    const [showFilterPopup, setShowFilterPopup] = useState(false);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await fetch(`${API_URL}/ideas`);
                if (!response.ok) throw new Error('Failed to fetch ideas');
                const data = await response.json();
                setIdeas(data || []); // Ensure data is always an array
            } catch (err: unknown) {
                setErrorIdeas(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setLoadingIdeas(false);
            }
        };

        fetchIdeas();
    }, []);

    useEffect(() => {
        const fetchSearchedIdeas = async () => {
            if (searchTerm === '') {
                const response = await fetch(`${API_URL}/ideas`);
                const data = await response.json();
                setIdeas(data || []);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/ideas/search/title/${searchTerm}`);
                if (!response.ok) throw new Error('Failed to fetch search results');
                const data = await response.json();
                setIdeas(data || []);
            } catch (err: unknown) {
                setErrorIdeas(err instanceof Error ? err.message : "An unknown error occurred.");
            }
        };

        fetchSearchedIdeas();
    }, [searchTerm]);

    const handleAddTag = (tag: string) => {
        if (!tagsFilter.includes(tag)) {
            setTagsFilter((prevTags) => [...prevTags, tag]);
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTagsFilter((prevTags) => prevTags.filter((t) => t !== tag));
    };

    const handleApplyFilters = () => {
        const filteredIdeas = ideas.filter((idea) => {
            const matchesTags = tagsFilter.every((tag) =>
                idea.tags_name?.some((t) => t.tag_id === Number(tag)) // Convert tag to number
            );
            const matchesPrice = idea.price !== undefined &&
                idea.price >= priceRange[0] &&
                idea.price <= priceRange[1];

            return matchesTags && matchesPrice;
        });

        setIdeas(filteredIdeas);
        setShowFilterPopup(false);
    };

    return (
        <>
            <Head>
                <title>Investor Profile</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
                    <Link href="/">iHive-Investors</Link>
                </div>
                <div className={styles['nav-links']}>
                    <Link href="#investments">Investments</Link>
                    <Link href="#setting">Settings</Link>
                    <Link href="#get-started">Signout</Link>
                    <Link href="/investor-profile">
                        <Image
                            src="/Images/Yixi.jpeg"
                            alt="Investor Profile"
                            width={40}
                            height={40}
                            className={styles.avatarIcon}
                        />
                    </Link>
                </div>

                {/* Search and Filter Section */}
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search ideas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className={styles.searchButton}>Search</button>
                    <button className={styles.filterButton} onClick={() => setShowFilterPopup(true)}>
                        Filter
                    </button>
                </div>
            </nav>
            {showFilterPopup && (
                <div className={styles.filterPopup}>
                    <div className={styles.filterContent}>
                        <h3>Filter Ideas</h3>
                        <div>
                            <input
                                type="text"
                                placeholder="Add a tag"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        handleAddTag(e.currentTarget.value.trim());
                                        e.currentTarget.value = '';
                                    }
                                }}
                            />
                            <div>
                                {tagsFilter.map((tag, index) => (
                                    <span key={index} className={styles.tag}>
                                        {tag} <button onClick={() => handleRemoveTag(tag)}>x</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label>Price Range:</label>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                            />
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                            />
                            <p>Price: {priceRange[0]} - {priceRange[1]}</p>
                        </div>
                        <button className={styles.applyFiltersButton} onClick={handleApplyFilters}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
            {/* Main Content */}
            <main className={styles.pageContainer}>
                <div className={styles.postsGrid}>
                    {loadingIdeas && <p>Loading ideas...</p>}
                    {errorIdeas && <p>Error: {errorIdeas}</p>}
                    {!loadingIdeas && !errorIdeas && ideas?.length === 0 && <p>No ideas found.</p>}

                    {ideas.map((idea, index) => (
                        <div className={styles.postCard} key={idea.id || index}>
                            <h3>{idea.title}</h3>
                            <p>{idea.description}</p>
                            <p>{idea.category}</p>
                            <p>
                                {Array.isArray(idea.tags_name)
                                    ? idea.tags_name.join(", ")
                                    : idea.tags_name}
                            </p>
                            <button className={styles.investButton}>💰 Invest</button>
                        </div>
                    ))}
                </div>
            </main>
            {/* Footer */}
            <footer className={styles.footer}>
                <p>
                    © 2025 iHive · Entrepreneur | <Link href="/terms" target='_blank'>Terms</Link> | <Link href="/Privacy" target='_blank'>Privacy</Link>
                </p>
            </footer>
        </>
    );
};

export default InvestorPage;
