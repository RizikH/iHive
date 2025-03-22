"use client";

import React from 'react';

// Next.js
import Link from 'next/link';
import Image from 'next/image';

// Styles
import styles from '@/app/styles/nav-bar.module.css';

// =============================================
// Types
// =============================================
interface NavBarProps {
  title?: string;
  logoPath?: string;
  links?: { href: string; label: string }[];
}

// =============================================
// Component
// =============================================
const NavBar = ({
  title = "iHive",
  logoPath = "/Images/iHive.png",
  links = [
    { href: "/setting", label: "Setting" },
    { href: "/get-started", label: "Sign Out" }
  ]
}: NavBarProps) => {
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
        {links.map((link, index) => (
          <Link key={index} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar; 