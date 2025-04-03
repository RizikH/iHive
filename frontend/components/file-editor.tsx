import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/styles/repository.module.css";
import { FileItem } from "./file-tree";
import { fetcher } from "@/app/utils/fetcher";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  FiCopy, 
  FiDownload, 
  FiEdit, 
  FiSave, 
  FiX 
} from "react-icons/fi";

type Props = {
  file: FileItem;
  onUpdate: (file: FileItem) => void;
};

const FileEditor = ({ file, onUpdate }: Props) => {
  const [content, setContent] = useState(file.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Get language for syntax highlighting
  const getLanguage = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "py":
        return "python";
      case "java":
        return "java";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      case "md":
        return "markdown";
      case "sql":
        return "sql";
      case "sh":
        return "bash";
      default:
        return "text";
    }
  };

  useEffect(() => {
    setContent(file.content || "");
    setIsEditing(false); // Reset editing when switching files
    setCopied(false);
  }, [file]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = async () => {
    if (!file.id) return;
    setIsSaving(true);
    try {
      const updated = await fetcher(`/files/${file.id}`, "PUT", {
        ...file,
        content,
      });
      onUpdate(updated);
      setIsEditing(false);
    } catch (err: any) {
      alert("Error saving file: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleCancel = () => {
    setContent(file.content || "");
    setIsEditing(false);
  };

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.editorToolbar}>
        <div className={styles.editorInfo}>
          <span className={styles.filename}>{file.name}</span>
          <span className={styles.filesize}>{content.length} bytes</span>
        </div>
        
        <div className={styles.editorActions}>
          {!isEditing ? (
            <>
              <button 
                className={styles.toolbarButton} 
                onClick={handleCopy} 
                title="Copy to clipboard"
              >
                <FiCopy /> {copied ? "Copied!" : "Copy"}
              </button>
              <button 
                className={styles.toolbarButton}
                onClick={handleDownload}
                title="Download file"
              >
                <FiDownload /> Download
              </button>
              <button 
                className={styles.toolbarButton}
                onClick={() => setIsEditing(true)}
                title="Edit file"
              >
                <FiEdit /> Edit
              </button>
            </>
          ) : (
            <>
              <button 
                className={styles.toolbarButton}
                onClick={handleCancel}
                title="Cancel editing"
              >
                <FiX /> Cancel
              </button>
              <button 
                className={`${styles.toolbarButton} ${styles.saveButton}`}
                onClick={handleSave} 
                disabled={isSaving}
                title="Save changes"
              >
                <FiSave /> {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <textarea
          ref={editorRef as React.RefObject<HTMLTextAreaElement>}
          className={styles.editableContent}
          value={content}
          onChange={handleInput}
          spellCheck={false}
          autoComplete="off"
        />
      ) : (
        <div className={styles.viewContent}>
          {content ? (
            <SyntaxHighlighter
              language={getLanguage(file.name)}
              style={oneLight}
              showLineNumbers
              wrapLines
              customStyle={{ 
                margin: 0, 
                borderRadius: '0 0 6px 6px',
                backgroundColor: '#f6f8fa'
              }}
            >
              {content}
            </SyntaxHighlighter>
          ) : (
            <div className={styles.emptyFile}>
              <h3>Welcome to iHive Editor!</h3>
              <p>Select or create a file to begin editing.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileEditor;
