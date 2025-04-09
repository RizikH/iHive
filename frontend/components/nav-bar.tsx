"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/styles/nav-bar.module.css";
import { fetcher } from "@/app/utils/fetcher"; // ✅ import your fetcher utility

interface NavBarProps {
  title?: string;
  logoPath?: string;
  links?: { href: string; label: string; onClick?: () => void }[];
}

const NavBar = ({
  title = "iHive",
  logoPath = "/Images/iHive.png",
  links,
}: NavBarProps) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetcher("/users/me");
        setUserId(data.id); // Supabase user ID
      } catch (err) {
        console.warn("User not logged in");
        setUserId(null);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      // 1. Invalidate backend session
      await fetcher("/users/logout", "POST");

      // 2. Clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();

      // 3. Remove non-HttpOnly cookies
      document.cookie
        .split(";")
        .forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });

      // 4. Optional: Clear user state
      setUserId(null);

      // 5. Redirect to landing/login page
      window.location.href = "/get-started"; // more explicit redirect
    } catch (error) {
      console.error("Logout failed", error);
    }
  };


  const computedLinks =
    links ??
    (userId
      ? [
        { href: `/setting`, label: "Settings" },
        { href: `/repository/${userId}`, label: "My Repositories" },
        { href: "#", label: "Sign Out", onClick: handleSignOut },
      ]
      : [
        { href: "/get-started", label: "Login" },
        { href: "/register", label: "Register" },
      ]);

  return (
    <nav className={styles.navContainer}>
      {/* Logo and Title */}
      <Link href="/" className={styles.logo}>
        <Image
          src={logoPath}
          alt="Logo"
          width={35}
          height={35}
          className={styles.logoImage}
        />
        <span>{title}</span>
      </Link>

      {/* Navigation Links */}
      <div className={styles.navLinks}>
        {computedLinks.map((link, index) =>
          link.onClick ? (
            <button key={index} onClick={link.onClick} className={styles.navButton}>
              {link.label}
            </button>
          ) : (
            <Link key={index} href={link.href}>
              {link.label}
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default NavBar;
