import React, { useState, useEffect } from 'react';
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
    // =============================================
    // State Management
    // =============================================
    const [formData, setFormData] = useState({
        fullName: '',
        jobTitle: '',
        skills: '',
        bio: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // =============================================
    // Effects
    // =============================================
    useEffect(() => {
        // Load user profile data from localStorage
        const fullName = localStorage.getItem('fullName');
        const jobTitle = localStorage.getItem('jobTitle');
        const skills = localStorage.getItem('skills');
        const bio = localStorage.getItem('bio');
        
        setFormData({
            fullName: fullName || '',
            jobTitle: jobTitle || '',
            skills: skills || '',
            bio: bio || ''
        });
    }, []);

    // =============================================
    // Event Handlers
    // =============================================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            
            // Save all profile data to localStorage
            Object.entries(formData).forEach(([key, value]) => {
                if (value) {
                    localStorage.setItem(key, value);
                }
            });
            
            setSuccessMessage('Profile information updated successfully!');
            
            // In a real app, you would save to the database here
            // For example:
            // await fetch('/api/profile', {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData)
            // });
            
            // Refresh the page after a short delay to show updated info everywhere
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
        } catch (error) {
            setErrorMessage('Failed to update profile information');
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.settingSection}>
            <h2>Basic Information</h2>
            
            {successMessage && (
                <div className={styles.successMessage}>{successMessage}</div>
            )}
            
            {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
            )}
            
            <form onSubmit={handleSubmit}>
                {/*Personal Details Section*/}
                <div className={styles.formGroup}>
                    <label>
                        <FontAwesomeIcon icon={faUser} className={styles.icon} />
                        Full Name
                    </label>
                    <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder={formData.fullName || "Enter your full name"} 
                    />
                </div>

                {/*Professional Information*/}
                <div className={styles.formGroup}>
                    <label>
                        <FontAwesomeIcon icon={faBriefcase} className={styles.icon} />
                        Job Title
                    </label>
                    <input 
                        type="text" 
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder={formData.jobTitle || "Enter your job title"} 
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>
                        <FontAwesomeIcon icon={faCode} className={styles.icon} />
                        Skills
                    </label>
                    <input 
                        type="text" 
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder={formData.skills || "Enter your skills"} 
                    />
                </div>

                {/*Biography Section*/}
                <div className={styles.formGroup}>
                    <label>Bio</label>
                    <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder={formData.bio || "Tell us about yourself"}
                        className={styles.textarea}
                        rows={4}
                    ></textarea>
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

export default BasicInfo;