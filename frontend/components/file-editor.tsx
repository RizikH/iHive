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
  FiX,
  FiLock,
  FiShield,
  FiGlobe,
  FiSettings
} from "react-icons/fi";
import { useAuthStore } from '@/app/stores/useAuthStore';

type Props = {
  file: FileItem;
  onUpdate: (file: FileItem) => void;
};

// Permission type definition
type Permission = 'private' | 'protected' | 'public';

const FileEditor = ({ file, onUpdate }: Props) => {
  const [content, setContent] = useState(file.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissionLevel, setPermissionLevel] = useState<Permission>(
    file.is_public as Permission || 'private'
  );
  const [updatingPermission, setUpdatingPermission] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const currentUser = useAuthStore((state) => state.currentUser);
  const isOwner = currentUser?.id === file.user_id;
  
  // Get language for syntax highlighting
  const getLanguage = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
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
      case "c":
        return "c";
      case "cpp":
      case "cc":
      case "cxx":
        return "cpp";
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
      case "php":
        return "php";
      default:
        return "text";
    }
  };
  
  useEffect(() => {
    setContent(file.content || "");
    setIsEditing(false); // Reset editing when switching files
    setCopied(false);
    // Make sure we have a default permission value if is_public is undefined
    const filePermission = file.is_public || 'private';
    setPermissionLevel(filePermission as Permission);
    setShowPermissions(false);
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
      onUpdate(updated.data);
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

  const handlePermissionChange = async (newPermission: Permission) => {
    if (!file.id || !isOwner) return;
    
    setUpdatingPermission(true);
    try {
      const response = await fetcher(`/files/${file.id}`, "PUT", {
        is_public: newPermission
      });
      
      if (response && response.data) {
        setPermissionLevel(newPermission);
        const updatedFile = {
          ...file,
          is_public: newPermission
        };
        onUpdate(updatedFile);
      } else {
        throw new Error("Failed to update permission");
      }
    } catch (err: any) {
      console.error("Error updating file permissions:", err);
      alert("Error updating file permissions: " + err.message);
    } finally {
      setUpdatingPermission(false);
    }
  };

  const getPermissionIcon = (permission: Permission) => {
    switch (permission) {
      case 'private': return <FiLock />;
      case 'protected': return <FiShield />;
      case 'public': return <FiGlobe />;
      default: return <FiLock />;
    }
  };

  const getPermissionLabel = (permission: Permission) => {
    switch (permission) {
      case 'private': return 'Private (Only you can access)';
      case 'protected': return 'Protected (Collaborators can access)';
      case 'public': return 'Public (Anyone can access)';
      default: return 'Private';
    }
  };

  // Also debug the current permission
  console.log('Current file permission:', file.is_public, 'Current permission state:', permissionLevel);

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.editorToolbar}>
        <div className={styles.editorInfo}>
          <span className={styles.filename}>
            {file.name} 
            {file.is_locked && (
              <span className={styles.lockIcon} title="This file is locked and cannot be edited">
                <FiLock />
              </span>
            )}
          </span>
          <span className={styles.filesize}>{content.length} bytes</span>
          <span 
            className={styles.permissionIndicator} 
            title={getPermissionLabel(permissionLevel)}
            onClick={() => isOwner && setShowPermissions(!showPermissions)}
            style={{ 
              backgroundColor: permissionLevel === 'private' ? '#fee2e2' : 
                             permissionLevel === 'protected' ? '#fef3c7' : 
                             '#dcfce7',
              cursor: isOwner ? 'pointer' : 'default'
            }}
          >
            {getPermissionIcon(permissionLevel)}
            <span className={styles.permissionText}>{permissionLevel}</span>
          </span>
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
              {isOwner && (
                <button 
                  className={styles.toolbarButton}
                  onClick={() => setShowPermissions(!showPermissions)}
                  title="Manage permissions"
                >
                  <FiSettings /> Permissions
                </button>
              )}
              {!file.is_locked && (
                <button 
                  className={styles.toolbarButton}
                  onClick={() => setIsEditing(true)}
                  title="Edit file"
                >
                  <FiEdit /> Edit
                </button>
              )}
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
      
      {showPermissions && isOwner && (
        <div className={styles.permissionsPanel}>
          <h3 className={styles.permissionsTitle}>File Permissions</h3>
          <div className={styles.permissionOptions}>
            {(['private', 'protected', 'public'] as Permission[]).map((permission) => (
              <button
                key={permission}
                className={`${styles.permissionButton} ${permissionLevel === permission ? styles.activePermission : ''}`}
                onClick={() => handlePermissionChange(permission)}
                disabled={updatingPermission || permissionLevel === permission}
                style={{
                  backgroundColor: permission === 'private' ? '#fff1f2' : 
                                permission === 'protected' ? '#fef9c3' : 
                                '#f0fdf4',
                  borderColor: permission === 'private' ? '#fecaca' : 
                             permission === 'protected' ? '#fde68a' : 
                             '#bbf7d0',
                  opacity: permissionLevel === permission ? 1 : 0.8
                }}
              >
                {getPermissionIcon(permission)}
                <span>{getPermissionLabel(permission)}</span>
                {permissionLevel === permission && 
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>✓ Current</span>
                }
              </button>
            ))}
          </div>
          <div className={styles.permissionInfo}>
            <p><strong>Private:</strong> Only you can view and edit this file</p>
            <p><strong>Protected:</strong> Collaborators can view this file based on their permission level</p>
            <p><strong>Public:</strong> Anyone with access to the repository can view this file</p>
          </div>
          {updatingPermission && (
            <div style={{ textAlign: 'center', padding: '8px', color: '#666' }}>
              Updating permission...
            </div>
          )}
        </div>
      )}
      
      {isEditing && !file.is_locked ? (
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
      
      {file.is_locked && (
        <div className={styles.lockedFileMessage}>
          <FiLock /> This file is locked and cannot be edited
        </div>
      )}
    </div>
  );
};

export default FileEditor;
