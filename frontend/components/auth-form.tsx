"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiUser, FiX } from "react-icons/fi";
import styles from "@/app/styles/auth-form.module.css";
import { fetcher } from "@/app/utils/fetcher";
import { useAuthStore } from "@/app/stores/useAuthStore";

interface AuthFormProps {
  initialView?: "login" | "register";
  onClose?: () => void;
}

export const AuthForm = ({ initialView = "login", onClose }: AuthFormProps) => {
  const router = useRouter();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const [isActive, setIsActive] = useState(initialView === "register");
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    jobTitle: "",
    skills: "",
    rememberMe: false,
    termsAccepted: false,
  });

  useEffect(() => {
    const savedUser = sessionStorage.getItem("auth_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setAuthenticated(parsed);
      } catch (e) {
        console.warn("Failed to restore session", e);
      }
    }
  }, [setAuthenticated]);

  const hideForm = () => {
    setIsVisible(false);
    onClose?.();
  };

  const toggleForm = () => {
    setIsActive(!isActive);
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetcher("/users/login", "POST", {
        email: formData.email,
        password: formData.password,
      });

      const { user } = response;

      if (!Array.isArray(user) || user.length === 0) {
        throw new Error("Login failed. No user returned.");
      }

      const currentUser = user[0];
      const userData = {
        id: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar || "/Images/sample.jpeg",
      };

      setAuthenticated(userData);
      sessionStorage.setItem("auth_user", JSON.stringify(userData));

      setSuccess("Login successful!");

      setTimeout(() => {
        hideForm();
        router.push("/");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (!formData.role) throw new Error("Please select a role (Entrepreneur or Investor).");
    if (!formData.termsAccepted) throw new Error("You must accept the Terms & Privacy Policy.");

    const payload: Record<string, any> = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "entrepreneur") {
      payload.jobTitle = formData.jobTitle;
      payload.skills = formData.skills;
    }

    const user = await fetcher("/users/register", "POST", payload);
    if (!user) throw new Error("Registration failed. Please try again.");
    setSuccess("Registration successful! You can now log in.");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isActive) {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.wrapper} ${isVisible ? styles.activePopup : ""} ${isActive ? styles.active : ""}`}>
      <button className={styles.iconClose} onClick={hideForm} type="button" aria-label="Close">
        <FiX />
      </button>

      {/* Login Form */}
      <div className={`${styles.formBox} ${styles.login}`} style={{ display: isActive ? "none" : "block" }}>
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
              Don&apos;t have an account?
              <button type="button" onClick={toggleForm} className={styles.registerLink}>
                Register
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Register Form */}
      <div className={`${styles.formBox} ${styles.register}`} style={{ display: !isActive ? "none" : "block" }}>
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

          <div className={styles.roleSelection}>
            <p className={styles.roleTitle}>Select your role:</p>
            <div className={styles.roleOptions}>
              {["entrepreneur", "investor"].map((role) => (
                <label
                  key={role}
                  className={`${styles.roleOption} ${formData.role === role ? styles.selectedRole : ""}`}
                >
                  <input type="radio" name="role" value={role} checked={formData.role === role} onChange={handleChange} />
                  <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                </label>
              ))}
            </div>
            <p className={styles.roleWarning}>
              <strong>Note:</strong> Once registered, your role cannot be changed.
            </p>
          </div>

          {formData.role === "entrepreneur" && (
            <div className={styles.entrepreneurFields}>
              <div className={styles.inputBox}>
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Optional" />
                <label>Job Title</label>
              </div>
              <div className={styles.inputBox}>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Optional" />
                <label>Skills</label>
              </div>
            </div>
          )}

          <div className={styles.rememberForgot}>
            <label>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
              />
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
    </div>
  );
};
