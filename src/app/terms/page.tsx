import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — OverYonder",
  description: "The terms that govern your use of OverYonder.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="June 27, 2026">
      <p>
        These Terms of Service (“Terms”) govern your access to and use of
        OverYonder, a campus engagement platform (the “Service”). By creating an
        account or using the Service, you agree to these Terms. If you do not
        agree, do not use the Service.
      </p>

      <h2>Eligibility</h2>
      <p>
        You may use OverYonder only if you are affiliated with a participating
        institution and are able to form a binding contract under the laws of your
        jurisdiction. If you are under the age of majority, you may use the Service
        only with the involvement of a parent, guardian, or your institution.
      </p>

      <h2>Your Account</h2>
      <ul>
        <li>Provide accurate information and keep it up to date.</li>
        <li>Keep your login credentials confidential.</li>
        <li>You are responsible for all activity that occurs under your account.</li>
        <li>Notify us promptly of any unauthorized use of your account.</li>
      </ul>

      <h2>Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for any unlawful, harmful, or fraudulent purpose.</li>
        <li>Harass, threaten, impersonate, or harm other users.</li>
        <li>Post content that is infringing, defamatory, obscene, or otherwise objectionable.</li>
        <li>Send spam, or scrape, harvest, or collect data from the Service.</li>
        <li>Interfere with, disrupt, or attempt to gain unauthorized access to the Service or its security.</li>
      </ul>

      <h2>User Content</h2>
      <p>
        You retain ownership of the content you create or upload (“User Content”).
        By posting User Content, you grant OverYonder a non-exclusive, worldwide,
        royalty-free license to host, store, display, and distribute that content
        as needed to operate the Service within your institution’s community. You
        are solely responsible for your User Content, and you represent that you
        have the rights necessary to share it. We may remove content that violates
        these Terms.
      </p>

      <h2>Events and Participation</h2>
      <p>
        Events on OverYonder are organized by users, clubs, and institutions, not
        by OverYonder. We do not guarantee the accuracy, safety, or occurrence of
        any event, and your attendance and participation are at your own
        discretion and risk.
      </p>

      <h2>Your Institution</h2>
      <p>
        Access to OverYonder depends on your affiliation with a participating
        institution and that institution’s approval. Your institution’s
        administrators may manage, restrict, or revoke access to their community,
        and may moderate content within it.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        The Service, including its software, design, and trademarks, is owned by
        OverYonder and protected by intellectual-property laws. These Terms do not
        grant you any right to use our branding without our prior written consent.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        The Service may integrate third-party services (such as authentication and
        notification providers). Your use of those services may be subject to their
        own terms and privacy policies, and we are not responsible for them.
      </p>

      <h2>Disclaimers</h2>
      <p>
        The Service is provided “as is” and “as available,” without warranties of
        any kind, whether express or implied, including warranties of
        merchantability, fitness for a particular purpose, and non-infringement. We
        do not warrant that the Service will be uninterrupted, secure, or
        error-free.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, OverYonder will not be liable for
        any indirect, incidental, special, consequential, or punitive damages, or
        any loss of data, use, or goodwill, arising out of your use of the Service.
      </p>

      <h2>Termination</h2>
      <p>
        You may stop using the Service at any time. We may suspend or terminate your
        access if you violate these Terms or if necessary to protect the Service or
        its users. Provisions that by their nature should survive termination will
        survive.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. When we do, we will revise the
        “Last updated” date above. Your continued use of the Service after changes
        take effect constitutes acceptance of the updated Terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms are governed by the laws of the jurisdiction in which
        OverYonder operates, without regard to its conflict-of-laws principles.
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions about these Terms? Contact us at{" "}
        <a href="mailto:support@overyonder.app">support@overyonder.app</a>.
      </p>
    </LegalPage>
  );
}
