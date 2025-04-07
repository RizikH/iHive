import React, { useState, useEffect } from "react";
import styles from "@/app/styles/repository.module.css";
import { FileItem } from "./file-tree";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { fetcher } from "@/app/utils/fetcher";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  file: FileItem;
};

const FileViewer = ({ file }: Props) => {
  const [fileBlobUrl, setFileBlobUrl] = useState<string>("");
  const [fileTextContent, setFileTextContent] = useState<string>("");

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
  

  const isCodeFile = (filename: string): boolean => {
    const codeExtensions = [
      "js", "jsx", "ts", "tsx", "py", "java", "c", "cpp", "cc", "cxx",
      "css", "html", "json", "md", "sql", "sh", "php"
    ];
    const ext = filename.split(".").pop()?.toLowerCase();
    return codeExtensions.includes(ext || "");
  };
  

  useEffect(() => {
    const fetchFile = async () => {
      if (file.type === "upload" && file.id) {
        try {
          const blob = await fetcher(`/files/${file.id}/view`, "GET", null, {}, "blob");

          if (getLanguage(file.name) === "markdown") {
            const text = await blob.text();
            setFileTextContent(text);
          } else if (isCodeFile(file.name)) {
            const text = await blob.text();
            setFileTextContent(text);
          } else {
            const objectUrl = URL.createObjectURL(blob);
            setFileBlobUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
          }
        } catch (err) {
          console.error("Error loading file blob:", err);
        }
      } else {
        setFileBlobUrl("");
        setFileTextContent("");
      }
    };

    fetchFile();
  }, [file]);

  const renderCodeBlock = (content: string) => (
    <SyntaxHighlighter
      language={getLanguage(file.name)}
      style={oneDark}
      showLineNumbers
      wrapLines
      customStyle={{ borderRadius: "8px", padding: "1rem" }}
    >
      {content || "// File is empty or failed to load."}
    </SyntaxHighlighter>
  );

  const renderMarkdown = (content: string) => (
    <div className={styles.markdownViewer}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: (props: any) => {
            const { inline, className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                language={match[1]}
                style={oneDark as any}
                PreTag="div"
                {...rest}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
  
  
  

  const renderUploadPreview = () => {
    const isImage = file.mime_type?.startsWith("image/");
    const isPdf = file.mime_type === "application/pdf";

    return (
      <>
        {isImage ? (
          <img
            src={fileBlobUrl}
            alt={file.name}
            className={styles.uploadedImage}
          />
        ) : isPdf ? (
          <iframe
            src={fileBlobUrl}
            title={file.name}
            className={styles.pdfViewer}
          />
        ) : (
          <video controls src={fileBlobUrl} className={styles.uploadedVideo}>
            Your browser does not support the video tag.
          </video>
        )}
      </>
    );
  };

  return (
    <div className={styles.viewerWrapper}>
      <h3>{file.name}</h3>

      {file.type === "text" ? (
        getLanguage(file.name) === "markdown"
          ? renderMarkdown(file.content || "")
          : renderCodeBlock(file.content || "")
      ) : file.type === "upload" && getLanguage(file.name) === "markdown" ? (
        renderMarkdown(fileTextContent)
      ) : file.type === "upload" && isCodeFile(file.name) ? (
        renderCodeBlock(fileTextContent)
      ) : fileBlobUrl ? (
        renderUploadPreview()
      ) : (
        <p>🪵 Preview not available for this file type.</p>
      )}
    </div>
  );
};

export default FileViewer;
