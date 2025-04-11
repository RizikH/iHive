import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/setting.module.css';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';

// =============================================
// Account Settings Component
// =============================================

const AccountSettings = () => {
  // =============================================
  // State Management
  // =============================================
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // =============================================
  // Effects
  // =============================================
  useEffect(() => {
    // Load user data from localStorage
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    
    setFormData(prev => ({
      ...prev,
      username: username || '',
      email: email || ''
    }));
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
    
    // Basic validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    
    if (formData.newPassword && !formData.currentPassword) {
      setErrorMessage('Current password is required to set a new password');
      return;
    }
    
    try {
      setLoading(true);
      
      // Here you would normally make an API call to update the user info
      // For this demo, we'll just update localStorage
      
      if (formData.username) {
        localStorage.setItem('username', formData.username);
      }
      
      if (formData.email) {
        localStorage.setItem('email', formData.email);
      }
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccessMessage('Account information updated successfully!');
      
      // Refresh the page after a short delay to show updated info in all components
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      setErrorMessage('Failed to update account information');
      console.error('Error updating account:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.settingSection}>
      <h2>Account Settings</h2>
      
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/*User Identity Section*/}
        <div className={styles.formGroup}>
          <label>
            <FiUser className={styles.icon} />
            Username
          </label>
          <input 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder={formData.username || "Enter username"} 
          /> 
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiMail className={styles.icon} />
            Email
          </label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={formData.email || "Enter email address"} 
          />
        </div>

        {/*Password Management Section*/}
        <div className={styles.formGroup}>
          <label>
            <FiLock className={styles.icon} />
            Current Password
          </label>
          <input 
            type="password" 
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password" 
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiLock className={styles.icon} />
            New Password
          </label>
          <input 
            type="password" 
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password" 
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiLock className={styles.icon} />
            Confirm Password
          </label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password" 
          />
        </div>

        {/*Form Submission*/}
        <button 
          type="submit" 
          className={styles.saveButton}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Account'}
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
