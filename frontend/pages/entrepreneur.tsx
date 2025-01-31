import React from 'react';
import styles from '../styles/entrepreneur-profile.css';
import cdnjs from 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css';

const EntrepreneurProfile = () => {
    return (
        <main className={styles.profile-container}>
            <div className={styles.profile-content}>
                <div className={profile-image title="Change Your Avatar"}>
                    <img src="#" alt="User's Avatar">
                </div>
                <h1 title="Username">Username</h1>
                <div className={skills} title="job-title/skills">
                    <p>Job Title</p>
                    <p>Skills</p>
                </div>
                <div className={social-links}>
                    <a href="#" title="GitHub"><i class="fab fa-github"></i></a>
                    <a href="#" title="X-Twitter"><i class="fab fa-x-twitter"></i></a>
                    <a href="#" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                </div> 
            </div>
        </main>
    );
};

export default EntrepreneurProfile;