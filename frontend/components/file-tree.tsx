import React, { useState } from "react";
import styles from "@/app/styles/file-tree.module.css";
import { JSX } from "react/jsx-runtime";
import { fetcher } from "@/app/utils/fetcher";

export type FileItem = {
  id: string;
  name: string;
  type: "folder" | "text" | "upload";
  parent_id: string | null;
  content?: string;
  path?: string;
  mime_type?: string;
  children?: FileItem[];
};

type FileTreeProps = {
  files: FileItem[];
  onSelect: (file: FileItem) => void;
  onRefresh: () => void;
  selectedId: string | null;
  ideaId: number;
};

const FileTree = ({ files, onSelect, onRefresh, selectedId, ideaId }: FileTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const selectedFile = files.find((f) => f.id === selectedId) || null;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreate = async (type: "folder" | "text") => {
    if (!selectedFile || selectedFile.type !== "folder") {
      alert("Select a folder to create inside.");
      return;
    }
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    try {
      await fetcher("/files", "POST", {
        name,
        type,
        idea_id: ideaId,
        parent_id: selectedFile.id,
        content: type === "text" ? "" : undefined,
      });
      onRefresh();
    } catch (err: any) {
      alert(`Failed to create ${type}: ` + (err.info?.error || err.message));
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedFile || selectedFile.type !== "folder") return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("type", "upload");
    formData.append("idea_id", ideaId.toString());
    formData.append("parent_id", selectedFile.id);

    try {
      await fetcher("/files/upload", "POST", formData);
      onRefresh();
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

  const buildTree = (items: FileItem[], parentId: string | null = null): FileItem[] => {
    return items
      .filter((item) => item.parent_id === parentId)
      .map((item) => ({
        ...item,
        children: buildTree(items, item.id),
      }));
  };

  const renderTree = (nodes: FileItem[], depth: number = 0): JSX.Element[] => {
    return nodes.map((item) => (
      <div key={item.id} className={`${styles.treeItem} ${selectedId === item.id ? styles.selected : ""}`}> 
        <div className={styles.fileItem}>
          {item.type === "folder" && (
            <span onClick={() => toggleExpand(item.id)} className={styles.toggleIcon}>
              {expanded[item.id] ? "▾" : "▸"}
            </span>
          )}
          <span
            className={styles.fileItemName}
            onClick={() => {
              if (item.type === "upload" && item.path) {
                window.open(item.path, "_blank");
              } else {
                onSelect(item);
              }
            }}
          >
            {item.type === "folder" ? "📁" : item.type === "upload" ? "📎" : "📄"} {item.name}
          </span>
          {selectedId === item.id && (
            <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>✕</button>
          )}
        </div>
        {expanded[item.id] && item.children && (
          <div className={`folderContent depth-${depth}`}>{renderTree(item.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  const treeData = buildTree(files);

  return (
    <div className={styles.fileTreeContainer}>
      <div className={styles.treeActionsTop}>
        <button onClick={() => handleCreate("folder")}>+ Folder</button>
        <button onClick={() => handleCreate("text")}>+ Text</button>
        <label>
          Upload
          <input type="file" onChange={handleUpload} />
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