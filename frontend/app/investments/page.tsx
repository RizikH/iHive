"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/investments.module.css";
import Head from "next/head";
import NavBar from "@/components/nav-bar";
import Image from "next/image";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { fetcher } from "../utils/fetcher";
import { useAuthStore } from '@/app/stores/useAuthStore';

interface Investment {
  id: number;
  idea_id: number;
  amount: number;
  invested_at: string;
  status: string;
  ideas?: {
    title: string;
  };
}

const InvestmentsTab = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.currentUser);
  const router = useRouter();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const currentUser = useAuthStore(state => state.currentUser);

  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) {
      const timeout = setTimeout(() => router.push("/get-started"), 1500);
      return () => clearTimeout(timeout);
    }

    const fetchInvestments = async () => {
      try {
        const data = await fetcher(`/investments/user/${currentUser.id}`);
        setInvestments(data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch investments");
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [isAuthenticated, currentUser?.id, router]);

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
                  <td>
                    {investment.ideas?.title ? (
                      investment.status?.toLowerCase() !== "rejected" ? (
                        <a
                          href={`/repository?id=${investment.idea_id}`}
                          className={styles.linkTitle}
                        >
                          {investment.ideas.title}
                        </a>
                      ) : (
                        <span className={styles.rejectedTitle}>{investment.ideas.title}</span>
                      )
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td>${investment.amount.toLocaleString()}</td>
                  <td>{new Date(investment.invested_at).toLocaleDateString()}</td>
                  <td className={
                    investment.status?.toLowerCase() === "accepted"
                      ? styles.accepted
                      : investment.status?.toLowerCase() === "rejected"
                        ? styles.rejected
                        : styles.pending
                  }>
                    {investment.status || "Unknown"}
                  </td>
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

