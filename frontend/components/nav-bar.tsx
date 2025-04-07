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
      await fetcher("/users/logout", "POST");

      localStorage.clear();

      setUserId(null);

      window.location.href = "/";
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
