import React from 'react';
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
  return (
    <div className={styles.settingSection}>
      <h2>Social Media Links</h2>
      <form>
        {/*Developer Platforms*/}
        <div className={styles.formGroup}>
          <label>
            <FontAwesomeIcon icon={faGithub} className={styles.icon} />
            GitHub
          </label>
          <input type="url" placeholder="https://github.com/username" />
        </div>

        {/*Professional Networks*/}
        <div className={styles.formGroup}>
          <label>
            <FontAwesomeIcon icon={faLinkedin} className={styles.icon} />
            LinkedIn
          </label>
          <input type="url" placeholder="https://linkedin.com/in/username" />
        </div>

        {/*Social Networks*/}
        <div className={styles.formGroup}>
          <label>
            <FontAwesomeIcon icon={faXTwitter} className={styles.icon} />
            Twitter
          </label>
          <input type="url" placeholder="https://twitter.com/username" />
        </div>

        {/*Form Submission*/}
        <button type="submit" className={styles.saveButton}>Save Changes</button>
      </form>
    </div>
  );
};

export default SocialMedia;
