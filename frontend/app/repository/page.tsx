"use client";

import React, { useState, useEffect, useRef } from 'react';

// Next.js
import Head from 'next/head';
import Link from 'next/link';

// Components
import NavBar from '@/components/nav-bar';
import FileTreeDemo from '@/components/file-tree-demo';

// Icons
import { 
  FiCopy, 
  FiDownload, 
  FiUpload, 
  FiEdit, 
  FiCheck, 
  FiBold, 
  FiItalic, 
  FiUnderline 
} from 'react-icons/fi';

// Styles
import styles from '../styles/repository.module.css';

const Repository = () => {
  // =============================================
  // State Management
  // =============================================
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [currentFileName, setCurrentFileName] = useState('Main Content');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [currentFontSize, setCurrentFontSize] = useState(16);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasContent, setHasContent] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);
  
  // Refs
  const editorRef = useRef<HTMLDivElement>(null);

  // =============================================
  // Effects
  // =============================================
  // Load saved ideas on component mount
  useEffect(() => {
    const savedIdeas = localStorage.getItem('ideas');
    const fetchedIdeas = savedIdeas ? JSON.parse(savedIdeas) : [];
    setIdeas(fetchedIdeas);
    setFileContents(fetchedIdeas.reduce((acc: any, idea: any) => (
      { ...acc, [idea.id]: idea.description }
    ), {}));
  }, []);

  // Add selection change listener when editing
  useEffect(() => {
    const handleSelectionChange = () => {
      // Selection change handler logic would go here
      // This can be used for handling text selection in the editor
    };
    
    if (isEditing) {
      document.addEventListener('selectionchange', handleSelectionChange);
    }
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isEditing]);

  // Close font size dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('fontSizeOptions');
      const container = document.querySelector(`.${styles.fontSizeContainer}`);
      
      if (dropdown && container && !container.contains(event.target as Node)) {
        dropdown.style.display = 'none';
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [styles.fontSizeContainer]);

  // Update editor content when not editing
  useEffect(() => {
    if (editorRef.current && !isEditing) {
      editorRef.current.innerHTML = content;
      setHasContent(content.trim() !== '');
    }
  }, [content, isEditing]);

  // Update placeholder styling based on content
  useEffect(() => {
    if (editorRef.current) {
      if (hasContent) {
        editorRef.current.classList.remove(styles.placeholder);
      } else if (!hasContent && !isEditing) {
        editorRef.current.classList.add(styles.placeholder);
      }
    }
  }, [hasContent, isEditing, styles.placeholder]);

  // =============================================
  // File Management Handlers
  // =============================================
  const handleFileSelect = (fileId: string, fileContent: string, fileName: string) => {
    const cleanFileId = fileId.replace(/^file-/, '');
    setCurrentFileId(cleanFileId);
    setContent(fileContent);
    setCurrentFileName(fileName);
    setIsEditing(false);
    setHasContent(fileContent.trim() !== '');
    
    setFileContents(prev => ({
      ...prev,
      [cleanFileId]: fileContent
    }));
  };

  const handleContentUpdate = (fileId: string, newContent: string) => {
    if (fileId) {
      const cleanFileId = fileId.replace(/^file-/, '');
      
      if (cleanFileId === currentFileId) {
        setContent(newContent);
        setHasContent(newContent.trim() !== '');
      }
      
      setFileContents(prev => ({
        ...prev,
        [cleanFileId]: newContent
      }));
    }
  };

  const handleFileDelete = (fileId: string) => {
    if (currentFileId === fileId) {
      setCurrentFileId(null);
      setContent('');
      setCurrentFileName('Main Content');
      setHasContent(false);
    }
    
    setFileContents(prev => {
      const newContents = { ...prev };
      delete newContents[fileId];
      return newContents;
    });
  };

  // =============================================
  // Editor Content Handlers
  // =============================================
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (isEditing) {
      const newContent = e.currentTarget.innerHTML || '';
      
      const contentExists = newContent.trim() !== '';
      setHasContent(contentExists);
      
      if (contentExists && !hasContent && editorRef.current) {
        editorRef.current.classList.remove(styles.placeholder);
      }
      
      if (currentFileId) {
        setFileContents(prev => ({
          ...prev,
          [currentFileId]: newContent
        }));
      }
      
      const marker = document.getElementById('font-size-marker');
      if (marker && marker.textContent === '') {
        marker.remove();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          return;
        } else {
          e.preventDefault();
          handleSave();
        }
      }
    }
  };

  const handleSave = async () => {
    if (currentFileId && editorRef.current) {
      // Get the raw content from the editor
      const newContent = editorRef.current.innerHTML;
      try {
        setIsLoading(true);
        
        const idea = {
          id: currentFileId,
          title: currentFileName,
          description: newContent,
          category: 'document'
        };
        
        setIdeas(prevIdeas => {
          const updatedIdeas = [...prevIdeas];
          const existingIndex = updatedIdeas.findIndex(item => item.id === currentFileId);
          
          if (existingIndex >= 0) {
            updatedIdeas[existingIndex] = idea;
          } else {
            updatedIdeas.push(idea);
          }
          
          localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
          return updatedIdeas;
        });

        setContent(newContent);
        handleContentUpdate(currentFileId, newContent);
        setIsEditing(false);
      } catch (error) {
        setError('Failed to save content');
        console.error('Error saving content:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  // =============================================
  // Editor Style Handlers
  // =============================================
  const handleStyle = (command: string) => {
    if (isEditing) document.execCommand(command, false);
  };

  // Save the current text selection
  const saveSelection = () => {
    if (isEditing) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        setSavedSelection(selection.getRangeAt(0).cloneRange());
      }
    }
  };

  // Restore the saved selection
  const restoreSelection = () => {
    if (isEditing && savedSelection && editorRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection);
        return true;
      }
    }
    return false;
  };

  // Add a new function to detect font size of selected text
  const getSelectionFontSize = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
        const parentElement = range.commonAncestorContainer.parentElement;
        if (parentElement) {
          const computedStyle = window.getComputedStyle(parentElement);
          const fontSize = parseInt(computedStyle.fontSize);
          if (!isNaN(fontSize)) {
            return fontSize;
          }
        }
      } else if (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
        const computedStyle = window.getComputedStyle(range.commonAncestorContainer as Element);
        const fontSize = parseInt(computedStyle.fontSize);
        if (!isNaN(fontSize)) {
          return fontSize;
        }
      }
    }
    return currentFontSize; // Default if can't detect
  };

  // Update this function to detect and set font size when selecting text
  const handleMouseUp = () => {
    if (isEditing) {
      const detectedSize = getSelectionFontSize();
      if (detectedSize !== currentFontSize) {
        setCurrentFontSize(detectedSize);
      }
    }
  };

  // Modify the handleFontSizeChange function to work better with selections
  const handleFontSizeChange = (size: number) => {
    setCurrentFontSize(size);
    
    if (editorRef.current) {
      // Try to restore selection
      const selectionRestored = restoreSelection();
      
      if (selectionRestored && window.getSelection()?.toString().trim() !== '') {
        // Apply font size to selection
        document.execCommand('fontSize', false, '7'); // Use 7 as a dummy size
        
        // Find all font elements with size 7 and change to desired px size
        const fontElements = editorRef.current.querySelectorAll('font[size="7"]');
        fontElements.forEach(el => {
          el.removeAttribute('size');
          (el as HTMLElement).style.fontSize = `${size}px`;
        });
        
        // Re-focus the editor
        editorRef.current.focus();
      } else {
        // No selection or empty selection, set font size for entire editor or at cursor position
        if (window.getSelection()?.rangeCount) {
          const range = window.getSelection()!.getRangeAt(0);
          const span = document.createElement('span');
          span.style.fontSize = `${size}px`;
          span.textContent = '\u200B'; // Zero-width space
          range.insertNode(span);
          
          // Position cursor after the inserted span
          range.setStartAfter(span);
          range.setEndAfter(span);
          window.getSelection()!.removeAllRanges();
          window.getSelection()!.addRange(range);
        } else {
          // Fall back to setting the entire editor
          editorRef.current.style.fontSize = `${size}px`;
        }
      }
    }
  };

  // Update this function to also prevent default event behavior
  const toggleFontSizeDropdown = (e?: React.MouseEvent<HTMLElement>) => {
    // If event is provided, prevent default behavior
    if (e) {
      e.preventDefault();
    }
    
    // Save selection before opening dropdown
    saveSelection();
    
    const dropdown = document.getElementById('fontSizeOptions');
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
  };

  const handleFontSizeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const size = Number((e.target as HTMLInputElement).value);
      if (size > 0) {
        handleFontSizeChange(size);
        const dropdown = document.getElementById('fontSizeOptions');
        if (dropdown) dropdown.style.display = 'none';
      }
    }
  };

  const handleFontSizeInputFocus = () => {
    saveSelection();
  };

  // =============================================
  // Editor Action Handlers
  // =============================================
  const handleEnableEdit = () => {
    setIsEditing(true);
    
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.style.fontSize = `${currentFontSize}px`;
        editorRef.current.setAttribute('contenteditable', 'true');
        editorRef.current.focus();
        
        const selection = window.getSelection();
        if (selection) {
          try {
            const range = document.createRange();
            const contentDiv = editorRef.current.querySelector('div');
            if (contentDiv && contentDiv.childNodes.length > 0) {
              const lastNode = contentDiv.childNodes[contentDiv.childNodes.length - 1];
              if (lastNode.nodeType === Node.TEXT_NODE) {
                range.setStart(lastNode, lastNode.textContent?.length || 0);
              } else if (lastNode.nodeType === Node.ELEMENT_NODE) {
                range.setStartAfter(lastNode);
              }
            } else {
              range.setStart(editorRef.current, 0);
            }
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            console.error('Error setting cursor position:', e);
            editorRef.current.focus();
          }
        }
      }
    }, 0);
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content.replace(/<[^>]*>/g, ''))
        .then(() => alert('Content copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
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
          const fileContent = file.type.includes('image') 
            ? `<img src="${reader.result}" alt="${file.name}" />` 
            : reader.result as string;
          
          setFileContents({ ...fileContents, [newFileId]: fileContent });
          setCurrentFileId(newFileId);
          setContent(fileContent);
          setCurrentFileName(file.name);
        };
        file.type.includes('image') 
          ? reader.readAsDataURL(file) 
          : reader.readAsText(file);
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

  // =============================================
  // Render Component
  // =============================================
  return (
    <>
      <Head>
        <title>Entrepreneur Repository</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>
      
      <div className={styles.pageContainer}>
        {/* Navigation */}
        <NavBar 
          title="iHive-Entrepreneur" 
          links={[
            { href: "/entrepreneur", label: "Profile" },
            { href: "/setting", label: "Setting" },
            { href: "/sponsors", label: "Sponsors" },
            { href: "/get-started", label: "Sign Out" }
          ]}
        />
        
        <main className={styles.mainContent}>
          {/* Status Indicators */}
          {isLoading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>{error}</div>}
          
          {/* Sidebar with File Tree */}
          <div className={styles.sideBar}>
            <h2>File Tree</h2>
            <div className={styles.fileTree}>
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
          </div>
          
          {/* Document Area */}
          <div className={styles.docSpace}>
            {/* Document Header */}
            <div className={styles.docHeader}>
              <h2>{currentFileName}</h2>
              
              {/* Document Toolbar */}
              <div className={styles.docDock}>
                {/* Font Size Controls */}
                <div className={styles.fontSizeContainer}>
                  <input
                    type="number"
                    value={currentFontSize}
                    onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                    className={styles.fontSizeInput}
                    onKeyDown={handleFontSizeInputKeyDown}
                    onFocus={handleFontSizeInputFocus}
                    onMouseDown={(e) => {
                      saveSelection();
                      e.stopPropagation();
                    }}
                  />
                  <div 
                    id="fontSizeDropdown" 
                    className={styles.fontSizeDropdown}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      toggleFontSizeDropdown();
                    }}
                  >
                    <span className={styles.dropdownArrow}>▼</span>
                  </div>
                  <div 
                    id="fontSizeOptions" 
                    className={styles.fontSizeOptions} 
                    style={{display: 'none'}}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
                      <div 
                        key={size} 
                        className={`${styles.fontSizeOption} ${currentFontSize === size ? styles.selected : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFontSizeChange(size);
                          toggleFontSizeDropdown();
                        }}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Formatting Controls */}
                <button className={styles.dockButton} onClick={() => handleStyle('bold')}>
                  <FiBold />
                </button>
                <button className={styles.dockButton} onClick={() => handleStyle('italic')}>
                  <FiItalic />
                </button>
                <button className={styles.dockButton} onClick={() => handleStyle('underline')}>
                  <FiUnderline />
                </button>
                
                {/* Document Actions */}
                <button className={styles.dockButton} onClick={handleCopy}>
                  <FiCopy />
                </button>
                <button className={styles.dockButton} onClick={handleUpload}>
                  <FiUpload />
                </button>
                <button className={styles.dockButton} onClick={handleDownload}>
                  <FiDownload />
                </button>
                <button className={styles.dockButton} onClick={isEditing ? handleSave : handleEnableEdit}>
                  {isEditing ? <FiCheck /> : <FiEdit />}
                </button>
              </div>
            </div>

            {/* Editor Content Area */}
            <div className={styles.docContent}>
              {isEditing ? (
                <div 
                  ref={editorRef}
                  className={`${styles.docBody} ${!hasContent ? styles.placeholder : ''}`}
                  onKeyDown={handleKeyDown}
                  onMouseUp={handleMouseUp}
                  onInput={handleInput}
                  contentEditable={true}
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
        
        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2025 iHive · Entrepreneur | <Link href="/terms">Terms</Link> | <Link href="/Privacy">Privacy</Link></p>
        </footer>
      </div>
    </>
  );
};

export default Repository;