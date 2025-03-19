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

 
  useEffect(() => {
    setHasContent(content.trim() !== '');
  }, [content]);

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
            
            const formattedContent = fileContent.split('\n').map(line => 
              line.trim() ? `<p>${line}</p>` : '<p><br></p>'
            ).join('');
            
            setContent(formattedContent);
            
           
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
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // If no text is selected (just a cursor position), return
    if (range.collapsed) return;
    
    // Get the actual selected text node
    const selectedNode = range.startContainer;
    
    // Try to get the font size directly from the selected node or its parent
    if (selectedNode) {
      let element: HTMLElement | null = null;
      
      // If it's a text node, get its parent element
      if (selectedNode.nodeType === Node.TEXT_NODE && selectedNode.parentElement) {
        element = selectedNode.parentElement;
      } 
      // If it's an element node, use it directly
      else if (selectedNode.nodeType === Node.ELEMENT_NODE) {
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
    
    // If we couldn't get the font size directly, try with a temporary element
    try {
      // Create a temporary span with the exact content of the selection
      const tempSpan = document.createElement('span');
      tempSpan.appendChild(range.cloneContents());
      
      // Add to document to compute style (but hidden)
      tempSpan.style.position = 'absolute';
      tempSpan.style.visibility = 'hidden';
      document.body.appendChild(tempSpan);
      
      const fontSize = getActualFontSize(tempSpan);
      
      // Remove the temporary element
      document.body.removeChild(tempSpan);
      
      if (fontSize !== null) {
        setCurrentFontSize(fontSize);
      }
    } catch (e) {
      console.error('Error getting font size:', e);
    }
  };

  // Helper function to get the actual font size from an element
  const getActualFontSize = (element: HTMLElement): number | null => {
    // First check for inline style (highest priority)
    if (element.style && element.style.fontSize) {
      const size = parseInt(element.style.fontSize);
      if (!isNaN(size)) {
        return size;
      }
    }
    
    // Then check computed style
    const computedStyle = window.getComputedStyle(element);
    const computedSize = parseInt(computedStyle.fontSize);
    if (!isNaN(computedSize)) {
      return computedSize;
    }
    
    return null;
  };

  const handleFontSizeChange = (size: number) => {
    setCurrentFontSize(size);
    
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // If no text is selected, set the font size for future typing
    if (range.collapsed) {
      const marker = document.createElement('span');
      marker.id = 'font-size-marker';
      marker.style.fontSize = `${size}px`;
      marker.innerHTML = '&#8203;'; // Zero-width space
      
      range.insertNode(marker);
      range.setStartAfter(marker);
      range.setEndAfter(marker);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // For selected text, wrap it in a span with the desired font size
      const selectedContent = range.extractContents();
      const wrapper = document.createElement('span');
      wrapper.style.fontSize = `${size}px`;
      wrapper.appendChild(selectedContent);
      range.insertNode(wrapper);
      
      // Select the wrapped content
      const newRange = document.createRange();
      newRange.selectNodeContents(wrapper);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    
    // Update content
    const docBody = document.querySelector(`.${styles.docBody}`) as HTMLElement;
    if (docBody) {
      setContent(docBody.innerHTML);
    }
  };

  // Improve the selection change handler to better detect font size
  const handleSelectionChange = () => {
    if (!isEditing) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    
    // If text is selected, use the mouseUp handler
    if (!range.collapsed) {
      handleMouseUp();
      return;
    }
    
    // For cursor position (no selection), get font size at cursor
    let currentNode = range.startContainer;
    let element: HTMLElement | null = null;
    
    // If it's a text node, get its parent element
    if (currentNode.nodeType === Node.TEXT_NODE && currentNode.parentElement) {
      element = currentNode.parentElement;
    } 
    // If it's an element node, use it directly
    else if (currentNode.nodeType === Node.ELEMENT_NODE) {
      element = currentNode as HTMLElement;
    }
    
    if (element) {
      const fontSize = getActualFontSize(element);
      if (fontSize !== null) {
        setCurrentFontSize(fontSize);
        return;
      }
    }
    
    // If we couldn't get the font size from the current node, traverse up the DOM tree
    while (currentNode && currentNode.parentElement) {
      currentNode = currentNode.parentElement;
      // Cast to HTMLElement to fix type error
      const element = currentNode as HTMLElement;
      
      const fontSize = getActualFontSize(element);
      if (fontSize !== null) {
        setCurrentFontSize(fontSize);
        break;
      }
    }
  };
  

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('selectionchange', handleSelectionChange);
    }
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isEditing]);

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

  const handleFileSelect = (fileId: string, fileContent: string, fileName: string) => {
    setCurrentFileId(fileId);
    setContent(fileContent);
    setCurrentFileName(fileName);
    setIsEditing(false);
    setHasContent(fileContent.trim() !== '');
  };

  const handleContentUpdate = (fileId: string, newContent: string) => {
    
    if (fileId) {
      setFileContents(prev => ({
        ...prev,
        [fileId]: newContent
      }));
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    
    if (isEditing) {
      const newContent = e.currentTarget.innerHTML || '';
      setContent(newContent);
      setHasContent(newContent.trim() !== '');
      
     
      const marker = document.getElementById('font-size-marker');
      if (marker && marker.textContent === '') {
        marker.remove();
      }
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

  const handleEnableEdit = () => {
    setIsEditing(true);
    
    setTimeout(() => {
      const docBody = document.querySelector(`.${styles.docBody}`) as HTMLElement;
      if (docBody) {
        // Always set the font size when enabling edit mode
        docBody.style.fontSize = `${currentFontSize}px`;
        
        // Set contentEditable attribute
        docBody.setAttribute('contenteditable', 'true');
        
        // Focus the editor
        docBody.focus();
        
        // Set focus to the end of the content
        const selection = window.getSelection();
        if (selection) {
          try {
            // Try to place cursor at the end of content
            const range = document.createRange();
            const contentDiv = docBody.querySelector('div');
            if (contentDiv && contentDiv.childNodes.length > 0) {
              const lastNode = contentDiv.childNodes[contentDiv.childNodes.length - 1];
              if (lastNode.nodeType === Node.TEXT_NODE) {
                range.setStart(lastNode, lastNode.textContent?.length || 0);
              } else if (lastNode.nodeType === Node.ELEMENT_NODE) {
                range.setStartAfter(lastNode);
              }
            } else {
              range.setStart(docBody, 0);
            }
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            console.error('Error setting cursor position:', e);
            // Fallback to just focusing the element
            docBody.focus();
          }
        }
      }
    }, 0);
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

  const handleDirectFontSizeInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      handleFontSizeChange(value);
    }
  };

  const [savedSelection, setSavedSelection] = useState<{
    range: Range | null;
    selection: Selection | null;
  }>({ range: null, selection: null });


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

  useEffect(() => {
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
            <div className={styles.fontSizeContainer}
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
                  } else if (/^\d*$/.test(value)) { // Only allow digits
                    const numValue = parseInt(value);
                    if (numValue <= 400) { // Set a reasonable maximum
                      setCurrentFontSize(numValue);
                    }
                  }
                }}
                onBlur={(e) => {
                  if (!currentFontSize || currentFontSize < 1) {
                    setCurrentFontSize(16); // Reset to default if invalid
                  } else {
                    handleDirectFontSizeInput(e);
                  }
                  // Restore selection after changing font size
                  setTimeout(restoreSelection, 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!currentFontSize || currentFontSize < 1) {
                      setCurrentFontSize(16); // Reset to default if invalid
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
                      // Prevent default to avoid losing selection
                      e.preventDefault();
                      e.stopPropagation();
                      
                      handleFontSizeChange(size);
                      const dropdown = document.getElementById('fontSizeDropdown');
                      if (dropdown) dropdown.style.display = 'none';
                      
                      // Restore selection after changing font size
                      setTimeout(restoreSelection, 0);
                    }}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

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
};

export default Repository;