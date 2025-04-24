"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { fetcher } from "@/app/utils/fetcher";
import styles from "@/app/styles/collab.module.css";
import { permission } from "process";

export default function RepositorySettingsClient() {
    const [collaborators, setCollaborators] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [permission, setPermission] = useState("public");


    const searchParams = useSearchParams();
    const ideaId = Number(searchParams.get("id"));


    const getCollaborators = async (ideaId: number) => {
        try {
            const data = await fetcher(`/collabs/${ideaId}`);
            console.log("Collaborators data:", data);
            return data;
        } catch (err) {
            console.error("Error fetching collaborators:", err);
            return null;
        }
    };

    const updateCollaborator = async (collabId: number, permissions: string) => {
        try {
            const response = await fetcher(`/collabs/`, 'PUT', {
                userId: collabId,
                ideaId,
                permissions,
            });
            if (response) {
                setCollaborators((prev) =>
                    prev.map((collab) =>
                        collab.user_id === collabId ? { ...collab, permissions } : collab
                    )
                );
            } else {
                setError("Failed to update collaborator");
            }
        } catch (err) {
            console.error("Error updating collaborator:", err);
        }
    };

    const deleteCollaborator = async (collabId: number) => {
        try {
            const response = await fetcher(`/collabs/`, 'DELETE', {
                userId: collabId,
                ideaId,
            });
            if (response) {
                setCollaborators((prev) =>
                    prev.filter((collab) => collab.user_id !== collabId)
                );
            }

        } catch (error) {
            console.error("Error deleting collaborator:", error);
            setError("Failed to delete collaborator");
        }

    };

    const addCollaborator = async (email: string, permission: string) => {
        try {
            const response = await fetcher(`/collabs/`, 'POST', {
                email,
                ideaId,
                permission,
            });
            if (response) {
                setCollaborators((prev) => [...prev, response]);
            } else {
                setError("Failed to add collaborator");
            }
        } catch (error) {
            console.error("Error adding collaborator:", error);
            setError("Failed to add collaborator");
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
                    <h1>Collaborators</h1>
                    <p>Manage your collaborators here.</p>

                    {/* Add Collaborator Form */}
                    <div className={styles.addCollaboratorForm}>
                        <input
                            type="email"
                            placeholder="Enter collaborator's email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <select
                            className={styles.select}
                            value={permission}
                            onChange={(e) => setPermission(e.target.value)}
                        >
                            <option value="private">Private</option>
                            <option value="protected">Protected</option>
                            <option value="public">Public</option>
                        </select>

                        <button
                            onClick={() => {
                                if (email) {
                                    addCollaborator(email, permission);
                                    setEmail("");
                                    setPermission("private");
                                }
                            }}
                            className={styles.addButton}
                        >
                            Add Collaborator
                        </button>
                    </div>


                    {loading && <p>Loading collaborators...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {collaborators.length > 0 && (
                        <table className={styles.collaboratorTable}>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Permissions</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {collaborators.map((collab) => (
                                    <tr key={collab.user_id}>
                                        <td>{collab.users.username}</td>
                                        <td>{collab.users.email}</td>
                                        <td>{collab.permissions}</td>
                                        <td>
                                            <button
                                                className={styles.updateButton}
                                                onClick={() => {
                                                    const newPermission = prompt(
                                                        `Update permission for ${collab.users.username}`,
                                                        collab.permissions
                                                    );
                                                    if (newPermission && newPermission !== collab.permissions) {
                                                        updateCollaborator(collab.user_id, newPermission);
                                                    }
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => deleteCollaborator(collab.user_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </main>

            <Footer role="Entrepreneur" />
        </div>
    );
}
