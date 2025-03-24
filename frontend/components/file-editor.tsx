import React, { useEffect, useRef, useState } from "react";
import styles from "@/app/styles/repository.module.css";
import { FileItem } from "./file-tree";
import { fetcher } from "@/app/utils/fetcher";

type Props = {
  file: FileItem;
  onUpdate: (file: FileItem) => void;
};

const FileEditor = ({ file, onUpdate }: Props) => {
  const [content, setContent] = useState(file.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(file.content || "");
    setIsEditing(false); // Reset editing when switching files
  }, [file]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerText);
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

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.editorHeader}>
        <h3>{file.name}</h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
      <div
        ref={editorRef}
        className={styles.docBody}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onInput={handleInput}
        dir="ltr"
        style={{ border: isEditing ? "1px solid #ccc" : "none", padding: "8px" }}
      >
        {content}
      </div>
    </div>
  );
};

export default FileEditor;
