"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/repository.module.css";
import {
  getIdeasByUser,
  createIdea,
  updateIdea,
  deleteIdea,
} from "@/app/utils/api";

import {
  FiCopy,
  FiDownload,
  FiUpload,
  FiEdit,
  FiCheck,
  FiBold,
  FiItalic,
  FiUnderline,
} from "react-icons/fi";

interface Idea {
  id: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

const Repository = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [content, setContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [currentFontSize, setCurrentFontSize] = useState<number>(16);
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 36];

  const editorRef = useRef<HTMLDivElement>(null);

  // Fetch current user ID from /api/users/me
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          credentials: "include",
        });

        if (res.ok) {
          const user = await res.json();
          setUserId(user.id);
          setIsLoggedIn(true);
          localStorage.setItem("user_id", user.id);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    checkUser();
  }, []);

  // Fetch ideas based on user ID
  useEffect(() => {
    const fetchIdeas = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const data = await getIdeasByUser(userId);
        setIdeas(data);
        if (data.length > 0) {
          setCurrentIdea(data[0]);
          setContent(data[0].description);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [userId]);

  const handleSave = async () => {
    if (!currentIdea) return;
    try {
      setLoading(true);
      const updated = await updateIdea(currentIdea.id, {
        title: currentIdea.title,
        description: content,
        category: "document",
        status: "draft",
      });
      setIdeas(prev =>
        prev.map(idea => (idea.id === updated.id ? updated : idea))
      );
      setCurrentIdea(updated);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = async () => {
    try {
      setLoading(true);
      const newIdea = await createIdea({
        title: `Untitled ${ideas.length + 1}`,
        description: "",
        category: "document",
        status: "draft",
      });
      setIdeas(prev => [...prev, newIdea]);
      setCurrentIdea(newIdea);
      setContent("");
      setIsEditing(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteIdea(id);
      setIdeas(prev => prev.filter(idea => idea.id !== id));
      setCurrentIdea(null);
      setContent("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idea: Idea) => {
    if (isEditing && currentIdea) handleSave();
    setCurrentIdea(idea);
    setContent(idea.description);
    setIsEditing(false);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
  };

  const handleStyle = (command: string) => {
    document.execCommand(command, false);
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard
        .writeText(content.replace(/<[^>]*>/g, ""))
        .then(() => alert("Copied!"));
    }
  };

  const handleDownload = () => {
    const plainText = content.replace(/<[^>]*>/g, "");
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentIdea?.title || "document.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          const text = reader.result as string;
          const html = text
            .split("\n")
            .map((line) => `<p>${line}</p>`)
            .join("");
          setContent(html);
          setIsEditing(true);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleFontSizeChange = (size: number) => {
    setCurrentFontSize(size);
    document.execCommand("fontSize", false, "7");
    const fontElements = document.getElementsByTagName("font");
    for (let i = 0; i < fontElements.length; i++) {
      const el = fontElements[i];
      if (el.size === "7") {
        el.removeAttribute("size");
        el.style.fontSize = `${size}px`;
      }
    }
  };

  return (
    <>
      <Head>
        <title>iHive Repository</title>
      </Head>

      <div className={styles.pageContainer}>
        {/* ✅ Updated Nav */}
        <nav className={styles.navContainer}>
          <div className={styles.logo}>
            <Link href="/">
              <Image src="/Images/iHive.png" alt="Logo" width={35} height={35} />
              <span>iHive-Entrepreneur</span>
            </Link>
          </div>
          <div className={styles["nav-links"]}>
            {isLoggedIn ? (
              <>
                <Link href="/entrepreneur">Profile</Link>
                <Link href="/setting">Setting</Link>
                <Link href="/sponsors">Sponsors</Link>
                <Link href="/get-started">Sign Out</Link>
              </>
            ) : (
              <Link href="/get-started">Sign In</Link>
            )}
          </div>
        </nav>

        {/* ✅ Show userId */}
        {userId && (
          <p style={{ textAlign: "center", marginTop: "0.5rem", color: "gray" }}>
            Logged in as: <strong>{userId}</strong>
          </p>
        )}

        <main className={styles.mainContent}>
          {loading && <p className={styles.loading}>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.toolbar}>
            <h2>{currentIdea?.title || "No Document Selected"}</h2>

            <div className={styles.fontSizeContainer}>
              <select
                value={currentFontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className={styles.fontSizeInput}
              >
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </div>

            <button onClick={() => handleStyle("bold")} title="Bold">
              <FiBold />
            </button>
            <button onClick={() => handleStyle("italic")} title="Italic">
              <FiItalic />
            </button>
            <button onClick={() => handleStyle("underline")} title="Underline">
              <FiUnderline />
            </button>

            <button onClick={handleCopy} title="Copy">
              <FiCopy />
            </button>
            <button onClick={handleUpload} title="Upload">
              <FiUpload />
            </button>
            <button onClick={handleDownload} title="Download">
              <FiDownload />
            </button>

            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              title={isEditing ? "Save" : "Edit"}
            >
              {isEditing ? <FiCheck /> : <FiEdit />}
            </button>
          </div>

          {isEditing ? (
            <div
              ref={editorRef}
              className={styles.docBody}
              contentEditable
              onInput={handleInput}
              suppressContentEditableWarning
              style={{ fontSize: `${currentFontSize}px` }}
            >
              {content}
            </div>
          ) : (
            <div
              className={styles.docBody}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </main>
      </div>

      <footer className={styles.footer}>
        <p>
          © 2025 iHive · Entrepreneur | <Link href="/terms">Terms</Link> |{" "}
          <Link href="/privacy">Privacy</Link>
        </p>
      </footer>
    </>
  );
};

export default Repository;
