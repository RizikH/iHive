"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import NavBar from '@/components/nav-bar';
import styles from '../styles/ideas.module.css';

// API URL
const API_URL = process.env.NODE_ENV === "production" 
  ? "https://ihive.onrender.com/api" 
  : "http://localhost:5000/api";

const IdeasPage = () => {
  // =============================================
  // State Management
  // =============================================
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // =============================================
  // Effects
  // =============================================
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/ideas`);
        if (!response.ok) throw new Error('Failed to fetch ideas');
        
        const fetchedIdeas = await response.json();
        setIdeas(fetchedIdeas);
      } catch (error) {
        console.error('Error fetching ideas:', error);
        setError('Failed to load ideas');
        // Fallback to localStorage if API fails
        const savedIdeas = localStorage.getItem('ideas');
        if (savedIdeas) {
          setIdeas(JSON.parse(savedIdeas));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIdeas();
  }, []);

  // =============================================
  // Helper Functions
  // =============================================
  const filteredIdeas = ideas.filter(idea => {
    // First apply text search
    const matchesSearch = 
      searchTerm === '' || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (idea.description && idea.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Then apply category filter
    const matchesFilter = filter === 'all' || idea.category === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  const getCategories = () => {
    const categories = ideas.map(idea => idea.category).filter(Boolean);
    return ['all', ...new Set(categories)];
  };
  
  const getPreviewText = (description: string) => {
    // Strip HTML tags and limit to 100 characters
    const textOnly = description.replace(/<[^>]*>/g, '');
    return textOnly.length > 100 ? textOnly.substring(0, 100) + '...' : textOnly;
  };

  const handleCreateNewIdea = async () => {
    try {
      setIsLoading(true);
      
      const newIdea = {
        title: 'New Idea',
        description: 'Click to edit this idea',
        category: 'document'
      };
      
      const response = await fetch(`${API_URL}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIdea)
      });
      
      if (!response.ok) throw new Error('Failed to create new idea');
      
      const savedIdea = await response.json();
      setIdeas(prev => [...prev, savedIdea.idea || savedIdea]);
      
    } catch (error) {
      console.error('Error creating idea:', error);
      setError('Failed to create new idea');
    } finally {
      setIsLoading(false);
    }
  };

  // =============================================
  // Render Component
  // =============================================
  return (
    <>
      <Head>
        <title>Ideas Repository</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>
      
      <div className={styles.pageContainer}>
        {/* Navigation */}
        <NavBar 
          title="iHive-Entrepreneur" 
          links={[
            { href: "/entrepreneur", label: "Profile" },
            { href: "/sponsors", label: "Sponsors" },
            { href: "/setting", label: "Setting" },
            { href: "/get-started", label: "Sign Out" }
          ]}
        />
        
        <main className={styles.mainContent}>
          {/* Status Indicators */}
          {isLoading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>{error}</div>}
          
          {/* Controls Section */}
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
                {getCategories().map(category => (
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
          
          {/* Ideas Grid */}
          <div className={styles.ideasGrid}>
            {filteredIdeas.length > 0 ? (
              filteredIdeas.map(idea => (
                <Link href={`/repository?id=${idea.id}`} key={idea.id} className={styles.ideaCard}>
                  <h3 className={styles.ideaTitle}>{idea.title}</h3>
                  {idea.category && (
                    <span className={styles.ideaCategory}>{idea.category}</span>
                  )}
                  <p className={styles.ideaPreview}>
                    {idea.description ? getPreviewText(idea.description) : 'No content'}
                  </p>
                  <div className={styles.ideaFooter}>
                    <span className={styles.ideaDate}>
                      {idea.updatedAt ? new Date(idea.updatedAt).toLocaleDateString() : 'Not saved'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.noIdeas}>
                {searchTerm || filter !== 'all' ? (
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
        <footer className={styles.footer}>
          <p>© 2025 iHive · Entrepreneur | <Link href="/terms">Terms</Link> | <Link href="/privacy">Privacy</Link></p>
        </footer>
      </div>
    </>
  );
};

export default IdeasPage; 