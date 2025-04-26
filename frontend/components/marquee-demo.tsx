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
import RepositoryModal from "@/components/repository-modal";
import { useAuthStore } from '@/app/stores/useAuthStore';


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
  const currentUser = useAuthStore((state) => state.currentUser);
  const username = currentUser?.username || '@user';
  const userAvatar = currentUser?.avatar || 'https://avatar.vercel.sh/jack';


  useEffect(() => {
    const fetchUserIdeas = async () => {
      try {
        const data = await fetcher(`/ideas`);
        console.log("Fetched ideas:", data.data); // Debugging line

        if (Array.isArray(data.data) && data.data.length > 0) {
          setIdeas(data.data);
        } else {
          setIdeas([]);
        }

      } catch (err) {
        console.error("Error loading user ideas:", err);
        setIdeas([]);
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
            username={'@' + idea.users?.username}
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
            username={'@' + idea.users?.username}
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
