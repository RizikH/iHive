"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import styles from "@/app/styles/repository-modal.module.css";
import { fetcher } from "@/app/utils/fetcher";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import FileTree, { FileItem } from "@/components/file-tree";
import FileViewer from "@/components/file-viewer";
import Link from "next/link";
import { idea } from "react-syntax-highlighter/dist/esm/styles/hljs";

const RepositoryModal = ({
  isOpen,
  onClose,
  repoId,
  title,
  isInvestorView = false,
  onInvest,
}: {
  isOpen: boolean;
  onClose: () => void;
  repoId: string;
  title: string;
  isInvestorView?: boolean;
  onInvest?: (repoId: string, amount: number) => void;
}) => {
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>("Main Content");
  const [repoDetails, setRepoDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isReadOnly = true;

  const fetchRepoDetails = useCallback(async () => {
    try {
      setError(null);
      const ideaData = await fetcher(`/ideas/public?id=${repoId}`, 'GET');
      if (ideaData.status !== 200 || !ideaData.data) {
        throw new Error(ideaData.data.error || "Failed to load repository details");
      }
      setRepoDetails(ideaData.data);
      return ideaData.data;
    } catch (err) {
      console.error("Error fetching repository details:", err);
      setError("Failed to load repository details");
      setRepoDetails(null);
      return null;
    }
  }, [repoId]);

  const fetchFiles = useCallback(async () => {
    try {
      const files = await fetcher(`/files/public?idea_id=${repoId}`, 'GET');
      if (files.status !== 200 || !files.data) {
        throw new Error(files.data.error || "Failed to load files data");
      }
      setFiles(files.data);
      return files.data;
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files data");
      setFiles([]);
      return [];
    }
  }, [repoId]);

  useEffect(() => {
    if (isOpen && repoId) {
      setIsLoading(true);
      Promise.all([fetchRepoDetails(), fetchFiles()])
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, repoId, fetchRepoDetails, fetchFiles]);

  const handleSelectFile = (file: FileItem | null) => {
    setCurrentFile(file);
    if (file) {
      setCurrentFileName(file.name);
      if (file.type === "text") {
        setContent(file.content || "");
      } else if (file.type === "upload" && file.path) {
        setContent("");
      }
    } else {
      setCurrentFileName("Main Content");
      setContent("");
    }
  };

  const handleRefresh = () => { };

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

                      {/* handle investor view */}
                      {isInvestorView && (
                        <div className="mt-4 border-t pt-4">
                          <div>
                            <h4 className="text-sm font-medium">Interested in this idea?</h4>
                            <p className="text-xs text-gray-600 mt-1 mb-2">Support this entrepreneur by investing</p>

                            <label className="text-xs text-gray-700">Amount ($):</label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                              <input
                                type="number"
                                className="border rounded pl-6 pr-2 py-1 mt-1 w-full text-sm"
                                min={1}
                                value={investmentAmount === 0 ? "" : investmentAmount}
                                placeholder="Enter investment amount here"
                                onChange={(e) => {
                                  const val = e.target.value.replace(/^0+/, "");
                                  setInvestmentAmount(Number(val || 0));
                                }}
                              />
                            </div>

                            <button
                              onClick={async () => {
                                if (onInvest) {
                                  try {
                                    await onInvest(repoId, investmentAmount);
                                    setSuccessMessage("Investment successful!");
                                    setTimeout(() => setSuccessMessage(null), 3000); // hide after 3 sec
                                  } catch (e) {
                                    console.error("Investment failed:", e);
                                  }
                                }
                              }}
                              className={`${styles.investButton} mt-2`}
                            >
                              <span className={styles.investButtonIcon}>💰</span>
                              Confirm Investment
                            </button>
                            {successMessage && (
                              <div className="mt-2 text-green-600 text-sm font-medium">
                                {successMessage}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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