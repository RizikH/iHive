import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/setting.module.css';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { fetcher } from '@/app/utils/fetcher';

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
  const currentUser = useAuthStore(state => state.currentUser);

  // =============================================
  // Effects
  // =============================================
  useEffect(() => {
    // Load user data from localStorage
    const username = currentUser?.username || '';
    const email = currentUser?.email || '';

    setFormData(prev => ({
      ...prev,
      username: username || '',
      email: email || ''
    }));
  }, [currentUser?.email, currentUser?.username]);

  // =============================================
  // Event Handlers
  // =============================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "newPassword" || name === "confirmPassword") {
      setErrorMessage('');
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
  
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetcher(`/users/update/`, 'PUT', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        email: currentUser?.email,
        id: currentUser?.id,
      });
  
      if (!res || res.data?.error || res.status === 401 || res.status === 400) {
        setErrorMessage(res.data?.error || res.data?.message || 'Failed to update user information. Please try again.');
        return;
      }
  
      // ✅ Only show success if the update worked
      setSuccessMessage('User information updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
  
      // Optionally clear success after a delay
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
  
    } catch (error: any) {
      console.error('Error updating user:', error);
      setErrorMessage(error.message || 'Failed to update user information. Please try again.');
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
          <label className={styles.formLabel}>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            <span className={styles.labelText}>Username:</span>
          </label>
          <span className={styles.formValue}>{formData.username}</span>
        </div>

        {/* Email (read-only) */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
            <span className={styles.labelText}>Email:</span>
          </label>
          <span className={styles.formValue}>{currentUser?.email || 'N/A'}</span>
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
            placeholder="Enter current password"
            onChange={handleChange}
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
            placeholder="Enter new password"
            onChange={handleChange}
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
            placeholder="Confirm new password"
            onChange={handleChange}
          />
        </div>

        {/*Form Submission*/}
        <button
          type="submit"
          className={styles.saveButton}
        >
          {loading ? 'Updating...' : 'Update Account'}
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
