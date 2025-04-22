"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import styles from "../styles/investor.module.css";
import { fetcher } from "@/app/utils/fetcher";
import RepositoryModal from "@/components/repository-modal";

interface Tag {
  id: number;
  name: string;
}

interface IdeaTag {
  id: number;
  tag_id: number;
  idea_id: number;
  tags: Tag;
}

interface Idea {
  id: number;
  title: string;
  description: string;
  category?: string;
  funding_progress?: number;
  idea_tags?: IdeaTag[];
  price?: number;
}

const InvestorPage = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [errorIdeas, setErrorIdeas] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagsFilter, setTagsFilter] = useState<Tag[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await fetcher("/ideas");
        setAllIdeas(data || []);
        setIdeas(data || []);
      } catch (err: any) {
        setErrorIdeas(err.message || "An unknown error occurred.");
      } finally {
        setLoadingIdeas(false);
      }
    };

    fetchIdeas();
  }, []);

  useEffect(() => {
    const fetchSearchedIdeas = async () => {
      if (!searchTerm || searchTerm.trim().length < 1) {
        setIdeas(allIdeas);
        return;
      }

      try {
        const data = await fetcher(`/ideas/search/title/${encodeURIComponent(searchTerm)}`);
        setIdeas(data || []);
      } catch (err: any) {
        setErrorIdeas(err.message || "An unknown error occurred.");
      }
    };

    fetchSearchedIdeas();
  }, [searchTerm]);

  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const data = await fetcher("/tags/all");
        setAllTags(data || []);
        setFilteredTags(data || []);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchAllTags();
  }, []);

  const handleTagSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.trim().toLowerCase();
    setFilteredTags(
      searchTerm === ""
        ? allTags
        : allTags.filter(tag => tag.name.toLowerCase().includes(searchTerm))
    );
    setDropdownVisible(true);
  };

  const handleInputFocus = () => setDropdownVisible(true);

  const handleAddTag = (tag: Tag) => {
    if (!tagsFilter.some(t => t.id === tag.id)) {
      setTagsFilter(prev => [...prev, tag]);
    }
    setDropdownVisible(false);
  };

  const handleRemoveTag = (tag: Tag) => {
    setTagsFilter(prev => prev.filter(t => t.id !== tag.id));
  };

  const handleClearTags = () => setTagsFilter([]);

  const handleApplyFilters = () => {
    const filteredIdeas = allIdeas.filter(idea => {
      const matchesTags =
        tagsFilter.length === 0 ||
        tagsFilter.some(tag =>
          idea.idea_tags?.some(ideaTag => ideaTag.tags.id === tag.id)
        );

      const matchesPrice =
        idea.price === undefined ||
        (idea.price >= priceRange[0] && idea.price <= priceRange[1]);

      return matchesTags && matchesPrice;
    });

    setIdeas(filteredIdeas);
    setShowFilterPopup(false);
  };

  const handleInvest = (repoId: string) => {
    console.log(`Investing in idea ${repoId}`);
  };

  const searchBar = (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search ideas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className={styles.searchButton}>Search</button>
      <button className={styles.filterButton} onClick={() => setShowFilterPopup(true)}>
        Filter
      </button>
    </div>
  );

  return (
    <>
      <Head>
        <title>Investor Profile</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <NavBar
        title="iHive-Investors"
        profileHref="/investor-profile"
        profileImgSrc="/Images/Yixi.jpeg"
        extraLinks={[
          { href: "/investments", label: "Investments" }
        ]}
        searchBar={searchBar}
      />

      {showFilterPopup && (
        <div className={styles.filterPopup}>
          <div className={styles.filterContent}>
            <h3>Filter Ideas</h3>
            <div>
              <input
                type="text"
                placeholder="Search tags"
                onChange={handleTagSearch}
                onFocus={handleInputFocus}
              />
              <button className={styles.clearTagsButton} onClick={handleClearTags}>
                Clear All Tags
              </button>

              {dropdownVisible && filteredTags.length > 0 && (
                <ul className={styles.tagDropdown}>
                  {filteredTags.map((tag) => (
                    <li key={tag.id} onClick={() => handleAddTag(tag)}>
                      {tag.name}
                    </li>
                  ))}
                </ul>
              )}

              <div>
                {tagsFilter.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                    <button onClick={() => handleRemoveTag(tag)}>x</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label>Price Range:</label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              />
              <p>Price: {priceRange[0]} - {priceRange[1]}</p>
            </div>

            <button className={styles.applyFiltersButton} onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <main className={styles.pageContainer}>
        <div className={styles.postsGrid}>
          {loadingIdeas && <p>Loading ideas...</p>}
          {errorIdeas && <p>Error: {errorIdeas}</p>}
          {!loadingIdeas && !errorIdeas && ideas.length === 0 && <p>No ideas found.</p>}

          {ideas.map((idea) => (
            <div key={idea.id} className={styles.postCard}>
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <p>{idea.category || "Uncategorized"}</p>
              <p>
                {idea.idea_tags && idea.idea_tags.length > 0
                  ? idea.idea_tags.map(tag => tag.tags.name).join(", ")
                  : "No tags available"}
              </p>
              <button 
                onClick={() => {
                  setSelectedRepo(idea.id.toString());
                  setIsModalOpen(true);
                }}
                className={styles.investButton}
              >
                <span className={styles.investButtonIcon}>💰</span>
                Invest
              </button>
            </div>
          ))}
        </div>
      </main>

      {selectedRepo && (
        <RepositoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          repoId={selectedRepo}
          title="Repository Preview"
          isInvestorView={true}
          onInvest={handleInvest}
        />
      )}

      <Footer role="Investor" />
    </>
  );
};

export default InvestorPage;
