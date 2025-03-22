"use client";

import React, { useState } from "react";
import styles from "../styles/investments.module.css";
import Head from "next/head"; 
import Image from "next/image"; 
import Link from "next/link"; 

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
    const [investments, setInvestments] = useState<Investment[]>(mockInvestments);

    return (
        <>
            <Head>
                <title>Investor Profile</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/Images/iHive.png" />
            </Head>

            <nav className={styles.navContainer}>
                <div className={styles.logo}>
                    <Image
                        src="/Images/iHive.png"
                        alt="Logo"
                        title="Home"
                        width={35}
                        height={35}
                        className={styles.logoImage}
                    />
                    <Link href="/investor">iHive-Investors</Link>
                </div>
                <div className={styles["nav-links"]}>
                    <Link href="/investments">Investments</Link>
                    <Link href="#setting">Settings</Link>
                    <Link href="#get-started">Signout</Link>
                    <Link href="/investor-profile">
                        <Image
                            src="/Images/Yixi.jpeg"
                            alt="Investor Profile"
                            width={40}
                            height={40}
                            className={styles.avatarIcon}
                        />
                    </Link>
                </div>
            </nav>

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
        </>
    );
};

export default InvestmentsTab;
