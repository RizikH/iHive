import Image from 'next/image';
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/magicui/marquee"
import Link from 'next/link'
import { useState } from 'react'
import FileTreeDemo from '@/components/file-tree-demo'
import { FiX } from 'react-icons/fi'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "../components/ui/dialog"
import styles from '@/app/styles/repository-modal.module.css'

// =============================================
// Repository Modal Component
// =============================================

const RepositoryModal = ({
  isOpen,
  onClose,
  repoId,
  name,
}: {
  isOpen: boolean;
  onClose: () => void;
  repoId: string;
  name: string;
}) => {
  // State Management
  const [content, setContent] = useState<string>('');
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>('Main Content');

  // Event Handlers
  const handleFileSelect = (fileId: string, fileContent: string, fileName: string) => {
    setCurrentFileId(fileId);
    setContent(fileContent);
    setCurrentFileName(fileName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={styles['modal-content']}>
        <div className={styles['modal-container']}>
          {/*File Tree Sidebar*/}
          <div className={styles.sidebar}>
            <h3 className={styles['sidebar-title']}>Files</h3>
            <div className={styles['file-tree-container']}>
              <FileTreeDemo
                onFileSelect={handleFileSelect}
                currentFileId={currentFileId}
                onContentUpdate={() => {}}
                onFileDelete={() => {}}
                isPreview={true}
              />
            </div>
          </div>
          
          {/*Repository Content Area*/}
          <div className={styles['content-area']}>
            <div className={styles['content-header']}>
              <h3 className={styles['content-title']}>{currentFileName}</h3>
            </div>
            <div className={styles['content-body']}>
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <div className={styles['content-placeholder']}>
                  <p>Select a file from the file tree to view its contents.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// =============================================
// Sample Repository Data
// =============================================

const reviews = [
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
    repoId: "1",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
    repoId: "2",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
    repoId: "3",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
    repoId: "4",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
    repoId: "5",
  },
  {
    name: "name",
    username: "@username",
    body: "Subtitle/short description for your repository.",
    img: "https://avatar.vercel.sh/jack",
    repoId: "6",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

// =============================================
// Repository Card Component
// =============================================

const ReviewCard = ({
  img,
  name,
  username,
  body,
  repoId,
}: {
  img: string
  name: string
  username: string
  body: string
  repoId: string
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      {/*Repository Card*/}
      <div onClick={handleCardClick}>
        <figure
          className={cn(
            "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
            "border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors",
            "hover:shadow-md transform hover:-translate-y-1 transition-all duration-200"
          )}
        >
          {/*Author Information*/}
          <div className="flex flex-row items-center gap-2">
            <Image 
              className="rounded-full" 
              width="32" 
              height="32" 
              alt="" 
              src={img || "/placeholder.svg"} 
            />
            <div className="flex flex-col">
              <figcaption className="text-sm font-medium text-gray-900">{name}</figcaption>
              <p className="text-xs font-medium text-gray-500">{username}</p>
            </div>
          </div>
          
          {/*Repository Description*/}
          <blockquote className="mt-2 text-sm text-gray-700">{body}</blockquote>
        </figure>
      </div>

      {/*Repository Detail Modal*/}
      <RepositoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        repoId={repoId}
        name={name}
      />
    </>
  );
};

// =============================================
// Marquee Component
// =============================================

export default function MarqueeDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-gray-100 shadow-xl">
      {/*Top Repository Row*/}
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      
      {/*Bottom Repository Row*/}
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      
      {/*Gradient Overlays*/}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-gray-100"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gray-100"></div>
    </div>
  );
}