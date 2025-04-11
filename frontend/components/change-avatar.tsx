'use client';
import DOMPurify from 'dompurify';

import React, { useState } from 'react';
import styles from '@/app/styles/change-avatar.module.css';
import Image from 'next/image';

// =============================================
// Types and Interfaces
// =============================================

interface ChangeAvatarProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarChange: (avatarUrl: string) => void;
  currentAvatar: string;
}

// =============================================
// Avatar Selection Component
// =============================================

const ChangeAvatar: React.FC<ChangeAvatarProps> = ({
  isOpen,
  onClose,
  onAvatarChange,
  currentAvatar
}) => {
  // =============================================
  // State Management
  // =============================================
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // =============================================
  // Default Avatar Options
  // =============================================
  const defaultAvatars = [
    'https://avatar.vercel.sh/jack',
    'https://avatar.vercel.sh/jill',
    'https://avatar.vercel.sh/jane',
    'https://avatar.vercel.sh/jenny',
    'https://avatar.vercel.sh/james'
  ];

  // =============================================
  // Avatar Selection Handlers
  // =============================================
  const handleDefaultAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Create a URL for the uploaded file
        const imageUrl = URL.createObjectURL(file);
        const sanitizedImageUrl = DOMPurify.sanitize(imageUrl);
        setSelectedAvatar(sanitizedImageUrl);
        
        // In a real application, you would upload the file to your server here
        // const uploadedUrl = await uploadToServer(file);
        // setSelectedAvatar(uploadedUrl);
        
        console.log('File selected:', file);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    onAvatarChange(selectedAvatar);
    onClose();
  };

  // =============================================
  // Effects
  // =============================================
  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      // Clean up the object URL if it's a blob URL
      if (selectedAvatar.startsWith('blob:')) {
        URL.revokeObjectURL(selectedAvatar);
      }
    };
  }, [selectedAvatar]);

  // Conditional rendering
  if (!isOpen) return null;

  // =============================================
  // Render Component
  // =============================================
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/*Modal Header*/}
        <div className={styles.header}>
          <h2>Change Avatar</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          {/*Current Avatar Preview*/}
          <div className={styles.currentAvatar}>
            <h3>Current Avatar</h3>
            <Image
              src={selectedAvatar}
              alt="Current avatar"
              width={100}
              height={100}
              className={styles.previewImage}
            />
          </div>

          {/*Avatar Selection Options*/}
          <div className={styles.defaultAvatars}>
            <h3>Choose from defaults</h3>
            <div className={styles.avatarGrid}>
              {defaultAvatars.map((avatar, index) => (
                <Image
                  key={index}
                  src={avatar}
                  alt={`Default avatar ${index + 1}`}
                  width={60}
                  height={60}
                  onClick={() => handleDefaultAvatarSelect(avatar)}
                  className={`${styles.avatarOption} ${
                    selectedAvatar === avatar ? styles.selected : ''
                  }`}
                />
              ))}
              <div 
                className={styles.uploadAvatar} 
                onClick={handleUploadClick}
                title="Upload custom avatar"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/*Action Buttons*/}
          <div className={styles.actions}>
            <button 
              className={styles.cancelButton} 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className={styles.saveButton} 
              onClick={handleSave}
              disabled={isUploading}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAvatar;