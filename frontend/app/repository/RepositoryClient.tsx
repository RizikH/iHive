"use client";

import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useSearchParams, useRouter } from "next/navigation";

import NavBar from "@/components/nav-bar";
import FileTree, { FileItem } from "@/components/file-tree";
import FileEditor from "@/components/file-editor";
import FileViewer from "@/components/file-viewer";
import Footer from '@/components/footer';
import { isAuthenticated } from "@/app/utils/isAuthenticated";
import { fetcher } from "@/app/utils/fetcher";

import styles from "../styles/repository.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Repository() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const ideaId = searchParams.get("id");
  const router = useRouter();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const path = ideaId ? `/files?idea_id=${ideaId}` : "/files";
      console.log("Fetching files from:", path);
      const data = await fetcher(path);
      console.log("Files response:", data);
      setFiles(data);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [ideaId]);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await isAuthenticated();
      if (!currentUser) {
        router.push("/get-started");
      } else {
        setUser(currentUser);
        setAuthChecked(true);
        fetchFiles(); // ✅ Fetch files only after user is authenticated
      }
    };

    checkAuth();
  }, [fetchFiles, router]);

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

  return (
    <>
      <Head>
        <title>Entrepreneur Repository</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.pageContainer}>
        <NavBar
          title="iHive-Entrepreneur"
          links={[
            { href: "/entrepreneur", label: "Profile" },
            { href: "/setting", label: "Setting" },
            { href: "/sponsors", label: "Sponsors" },
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
