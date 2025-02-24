import { useState } from "react";
import { FiMail, FiLock, FiUser, FiX } from "react-icons/fi";
import styles from "@/app/styles/auth-form.module.css";

interface AuthFormProps {
  initialView?: 'login' | 'register';
  onClose?: () => void;
}

export const AuthForm = ({ initialView = 'login', onClose }: AuthFormProps) => {
  const [isActive, setIsActive] = useState(initialView === 'register');
  const [isVisible, setIsVisible] = useState(true);

  const hideForm = () => {
    setIsVisible(false);
    onClose?.();
  };

  const toggleForm = () => setIsActive(!isActive);

  return (
    <div className={`${styles.wrapper} ${isVisible ? styles.activePopup : ''} ${isActive ? styles.active : ''}`}>
      <button className={styles.iconClose} onClick={hideForm}>
        <FiX />
      </button>

      <div className={`${styles.formBox} ${styles.login}`}>
        <h2>Login</h2>
        <form>
          <div className={styles.inputBox}>
            <FiMail className={styles.icon} />
            <input type="text" required />
            <label>Username</label>
          </div>
          <div className={styles.inputBox}>
            <FiLock className={styles.icon} />
            <input type="password" required />
            <label>Password</label>
          </div>
          <div className={styles.rememberForgot}>
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className={styles.btn}>Login</button>
          <div className={styles.loginRegister}>
            <p>Don't have an account? 
              <button type="button" onClick={toggleForm} className={styles.registerLink}>
                Register
              </button>
            </p>
          </div>
        </form>
      </div>

      <div className={`${styles.formBox} ${styles.register}`}>
        <h2>Sign up</h2>
        <form>
          <div className={styles.inputBox}>
            <FiUser className={styles.icon} />
            <input type="text" required />
            <label>Username</label>
          </div>
          <div className={styles.inputBox}>
            <FiMail className={styles.icon} />
            <input type="email" required />
            <label>Email</label>
          </div>
          <div className={styles.inputBox}>
            <FiLock className={styles.icon} />
            <input type="password" required />
            <label>Password</label>
          </div>
          <div className={styles.rememberForgot}>
            <label><input type="checkbox" required /> I agree to the <a href="/terms">Terms</a> & <a href="/privacy">Privacy</a></label>
          </div>
          <button type="submit" className={styles.btn}>Register</button>
          <div className={styles.loginRegister}>
            <p>Already have an account? 
              <button type="button" onClick={toggleForm} className={styles.loginLink}>
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}; 