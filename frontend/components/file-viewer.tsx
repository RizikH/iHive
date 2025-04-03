import React, { useState, useEffect } from "react";
import styles from "@/app/styles/repository.module.css";
import { FileItem } from "./file-tree";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type Props = {
  file: FileItem;
};

const FileViewer = ({ file }: Props) => {
  const [fileUrl, setFileUrl] = useState<string>("");

  useEffect(() => {
    if (file.type === "upload" && file.id) {
      // Use backend proxy route to fetch and serve the file
      setFileUrl(`${API_URL}/files/${file.id}/view`);
    }
  }, [file]);

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

  const renderUploadPreview = () => {
    const isImage = file.mime_type?.startsWith("image/");
    const isPdf = file.mime_type === "application/pdf";

    return (
      <>
        {isImage ? (
          <div className={styles.imageContainer}>
            <img
              src={fileUrl}
              alt={file.name}
              className={styles.uploadedImage}
              onError={(e) => {
                console.error("Image failed to load:", fileUrl);
                e.currentTarget.src = "/placeholder-image.png";
              }}
            />
          </div>
        ) : isPdf ? (
          <iframe src={fileUrl} title={file.name} className={styles.pdfViewer} />
        ) : (
          <a href={fileUrl} download>
            📎 Download {file.name}
          </a>
        )}
      </>
    );
  };

  const renderTextFile = () => (
    <SyntaxHighlighter
      language={getLanguage(file.name)}
      style={oneDark}
      showLineNumbers
      wrapLines
      customStyle={{ borderRadius: "8px", padding: "1rem" }}
    >
      {file.content || "// Welcome to iHive Editor! Start adding content to this file."}
    </SyntaxHighlighter>
  );

  return (
    <div className={styles.viewerWrapper}>
      <h3>{file.name}</h3>
      {file.type === "upload" && fileUrl
        ? renderUploadPreview()
        : file.type === "text"
        ? renderTextFile()
        : <p>🪵 Preview not available for this file type.</p>
      }
    </div>
  );
};

export default FileViewer;
