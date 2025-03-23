import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/styles/repository.module.css";
import { FileItem } from "./file-tree";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ihive.onrender.com/api"
    : "http://localhost:5000/api";

type Props = {
  file: FileItem;
  onUpdate: (file: FileItem) => void;
};

const FileEditor = ({ file, onUpdate }: Props) => {
  const [content, setContent] = useState(file.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(file.content || "");
  }, [file]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerText);
  };

  const handleSave = async () => {
    if (!file.id) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/files/${file.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...file, content }),
      });
      if (!res.ok) throw new Error("Failed to save file");
      const updated = await res.json();
      onUpdate(updated);
    } catch (err) {
      alert("Error saving file");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.editorHeader}>
        <h3>{file.name}</h3>
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      <div
        ref={editorRef}
        className={styles.docBody}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
      >
        {content}
      </div>
    </div>
  );
};

export default FileEditor;
