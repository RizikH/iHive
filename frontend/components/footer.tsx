"use client";

import React from "react";
import Link from "next/link";
import styles from "@/app/styles/footer.module.css";

interface FooterProps {
  iHive?: string;
  role?: string;
  links?: { href: string; label: string }[];
  year?: number;
}

const Footer = ({
  iHive = "iHive",
  role = "Role",
  links = [
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" }
  ],
  year = new Date().getFullYear()
}: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.copyright}>
          © {year} {iHive} · {role}
        </p>
        <div className={styles.links}>
          {links && links.length > 0 && links.map((link, index) => (
            <React.Fragment key={index}>
              <Link href={link.href} className={styles.link}>
                {link.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer; 