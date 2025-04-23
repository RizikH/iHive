"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import styles from "../styles/sponsors.module.css"; // Reuse existing styling or create new for table
import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useRouter } from "next/navigation";

interface Investor {
  id: number;
  name: string;
  amount: number;
  message: string;
  status: "Pending" | "Accepted" | "Rejected";
}

const mockInvestors: Investor[] = [
  { id: 1, name: "Alice Ventures", amount: 10000, message: "Excited to support your project!", status: "Pending" },
  { id: 2, name: "Beta Capital", amount: 5000, message: "We believe in your vision.", status: "Pending" },
  { id: 3, name: "Gamma Group", amount: 20000, message: "Looking forward to working together.", status: "Pending" }
];

const Sponsors = () => {
  const [investors, setInvestors] = useState<Investor[]>(mockInvestors);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const timeout = setTimeout(() => router.push("/get-started"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router]);

  const handleAction = (id: number, action: "Accepted" | "Rejected") => {
    setInvestors(prev =>
      prev.map(investor =>
        investor.id === id ? { ...investor, status: action } : investor
      )
    );
  };

  if (!isAuthenticated) {
    return <p style={{ textAlign: 'center', padding: '2rem' }}>Please log in to view this page...</p>;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0;" />
        <title>iHive | Your Sponsors</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.container}>
        <NavBar 
          title="iHive-Entrepreneur"
          links={[
            { href: "/ideas", label: "Repositories" },
            { href: "/setting", label: "Setting" },
            { href: "/entrepreneur", label: "Profile" },
            { href: "/get-started", label: "Sign Out" }
          ]}
        />

        <main className={styles.main}>
          <h1 className={styles.recently}>Investor Offers</h1>
          
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
                    <td>{inv.name}</td>
                    <td>{inv.amount.toLocaleString()}</td>
                    <td>{inv.message}</td>
                    <td>{inv.status}</td>
                    <td>
                      {inv.status === "Pending" ? (
                        <>
                          <button className={styles.acceptBtn} onClick={() => handleAction(inv.id, "Accepted")}>Accept</button>
                          <button className={styles.rejectBtn} onClick={() => handleAction(inv.id, "Rejected")}>Reject</button>
                        </>
                      ) : (
                        <span style={{ fontStyle: 'italic' }}>No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <Footer role="Entrepreneur" />
      </div>
    </>
  );
};

export default Sponsors;
