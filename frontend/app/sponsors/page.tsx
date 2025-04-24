"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import styles from "../styles/sponsors.module.css";
import "../styles/globals.css";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useRouter } from "next/navigation";

interface Investor {
  id: number;
  amount: number;
  message: string;
  status: "Pending" | "Accepted" | "Rejected";
  user: {
    username: string;
  };
}

const Sponsors = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const timeout = setTimeout(() => router.push("/get-started"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchInvestorOffers = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investments/entrepreneur/${user.id}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setInvestors(data);
        } else {
          console.error("Expected array, got:", data);
          setError("Unexpected response from server.");
        }
      } catch (err) {
        console.error("Failed to fetch sponsor offers:", err);
        setError("Could not load investor offers.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorOffers();
  }, [user]);

  const handleAction = async (id: number, action: "Accepted" | "Rejected") => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      });

      setInvestors((prev) =>
        prev.map((inv) =>
          inv.id === id ? { ...inv, status: action } : inv
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (!isAuthenticated) {
    return <p style={{ textAlign: "center", padding: "2rem" }}>Please log in to view this page...</p>;
  }

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
                  {investors.map((inv) => (
                    <tr key={inv.id}>
                      <td>{inv.user?.username || "Unknown"}</td>
                      <td>{inv.amount.toLocaleString()}</td>
                      <td>{inv.message}</td>
                      <td>{inv.status}</td>
                      <td>
                        {inv.status === "Pending" ? (
                          <>
                            <button
                              className={styles.acceptBtn}
                              onClick={() => handleAction(inv.id, "Accepted")}
                            >
                              Accept
                            </button>
                            <button
                              className={styles.rejectBtn}
                              onClick={() => handleAction(inv.id, "Rejected")}
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
