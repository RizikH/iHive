"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter for redirection
import { FiMail, FiLock, FiUser, FiX } from "react-icons/fi";
import styles from "@/app/styles/auth-form.module.css";

interface AuthFormProps {
  initialView?: "login" | "register";
  onClose?: () => void;
}

export const AuthForm = ({ initialView = "login", onClose }: AuthFormProps) => {
  const router = useRouter(); // ✅ Initialize router for navigation
  const [isActive, setIsActive] = useState(initialView === "register");
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rememberMe: false,
    termsAccepted: false,
  });

  // Hide Form
  const hideForm = () => {
    setIsVisible(false);
    onClose?.();
  };

  // Toggle Between Login & Register
  const toggleForm = () => {
    setIsActive(!isActive);
    setError(null);
    setSuccess(null);
  };

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
  
    const endpoint = isActive
      ? (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/register` : "http://localhost:5000/api/users/register")
      : (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/login` : "http://localhost:5000/api/users/login");
  
    // Registration requires accepting terms
    if (isActive && !formData.termsAccepted) {
      setError("You must accept the Terms & Privacy Policy.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isActive
            ? { username: formData.username, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password }
        ),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || "An error occurred");
  
      setSuccess(isActive ? "Registration successful! You can now log in." : "Login successful!");
  
      if (!isActive) {
        localStorage.setItem("token", data.token); // ✅ Store JWT token
        localStorage.setItem("username", data.username); // ✅ Store username
        setTimeout(() => {
          hideForm();
          router.push("/"); // ✅ Redirect to main app page after login
        }, 1000);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.wrapper} ${isVisible ? styles.activePopup : ""} ${isActive ? styles.active : ""}`}>
      <button className={styles.iconClose} onClick={hideForm}>
        <FiX />
      </button>

      {/* Login Form */}
      {!isActive && (
        <div className={`${styles.formBox} ${styles.login}`}>
          <h2>Login</h2>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputBox}>
              <FiMail className={styles.icon} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              <label>Email</label>
            </div>
            <div className={styles.inputBox}>
              <FiLock className={styles.icon} />
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              <label>Password</label>
            </div>
            <div className={styles.rememberForgot}>
              <label>
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} /> Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className={styles.loginRegister}>
              <p>
                Don't have an account?
                <button type="button" onClick={toggleForm} className={styles.registerLink}>
                  Register
                </button>
              </p>
            </div>
          </form>
        </div>
      )}

      {/* Register Form */}
      {isActive && (
        <div className={`${styles.formBox} ${styles.register}`}>
          <h2>Sign up</h2>
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className={styles.inputBox}>
              <FiUser className={styles.icon} />
              <input type="text" name="username" value={formData.username} onChange={handleChange} required />
              <label>Username</label>
            </div>
            <div className={styles.inputBox}>
              <FiMail className={styles.icon} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              <label>Email</label>
            </div>
            <div className={styles.inputBox}>
              <FiLock className={styles.icon} />
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
              <label>Password</label>
            </div>
            <div className={styles.rememberForgot}>
              <label>
                <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required />{" "}
                I agree to the <a href="/terms">Terms</a> & <a href="/privacy">Privacy</a>
              </label>
            </div>
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <div className={styles.loginRegister}>
              <p>
                Already have an account?
                <button type="button" onClick={toggleForm} className={styles.loginLink}>
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
