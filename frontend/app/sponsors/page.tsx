"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import styles from "../styles/sponsors.module.css";
import "../styles/globals.css";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { fetcher } from "../utils/fetcher";

interface Investor {
  id: number;
  title: string;
  investments: {
    id: string;
    username: string;
    amount: number;
    message: string;
    status: "pending" | "accepted" | "rejected";
    users?: {
      username: string;
    };
  }[];
}

const ITEMS_PER_PAGE = 5;

const Sponsors = () => {
  const [allInvestments, setAllInvestments] = useState<
    { investment: Investor["investments"][number]; ideaTitle: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) {
      const timeout = setTimeout(() => router.push("/get-started"), 1500);
      return () => clearTimeout(timeout);
    }

    const fetchInvestments = async () => {
      try {
        const data: Investor[] = await fetcher(
          `/investments/entrepreneur/${currentUser.id}`
        );
        const flat = data.flatMap((idea) =>
          idea.investments.map((inv) => ({
            investment: inv,
            ideaTitle: idea.title,
          }))
        );
        setAllInvestments(flat);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch investments.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [isAuthenticated, currentUser?.id, router]);

  const handleAction = async (
    investmentId: string,
    action: "accepted" | "rejected"
  ) => {
    try {
      await fetcher(`/investments/${investmentId}`, "PUT", { status: action });
      setAllInvestments((prev) =>
        prev.map((item) =>
          item.investment.id === investmentId
            ? { ...item, investment: { ...item.investment, status: action } }
            : item
        )
      );
    } catch (err) {
      console.error("Action error:", err);
      setError("Failed to update investment status.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(allInvestments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentInvestments = allInvestments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <Head>
        <title>iHive | Your Sponsors</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.container}>
        <NavBar
          title="iHive-Entrepreneur"
          links={[
            { href: "/ideas", label: "Repositories" },
            { href: "/setting", label: "Setting" },
            { href: "/entrepreneur", label: "Profile" },
            { href: "/get-started", label: "Sign Out" },
          ]}
        />

        <main className={styles.main}>
          <h1 className={styles.recently}>Investor Offers</h1>

          {loading && <p>Loading offers...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && allInvestments.length === 0 && (
            <p>No investor offers found.</p>
          )}

          {currentInvestments.length > 0 && (
            <div className={styles.investorTableWrapper}>
              <table className={styles.investorTable}>
                <thead>
                  <tr>
                    <th>Idea</th>
                    <th>Investor</th>
                    <th>Amount ($)</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvestments.map(({ investment, ideaTitle }) => (
                    <tr key={investment.id}>
                      <td>{ideaTitle}</td>
                      <td>{investment.users?.username || investment.username}</td>
                      <td>{investment.amount.toLocaleString()}</td>
                      <td>{investment.message}</td>
                      <td>{investment.status}</td>
                      <td>
                        {investment.status === "pending" ? (
                          <>
                            <button
                              className={styles.acceptBtn}
                              onClick={() =>
                                handleAction(investment.id, "accepted")
                              }
                            >
                              ✓
                            </button>
                            <button
                              className={styles.rejectBtn}
                              onClick={() =>
                                handleAction(investment.id, "rejected")
                              }
                            >
                              ✗
                            </button>
                          </>
                        ) : (
                          <span style={{ fontStyle: "italic" }}>No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage
                        ? styles.activePageBtn
                        : styles.pageBtn
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>

        <Footer role="Entrepreneur" />
      </div>
    </>
  );
};

export default Sponsors;
