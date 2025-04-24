"use client";

import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/investor.module.css";
import "../styles/globals.css";
import Image from "next/image";
import { fetcher } from "@/app/utils/fetcher"; // ✅ Import fetcher
import { useRouter, useSearchParams } from "next/navigation";
import { isAuthenticated } from "@/app/utils/isAuthenticated";
import RepositoryModal from "@/components/repository-modal";


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
    const [authChecked, setAuthChecked] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loadingIdeas, setLoadingIdeas] = useState(true);
    const [errorIdeas, setErrorIdeas] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
    const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await isAuthenticated();
            if (!currentUser) {
                router.push("/get-started");
            } else {
                setUser(currentUser);
                setAuthChecked(true);
            }
        };

        checkAuth();
    }, []);



    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const data = await fetcher("/ideas");
                setAllIdeas(data || []);
                setIdeas(data || []);
            } catch (err: any) {
                setErrorIdeas(err.message || "An unknown error occurred.");
            } finally {
                setLoadingIdeas(false);
            }
        };

        fetchIdeas();
    }, []);

    useEffect(() => {
        const fetchSearchedIdeas = async () => {
            if (!searchTerm || searchTerm.trim().length < 1) {
                setIdeas(allIdeas);
                return;
            }

            try {
                const data = await fetcher(`/ideas/search/title/${encodeURIComponent(searchTerm)}`);
                setIdeas(data || []);
            } catch (err: any) {
                setErrorIdeas(err.message || "An unknown error occurred.");
            }
        };

        fetchSearchedIdeas();
    }, [searchTerm, allIdeas]);



    useEffect(() => {
        const fetchAllTags = async () => {
            try {
                const data = await fetcher("/tags/all");
                setAllTags(data || []);
                setFilteredTags(data || []);
            } catch (err) {
                console.error("Error fetching tags:", err);
            }
        };

        fetchAllTags();
    }, []);

    const handleTagSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        setFilteredTags(
            searchTerm === ""
                ? allTags
                : allTags.filter(tag => tag.name.toLowerCase().includes(searchTerm))
        );
        setDropdownVisible(true);
    };

    const handleInputFocus = () => setDropdownVisible(true);

    const handleAddTag = (tag: Tag) => {
        if (!tagsFilter.some(t => t.id === tag.id)) {
            setTagsFilter(prev => [...prev, tag]);
        }
        setDropdownVisible(false);
    };

    const handleRemoveTag = (tag: Tag) => {
        setTagsFilter(prev => prev.filter(t => t.id !== tag.id));
    };

    const handleClearTags = () => setTagsFilter([]);

    const handleApplyFilters = () => {
        const filteredIdeas = allIdeas.filter(idea => {
            const matchesTags =
                tagsFilter.length === 0 ||
                tagsFilter.some(tag =>
                    idea.idea_tags?.some(ideaTag => ideaTag.tags.id === tag.id)
                );

            const matchesPrice =
                idea.price === undefined ||
                (idea.price >= priceRange[0] && idea.price <= priceRange[1]);

            return matchesTags && matchesPrice;
        });

        setIdeas(filteredIdeas);
        setShowFilterPopup(false);
    };

    const toggleDropdownVisibility = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleInvest = (repoId: string) => {
        console.log(`Investing in idea ${repoId}`);
    };

    // Fetch files for the selected idea
    const searchParams = useSearchParams();
    const ideaId = searchParams.get("id");



    if (!authChecked) return <p>Checking authentication...</p>;
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
                    <Link href="setting">Settings</Link>
                    <Link href="get-started">Signout</Link>
                    <Link href="setting">
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
                            <button
                                onClick={() => {
                                    setSelectedRepo(idea.id.toString());
                                    setIsModalOpen(true);
                                }}
                                className={styles.investButton}
                            >
                                <span className={styles.investButtonIcon}>💰</span>
                                Invest
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            {selectedRepo && (
                <RepositoryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    repoId={selectedRepo}
                    title="Repository Preview"
                    isInvestorView={true}
                    onInvest={handleInvest}
                />
            )}

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
