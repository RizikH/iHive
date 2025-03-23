"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import NavBar from "@/components/nav-bar";
import styles from "@/app/styles/repository.module.css";

import FileTree, { FileItem } from "@/components/file-tree";
import FileEditor from "@/components/file-editor";
import FileViewer from "@/components/file-viewer";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ihive.onrender.com/api"
    : "http://localhost:5000/api";

export default function Repository() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/files`);
      if (!res.ok) throw new Error("Failed to load files");
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSelectFile = (file: FileItem) => {
    setCurrentFile(file);
  };

  const handleUpdate = (updatedFile: FileItem) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === updatedFile.id ? updatedFile : f))
    );
    setCurrentFile(updatedFile);
  };

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
            />
          </div>

          <div className={styles.docSpace}>
            {currentFile ? (
              currentFile.type === "text" ? (
                <FileEditor file={currentFile} onUpdate={handleUpdate} />
              ) : (
                <FileViewer file={currentFile} />
              )
            ) : (
              <div className={styles.placeholderContent}>
                <h3>Select a file to view or edit</h3>
                <p>You can also create a new file or folder from the file tree.</p>
              </div>
            )}
          </div>
        </main>

        <footer className={styles.footer}>
          <p>
            © 2025 iHive · Entrepreneur | <a href="/terms">Terms</a> | <a href="/Privacy">Privacy</a>
          </p>
        </footer>
      </div>
    </>
  );
}