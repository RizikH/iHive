import React, { useState } from "react";
import styles from "@/app/styles/file-tree.module.css";
import { JSX } from "react/jsx-runtime";

export type FileItem = {
  id: string;
  name: string;
  type: 'folder' | 'text' | 'upload';
  parent_id: string | null;
  content?: string;
  path?: string;
  mime_type?: string;
  children?: FileItem[];
};

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ihive.onrender.com/api"
    : "http://localhost:5000/api";

type FileTreeProps = {
  files: FileItem[];
  onSelect: (file: FileItem) => void;
  onRefresh: () => void;
  selectedId: string | null;
  ideaId: number;
  userId: string;
};

const FileTree = ({ files, onSelect, onRefresh, selectedId, ideaId, userId }: FileTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateFolder = async (parentId: string | null = null) => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    const res = await fetch(`${API_URL}/files`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type: "folder", idea_id: ideaId, user_id: userId, parent_id: parentId }),
    });
    if (res.ok) onRefresh();
    else alert("Failed to create folder.");
  };

  const handleCreateTextFile = async (parentId: string | null = null) => {
    const name = prompt("Enter file name:");
    if (!name) return;
    const res = await fetch(`${API_URL}/files`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type: "text", idea_id: ideaId, user_id: userId, parent_id: parentId, content: "" }),
    });
    if (res.ok) onRefresh();
    else alert("Failed to create text file.");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, parentId: string | null = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("type", "upload");
    formData.append("idea_id", ideaId.toString());
    formData.append("user_id", userId);
    formData.append("parent_id", parentId || "");

    const res = await fetch(`${API_URL}/files/upload`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) onRefresh();
    else alert("Failed to upload file.");
  };

  const buildTree = (items: FileItem[], parentId: string | null = null): FileItem[] => {
    return items
      .filter((item) => item.parent_id === parentId)
      .map((item) => ({
        ...item,
        children: buildTree(items, item.id)
      }));
  };

  const renderTree = (nodes: FileItem[], depth: number = 0): JSX.Element[] => {
    return nodes.map((item) => (
      <div key={item.id} className={styles.treeItem} style={{ paddingLeft: depth * 16 }}>
        <div className={styles.treeRow}>
          {item.type === "folder" && (
            <span onClick={() => toggleExpand(item.id)} className={styles.toggleIcon}>
              {expanded[item.id] ? "▾" : "▸"}
            </span>
          )}
          <span
            onClick={() => {
              if (item.type === 'upload' && item.path) {
                window.open(item.path, '_blank');
              } else {
                onSelect(item);
              }
            }}
            className={`${styles.treeLabel} ${selectedId === item.id ? styles.selected : ''}`}
          >
            {item.type === "folder" ? "📁" : item.type === "upload" ? "📎" : "📄"} {item.name}
          </span>
          {item.mime_type && (
            <small className={styles.fileDetails}>{item.mime_type}</small>
          )}
        </div>

        {expanded[item.id] && item.children && (
          <div className={styles.treeChildren}>
            <div className={styles.treeActionsInline}>
              <button onClick={() => handleCreateFolder(item.id)}>+ Folder</button>
              <button onClick={() => handleCreateTextFile(item.id)}>+ Text</button>
              <label>
                Upload
                <input type="file" style={{ display: "none" }} onChange={(e) => handleUpload(e, item.id)} />
              </label>
            </div>
            {renderTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const treeData = buildTree(files);

  return (
    <div className={styles.fileTreeContainer}>
      <div className={styles.treeActionsTop}>
        <button onClick={() => handleCreateFolder(null)}>New Folder</button>
        <button onClick={() => handleCreateTextFile(null)}>New File</button>
        <label>
          Upload File
          <input type="file" style={{ display: "none" }} onChange={(e) => handleUpload(e)} />
        </label>
      </div>
      <div className={styles.fileTreeList}>{renderTree(treeData)}</div>
    </div>
  );
};

export default FileTree;