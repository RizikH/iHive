"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "@/styles/entrepreneur-profile.module.css"; // ✅ Reuse nav styles

interface NavProps {
  links?: {
    label: string;
    href: string;
  }[];
}

const NavBar = ({ links = [] }: NavProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie;
    const hasToken = cookies.includes("sb-access-token=");
    if (hasToken) {
      setIsLoggedIn(true);
      const stored = localStorage.getItem("username");
      setUsername(stored || null);
    }
  }, []);

  return (
    <nav className={styles.navContainer}>
      <div className={styles.logo}>
        <Image
          src="/Images/iHive.png"
          alt="Logo"
          title="Home"
          width={35}
          height={35}
          className={styles.logoImage}
        />
        <Link href="/">iHive</Link>
      </div>

      <div className={styles["nav-links"]}>
        {/* Optional links from props */}
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}

        {isLoggedIn ? (
          <>
            <Link href="/repository">Repository</Link>
            <Link href="/entrepreneur">Profile</Link>
            <Link href="/setting">Setting</Link>
            <Link href="/sponsors">Your Sponsors</Link>
            <Link href="/get-started">Sign Out</Link>
          </>
        ) : (
          <Link href="/get-started">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
