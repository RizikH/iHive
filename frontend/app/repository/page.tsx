"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";

import NavBar from "@/components/nav-bar";
import FileTree, { FileItem } from "@/components/file-tree";
import FileEditor from "@/components/file-editor";
import FileViewer from "@/components/file-viewer";
import Footer from '@/components/footer';

import {
  FiCopy,
  FiDownload,
  FiUpload,
  FiEdit,
} from "react-icons/fi";

import styles from "../styles/repository.module.css";
import { fetcher } from "@/app/utils/fetcher";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Repository() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const ideaId = searchParams.get("id");

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const path = ideaId ? `/files?idea_id=${ideaId}` : "/files";
      console.log("Fetching files from:", path);
      const data = await fetcher(path);
      console.log("Files response:", data);
      setFiles(data);
    } catch (err) {
      console.error("Error fetching files:", err);
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [ideaId]);

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
              ideaId={Number(ideaId) || 0}
            />
          </div>

          <div className={styles.docSpace}>
            {currentFile ? (
              <>
                <div className={styles.docContent}>
                  {currentFile.type === "text" ? (
                    <FileEditor file={currentFile} onUpdate={handleUpdate} />
                  ) : (
                    <FileViewer file={currentFile} />
                  )}
                </div>
              </>
            ) : (
              <div className={styles.placeholderContent}>
                <h3>Welcome to iHive Editor!</h3>
                <p>Select or create a file to begin editing.</p>
                <div className={styles.shortcuts}>
                  <p>Helpful shortcuts:</p>
                  <ul>
                    <li><kbd>Ctrl</kbd> + <kbd>B</kbd> - Bold text</li>
                    <li><kbd>Ctrl</kbd> + <kbd>I</kbd> - Italic text</li>
                    <li><kbd>Ctrl</kbd> + <kbd>U</kbd> - Underline text</li>
                    <li><kbd>Ctrl</kbd> + <kbd>C</kbd> - Copy text</li>
                    <li><kbd>Ctrl</kbd> + <kbd>S</kbd> - Save changes</li>
                    <li><kbd>Shift</kbd> + <kbd>Enter</kbd> - New line</li>
                    <li><kbd>Enter</kbd> - Save and exit edit mode</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer role="Entrepreneur" />
      </div>
    </>
  );
}
