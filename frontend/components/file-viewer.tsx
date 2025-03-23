import React from "react";
import styles from "@/app/styles/repository.module.css";
import { FileItem } from "./file-tree";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  file: FileItem;
};

const FileViewer = ({ file }: Props) => {
  const renderUploadPreview = () => {
    const isImage = file.path?.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i);
    const isPdf = file.path?.match(/\.pdf$/i);

    return (
      <>
        {isImage ? (
          <img src={file.path} alt={file.name} className={styles.uploadedImage} />
        ) : isPdf ? (
          <iframe src={file.path} title={file.name} className={styles.pdfViewer} />
        ) : (
          <a href={file.path} download>
            📎 Download {file.name}
          </a>
        )}
      </>
    );
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split(".").pop();
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

  const renderTextFile = () => (
    <SyntaxHighlighter
      language={getLanguage(file.name)}
      style={oneDark}
      showLineNumbers
      wrapLines
      customStyle={{ borderRadius: "8px", padding: "1rem" }}
    >
      {file.content || "// Empty file"}
    </SyntaxHighlighter>
  );

  return (
    <div className={styles.viewerWrapper}>
      <h3>{file.name}</h3>
      {file.type === "upload" && file.path
        ? renderUploadPreview()
        : file.type === "text"
        ? renderTextFile()
        : <p>🪵 Preview not available for this file type.</p>
      }
    </div>
  );
};

export default FileViewer;
