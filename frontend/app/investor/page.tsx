"use client"; // ✅ Fixes hydration issues

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/styles/investor.module.css";
import "@/app/styles/globals.css";
import Image from "next/image";

interface Idea {
  id: number;
  title: string;
  description: string;
  funding_progress?: number;
  idea_tags: { tags?: { name?: string } }[];
}

const InvestorPage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch(`http://localhost:5432/api/ideas`);
        if (!response.ok) throw new Error("Failed to fetch ideas");
        const data: Idea[] = await response.json();
        setIdeas(data);
      } catch (err) {
        console.error("Error fetching ideas:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas().catch(console.error);
  }, []);

  return (
    <>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>iHive - Investor</div>
        <div className={styles["nav-links"]}>
          <Link href="/investor#investments"><span>Investments</span></Link>
          <Link href="/investor#settings"><span>Settings</span></Link>
          <Link href="/get-started"><span>Sign Out</span></Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.pageContainer}>
        {/* Left Side: Posts Grid */}
        <div className={styles.postsGrid}>
          {loading && <p>Loading ideas...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && ideas.length === 0 && <p>No ideas found.</p>}

          {ideas.map((idea) => (
            <div className={styles.postCard} key={idea.id}>
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <div className={styles.tags}>
                {idea.idea_tags.length > 0
                  ? idea.idea_tags.map((tagObj, index) => (
                      <span key={index}>#{tagObj.tags?.name || "NoTag"}</span>
                    ))
                  : <span>#NoTags</span>
                }
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

        {/* Right Side: Profile Content */}
        <div className={styles.profile}>
          <h2>Investor Profile</h2>
          <div className={styles.profileContent}>
            <div className={styles["profile-image"]} title="Change Your Avatar">
              <Image
                src="/investor-avatar.png" // ✅ Make sure this file is inside `public/`
                alt="Investor Avatar"
                className={styles.avatar}
                width={100}
                height={100}
                priority
              />
            </div>
            <h1 title="Investor Name">Investor Name</h1>

            {/* Investor Stats */}
            <div className={styles["investor-stats"]}>
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
