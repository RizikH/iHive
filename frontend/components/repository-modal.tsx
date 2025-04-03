"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import styles from "@/app/styles/repository-modal.module.css";
import { fetcher } from "@/app/utils/fetcher";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import FileTreeDemo from "@/components/file-tree-demo";

// ========================
// Repository Modal Component
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
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>("Main Content");
  const [repoDetails, setRepoDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && repoId) {
      fetchRepoDetails();
    }
  }, [isOpen, repoId]);

  const fetchRepoDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching repository details for repoId:", repoId);
      // Directly fetch files instead of idea details
      const filesData = await fetcher(`/files?idea_id=${repoId}`);
      console.log("Files response:", filesData);
      
      // Also fetch idea metadata if needed
      const ideaData = await fetcher(`/ideas/${repoId}`);
      console.log("Idea data response:", ideaData);
      
      setRepoDetails(ideaData);
    } catch (err) {
      console.error("Error fetching repository details:", err);
      setError("Failed to load repository details");
      setRepoDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (fileId: string, fileContent: string, fileName: string) => {
    setCurrentFileId(fileId);
    setContent(fileContent);
    setCurrentFileName(fileName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Add DialogTitle component */}
      <VisuallyHidden>
        <DialogTitle>{title || "Repository Modal"}</DialogTitle>
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
                  <FileTreeDemo
                    onFileSelect={handleFileSelect}
                    currentFileId={currentFileId}
                    onContentUpdate={() => { }}
                    onFileDelete={() => { }}
                    isPreview={true}
                    repoId={repoId}
                  />
                </div>
              </div>

              <div className={styles["content-area"]}>
                <div className={styles["content-header"]}>
                  <h3 className={styles["content-title"]}>{currentFileName}</h3>
                </div>
                <div className={styles["content-body"]}>
                  {repoDetails && (
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
                  
                  {content ? (
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  ) : (
                    <div className={styles["content-placeholder"]}>
                      <p>Select a file from the file tree to view its contents.</p>
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