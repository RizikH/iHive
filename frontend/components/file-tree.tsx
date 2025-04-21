import React, { useState, useRef, useEffect } from "react";
import styles from "@/app/styles/file-tree.module.css";
import { JSX } from "react/jsx-runtime";
import { fetcher } from "@/app/utils/fetcher";
import {
  FiFolder,
  FiFolderPlus,
  FiFile,
  FiFileText,
  FiFilePlus,
  FiUpload,
  FiTrash2,
  FiChevronRight,
  FiChevronDown,
  FiImage,
  FiFileText as FiFilePdf,
  FiCode,
  FiLock
} from "react-icons/fi";

export type FileItem = {
  id: string;
  name: string;
  type: "folder" | "text" | "upload";
  parent_id: string | null;
  content?: string;
  path?: string;
  mime_type?: string;
  children?: FileItem[];
  is_locked?: boolean;
};

type FileTreeProps = {
  files: FileItem[];
  onSelect: (file: FileItem | null) => void; // ← allow null
  onRefresh: () => void;
  selectedId: string | null;
  ideaId: number;
};


// Helper function to get appropriate icon based on file name/type
const getFileIcon = (file: FileItem) => {
  if (file.type === "folder") return <FiFolder className={styles.folderIcon} />;

  if (file.type === "upload" && file.mime_type) {
    if (file.mime_type.startsWith("image/")) return <FiImage />;
    if (file.mime_type.startsWith("application/pdf")) return <FiFilePdf />;
  }

  // Check file extension
  if (file.name) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'md') return <FiFileText />;
    if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'php'].includes(ext || '')) {
      return <FiCode />;
    }
  }

  return file.type === "text" ? <FiFileText /> : <FiFile />;
};

