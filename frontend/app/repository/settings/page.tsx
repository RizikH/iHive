"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { fetcher } from "@/app/utils/fetcher";

import styles from "@/app/styles/repository.module.css";

export default function RepositorySettings() {
    const [collaborators, setCollaborators] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const ideaId = Number(searchParams.get("id"));

    const getCollaborators = async (ideaId: number) => {
        try {
            const data = await fetcher(`/collab/${ideaId}`);
            return data;
        } catch (err) {
            console.error("Error fetching collaborators:", err);
            return null;
        }
    };

    useEffect(() => {
        if (!ideaId) return;

        setLoading(true);
        getCollaborators(ideaId)
            .then((data) => {
                if (data) {
                    setCollaborators(data);
                } else {
                    setError("Failed to load collaborators");
                }
            })
            .finally(() => setLoading(false));
    }, [ideaId]);

    return (
        <>
            <div className={styles.pageContainer}>
                <NavBar
                    title="iHive-Entrepreneur"
                    links={[
                        { href: "/entrepreneur", label: "Profile" },
                        { href: "/setting", label: "Setting" },
                        { href: "/sponsors", label: "Offers" },
                        { href: "/get-started", label: "Sign Out" },
                    ]}
                />

                <main className={styles.mainContent}>
                    <div className={styles.settingsContainer}>
                        <h1>Repository Settings</h1>
                        <p>Manage your repository settings here.</p>
                    </div>

                    <div className={styles.settingsContainer}>
                        <h1>Collaborators</h1>
                        <p>Manage your collaborators here.</p>

                        {loading && <p>Loading collaborators...</p>}
                        {error && <p>{error}</p>}

                        {collaborators.length > 0 && (
                            <table className={styles.collaboratorTable}>
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Permissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {collaborators.map((collab) => (
                                        <tr key={collab.user_id}>
                                            <td>{collab.users.username}</td>
                                            <td>{collab.users.email}</td>
                                            <td>{collab.permissions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>

                <Footer role="Entrepreneur" />
            </div>
        </>
    );
}
