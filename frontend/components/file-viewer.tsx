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
  const [imagePath, setImagePath] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSignedUrl = async (path: string) => {
    try {
      // Request a signed URL from your backend
      const response = await fetch(`${API_URL}/get-signed-url?path=${encodeURIComponent(path)}`);
      if (!response.ok) throw new Error('Failed to get signed URL');
      const data = await response.json();
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return path; // Fall back to original path
    }
  };

  // Function to get complete image path with authentication
  const getFilePath = async (path: string | undefined) => {
    if (!path) return '';
    
    // If it looks like an S3 path or contains your bucket name
    if (path.includes('amazonaws.com') || path.includes('your-bucket-name')) {
      return await getSignedUrl(path);
    }
    
    // If the path is already a full URL, return it
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    // If it's a relative path, add the API_URL
    if (path.startsWith('/')) {
      return `${API_URL}${path}`;
    }
    
    // Otherwise add API_URL with a slash
    return `${API_URL}/${path}`;
  };

  useEffect(() => {
    const loadFilePath = async () => {
      setIsLoading(true);
      if (file.path) {
        const path = await getFilePath(file.path);
        setImagePath(path);
      }
      setIsLoading(false);
    };
    
    loadFilePath();
  }, [file.path]);

  const renderUploadPreview = () => {
    const isImage = file.path?.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i);
    const isPdf = file.path?.match(/\.pdf$/i);

    if (isLoading) {
      return <div className={styles.loading}>Loading file...</div>;
    }

    return (
      <>
        {isImage ? (
          <div className={styles.imageContainer}>
            <img 
              src={imagePath} 
              alt={file.name} 
              className={styles.uploadedImage} 
              crossOrigin="anonymous"
              onError={(e) => {
                console.error("Image failed to load:", imagePath);
                e.currentTarget.src = "/placeholder-image.png";
                e.currentTarget.alt = "Image failed to load";
              }}
            />
          </div>
        ) : isPdf ? (
          <iframe src={imagePath} title={file.name} className={styles.pdfViewer} />
        ) : (
          <a href={imagePath} download>
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
      {file.content || "// Welcome to iHive Editor! Start adding content to this file."}
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
