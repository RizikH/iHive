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
  ideaTitle: string;
  amount: number;
  date: string;
  status: "Pending" | "Completed" | "Cancelled";
}

const mockInvestments: Investment[] = [
  { id: 1, ideaTitle: "AI-Powered Chatbot", amount: 5000, date: "2025-02-15", status: "Completed" },
  { id: 2, ideaTitle: "Sustainable Packaging", amount: 2500, date: "2025-02-20", status: "Pending" },
  { id: 3, ideaTitle: "Blockchain Logistics", amount: 8000, date: "2025-02-10", status: "Cancelled" },
];

const InvestmentsTab = () => {
  const [investments] = useState<Investment[]>(mockInvestments);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const timeout = setTimeout(() => router.push("/get-started"), 1500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router]);

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
        extraLinks={[
          { href: "/investments", label: "Investments" },
        ]}
      />

      <div className={styles.investmentsContainer}>
        <h2 className={styles.investmentsTitle}>My Investments</h2>
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
                <td>{investment.ideaTitle}</td>
                <td>${investment.amount.toLocaleString()}</td>
                <td>{investment.date}</td>
                <td className={styles[investment.status.toLowerCase()]}>{investment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer role="Investor" />
    </>
  );
};

export default InvestmentsTab;