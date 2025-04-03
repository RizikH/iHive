"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter for redirection
import { FiMail, FiLock, FiUser, FiX } from "react-icons/fi";
import styles from "@/app/styles/auth-form.module.css";

// =============================================
// Types and Interfaces
// =============================================

interface AuthFormProps {
  initialView?: "login" | "register";
  onClose?: () => void;
}

// =============================================
// Authentication Form Component
// =============================================

export const AuthForm = ({ initialView = "login", onClose }: AuthFormProps) => {
  const router = useRouter(); // ✅ Initialize router for navigation
  
  // =============================================
  // State Management
  // =============================================
  
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
    role: "", // No default role selection
    jobTitle: "", // Added for entrepreneur profile
    skills: "", // Added for entrepreneur profile
    rememberMe: false,
    termsAccepted: false,
  });

  // =============================================
  // Event Handlers
  // =============================================

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
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

    // Registration requires a role
    if (isActive && !formData.role) {
      setError("Please select a role (Entrepreneur or Investor).");
      setLoading(false);
      return;
    }

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
      const registerData = {
        username: formData.username, 
        email: formData.email, 
        password: formData.password,
        role: formData.role
      };
      
      // Add entrepreneur-specific fields if role is entrepreneur
      if (formData.role === 'entrepreneur') {
        Object.assign(registerData, {
          jobTitle: formData.jobTitle,
          skills: formData.skills
        });
      }
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isActive
            ? registerData
            : { email: formData.email, password: formData.password }
        ),
        credentials: "include", // Ensure the cookie is included in the request
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "An error occurred");

      setSuccess(isActive ? "Registration successful! You can now log in." : "Login successful!");

      if (!isActive) {
        // ✅ Save token in a cookie (so backend authMiddleware can read it)
        if (data.token) {
          document.cookie = `token=${data.token}; path=/; SameSite=Lax`;
        }
        
        // Store user profile data in localStorage
        localStorage.setItem("username", data.username || "");
        localStorage.setItem("role", data.role || "");
        if (data.jobTitle) localStorage.setItem("jobTitle", data.jobTitle);
        if (data.skills) localStorage.setItem("skills", data.skills);
      
        // ✅ Redirect after short delay
        setTimeout(() => {
          hideForm();
          router.push("/");
        }, 1000);
      }
      
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  // =============================================
  // Render
  // =============================================

  return (
    <div className={`${styles.wrapper} ${isVisible ? styles.activePopup : ""} ${isActive ? styles.active : ""}`}>
      {/*Close Button
      <button className={styles.iconClose} onClick={hideForm}>
        <FiX />
      </button>
      */}

      {/*Login Form Section*/}
      <div className={`${styles.formBox} ${styles.login}`} style={{display: isActive ? 'none' : 'block'}}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          {/*Email Input*/}
          <div className={styles.inputBox}>
            <FiMail className={styles.icon} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <label>Email</label>
          </div>
          
          {/*Password Input*/}
          <div className={styles.inputBox}>
            <FiLock className={styles.icon} />
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <label>Password</label>
          </div>
          
          {/*Remember Me and Forgot Password*/}
          <div className={styles.rememberForgot}>
            <label>
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>

          {/*Login Button -> Redirect to Investor Dashboard || Entrepreneur Profile */}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          
          {/*Register Link*/}
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

      {/*Register Form Section*/}
      <div className={`${styles.formBox} ${styles.register}`} style={{display: !isActive ? 'none' : 'block'}}>
        <h2>Sign up</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          {/*Username Input*/}
          <div className={styles.inputBox}>
            <FiUser className={styles.icon} />
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            <label>Username</label>
          </div>
          
          {/*Email Input*/}
          <div className={styles.inputBox}>
            <FiMail className={styles.icon} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <label>Email</label>
          </div>
          
          {/*Password Input*/}
          <div className={styles.inputBox}>
            <FiLock className={styles.icon} />
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <label>Password</label>
          </div>
          
          {/*Role Selection*/}
          <div className={styles.roleSelection}>
            <p className={styles.roleTitle}>Select your role:</p>
            <div className={styles.roleOptions}>
              <label className={`${styles.roleOption} ${formData.role === 'entrepreneur' ? styles.selectedRole : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="entrepreneur" 
                  checked={formData.role === 'entrepreneur'} 
                  onChange={handleChange} 
                />
                <span>Entrepreneur</span>
              </label>
              <label className={`${styles.roleOption} ${formData.role === 'investor' ? styles.selectedRole : ''}`}>
                <input 
                  type="radio" 
                  name="role" 
                  value="investor" 
                  checked={formData.role === 'investor'} 
                  onChange={handleChange} 
                />
                <span>Investor</span>
              </label>
            </div>
            <p className={styles.roleWarning}><strong>Note:</strong> Once registered, your role cannot be changed.</p>
          </div>
          
          {/* Entrepreneur-specific fields */}
          {formData.role === 'entrepreneur' && (
            <div className={styles.entrepreneurFields}>
              <div className={styles.inputBox}>
                <input 
                  type="text" 
                  name="jobTitle" 
                  value={formData.jobTitle} 
                  onChange={handleChange} 
                  placeholder="Optional"
                />
                <label>Job Title</label>
              </div>
              
              <div className={styles.inputBox}>
                <input 
                  type="text" 
                  name="skills" 
                  value={formData.skills} 
                  onChange={handleChange} 
                  placeholder="Optional"
                />
                <label>Skills</label>
              </div>
            </div>
          )}
          
          {/*Terms and Conditions*/}
          <div className={styles.rememberForgot}>
            <label>
              <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} required />{" "}
              I agree to the <a href="/terms">Terms</a> & <a href="/privacy">Privacy</a>
            </label>
          </div>
          
          {/*Register Button*/}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          
          {/*Login Link*/}
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
