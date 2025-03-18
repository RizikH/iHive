"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/investor.module.css";
import "../styles/globals.css";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Tag {
    id: number;
    name: string;
}

interface IdeaTag {
    id: number;
    tag_id: number;
    idea_id: number;
    tags: Tag;
}

interface Idea {
    id: number;
    title: string;
    description: string;
    category?: string;
    funding_progress?: number;
    idea_tags?: IdeaTag[];
    price?: number;
}

const InvestorPage = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loadingIdeas, setLoadingIdeas] = useState(true);
    const [errorIdeas, setErrorIdeas] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [tagsFilter, setTagsFilter] = useState<Tag[]>([]); // Now storing selected tags as objects
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [filteredTags, setFilteredTags] = useState<Tag[]>([]); // Holds filtered tags based on input
    const [allIdeas, setAllIdeas] = useState<Idea[]>([]);

    const [dropdownVisible, setDropdownVisible] = useState(false); // New state to manage dropdown visibility

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await fetch(`${API_URL}/ideas`);
                if (!response.ok) throw new Error("Failed to fetch ideas");
                const data = await response.json();
                setAllIdeas(data || []); // Store original ideas
                setIdeas(data || []);    // Use for filtering
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
            if (searchTerm === "") {
                const response = await fetch(`${API_URL}/ideas`);
                const data = await response.json();
                setIdeas(data || []);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/ideas/search/title/${searchTerm}`);
                if (!response.ok) throw new Error("Failed to fetch search results");
                const data = await response.json();
                setIdeas(data || []);
            } catch (err: unknown) {
                setErrorIdeas(err instanceof Error ? err.message : "An unknown error occurred.");
            }
        };

        fetchSearchedIdeas();
    }, [searchTerm]);

    useEffect(() => {
        const fetchAllTags = async () => {
            try {
                const response = await fetch(`${API_URL}/tags/all`);
                if (!response.ok) throw new Error("Failed to fetch tags");
                const data = await response.json();
                setAllTags(data || []);
                setFilteredTags(data || []); // Initialize filtered tags with all tags
            } catch (err: unknown) {
                console.error("Error fetching tags:", err);
            }
        };

        fetchAllTags();
    }, []);

    const handleTagSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.trim().toLowerCase();

        if (searchTerm === "") {
            setFilteredTags(allTags);
        } else {
            const matchedTags = allTags.filter(tag => tag.name.toLowerCase().includes(searchTerm));
            setFilteredTags(matchedTags);
        }

        setDropdownVisible(true); // Show the dropdown as the user types
    };

    const handleInputFocus = () => {
        setDropdownVisible(true); // Show the dropdown when input is focused
    };


    const handleAddTag = (tag: Tag) => {
        if (!tagsFilter.some((t) => t.id === tag.id)) {
            setTagsFilter((prevTags) => [...prevTags, tag]);
        }
        setDropdownVisible(false); // Hide the dropdown when a tag is selected
    };

    const handleRemoveTag = (tag: Tag) => {
        setTagsFilter((prevTags) => prevTags.filter((t) => t.id !== tag.id));
    };

    const handleClearTags = () => {
        setTagsFilter([]); // Clear all selected tags
    };


    const handleApplyFilters = () => {
        const filteredIdeas = allIdeas.filter((idea) => {
            const matchesTags = tagsFilter.length === 0 || tagsFilter.some((tag) =>
                idea.idea_tags?.some((ideaTag) => ideaTag.tags.id === tag.id)
            );

            const matchesPrice = idea.price === undefined ||
                (idea.price >= priceRange[0] && idea.price <= priceRange[1]);

            return matchesTags && matchesPrice;
        });

        setIdeas(filteredIdeas);
        setShowFilterPopup(false);
    };

    const toggleDropdownVisibility = () => {
        setDropdownVisible(!dropdownVisible);
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
                <div className={styles["nav-links"]}>
                    <Link href="/investments">Investments</Link>
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
                                placeholder="Search tags"
                                onChange={handleTagSearch}
                                onFocus={handleInputFocus} // Add this to show dropdown on focus
                            />
                            {/* Button to clear all tags */}
                            <button className={styles.clearTagsButton} onClick={handleClearTags}>
                                Clear All Tags
                            </button>

                            {dropdownVisible && filteredTags.length > 0 && (
                                <ul className={styles.tagDropdown}>
                                    {filteredTags.map((tag) => (
                                        <li key={tag.id} onClick={() => handleAddTag(tag)}>
                                            {tag.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div>
                                {tagsFilter.map((tag) => (
                                    <span key={tag.id} className={styles.tag}>
                                        {tag.name} <button onClick={() => handleRemoveTag(tag)}>x</button>
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

                    {ideas.map((idea) => (
                        <div className={styles.postCard} key={idea.id}>
                            <h3>{idea.title}</h3>
                            <p>{idea.description}</p>
                            <p>{idea.category}</p>
                            <p>
                                {idea.idea_tags && idea.idea_tags.length > 0
                                    ? idea.idea_tags.map(tag => tag.tags.name).join(", ")
                                    : "No tags available"}
                            </p>
                            <button className={styles.investButton}>💰 Invest</button>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>
                    © 2025 iHive · Entrepreneur | <Link href="/terms">Terms</Link> | <Link href="/Privacy">Privacy</Link>
                </p>
            </footer>
        </>
    );
};

export default InvestorPage;
