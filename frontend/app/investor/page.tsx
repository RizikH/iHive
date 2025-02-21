"use client"; // ✅ Fixes hydration issues

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/investor.module.css"; // ✅ Fixed Import Path
import "@/styles/globals.css"; // ✅ Fixed Import Path
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ideas`);
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
      <nav className={styles.navbar}>
        <div className={styles.logo}>iHive - Investor</div>
        <div className={styles["nav-links"]}>
          <Link href="/investor#investments"><span>Investments</span></Link>
          <Link href="/investor#settings"><span>Settings</span></Link>
          <Link href="/get-started"><span>Sign Out</span></Link>
        </div>
      </nav>

      <main className={styles.pageContainer}>
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
              <button className={styles.investButton}>💰 Invest</button>
            </div>
          ))}
        </div>

        <div className={styles.profile}>
          <h2>Investor Profile</h2>
          <Image src="/investor-avatar.png" alt="Investor Avatar" width={100} height={100} priority />
        </div>
      </main>
    </>
  );
};

export default InvestorPage;
