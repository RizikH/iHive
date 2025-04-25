"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/app/styles/nav-bar.module.css";
import { fetcher } from "@/app/utils/fetcher";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/useAuthStore";

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
  profileHref?: string;
  profileImgSrc?: string;
  searchBar?: ReactNode;
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
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

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

      setAuthenticated(null);
      router.push("/get-started");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const computedLinks: NavLink[] =
    links ??
    (currentUser?.id
      ? [
          ...(extraLinks || []),
          { href: "/setting", label: "Settings" },
          { href: `/repository/${currentUser.id}`, label: "My Repositories" },
          { href: "#", label: "Sign Out", onClick: handleSignOut },
        ]
      : [
          { href: "/get-started", label: "Login" },
          { href: "/register", label: "Register" },
        ]);

  const filteredLinks = computedLinks.filter(
    (link) => link.label !== "My Repositories"
  );

  // Determine logo link based on user type
  const logoHref =
    currentUser?.user_type === "investor"
      ? "/investor"
      : currentUser?.user_type === "entrepreneur"
      ? "/entrepreneur"
      : "/";

  return (
    <nav className={styles.navContainer}>
      <Link href={logoHref} className={styles.logo}>
        <Image
          src={logoPath}
          alt="Logo"
          width={35}
          height={35}
          className={styles.logoImage}
        />
        <span>{title}</span>
      </Link>

      <div className={styles.navRight}>
        {searchBar && <div className={styles.searchWrapper}>{searchBar}</div>}

        <div className={styles.navLinks}>
          {filteredLinks.map((link, index) =>
            link.onClick ? (
              <button
                key={index}
                onClick={link.onClick}
                className={styles.navButton}
              >
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