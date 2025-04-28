"use client";

import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/setting.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuthStore } from '@/app/stores/useAuthStore';
import {
    faUser,
    faEnvelope,
    faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { fetcher } from '@/app/utils/fetcher';

const BasicInfo = () => {
    const currentUser = useAuthStore((state) => state.currentUser);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
    });
    const [bioEditable, setBioEditable] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const updateUser = useAuthStore((state) => state.updateCurrentUserBio);

    useEffect(() => {
        if (currentUser) {
            const { username = '', bio = '', email = '' } = currentUser;
            setFormData({ username, bio, email });
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const res = await fetcher(`/users/update?id=${currentUser.id}`, 'PUT', {
                bio: formData.bio,
            });

            if (!res) {
                throw new Error('Failed to update user information');
            }
            setSuccessMessage('User information updated successfully!');
            updateUser(formData.bio);
            setBioEditable(false); // lock after success
        } catch (error) {
            console.error('Error updating user:', error);
            setErrorMessage('Failed to update user information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.settingSection}>
            <h2>Basic Information</h2>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        <FontAwesomeIcon icon={faUser} className={styles.icon} />
                        <span className={styles.labelText}>Username:</span>
                    </label>
                    <span className={styles.formValue}>{formData.username}</span>
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                        <span className={styles.labelText}>Email:</span>
                    </label>
                    <span className={styles.formValue}>{formData.email}</span>
                </div>

                {/* Date Joined */}
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                        <FontAwesomeIcon icon={faCalendar} className={styles.icon} />
                        <span className={styles.labelText}>Date Joined:</span>
                    </label>
                </div>

                {/* Bio */}
                <div className={styles.formGroup}>
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        readOnly={!bioEditable}
                        onClick={() => setBioEditable(true)}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        className={styles.textarea}
                        rows={4}
                    />

                </div>

                {/* Submit */}
                {bioEditable && (
                    <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                )}
            </form>
        </div>
    );
};

export default BasicInfo;
