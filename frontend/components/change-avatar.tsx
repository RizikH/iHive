'use client';

import React, { useState } from 'react';
import styles from '@/app/styles/change-avatar.module.css';
import Image from 'next/image';

interface ChangeAvatarProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarChange: (avatarUrl: string) => void;
  currentAvatar: string;
}

const ChangeAvatar: React.FC<ChangeAvatarProps> = ({
  isOpen,
  onClose,
  onAvatarChange,
  currentAvatar
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const defaultAvatars = [
    'https://avatar.vercel.sh/jack',
    'https://avatar.vercel.sh/jill',
    'https://avatar.vercel.sh/jane',
    'https://avatar.vercel.sh/jenny',
    'https://avatar.vercel.sh/james'
  ];

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
        setSelectedAvatar(imageUrl);
        
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

  // Clean up object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      // Clean up the object URL if it's a blob URL
      if (selectedAvatar.startsWith('blob:')) {
        URL.revokeObjectURL(selectedAvatar);
      }
    };
  }, [selectedAvatar]);

  const handleSave = () => {
    onAvatarChange(selectedAvatar);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Change Avatar</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
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