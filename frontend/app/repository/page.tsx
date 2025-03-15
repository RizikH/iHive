"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/repository.module.css';
import '../styles/globals.css';
import FileTreeDemo from '@/components/file-tree-demo';
import { FiCopy, FiDownload, FiUpload, FiEdit, FiCheck, FiBold, FiItalic, FiUnderline } from 'react-icons/fi';

const Repository = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentFontSize, setCurrentFontSize] = useState<number>(16);
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
  const [hasContent, setHasContent] = useState(false);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [currentFileName, setCurrentFileName] = useState<string>('Main Content');
  const [content, setContent] = useState<string>('');
  const placeholderText = 'Welcome to iHive Editor! Click the Edit button to start editing.';

  // Update hasContent whenever content changes
  useEffect(() => {
    setHasContent(content.trim() !== '');
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          // Allow Shift+Enter for newline
          return;
        } else {
          // Regular Enter triggers save
          e.preventDefault();
          handleSave();
        }
      }
    }
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content.replace(/<[^>]*>/g, ''))
        .then(() => alert('Content copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  const handleUpload = () => {
    alert('Only accept txt files')
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';  // Only accept txt files
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileContent = e.target?.result;
          if (typeof fileContent === 'string') {
            // Format the content with paragraph tags
            const formattedContent = fileContent.split('\n').map(line => 
              line.trim() ? `<p>${line}</p>` : '<p><br></p>'
            ).join('');
            
            setContent(formattedContent);
            
            // Save the content to the current file if one is selected
            if (currentFileId) {
              handleContentUpdate(currentFileId, formattedContent);
            }
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleDownload = () => {
    if (content) {
      // Strip HTML tags for plain text download
      const plainText = content.replace(/<[^>]*>/g, '');
      const blob = new Blob([plainText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = currentFileName ? `${currentFileName}.txt` : 'document.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleEdit = () => {
    const docBody = document.querySelector(`.${styles.docBody}`) as HTMLElement;
    if (docBody) {
      setIsEditing(!isEditing);
      docBody.setAttribute('contenteditable', (!isEditing).toString());
      docBody.focus();
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.parentElement;
    
    if (parentElement) {
      const fontSize = window.getComputedStyle(parentElement).fontSize;
      const size = parseInt(fontSize);
      if (!isNaN(size)) {
        setCurrentFontSize(size);
      }
    }
  };

  const handleFontSizeChange = (size: number) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    setCurrentFontSize(size); 

    
    if (range.collapsed) {
      const span = document.createElement('span');
      span.style.fontSize = `${size}px`;
      
      span.innerHTML = '&#8203;';
      range.insertNode(span);
      
      
      const newRange = document.createRange();
      newRange.setStartAfter(span);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      return;
    }

    // Handle selected text
    const selectedText = range.extractContents();
    const fragment = document.createDocumentFragment();

    Array.from(selectedText.childNodes).forEach(node => {
      if (node instanceof HTMLElement) {
        const newSpan = document.createElement('span');
        newSpan.innerHTML = node.innerHTML;
        if (node.style.cssText) {
          newSpan.style.cssText = node.style.cssText;
        }
        newSpan.style.fontSize = `${size}px`;
        fragment.appendChild(newSpan);
      } else {
        const newSpan = document.createElement('span');
        newSpan.style.fontSize = `${size}px`;
        newSpan.appendChild(node.cloneNode(true));
        fragment.appendChild(newSpan);
      }
    });

    range.insertNode(fragment);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleStyle = (command: string) => {
    document.execCommand(command, false);
  };

  const handleFileSelect = (fileId: string, fileContent: string, fileName: string) => {
    setCurrentFileId(fileId);
    setContent(fileContent);
    setCurrentFileName(fileName);
    setIsEditing(false);
    setHasContent(fileContent.trim() !== '');
  };

  const handleContentUpdate = (fileId: string, newContent: string) => {
    // Update the content in the FileTreeDemo component
    if (fileId) {
      setFileContents(prev => ({
        ...prev,
        [fileId]: newContent
      }));
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // When in edit mode, we need to get the content from the contentEditable div
    if (isEditing) {
      const newContent = e.currentTarget.innerHTML || '';
      setContent(newContent);
      setHasContent(newContent.trim() !== '');
    }
  };

  const handleFileDelete = (fileId: string) => {
    // Clear the content if the deleted file was currently selected
    if (currentFileId === fileId) {
      setCurrentFileId(null);
      setContent('');
      setCurrentFileName('Main Content');
      setHasContent(false);
    }
    
    // Remove the file's content from storage
    setFileContents(prev => {
      const newContents = { ...prev };
      delete newContents[fileId];
      return newContents;
    });
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (currentFileId) {
      const docBody = document.querySelector(`.${styles.docBody}`) as HTMLElement;
      if (docBody) {
        const newContent = docBody.innerHTML;
        setContent(newContent);
        handleContentUpdate(currentFileId, newContent);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
  <>
  <Head>
    <meta charSet='UTF-8' />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Entrepreneur Repository</title>
    <link rel="icon" href="/Images/iHive.png" />
  </Head>

  <div className={styles.pageContainer}>
    <nav className={styles.navContainer}>
      <div className={styles.logo}>
        <Image 
          src="/Images/iHive.png"
          alt="Logo"
          title="Home"
          width={35}
          height={35}
          className={styles.logoImage}
        />
        <Link href="/">iHive</Link>
      </div>
      <div className={styles['nav-links']}>
        <Link href="/entrepreneur">Profile</Link>
        <Link href="/setting">Setting</Link>
        <Link href="/sponsors">Your Sponsors</Link>
        <Link href="/get-started">Sign Out</Link>
      </div>
    </nav>

    <main className={styles.mainContent}>
      {/* SideBar | FileTree */}
      <div className={styles.sideBar}>
        <h2>File Tree</h2>
        <div className={styles.fileTree}>
          <FileTreeDemo 
            onFileSelect={handleFileSelect}
            onContentUpdate={handleContentUpdate}
            currentFileId={currentFileId}
            onFileDelete={handleFileDelete}
          />
        </div>
      </div>

      {/* Document Content */}
      <div className={styles.docSpace}>
        <div className={styles.docHeader}>
          <h2>{currentFileName}</h2>
          <div className={styles.docDock}>
            <select 
              className={styles.fontSizeSelect}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              value={currentFontSize}
              title="Font Size"
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <button className={styles.dockButton} title="Bold" onClick={() => handleStyle('bold')}>
              <span><FiBold /></span>
            </button>
            <button className={styles.dockButton} title="Italic" onClick={() => handleStyle('italic')}>
              <span><FiItalic /></span>
            </button>
            <button className={styles.dockButton} title="Underline" onClick={() => handleStyle('underline')}>
              <span><FiUnderline /></span>
            </button>

            <div className={styles.divider}></div>

            <button className={styles.dockButton} title="Copy" onClick={handleCopy}>
              <span><FiCopy /></span>
            </button>
            <button className={styles.dockButton} title="Upload" onClick={handleUpload}>
              <span><FiUpload /></span>
            </button>
            <button className={styles.dockButton} title="Download" onClick={handleDownload}>
              <span><FiDownload /></span>
            </button>
            <button className={styles.dockButton} title={isEditing ? "Commit" : "Edit"} onClick={isEditing ? handleSave : handleEnableEdit}>
              <span>{isEditing ? <FiCheck /> : <FiEdit />}</span>
            </button>
          </div>
        </div>
        <div className={styles.docContent}>
          {isEditing ? (
            <div 
              className={`${styles.docBody} ${!hasContent ? styles.placeholder : ''}`}
              onKeyDown={handleKeyDown}
              onMouseUp={handleMouseUp}
              onInput={handleInput}
              style={{ fontSize: `${currentFontSize}px` }}
              contentEditable={true}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className={`${styles.docBody} ${!hasContent ? styles.placeholder : ''}`}>
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <div className={styles.placeholderContent}>
                  <h3>Welcome to iHive Editor!</h3>
                  <p>Click the Edit button to start editing.</p>
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
          )}
        </div>
      </div>
    </main>

    <footer className={styles.footer}>
      <p>
      © 2025 iHive · Entrepreneur | <Link href="/terms" target='_blank'>Terms</Link> | <Link href="/Privacy" target='_blank'>Privacy</Link>
      </p>
    </footer>
    
  </div>
  </>
  );
}

export default Repository;