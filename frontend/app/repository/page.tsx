"use client";

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/repository.module.css';
import '../styles/globals.css';
import FileTreeDemo from '@/components/file-tree-demo';
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
import sanitizeHtml from 'sanitize-html';

const Repository = () => {
  // =============================================
  // State Management
  // =============================================
  
  // Editor state
  const [isEditing, setIsEditing] = React.useState(false);
  const [content, setContent] = useState<string>('');
  const [hasContent, setHasContent] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // File management state
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [currentFileName, setCurrentFileName] = useState<string>('Main Content');
  const [ideas, setIdeas] = useState<any[]>([]);
  
  // UI state
  const [currentFontSize, setCurrentFontSize] = useState<number>(16);
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSelection, setSavedSelection] = useState<{
    range: Range | null;
    selection: Selection | null;
  }>({ range: null, selection: null });
  
  const placeholderText = 'Welcome to iHive Editor! Click the Edit button to start editing.';

  // =============================================
  // Effects
  // =============================================
  
  // Update hasContent when content changes
  useEffect(() => {
    // TODO: Add missing dependencies if needed
    setHasContent(content.trim() !== '');
  }, [content]);

  // Load saved files on initial render
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        
        const savedIdeas = localStorage.getItem('ideas');
        const fetchedIdeas = savedIdeas ? JSON.parse(savedIdeas) : [];
        setIdeas(fetchedIdeas);
        
        const ideaContents: Record<string, string> = {};
        fetchedIdeas.forEach((idea: any) => {
          ideaContents[idea.id] = idea.description;
        });
        setFileContents(ideaContents);
      } catch (error) {
        setError('Failed to fetch ideas');
        console.error('Error fetching ideas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // Add selection change listener when editing
  useEffect(() => {
    // TODO: Add missing dependencies if needed
    if (isEditing) {
      document.addEventListener('selectionchange', handleSelectionChange);
    }
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isEditing]);

  // Close font size dropdown when clicking outside
  useEffect(() => {
    // TODO: Add missing dependencies if needed
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('fontSizeDropdown');
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
  // UI Action Handlers
  // =============================================
  
  const handleEdit = () => {
    if (editorRef.current) {
      setIsEditing(!isEditing);
      editorRef.current.setAttribute('contenteditable', (!isEditing).toString());
      editorRef.current.focus();
    }
  };

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
        reader.onload = (e) => {
          const fileContent = e.target?.result;
          let formattedContent = '';
          
          if (file.type.includes('text/plain')) {
            if (typeof fileContent === 'string') {
              formattedContent = fileContent.split('\n').map(line => 
                line.trim() ? `<p>${line}</p>` : '<p><br></p>'
              ).join('');
            }
          } else if (file.type.includes('image')) {
            formattedContent = `<p><img src="${fileContent}" alt="${file.name}" style="max-width: 100%; height: auto;"/></p>`;
          } else {
            formattedContent = `<p>File uploaded: ${file.name}</p>`;
          }

          // Generate a unique ID for the new file
          const newFileId = `file-${Date.now()}`;
          
          // Update file contents state
          setFileContents(prev => ({
            ...prev,
            [newFileId]: formattedContent
          }));

          // Set this as the current file
          setCurrentFileId(newFileId);
          setContent(formattedContent);
          setCurrentFileName(file.name);
          setHasContent(true);

          // Update the file tree through the onContentUpdate callback
          handleContentUpdate(newFileId, formattedContent);
        };

        if (file.type.includes('image')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      }
    };
    input.click();
  };

  const handleDownload = () => {
    if (content) {
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

  // =============================================
  // Text Formatting Handlers
  // =============================================
  
  const handleStyle = (command: string) => {
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      document.execCommand(command, false);
      return;
    }
    
    document.execCommand(command, false);
    
    const docBody = document.querySelector(`.${styles.docBody}`) as HTMLElement;
    if (docBody) {
      setContent(docBody.innerHTML);
    }
  };

  const handleFontSizeChange = (size: number) => {
    setCurrentFontSize(size);
    
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (range.collapsed) {
      const marker = document.createElement('span');
      marker.id = 'font-size-marker';
      marker.style.fontSize = `${size}px`;
      marker.innerHTML = '&#8203;'; 
      
      range.insertNode(marker);
      range.setStartAfter(marker);
      range.setEndAfter(marker);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      const selectedContent = range.extractContents();
      const wrapper = document.createElement('span');
      wrapper.style.fontSize = `${size}px`;
      wrapper.appendChild(selectedContent);
      range.insertNode(wrapper);
      
      const newRange = document.createRange();
      newRange.selectNodeContents(wrapper);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    
    const docBody = document.querySelector(`.${styles.docBody}`) as HTMLElement;
    if (docBody) {
      setContent(docBody.innerHTML);
    }
  };

  const handleDirectFontSizeInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      handleFontSizeChange(value);
    }
  };

  // =============================================
  // Selection Management
  // =============================================
  
  const saveCurrentSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange();
      setSavedSelection({ range, selection });
    }
  };

  const restoreSelection = () => {
    if (savedSelection.range && savedSelection.selection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedSelection.range);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    if (range.collapsed) return;
    
    const selectedNode = range.startContainer;
    
    if (selectedNode) {
      let element: HTMLElement | null = null;
      
      if (selectedNode.nodeType === Node.TEXT_NODE && selectedNode.parentElement) {
        element = selectedNode.parentElement;
      } else if (selectedNode.nodeType === Node.ELEMENT_NODE) {
        element = selectedNode as HTMLElement;
      }
      
      if (element) {
        const fontSize = getActualFontSize(element);
        if (fontSize !== null) {
          setCurrentFontSize(fontSize);
          return;
        }
      }
    }
    
    try {
      const tempSpan = document.createElement('span');
      tempSpan.appendChild(range.cloneContents());
      
      tempSpan.style.position = 'absolute';
      tempSpan.style.visibility = 'hidden';
      document.body.appendChild(tempSpan);
      
      const fontSize = getActualFontSize(tempSpan);
      
      document.body.removeChild(tempSpan);
      
      if (fontSize !== null) {
        setCurrentFontSize(fontSize);
      }
    } catch (e) {
      console.error('Error getting font size:', e);
    }
  };

  const handleSelectionChange = () => {
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    if (!range.collapsed) {
      handleMouseUp();
      return;
    }
    
    let currentNode = range.startContainer;
    let element: HTMLElement | null = null;
    
    if (currentNode.nodeType === Node.TEXT_NODE && currentNode.parentElement) {
      element = currentNode.parentElement;
    } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
      element = currentNode as HTMLElement;
    }
    
    if (element) {
      const fontSize = getActualFontSize(element);
      if (fontSize !== null) {
        setCurrentFontSize(fontSize);
        return;
      }
    }
    
    while (currentNode && currentNode.parentElement) {
      currentNode = currentNode.parentElement;
      const element = currentNode as HTMLElement;
      
      const fontSize = getActualFontSize(element);
      if (fontSize !== null) {
        setCurrentFontSize(fontSize);
        break;
      }
    }
  };

  // =============================================
  // Utility Functions
  // =============================================
  
  const getActualFontSize = (element: HTMLElement): number | null => {
    if (element.style && element.style.fontSize) {
      const size = parseInt(element.style.fontSize);
      if (!isNaN(size)) {
        return size;
      }
    }
    
    const computedStyle = window.getComputedStyle(element);
    const computedSize = parseInt(computedStyle.fontSize);
    if (!isNaN(computedSize)) {
      return computedSize;
    }
    
    return null;
  };

  // =============================================
  // Render
  // =============================================
  
  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Entrepreneur Repository</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.pageContainer}>
        {/*Navigation*/}
        <nav className={styles.navContainer}>
          <div className={styles.logo}>
            <Link href="/" title="Home" className="flex items-center gap-2">
              <Image
                src="/Images/iHive.png"
                alt="Logo"
                width={35}
                height={35}
                className={styles.logoImage}
              />
              <span>iHive-Entrepreneur</span>
            </Link>
          </div>
          <div className={styles['nav-links']}>
            <Link href="/entrepreneur">Profile</Link>
            <Link href="/setting">Setting</Link>
            <Link href="/sponsors">Sponsors</Link>
            <Link href="/get-started">Sign Out</Link>
          </div>
        </nav>

        <main className={styles.mainContent}>
          {isLoading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>{error}</div>}

          {/*File Tree Sidebar*/}
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

          {/*Document Content Area*/}
          <div className={styles.docSpace}>
            {/*Document Header and Toolbar*/}
            <div className={styles.docHeader}>
              <h2>{currentFileName}</h2>
              <div className={styles.docDock}>
                {/*Font Size Selector*/}
                <div 
                  className={styles.fontSizeContainer}
                  onMouseDown={(e) => {
                    if (isEditing) {
                      saveCurrentSelection();
                    }
                    e.preventDefault();
                  }}
                >
                  <input
                    type="text"
                    className={styles.fontSizeInput}
                    value={currentFontSize || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setCurrentFontSize(0);
                      } else if (/^\d*$/.test(value)) { 
                        const numValue = parseInt(value);
                        if (numValue <= 400) { 
                          setCurrentFontSize(numValue);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      if (!currentFontSize || currentFontSize < 1) {
                        setCurrentFontSize(16); 
                      } else {
                        handleDirectFontSizeInput(e);
                      }
                      setTimeout(restoreSelection, 0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!currentFontSize || currentFontSize < 1) {
                          setCurrentFontSize(16); 
                        }
                        handleDirectFontSizeInput(e as unknown as React.FocusEvent<HTMLInputElement>);
                        setTimeout(restoreSelection, 0);
                      }
                    }}
                    onMouseDown={(e) => {
                      if (isEditing) {
                        e.stopPropagation();
                      }
                    }}
                  />
                  <div 
                    className={styles.fontSizeDropdown}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      const dropdown = document.getElementById('fontSizeDropdown');
                      if (dropdown) {
                        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                      }
                    }}
                  >
                    <span className={styles.dropdownArrow}>▼</span>
                  </div>
                  <div id="fontSizeDropdown" className={styles.fontSizeOptions}>
                    {fontSizes.map(size => (
                      <div 
                        key={size} 
                        className={`${styles.fontSizeOption} ${currentFontSize === size ? styles.selected : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          handleFontSizeChange(size);
                          const dropdown = document.getElementById('fontSizeDropdown');
                          if (dropdown) dropdown.style.display = 'none';
                          
                          setTimeout(restoreSelection, 0);
                        }}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>

                {/*Text Formatting Buttons*/}
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

                {/*Document Action Buttons*/}
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

            {/*Editor Area*/}
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

        {/*Footer*/}
        <footer className={styles.footer}>
          <p>
            © 2025 iHive · Entrepreneur | <Link href="/terms" target='_blank'>Terms</Link> | <Link href="/Privacy" target='_blank'>Privacy</Link>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Repository;