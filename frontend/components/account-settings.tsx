import React from 'react';
import styles from '@/app/styles/setting.module.css';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';

// =============================================
// Account Settings Component
// =============================================

const AccountSettings = () => {
  return (
    <div className={styles.settingSection}>
      <h2>Account Settings</h2>
      
      <form>
        {/*User Identity Section*/}
        <div className={styles.formGroup}>
          <label>
            <FiUser className={styles.icon} />
            Username
          </label>
          <input type="text" placeholder="Change username" /> 
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiMail className={styles.icon} />
            Email
          </label>
          <input type="email" placeholder="Change email address" />
        </div>

        {/*Password Management Section*/}
        <div className={styles.formGroup}>
          <label>
            <FiLock className={styles.icon} />
            Current Password
          </label>
          <input type="password" placeholder="Enter current password" />
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiLock className={styles.icon} />
            New Password
          </label>
          <input type="password" placeholder="Enter new password" />
        </div>

        <div className={styles.formGroup}>
          <label>
            <FiLock className={styles.icon} />
            Confirm Password
          </label>
          <input type="password" placeholder="Confirm new password" />
        </div>

        {/*Form Submission*/}
        <button type="submit" className={styles.saveButton}>Update Account</button>
      </form>
    </div>
  );
};

export default AccountSettings;
