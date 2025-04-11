import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/setting.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGithub, 
  faLinkedin, 
  faXTwitter 
} from '@fortawesome/free-brands-svg-icons';

// =============================================
// Social Media Links Component
// =============================================

const SocialMedia = () => {
  // =============================================
  // State Management
  // =============================================
  const [formData, setFormData] = useState({
    github: '',
    linkedin: '',
    twitter: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // =============================================
  // Effects
  // =============================================
  useEffect(() => {
    // Load social media links from localStorage
    const github = localStorage.getItem('github');
    const linkedin = localStorage.getItem('linkedin');
    const twitter = localStorage.getItem('twitter');
    
    setFormData({
      github: github || '',
      linkedin: linkedin || '',
      twitter: twitter || ''
    });
  }, []);

  // =============================================
  // Event Handlers
  // =============================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      setLoading(true);
      
      // Validate URLs
      const urlPattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/i;
      
      // Only save valid URLs (or empty strings to clear a link)
      Object.entries(formData).forEach(([key, value]) => {
        if (value === '' || urlPattern.test(value)) {
          localStorage.setItem(key, value);
        } else {
          throw new Error(`Invalid URL format for ${key}`);
        }
      });
      
      setSuccessMessage('Social media links updated successfully!');
      
      // In a real app, you would save to the database here
      // For example:
      // await fetch('/api/social-links', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // Refresh the page after a short delay to show updated info everywhere
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update social media links');
      console.error('Error updating social links:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.settingSection}>
      <h2>Social Media Links</h2>
      
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/*Developer Platforms*/}
        <div className={styles.formGroup}>
          <label>
            <FontAwesomeIcon icon={faGithub} className={styles.icon} />
            GitHub
          </label>
          <input 
            type="url" 
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder={formData.github || "https://github.com/username"} 
          />
        </div>

        {/*Professional Networks*/}
        <div className={styles.formGroup}>
          <label>
            <FontAwesomeIcon icon={faLinkedin} className={styles.icon} />
            LinkedIn
          </label>
          <input 
            type="url" 
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder={formData.linkedin || "https://linkedin.com/in/username"} 
          />
        </div>

        {/*Social Networks*/}
        <div className={styles.formGroup}>
          <label>
            <FontAwesomeIcon icon={faXTwitter} className={styles.icon} />
            Twitter
          </label>
          <input 
            type="url" 
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            placeholder={formData.twitter || "https://twitter.com/username"} 
          />
        </div>

        {/*Form Submission*/}
        <button 
          type="submit" 
          className={styles.saveButton}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default SocialMedia;
