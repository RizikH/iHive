"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import NavBar from "@/components/nav-bar";
import FileTree, { FileItem } from "@/components/file-tree";
import FileEditor from "@/components/file-editor";
import FileViewer from "@/components/file-viewer";
import Footer from '@/components/footer';
import { isAuthenticated } from "@/app/utils/isAuthenticated";
import { fetcher } from "@/app/utils/fetcher";

import styles from "../styles/repository.module.css";

export const metadata = {
  title: "Entrepreneur Repository",
  description: "Manage your project files on iHive",
};

export default function Repository() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const searchParams = useSearchParams();
  const ideaId = searchParams.get("id");
  console.log("Idea ID:", ideaId);

  const router = useRouter();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const path = ideaId ? `/files?idea_id=${ideaId}` : "/files";
      const data = await fetcher(path);
      setFiles(data);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [ideaId]);

  useEffect(() => {
    const checkAuthAndOwnership = async () => {
      const currentUser = await isAuthenticated();
      console.log("Current User:", currentUser);

      if (!currentUser) {
        router.push("/get-started");
        return;
      }

      setUser(currentUser);

      try {
        const idea = await fetcher(`/ideas/search/id/${ideaId}`);
        console.log("idea.user_id type:", typeof idea.user_id);
        console.log("idea.user_id:", idea.user_id);
        console.log("currentUser.id:", currentUser);

        if (idea.user_id !== currentUser.id) {
          setUnauthorized(true);
        } else {
          await fetchFiles();
        }
      } catch (err) {
        console.error("Error verifying idea ownership:", err);
        setUnauthorized(true);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuthAndOwnership();
  }, [fetchFiles, ideaId, router]);

  const handleSelectFile = (file: FileItem | null) => {
    setCurrentFile(file);
  };

  const handleUpdate = (updatedFile: FileItem) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === updatedFile.id ? updatedFile : f))
    );
    setCurrentFile(updatedFile);
  };

  if (!authChecked) return <p>Checking authentication...</p>;

  if (unauthorized) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h2>You are not autherized to view this page.</h2>
        <p>Please contact the owner to request access.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <NavBar
          title="iHive-Entrepreneur"
          links={[
            { href: "/entrepreneur", label: "Profile" },
            { href: `/repository/settings?id=${ideaId}`, label: "Repo Settings" },
            { href: "/setting", label: "Settings" },
            { href: "/sponsors", label: "Offers" },
            { href: "/get-started", label: "Sign Out" },
          ]}
        />

        <main className={styles.mainContent}>
          {loading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.sideBar}>
            <h2>File Tree</h2>
            <FileTree
              files={files}
              onSelect={handleSelectFile}
              onRefresh={fetchFiles}
              selectedId={currentFile?.id || null}
              ideaId={Number(ideaId) || 0}
            />
          </div>

          <div className={styles.docSpace}>
            {currentFile ? (
              <div className={styles.docContent}>
                {currentFile.type === "text" ? (
                  <FileEditor file={currentFile} onUpdate={handleUpdate} />
                ) : (
                  <FileViewer file={currentFile} />
                )}
              </div>
            ) : (
              <div className={styles.placeholderContent}>
                <h3>Welcome to iHive Editor!</h3>
                <p>Select or create a file to begin editing.</p>
              </div>
            )}
          </div>
        </main>

        <Footer role="Entrepreneur" />
      </div>
    </>
  );
}
