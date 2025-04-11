"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import styles from "../styles/ideas.module.css";
import { fetcher } from "@/app/utils/fetcher";

const IdeasPage = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    const storedId = localStorage.getItem("user_id");
    if (storedId) setUserId(storedId);

    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const fetchedIdeas = await fetcher("/ideas");
        setIdeas(fetchedIdeas);
      } catch (error) {
        console.error("Error fetching ideas:", error);
        setError("Failed to load ideas");

        const savedIdeas = localStorage.getItem("ideas");
        if (savedIdeas) {
          setIdeas(JSON.parse(savedIdeas));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      searchTerm === "" ||
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (idea.description &&
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filter === "all" || idea.category === filter;
    return matchesSearch && matchesFilter;
  });

  const getCategories = () => {
    const categories = ideas.map((idea) => idea.category).filter(Boolean);
    return ["all", ...new Set(categories)];
  };

  const getPreviewText = (description: string) => {
    const textOnly = description.replace(/<[^>]*>/g, "");
    return textOnly.length > 100
      ? textOnly.substring(0, 100) + "..."
      : textOnly;
  };

  const handleCreateNewIdea = () => {
    if (!userId) {
      alert("Please log in to create an idea.");
      return;
    }
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("Title and description are required.");
      return;
    }

    try {
      setIsLoading(true);
      const savedIdea = await fetcher(
        "/ideas",
        "POST",
        {
          ...formData,
          user_id: userId
        }
      );

      setIdeas((prev) => [...prev, savedIdea.idea || savedIdea]);
      setShowForm(false);
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating idea:", error);
      setError("Failed to create new idea");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ideas Repository</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <NavBar
        title="iHive-Entrepreneur"
        extraLinks={[
          { href: "/sponsors", label: "Sponsors" }
        ]}
      />

      <main className={styles.mainContent}>
        {isLoading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {/* Filter + Search + New Button */}
        <div className={styles.controlsSection}>
          <div className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterContainer}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              {getCategories().map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            className={styles.newIdeaButton}
            onClick={handleCreateNewIdea}
            disabled={isLoading}
          >
            <FiPlus /> New Idea
          </button>
        </div>

        {/* New Idea Form */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <div className={styles.formButtons}>
              <button type="submit">Submit</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Idea Grid */}
        <div className={styles.ideasGrid}>
          {filteredIdeas.length > 0 ? (
            filteredIdeas.map((idea) => (
              <Link
                href={`/repository?id=${idea.id}`}
                key={idea.id}
                className={styles.ideaCard}
              >
                <h3 className={styles.ideaTitle}>{idea.title}</h3>
                {idea.category && (
                  <span className={styles.ideaCategory}>
                    {idea.category}
                  </span>
                )}
                <p className={styles.ideaPreview}>
                  {idea.description
                    ? getPreviewText(idea.description)
                    : "No content"}
                </p>
                <div className={styles.ideaFooter}>
                  <span className={styles.ideaDate}>
                    {idea.updatedAt
                      ? new Date(idea.updatedAt).toLocaleDateString()
                      : "Not saved"}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.noIdeas}>
              {searchTerm || filter !== "all" ? (
                <p>No ideas match your search criteria.</p>
              ) : (
                <div>
                  <p>You haven't created any ideas yet.</p>
                  <button
                    className={styles.createFirstButton}
                    onClick={handleCreateNewIdea}
                  >
                    Create your first idea
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer role="Entrepreneur" />
    </>
  );
};

export default IdeasPage;
