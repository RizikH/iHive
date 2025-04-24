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
  amount: number;
  message: string;
  status: "pending" | "accepted" | "rejected";
  users?: {
    username: string;
  };
}

const Sponsors = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const data = await fetcher(`/investments/entrepreneur/${currentUser.id}`);
        setInvestors(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch investments.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [isAuthenticated, currentUser?.id, router]);

  const handleAction = async (id: number, action: "accepted" | "rejected") => {
    try {
      await fetcher(`/investments/${id}`, "PUT", { status: action });
      setInvestors(prev =>
        prev.map(inv =>
          inv.id === id ? { ...inv, status: action } : inv
        )
      );
    } catch (err) {
      console.error("Action error:", err);
      setError("Failed to update investment status.");
    }
  };

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
          {!loading && investors.length === 0 && <p>No investor offers found.</p>}

          {investors.length > 0 && (
            <div className={styles.investorTableWrapper}>
              <table className={styles.investorTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Amount ($)</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {investors.map(inv => (
                    <tr key={inv.id}>
                      <td>{inv.users?.username || "Unknown"}</td>
                      <td>{inv.amount.toLocaleString()}</td>
                      <td>{inv.message}</td>
                      <td>{inv.status}</td>
                      <td>
                        {inv.status === "pending" ? (
                          <>
                            <button
                              className={styles.acceptBtn}
                              onClick={() => handleAction(inv.id, "accepted")}
                            >
                              Accept
                            </button>
                            <button
                              className={styles.rejectBtn}
                              onClick={() => handleAction(inv.id, "rejected")}
                            >
                              Reject
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
            </div>
          )}
        </main>

        <Footer role="Entrepreneur" />
      </div>
    </>
  );
};

export default Sponsors;
