import React from "react";
import styles from "@/app/styles/repository.module.css";
import { FileItem } from "./file-tree";

type Props = {
  file: FileItem;
};

const FileViewer = ({ file }: Props) => {
  if (file.type === "upload" && file.path) {
    const isImage = file.path.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i);
    const isPdf = file.path.match(/\.pdf$/i);

    return (
      <div className={styles.viewerWrapper}>
        <h3>{file.name}</h3>
        {isImage ? (
          <img src={file.path} alt={file.name} className={styles.uploadedImage} />
        ) : isPdf ? (
          <iframe src={file.path} title={file.name} className={styles.pdfViewer} />
        ) : (
          <a href={file.path} download>
            Download {file.name}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={styles.viewerWrapper}>
      <h3>{file.name}</h3>
      <p>Preview not available for this file type.</p>
    </div>
  );
};

export default FileViewer;