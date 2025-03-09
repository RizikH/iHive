import React from 'react';
import styles from '@/app/styles/setting.module.css';
import { FiBell, FiMail, FiMessageSquare, FiActivity } from 'react-icons/fi';

const NotificationPreferences = () => {
  return (
    <div className={styles.settingSection}>
      <h2>Notification Preferences</h2>
      <form>
        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <FiBell className={styles.icon} />
            Push Notifications
          </label>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="checkbox" defaultChecked />
              <span>New Comments</span>
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              <span>Repository Updates</span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <FiMail className={styles.icon} />
            Email Notifications
          </label>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="checkbox" defaultChecked /> Security Alerts
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <FiMessageSquare className={styles.icon} />
            Direct Messages
          </label>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="checkbox" defaultChecked /> Allow DMs from Sponsors
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Allow DMs from Team Members
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <FiActivity className={styles.icon} />
            Activity Updates
          </label>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="checkbox" defaultChecked /> Project Milestones
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Team Updates
            </label>
          </div>
        </div>

        <button type="submit" className={styles.saveButton}>Save Preferences</button>
      </form>
    </div>
  );
};

export default NotificationPreferences;