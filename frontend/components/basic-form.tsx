import React from 'react';
import styles from '@/app/styles/setting.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faEnvelope, 
    faBriefcase, 
    faCode 
} from '@fortawesome/free-solid-svg-icons';

// =============================================
// Basic Information Component
// =============================================

const BasicInfo = () => {
    return (
        <div className={styles.settingSection}>
            <h2>Basic Information</h2>
            <form>
                {/*Personal Details Section*/}
                <div className={styles.formGroup}>
                    <label>
                        <FontAwesomeIcon icon={faUser} className={styles.icon} />
                        Full Name
                    </label>
                    <input type="text" placeholder="Enter your full name" />
                </div>

                <div className={styles.formGroup}>
                    <label>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                        Email
                    </label>
                    <input type="email" placeholder="Enter your email" />
                </div>

                {/*Professional Information*/}
                <div className={styles.formGroup}>
                    <label>
                        <FontAwesomeIcon icon={faBriefcase} className={styles.icon} />
                        Job Title
                    </label>
                    <input type="text" placeholder="Enter your job title" />
                </div>

                <div className={styles.formGroup}>
                    <label>
                        <FontAwesomeIcon icon={faCode} className={styles.icon} />
                        Skills
                    </label>
                    <input type="text" placeholder="Enter your skills (comma separated)" />
                </div>

                {/*Biography Section*/}
                <div className={styles.formGroup}>
                    <label>Bio</label>
                    <textarea 
                        placeholder="Tell us about yourself"
                        className={styles.textarea}
                        rows={4}
                    ></textarea>
                </div>

                {/*Form Submission*/}
                <button type="submit" className={styles.saveButton}>Save Changes</button>
            </form>
        </div>
    );
};

export default BasicInfo;