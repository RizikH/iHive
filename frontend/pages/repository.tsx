import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/repository.module.css';
import '../styles/globals.css';
import FileTreeDemo from '@/components/file-tree-demo';
import AvatarCirclesDemo from '@/components/avatar-circles-demo';
import { FiCopy, FiDownload, FiUpload, FiEdit, FiCheck, FiPlus, FiMinus, FiBold, FiItalic, FiUnderline } from 'react-icons/fi';

const Repository = () => {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          // Allow Shift+Enter for newline
          return;
        } else {
          // Regular Enter triggers save
          e.preventDefault();
          handleEdit();
        }
      }
    }
  };

  const handleCopy = () => {
    const content = document.querySelector(`.${styles.docBody}`)?.textContent;
    if (content) {
      navigator.clipboard.writeText(content)
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
          const content = e.target?.result;
          const docBody = document.querySelector(`.${styles.docBody}`) as HTMLElement;
          if (docBody && typeof content === 'string') {
            docBody.innerHTML = content.split('\n').map(line => 
              `<p>${line}</p>`
            ).join('');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleDownload = () => {
    const content = document.querySelector(`.${styles.docBody}`)?.textContent;
    if (content) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.txt';
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

  const handleIncreaseFont = () => {
    const docBody = document.querySelector(`.${styles.docBody}`) as HTMLElement;
    if (docBody) {
      const currentSize = parseInt(window.getComputedStyle(docBody).fontSize);
      docBody.style.fontSize = `${currentSize + 2}px`;
    }
  };

  const handleDecreaseFont = () => {
    const docBody = document.querySelector(`.${styles.docBody}`) as HTMLElement;
    if (docBody) {
      const currentSize = parseInt(window.getComputedStyle(docBody).fontSize);
      docBody.style.fontSize = `${currentSize - 2}px`;
    }
  };

  const handleStyle = (command: string) => {
    document.execCommand(command, false);
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
        <Link href="/sponsor">Your Sponsors</Link>
        <Link href="/get-started">Sign Out</Link>
      </div>
    </nav>

    <main className={styles.mainContent}>
      {/* SideBar | FileTree */}
      <div className={styles.sideBar}>
        <h2>File Tree</h2>
        <div className={styles.fileTree}>
          <FileTreeDemo />
        </div>
      </div>

      {/* Document Content */}
      <div className={styles.docSpace}>
        <div className={styles.docHeader}>
          <h2>Main Content</h2>
          <div className={styles.docDock}>
            <button className={styles.dockButton} title="Increase Font-Size" onClick={handleIncreaseFont}>
              <span><FiPlus /></span>
            </button>
            <button className={styles.dockButton} title="Decrease Font-Size" onClick={handleDecreaseFont}>
              <span><FiMinus /></span>
            </button>
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
            <button className={styles.dockButton} title={isEditing ? "Commit" : "Edit"} onClick={handleEdit}>
              <span>{isEditing ? <FiCheck /> : <FiEdit />}</span>
            </button>
          </div>
        </div>
        <div className={styles.docContent}>
          <div className={styles.docBody} onKeyDown={handleKeyDown}>
            <p>input here...</p>
          </div>
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