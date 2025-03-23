import React, { JSX, useState } from "react";
import styles from "@/app/styles/repository.module.css";

// Type for file/folder entries
export type FileItem = {
  id: string;
  name: string;
  type: 'folder' | 'text' | 'upload';
  parent_id: string | null;
  content?: string;
  path?: string;
};

type FileTreeProps = {
  files: FileItem[];
  onSelect: (file: FileItem) => void;
  onRefresh: () => void;
  selectedId: string | null;
};

const FileTree = ({ files, onSelect, onRefresh, selectedId }: FileTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateFolder = async (parentId: string | null = null) => {
    const name = prompt("Enter folder name:");
    if (!name) return;
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type: "folder", parent_id: parentId }),
    });
    onRefresh();
  };

  const handleCreateTextFile = async (parentId: string | null = null) => {
    const name = prompt("Enter file name:");
    if (!name) return;
    await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type: "text", parent_id: parentId, content: "" }),
    });
    onRefresh();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, parentId: string | null = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("type", "upload");
    formData.append("parent_id", parentId || "");

    await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });
    onRefresh();
  };

  const renderTree = (items: FileItem[], parentId: string | null = null, depth: number = 0): JSX.Element[] => {
    return items
      .filter((item) => item.parent_id === parentId)
      .map((item) => (
        <div key={item.id} className={styles.treeItem} style={{ paddingLeft: depth * 12 }}>
          {item.type === "folder" && (
            <span onClick={() => toggleExpand(item.id)} className={styles.folderToggle}>
              [{expanded[item.id] ? "-" : "+"}]
            </span>
          )}

          <span
            onClick={() => onSelect(item)}
            className={selectedId === item.id ? styles.selected : ""}
          >
            {item.name}
          </span>

          {expanded[item.id] && (
            <div className={styles.treeActions}>
              <button onClick={() => handleCreateFolder(item.id)}>+ Folder</button>
              <button onClick={() => handleCreateTextFile(item.id)}>+ Text</button>
              <label>
                Upload
                <input type="file" style={{ display: "none" }} onChange={(e) => handleUpload(e, item.id)} />
              </label>
              {renderTree(items, item.id, depth + 1)}
            </div>
          )}
        </div>
      ));
  };

  return (
    <div className={styles.fileTreeContainer}>
      <div className={styles.treeActions}>
        <button onClick={() => handleCreateFolder(null)}>New Folder</button>
        <button onClick={() => handleCreateTextFile(null)}>New File</button>
        <label>
          Upload File
          <input type="file" style={{ display: "none" }} onChange={(e) => handleUpload(e)} />
        </label>
      </div>
      <div className={styles.fileTreeList}>{renderTree(files)}</div>
    </div>
  );
};

export default FileTree;