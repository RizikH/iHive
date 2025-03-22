"use client";

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/repository.module.css';
import FileTreeDemo from '@/components/file-tree-demo';
import { FiCopy, FiDownload, FiUpload, FiEdit, FiCheck, FiBold, FiItalic, FiUnderline } from 'react-icons/fi';

const Repository = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [currentFileName, setCurrentFileName] = useState('Main Content');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [currentFontSize, setCurrentFontSize] = useState(16);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedIdeas = localStorage.getItem('ideas');
    const fetchedIdeas = savedIdeas ? JSON.parse(savedIdeas) : [];
    setIdeas(fetchedIdeas);
    setFileContents(fetchedIdeas.reduce((acc: any, idea: any) => ({ ...acc, [idea.id]: idea.description }), {}));
  }, []);

  const handleFileSelect = (fileId: string, fileContent: string, fileName: string) => {
    setCurrentFileId(fileId);
    setContent(fileContent);
    setCurrentFileName(fileName);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (currentFileId && editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      const updatedIdeas = ideas.map(idea => idea.id === currentFileId ? { ...idea, description: newContent } : idea);
      localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
      setIdeas(updatedIdeas);
      setFileContents({ ...fileContents, [currentFileId]: newContent });
      setContent(newContent);
      setIsEditing(false);
    }
  };

  const handleStyle = (command: string) => {
    if (isEditing) document.execCommand(command, false);
  };

  const handleFontSizeChange = (size: number) => {
    setCurrentFontSize(size);
    if (isEditing && editorRef.current) {
      document.execCommand('fontSize', false, size.toString());
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.doc,.docx,.pdf,.jpg,.jpeg,.png,.gif';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const newFileId = `file-${Date.now()}`;
          const fileContent = file.type.includes('image') ? `<img src="${reader.result}" alt="${file.name}" />` : reader.result as string;
          setFileContents({ ...fileContents, [newFileId]: fileContent });
          setCurrentFileId(newFileId);
          setContent(fileContent);
          setCurrentFileName(file.name);
        };
        file.type.includes('image') ? reader.readAsDataURL(file) : reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleDownload = () => {
    const blob = new Blob([content.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentFileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>Entrepreneur Repository</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>
      <div className={styles.pageContainer}>
        <nav className={styles.navContainer}>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/Images/iHive.png" alt="Logo" width={35} height={35} />
            <span>iHive-Entrepreneur</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/entrepreneur">Profile</Link>
            <Link href="/setting">Setting</Link>
            <Link href="/sponsors">Sponsors</Link>
            <Link href="/get-started">Sign Out</Link>
          </div>
        </nav>
        <main className={styles.mainContent}>
          {isLoading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.sideBar}>
            <h2>File Tree</h2>
            <FileTreeDemo
              onFileSelect={handleFileSelect}
              currentFileId={currentFileId}
              onContentUpdate={(fileId, updatedContent) => {
                setFileContents({ ...fileContents, [fileId]: updatedContent });
                if (fileId === currentFileId) setContent(updatedContent);
              }}
              onFileDelete={(fileId) => {
                const updatedIdeas = ideas.filter(idea => idea.id !== fileId);
                localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
                setIdeas(updatedIdeas);
                const { [fileId]: _, ...remainingContents } = fileContents;
                setFileContents(remainingContents);
                if (fileId === currentFileId) {
                  setCurrentFileId(null);
                  setContent('');
                  setCurrentFileName('Main Content');
                }
              }}
            />
          </div>
          <div className={styles.docSpace}>
            <div className={styles.docHeader}>
              <h2>{currentFileName}</h2>
              <div className={styles.docDock}>
                <input
                  type="number"
                  value={currentFontSize}
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className={styles.fontSizeInput}
                />
                <button onClick={() => handleStyle('bold')}><FiBold /></button>
                <button onClick={() => handleStyle('italic')}><FiItalic /></button>
                <button onClick={() => handleStyle('underline')}><FiUnderline /></button>
                <button onClick={handleUpload}><FiUpload /></button>
                <button onClick={handleDownload}><FiDownload /></button>
                <button onClick={isEditing ? handleSave : () => setIsEditing(true)}>
                  {isEditing ? <FiCheck /> : <FiEdit />}
                </button>
              </div>
            </div>
            <div
              ref={editorRef}
              className={`${styles.docBody} ${!content && styles.placeholder}`}
              contentEditable={isEditing}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </main>
        <footer className={styles.footer}>
          <p>© 2025 iHive · Entrepreneur | <Link href="/terms">Terms</Link> | <Link href="/Privacy">Privacy</Link></p>
        </footer>
      </div>
    </>
  );
};

export default Repository;