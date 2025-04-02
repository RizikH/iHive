"use client";

import React from "react";
import Head from "next/head";
import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";
import styles from "../styles/legal.module.css";

const TermsPage = () => {
  return (
    <>
      <Head>
        <title>Terms of Service - iHive</title>
        <link rel="icon" href="/Images/iHive.png" />
      </Head>

      <div className={styles.container}>
        <NavBar title="iHive" />

        <main className={styles.content}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.updated}>Last Updated: {new Date().toLocaleDateString()}</p>

          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to iHive! These Terms of Service ("Terms") govern your use of our website,
              products, and services ("Services"). By accessing or using our Services, you agree
              to be bound by these Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Using Our Services</h2>
            <p>
              You must follow any policies made available to you within the Services. You may use
              our Services only as permitted by law. We may suspend or stop providing our Services
              to you if you do not comply with our terms or policies or if we are investigating
              suspected misconduct.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Your iHive Account</h2>
            <p>
              You may need an iHive Account in order to use some of our Services. You are responsible
              for maintaining the security of your account and password. iHive cannot and will not
              be liable for any loss or damage from your failure to comply with this security obligation.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Privacy and Copyright Protection</h2>
            <p>
              Our privacy policies explain how we treat your personal data and protect your privacy
              when you use our Services. By using our Services, you agree that iHive can use such
              data in accordance with our privacy policies.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Your Content in Our Services</h2>
            <p>
              Some of our Services allow you to upload, submit, store, send or receive content.
              You retain ownership of any intellectual property rights that you hold in that content.
              When you upload, submit, store, send or receive content to or through our Services,
              you give iHive a worldwide license to use, host, store, reproduce, modify, create
              derivative works, communicate, publish, publicly perform, publicly display and
              distribute such content.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Modifying and Terminating our Services</h2>
            <p>
              We are constantly changing and improving our Services. We may add or remove functionalities
              or features, and we may suspend or stop a Service altogether. You can stop using our
              Services at any time. iHive may also stop providing Services to you, or add or create
              new limits to our Services at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Liability for our Services</h2>
            <p>
              When permitted by law, iHive will not be responsible for lost profits, revenues, or
              data, financial losses or indirect, special, consequential, exemplary, or punitive damages.
              To the extent permitted by law, the total liability of iHive for any claims under these
              terms, including for any implied warranties, is limited to the amount you paid us to
              use the Services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. About these Terms</h2>
            <p>
              We may modify these terms or any additional terms that apply to a Service to, for example,
              reflect changes to the law or changes to our Services. You should look at the terms
              regularly. We'll post notice of modifications to these terms on this page. Changes will
              not apply retroactively and will become effective no sooner than fourteen days after
              they are posted.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <a href="mailto:support@ihive.com" className={styles.link}>support@ihive.com</a>
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

export default TermsPage; 