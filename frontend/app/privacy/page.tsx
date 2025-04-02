"use client";

import React from "react";
import Head from "next/head";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import styles from "../styles/legal.module.css";

const PrivacyPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - iHive</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.container}>
        <NavBar title="iHive" />

        <main className={styles.content}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.updated}>Last Updated: {new Date().toLocaleDateString()}</p>

          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              At iHive, we respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our website or services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <p>
              We may collect several types of information from and about users of our Services, including:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Personal identifiers:</strong> such as name, email address, username,
                and other similar identifiers.
              </li>
              <li>
                <strong>Account information:</strong> including login credentials, profile information,
                and preferences.
              </li>
              <li>
                <strong>Usage data:</strong> information about how you use our website and Services.
              </li>
              <li>
                <strong>Device information:</strong> such as IP address, browser type, operating system,
                and other technology on the devices you use to access our Services.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect about you for various purposes, including to:
            </p>
            <ul className={styles.list}>
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, such as updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Develop new products and services</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. How We Share Your Information</h2>
            <p>
              We may share personal information in the following situations:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>With service providers:</strong> We may share your information with third-party
                vendors, service providers, and other parties who perform services on our behalf.
              </li>
              <li>
                <strong>With business partners:</strong> We may share your information with our business
                partners to offer you certain products, services or promotions.
              </li>
              <li>
                <strong>When required by law:</strong> We may disclose your information where required
                to do so by law or subpoena.
              </li>
              <li>
                <strong>With your consent:</strong> We may disclose your personal information for any
                other purpose with your consent.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to
              protect the security of any personal information we process. However, please also remember
              that we cannot guarantee that the internet itself is 100% secure.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information,
              such as:
            </p>
            <ul className={styles.list}>
              <li>The right to access the personal information we have about you</li>
              <li>The right to request that we correct inaccurate personal information</li>
              <li>The right to request that we delete your personal information</li>
              <li>The right to withdraw consent to the processing of your personal information</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Children's Privacy</h2>
            <p>
              Our Services are not intended for use by children under the age of 13. We do not knowingly
              collect personal information from children under 13. If you are a parent or guardian and
              believe we may have collected information about a child, please contact us.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last Updated" date at the top
              of this Privacy Policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <a href="mailto:support@ihive.com" className={styles.link}>privacy@ihive.com</a>
            </p>
          </section>
        </main>

        <Footer 
          role="Admin"
          links={[
            { href: "/terms", label: "Terms" },
            { href: "/privacy", label: "Privacy" }
          ]}
        />
      </div>
    </>
  );
};

export default PrivacyPage; 