import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/investor.module.css';
import '../styles/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const InvestorPage = () => {
    interface Idea {
        id: number;
        title: string;
        description: string;
        category?: string;
        funding_progress?: number;
        tags_name?: { id: number; tag_id: number }[]; // Association table
    }

    interface Tag {
        id: number;
        name: string;
    }

    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loadingIdeas, setLoadingIdeas] = useState(true);
    const [loadingTags, setLoadingTags] = useState(true);
    const [errorIdeas, setErrorIdeas] = useState<string | null>(null);
    const [errorTags, setErrorTags] = useState<string | null>(null);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                const response = await fetch('http://localhost:5432/api/ideas');
                if (!response.ok) throw new Error('Failed to fetch ideas');
                const data = await response.json();
                setIdeas(data);
            } catch (err: any) {
                setErrorIdeas(err.message);
            } finally {
                setLoadingIdeas(false);
            }
        };

        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:5432/api/tags');
                if (!response.ok) throw new Error('Failed to fetch tags');
                const data = await response.json();
                setTags(data);
            } catch (err: any) {
                setErrorTags(err.message);
            } finally {
                setLoadingTags(false);
            }
        };

        fetchIdeas();
        fetchTags();
    }, []);

    // Helper function to get tag names for an idea
    const getIdeaTags = (idea: Idea): string[] => {
        return idea.tags_name
            ? idea.tags_name
                  .map((tag) => tags.find((t) => t.id === tag.tag_id)?.name)
                  .filter(Boolean) as string[]
            : [];
    };

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="Author" content="Yixi Xie" />
                <meta name="Description" content="Investor profile page." />
                <title>Investor Profile</title>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
                />
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

            <nav className={styles.navbar}>
                <div className={styles.logo}>iHive - Investor</div>
                <div className={styles['nav-links']}>
                    <Link href="#investments">Investments</Link>
                    <Link href="#setting">Settings</Link>
                    <Link href="#get-started">Signout</Link>
                </div>
            </nav>

            <main className={styles.pageContainer}>
                {/* Left Side: Posts Grid */}
                <div className={styles.postsGrid}>
                    {loadingIdeas && <p>Loading ideas...</p>}
                    {errorIdeas && <p>Error: {errorIdeas}</p>}
                    {!loadingIdeas && !errorIdeas && ideas.length === 0 && <p>No ideas found.</p>}

                    {ideas.map((idea) => (
                        <div className={styles.postCard} key={idea.id}>
                            <h3>{idea.title}</h3>
                            <p>{idea.description}</p>
                            <div className={styles.tags}>
                                {getIdeaTags(idea).length > 0 ? (
                                    getIdeaTags(idea).map((tag, index) => (
                                        <span key={index}>#{tag}</span>
                                    ))
                                ) : (
                                    <span>#NoTags</span>
                                )}
                            </div>
                            <div className={styles.fundingProgress}>
                                <div
                                    className={styles.fundingBar}
                                    style={{ width: `${idea.funding_progress || 0}%` }}
                                ></div>
                            </div>
                            <button className={styles.investButton}>💰 Invest</button>
                        </div>
                    ))}
                </div>

                {/* Right Side: Profile Content with Buttons */}
                <div className={styles.profile}>
                    <h2>Investor Profile</h2>
                    <div className={styles.profileContent}>
                        <div className={styles['profile-image']} title="Change Your Avatar">
                            <img
                                src="/Images/investor-avatar.png"
                                alt="Investor Avatar"
                                className={styles.avatar}
                            />
                        </div>
                        <h1 title="Investor Name">Investor Name</h1>

                        {/* Investor Stats */}
                        <div className={styles['investor-stats']}>
                            <p>Investments: <strong>$50,000</strong></p>
                            <p>Projects Followed: <strong>12</strong></p>
                            <p>Investment Return: <strong>18%</strong></p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default InvestorPage;
