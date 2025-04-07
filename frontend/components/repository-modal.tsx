"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import styles from "@/app/styles/repository-modal.module.css";
import { fetcher } from "@/app/utils/fetcher";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import FileTree, { FileItem } from "@/components/file-tree";
import FileViewer from "@/components/file-viewer";

// ========================
// Repository Modal Component - READ ONLY
// ========================

const RepositoryModal = ({
  isOpen,
  onClose,
  repoId,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  repoId: string;
  title: string;
}) => {
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>("Main Content");
  const [repoDetails, setRepoDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // This modal is READ ONLY
  const isReadOnly = true;

  useEffect(() => {
    if (isOpen && repoId) {
      setIsLoading(true);
      Promise.all([fetchRepoDetails(), fetchFiles()])
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, repoId]);

  const fetchRepoDetails = async () => {
    try {
      setError(null);
      
      console.log("Fetching repository details for repoId:", repoId);
      // Get idea details using the search/id endpoint which doesn't require auth
      const ideaData = await fetcher(`/ideas/search/id/${repoId}`);
      console.log("Idea data response:", ideaData);
      
      if (!ideaData) throw new Error("Failed to load repository details");
      
      setRepoDetails(ideaData);
      return ideaData;
    } catch (err) {
      console.error("Error fetching repository details:", err);
      setError("Failed to load repository details");
      setRepoDetails(null);
      return null;
    }
  };

  const fetchFiles = async () => {
    try {
      console.log("Fetching files for idea_id:", repoId);
      const filesData = await fetcher(`/files?idea_id=${repoId}`);
      console.log("Files response:", filesData);
      
      if (Array.isArray(filesData)) {
        setFiles(filesData);
      } else {
        console.warn("Invalid files data format:", filesData);
        setFiles([]);
      }
      return filesData;
    } catch (err) {
      console.error("Error fetching files:", err);
      setFiles([]);
      return [];
    }
  };

  const handleSelectFile = (file: FileItem | null) => {
    setCurrentFile(file);
    if (file) {
      setCurrentFileName(file.name);
      if (file.type === "text") {
        setContent(file.content || "");
      } else if (file.type === "upload" && file.path) {
        // For uploaded files, we'll display content differently
        setContent(""); // Clear text content
      }
    } else {
      setCurrentFileName("Main Content");
      setContent("");
    }
  };

  // No-op refresh function for read-only mode
  const handleRefresh = () => {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <VisuallyHidden>
        <DialogTitle>{title || "Repository Preview"}</DialogTitle>
      </VisuallyHidden>
      <DialogContent className={styles["modal-content"]}>
        <div className={styles["modal-container"]}>
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-64">
              <p>Loading repository details...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-64 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className={styles.sidebar}>
                <h3 className={styles["sidebar-title"]}>Files</h3>
                <div className={styles["file-tree-container"]}>
                  {files.length === 0 && (
                    <div className={styles.emptyState || "p-4 text-center text-gray-500"}>
                      <p>No files available</p>
                      <p>This is a read-only preview</p>
                    </div>
                  )}
                  {files.length > 0 && (
                    <FileTree
                      files={files}
                      onSelect={handleSelectFile}
                      onRefresh={handleRefresh}
                      selectedId={currentFile?.id || null}
                      ideaId={Number(repoId) || 0}
                    />
                  )}
                </div>
              </div>

              <div className={styles["content-area"]}>
                <div className={styles["content-header"]}>
                  <h3 className={styles["content-title"]}>{currentFileName}</h3>
                  <div className="text-xs text-gray-500">Preview - Read Only</div>
                </div>
                <div className={styles["content-body"]}>
                  {!currentFile && repoDetails && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-md">
                      <h2 className="text-xl font-bold">{repoDetails.title}</h2>
                      {repoDetails.category && (
                        <span className="inline-block px-2 py-1 mt-2 text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
                          {repoDetails.category}
                        </span>
                      )}
                      {repoDetails.description && (
                        <div className="mt-3 text-sm text-gray-600">
                          {repoDetails.description.replace(/<[^>]*>/g, "")}
                        </div>
                      )}
                      <div className="mt-3 text-xs text-gray-500">
                        {repoDetails.updatedAt && (
                          <span>Last updated: {new Date(repoDetails.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {currentFile ? (
                    currentFile.type === "text" ? (
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                      <FileViewer file={currentFile} />
                    )
                  ) : (
                    <div className={styles["content-placeholder"]}>
                      {files.length === 0 ? (
                        <p>No files available in this repository</p>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepositoryModal; 