const FileTree = ({ files, onSelect, onRefresh, selectedId, ideaId }: FileTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const fileTreeRef = useRef<HTMLDivElement>(null);

  // Auto-expand first level folders at first load
  React.useEffect(() => {
    const topLevelFolders = files
      .filter(f => f.type === "folder" && f.parent_id === null)
      .map(f => f.id);

    if (topLevelFolders.length > 0) {
      const newExpanded: Record<string, boolean> = {};
      topLevelFolders.forEach(id => { newExpanded[id] = true; });
      setExpanded(prev => ({ ...prev, ...newExpanded }));
    }
  }, [files]);

  // REMOVE the global click outside listener that was causing issues
  // We'll handle deselection only when clicking on empty areas of the tree

  const selectedFile = files.find((f) => f.id === selectedId) || null;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = async (type: "folder" | "text") => {
    // Parent ID logic - use selected folder or root
    const parentId = selectedFile && selectedFile.type === "folder"
      ? selectedFile.id
      : null;

    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    try {
      await fetcher("/files", "POST", {
        name,
        type,
        idea_id: ideaId,
        parent_id: parentId,
        content: type === "text" ? "" : undefined,
      });
      onRefresh();

      // Expand the parent folder if it exists
      if (parentId) {
        setExpanded(prev => ({ ...prev, [parentId]: true }));
      }
    } catch (err: any) {
      alert(`Failed to create ${type}: ` + (err.info?.error || err.message));
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Parent ID logic - use selected folder or root
    const parentId = selectedFile && selectedFile.type === "folder"
      ? selectedFile.id
      : null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("type", "upload");
    formData.append("idea_id", ideaId.toString());
    formData.append("parent_id", parentId || "");

    try {
      await fetcher("/files/upload", "POST", formData);
      onRefresh();

      // Expand the parent folder if it exists
      if (parentId) {
        setExpanded(prev => ({ ...prev, [parentId]: true }));
      }
    } catch (err: any) {
      alert("Failed to upload file: " + (err.info?.error || err.message));
    }
  };

  const handleDelete = async (fileId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;
    try {
      await fetcher(`/files/${fileId}`, "DELETE");
      onRefresh();
    } catch (err: any) {
      alert("Failed to delete: " + (err.info?.error || err.message));
    }
  };

  const isDescendant = (files: FileItem[], parentId: string, potentialChildId: string): boolean => {
    const children = files.filter(f => f.parent_id === parentId);
    for (const child of children) {
      if (child.id === potentialChildId) return true;
      if (isDescendant(files, child.id, potentialChildId)) return true;
    }
    return false;
  };


  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string, type: string) => {
    e.preventDefault();
    const targetFolder = files.find(f => f.id === id);
    if (type === "folder" && draggedItem !== id && !targetFolder?.is_locked) {
      setDropTarget(id);
    }
  };


  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDropTarget(null);

    if (!draggedItem || draggedItem === targetId) return;

    const draggedFile = files.find(f => f.id === draggedItem);
    const targetFolder = files.find(f => f.id === targetId);

    if (!draggedFile || !targetFolder || targetFolder.type !== "folder") return;

    // 🚫 Prevent moving into self
    if (draggedFile.id === targetFolder.id) return;

    // 🚫 Prevent moving into own descendant
    if (isDescendant(files, draggedFile.id, targetFolder.id)) {
      alert("You can't move a folder into one of its subfolders.");
      return;
    }

    // 🚫 Prevent moving into a locked folder
    if (targetFolder.is_locked) {
      alert("You can't move files into a locked folder.");
      return;
    }

    try {
      await fetcher(`/files/${draggedItem}/move`, "PUT", {
        parent_id: targetId
      });

      onRefresh();
      setExpanded(prev => ({ ...prev, [targetId]: true }));
    } catch (err: any) {
      alert("Failed to move file: " + (err.info?.error || err.message));
    }

    setDraggedItem(null);
  };


  const buildTree = (items: FileItem[], parentId: string | null = null): FileItem[] => {
    return items
      .filter((item) => item.parent_id === parentId)
      .sort((a, b) => {
        // Sorter
        if (a.type === "folder" && b.type !== "folder") return -1;
        if (a.type !== "folder" && b.type === "folder") return 1;
        return a.name.localeCompare(b.name);
      })
      .map((item) => ({
        ...item,
        children: buildTree(items, item.id),
      }));
  };

  const renderTree = (nodes: FileItem[], depth: number = 0): JSX.Element[] => {
    return nodes.map((item) => (
      <div
        key={item.id}
        className={`${styles.treeItem} ${selectedId === item.id ? styles.selected : ""} ${dropTarget === item.id ? styles.dropTarget : ""}`}
        draggable={!isPreviewMode}
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragOver={(e) => handleDragOver(e, item.id, item.type)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, item.id)}
      >
        <div
          className={styles.fileItem}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
            if (item.type === "folder") {
              toggleExpand(item.id);
            }
          }}
        >

          <div className={styles.fileItemLeft}>
            {item.type === "folder" ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(item.id);
                }}
                className={styles.toggleIcon}
              >
                {expanded[item.id] ? <FiChevronDown /> : <FiChevronRight />}
              </span>
            ) : (
              <span className={styles.fileIndent}></span>
            )}

            <span className={styles.fileItemName}>
              {getFileIcon(item)} {item.name}
            </span>

            {item.is_locked && (
              <span className={styles.lockIconRight} title="Locked">
                <FiLock />
              </span>
            )}
          </div>


          {!isPreviewMode && selectedId === item.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className={styles.deleteBtn}
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>

        {expanded[item.id] && item.children && item.children.length > 0 && (
          <div className={`${styles.folderContent} ${styles[`depth-${Math.min(depth, 3)}`]}`}>
            {renderTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };


  const treeData = buildTree(files);
  const isPreviewMode = false;

  // Handler to deselect when clicking on empty space in the tree
  const handleTreeClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (
      target.classList.contains(styles.fileTreeList) ||
      target.classList.contains(styles.fileTreeContainer)
    ) {
      onSelect(null); // ✅ use null instead of dummy object
    }
  };


  return (
    <div className={styles.fileTreeContainer} ref={fileTreeRef} onClick={handleTreeClick}>
      <div className={styles.treeActionsTop} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => handleCreate("folder")} title="Create new folder">
          <FiFolderPlus /> Folder
        </button>
        <button onClick={() => handleCreate("text")} title="Create new file">
          <FiFilePlus /> File
        </button>
        <label title="Upload a file">
          <FiUpload /> Upload
          <input
            type="file"
            onChange={handleUpload}
            ref={(input) => {
              if (input) {
                input.setAttribute("webkitdirectory", "false");
                input.setAttribute("directory", "false");
              }
            }}
          />

        </label>
      </div>

      <div className={styles.fileTreeList}>
        {treeData.length ? renderTree(treeData) : (
          <div className={styles.emptyState}>
            <p>No files yet</p>
            <p>Start by creating a folder or file above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileTree;