"use client";

import React, { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/styles/nav-bar.module.css";
import { fetcher } from "@/app/utils/fetcher";
import { useRouter } from "next/navigation";

interface NavLink {
  href: string;
  label: ReactNode;
  onClick?: () => void;
}

interface NavBarProps {
  title?: string;
  logoPath?: string;
  links?: NavLink[];
  extraLinks?: NavLink[];
  profileHref?: string; // ✅ e.g. "/investor-profile"
  profileImgSrc?: string; // ✅ e.g. "/Images/Yixi.jpeg"
  searchBar?: ReactNode; // ✅ custom search bar passed from the page
}

const NavBar = ({
  title = "iHive",
  logoPath = "/Images/iHive.png",
  links,
  extraLinks,
  profileHref,
  profileImgSrc,
  searchBar,
}: NavBarProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetcher("/users/me");
        setUserId(data.id);
      } catch {
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetcher("/users/logout", "POST");
      localStorage.clear();
      sessionStorage.clear();

      document.cookie
        .split(";")
        .forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });

      setUserId(null);
      router.push("/get-started");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const computedLinks: NavLink[] =
    links ?? (userId
      ? [
        ...(extraLinks || []),
        { href: "/setting", label: "Settings" },
        { href: `/repository/${userId}`, label: "My Repositories" },
        { href: "#", label: "Sign Out", onClick: handleSignOut },
      ]
      : [
        { href: "/get-started", label: "Login" },
        { href: "/register", label: "Register" },
      ]);

  // ⬇️ Add this line right after
  const filteredLinks = computedLinks.filter(link => link.label !== "My Repositories");


  return (
    <nav className={styles.navContainer}>
      {/* Left side: logo */}
      <Link href="/" className={styles.logo}>
        <Image src={logoPath} alt="Logo" width={35} height={35} className={styles.logoImage} />
        <span>{title}</span>
      </Link>

      {/* Right side: search bar + links + profile */}
      <div className={styles.navRight}>
        {searchBar && <div className={styles.searchWrapper}>{searchBar}</div>}

        <div className={styles.navLinks}>
          {filteredLinks.map((link, index) =>
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

          {profileHref && profileImgSrc && (
            <Link href={profileHref}>
              <Image
                src={profileImgSrc}
                alt="Profile"
                width={40}
                height={40}
                className={styles.avatarIcon}
              />
            </Link>
          )}
        </div>
      </div>
    </nav>

  );
};

export default NavBar;
