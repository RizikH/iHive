"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../styles/investor.module.css";
import "../styles/globals.css";
import RepositoryModal from "@/components/repository-modal";
import { fetcher } from "@/app/utils/fetcher";
import { isAuthenticated } from "@/app/utils/isAuthenticated";
import NavBar from "@/components/nav-bar";
import { useAuthStore } from "@/app/stores/useAuthStore";

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
    const { currentUser } = useAuthStore((state) => state);
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
                setAuthChecked(true);
            }
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const data = await fetcher("/ideas");
                setAllIdeas(data.data || []);
                setIdeas(data.data || []);
            } catch (err: any) {
                console.error("Error fetching ideas:", err);
                setErrorIdeas(err.message || "An unknown error occurred.");
            } finally {
                setLoadingIdeas(false);
            }
        };

        fetchIdeas();
    }, []);

    useEffect(() => {
        const fetchAllTags = async () => {
            try {
                const data = await fetcher("/tags/all");
                setAllTags(data.data || []);
                setFilteredTags(data.data || []);
            } catch (err) {
                console.error("Error fetching tags:", err);
            }
        };

        fetchAllTags();
    }, []);

    const handleAddTag = (tag: Tag) => {
        if (!tagsFilter.some((t) => t.id === tag.id)) {
            setTagsFilter((prev) => [...prev, tag]);
        }
        setDropdownVisible(false);
    };

    const handleInvest = async (ideaId: string, amount: number) => {
        const userId = currentUser?.id;

        if (!userId) {
            alert("You must be logged in to invest.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/investments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idea_id: ideaId,
                    user_id: userId,
                    amount,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Investment successful!");
            } else {
                alert(`Investment failed: ${data.error}`);
            }
        } catch (err) {
            console.error("Investment error:", err);
            alert("Something went wrong while processing your investment.");
        }
    };

    if (!authChecked) return <p>Checking authentication...</p>;

    return (
        <>
            <Head>
                <title>Investor Profile</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

            <NavBar
                title="iHive-Investors"
                profileHref="/investor-profile"
                profileImgSrc="/Images/Yixi.jpeg"
                extraLinks={[{ href: "/investments", label: "Investments" }]}
                searchBar={
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
                }
            />

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
                            <button
                                onClick={() => {
                                    setSelectedRepo(idea.id.toString());
                                    setIsModalOpen(true);
                                }}
                                className={styles.investButton}
                            >
                                Learn More
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
                    onInvest={(ideaId: string, amount: number) => handleInvest(ideaId, amount)}
                />
            )}

            <footer className={styles.footer}>
                <p>
                    © 2025 iHive · Entrepreneur | <Link href="/terms">Terms</Link> | <Link href="/Privacy">Privacy</Link>
                </p>
            </footer>
        </>
    );
};

export default InvestorPage;
