"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Link from "next/link";
import { useState, useEffect } from "react";
import FileTreeDemo from "@/components/file-tree-demo";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import styles from "@/app/styles/repository-modal.module.css";
import { fetcher } from "@/app/utils/fetcher";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";




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
      
      const data = await fetcher(`/ideas/${repoId}`);
      setRepoDetails(data);
    } catch (err) {
      console.error("Error fetching repository details:", err);
      setError("Failed to load repository details");
      // Try to get from localStorage as fallback
      const savedIdeas = localStorage.getItem('ideas');
      if (savedIdeas) {
        const ideas = JSON.parse(savedIdeas);
        const idea = ideas.find((idea: any) => idea.id === repoId);
        if (idea) setRepoDetails(idea);
      }
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

// ========================
// Repository Card Component
// ========================

const ReviewCard = ({
  img,
  ideaTitle,
  username,
  body,
  repoId,
}: {
  img: string;
  ideaTitle: string;
  username: string;
  body: string;
  repoId: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <div onClick={handleCardClick}>
        <figure
          className={cn(
            "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
            "border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors",
            "hover:shadow-md transform hover:-translate-y-1 transition-all duration-200"
          )}
        >
          <div className="flex flex-row items-center gap-2">
            <Image
              className="rounded-full"
              width="32"
              height="32"
              alt={`${username}'s avatar`}
              src={img || "/placeholder.svg"}
            />
            <div className="flex flex-col">
              <figcaption className="text-sm font-medium text-gray-900">
                {ideaTitle || "Untitled Idea"}
              </figcaption>
              <p className="text-xs font-medium text-gray-500">{username}</p>
            </div>
          </div>
          <blockquote className="mt-2 text-sm text-gray-700">{body}</blockquote>
        </figure>
      </div>

      <RepositoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        repoId={repoId}
        title={ideaTitle}
      />
    </>
  );
};

// ========================
// Marquee Component
// ========================

export default function MarqueeDemo() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [userAvatar, setUserAvatar] = useState('https://avatar.vercel.sh/jack');
  const [username, setUsername] = useState<string>('@user');

  useEffect(() => {
    const fetchUserIdeas = async () => {
      try {
        const data = await fetcher(`/ideas`);
        
        if (Array.isArray(data) && data.length > 0) {
          setIdeas(data);
        } else {
          // Fallback to localStorage if API returns empty data
          const savedIdeas = localStorage.getItem('ideas');
          if (savedIdeas) {
            setIdeas(JSON.parse(savedIdeas));
          }
        }

        // Try to get user info from localStorage
        const savedUsername = localStorage.getItem("username");
        const savedAvatar = localStorage.getItem("userAvatar");

        if (savedUsername) setUsername(savedUsername);
        if (savedAvatar) setUserAvatar(savedAvatar);
      } catch (err) {
        console.error("Error loading user ideas:", err);
        // Fallback to localStorage on API error
        const savedIdeas = localStorage.getItem('ideas');
        if (savedIdeas) {
          setIdeas(JSON.parse(savedIdeas));
        }
      }
    };

    fetchUserIdeas();
  }, []);

  const firstRow = ideas.slice(0, Math.ceil(ideas.length / 2));
  const secondRow = ideas.slice(Math.ceil(ideas.length / 2));

  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-gray-100 shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((idea) => (
          <ReviewCard
            key={idea.id}
            repoId={idea.id}
            ideaTitle={idea.title}
            username={username}
            body={
              idea.description
                ? idea.description.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
                : "No description"
            }
            img={userAvatar}
          />
        ))}
      </Marquee>

      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((idea) => (
          <ReviewCard
            key={idea.id}
            repoId={idea.id}
            ideaTitle={idea.title}
            username={username}
            body={
              idea.description
                ? idea.description.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
                : "No description"
            }
            img={userAvatar}
          />
        ))}
      </Marquee>

      {/* Fading edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-100"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-100"></div>
    </div>
  );
}
