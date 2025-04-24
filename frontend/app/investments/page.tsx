"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/investments.module.css";
import Head from "next/head";
import NavBar from "@/components/nav-bar";
import Image from "next/image";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/useAuthStore";

interface Investment {
  id: number;
  idea_id: number;
  amount: number;
  invested_at: string;
  idea?: {
    title: string;
  };
}

const InvestmentsTab = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.currentUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      const timeout = setTimeout(() => router.push("/get-started"), 1500);
      return () => clearTimeout(timeout);
    }

    const fetchInvestments = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investments/user/${user.id}`);
        const data = await res.json();

        console.log("RAW investment response:", data);

        if (Array.isArray(data)) {
          setInvestments(data);
        } else {
          console.error("Expected array, got:", data);
          setInvestments([]);
        }
      } catch (err) {
        setError("Failed to load investments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Please log in to view this page...</p>;
  }

  return (
    <>
      <Head>
        <title>My Investments</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <NavBar
        title="iHive-Investors"
        profileHref="/investor-profile"
        profileImgSrc="/Images/Yixi.jpeg"
        extraLinks={[{ href: "/investments", label: "Investments" }]}
      />

      <div className={styles.investmentsContainer}>
        <h2 className={styles.investmentsTitle}>My Investments</h2>

        {loading ? (
          <p>Loading investments...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : investments.length === 0 ? (
          <p>No investments found.</p>
        ) : (
          <table className={styles.investmentsTable}>
            <thead>
              <tr>
                <th>Idea</th>
                <th>Amount Invested</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => (
                <tr key={investment.id}>
                  <td>{investment.idea?.title || "Unknown"}</td>
                  <td>${investment.amount.toLocaleString()}</td>
                  <td>{new Date(investment.invested_at).toLocaleDateString()}</td>
                  <td className={styles.completed}>Completed</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Footer role="Investor" />
    </>
  );
};

export default InvestmentsTab;

