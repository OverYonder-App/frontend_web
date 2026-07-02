import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — OverYonder",
  description: "How OverYonder collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="June 27, 2026">
      <p>
        OverYonder (“OverYonder,” “we,” “us,” or “our”) provides a campus
        engagement platform that helps students, clubs, and institutions discover
        and organize events. This Privacy Policy explains what information we
        collect, how we use it, and the choices you have. By using OverYonder, you
        agree to the practices described here.
      </p>

      <h2>Information We Collect</h2>
      <p>We collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Account and profile information</strong> — your name, email
          address, username, profile photo, short bio, role (e.g. student,
          faculty, administrator), and the institution you are affiliated with.
        </li>
        <li>
          <strong>Institution information</strong> — your school affiliation and
          its approval status, which determine the community you can access.
        </li>
        <li>
          <strong>Content you create</strong> — events, RSVPs, comments, friend
          connections, organizations, and any media you upload.
        </li>
        <li>
          <strong>Push notification data</strong> — if you enable event
          reminders, we store your browser’s push subscription so we can deliver
          them. You can turn this off at any time.
        </li>
        <li>
          <strong>Authentication data</strong> — if you sign in with a third-party
          provider such as Google, we receive basic profile information (such as
          your name and email) from that provider.
        </li>
        <li>
          <strong>Usage and analytics information</strong> — with your consent, we
          use analytics (via PostHog) to collect data such as your browser type,
          pages viewed, and general activity, to understand and improve the
          service. You control this through the cookie banner.
        </li>
        <li>
          <strong>Diagnostic information</strong> — to keep the service reliable we
          use error monitoring (via Sentry) that records technical details when
          something goes wrong (such as the error and the page it occurred on).
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>Provide, maintain, and personalize the OverYonder service.</li>
        <li>Show you relevant events and deliver the reminders you opt into.</li>
        <li>Connect you with others in your institution’s community.</li>
        <li>Secure the platform and prevent fraud, abuse, and unauthorized access.</li>
        <li>Communicate with you about your account, including confirmation,
          magic-link, and password-reset emails.</li>
        <li>Understand how the service is used so we can improve it.</li>
      </ul>

      <h2>How We Share Information</h2>
      <p>We do not sell your personal information. We share it only as follows:</p>
      <ul>
        <li>
          <strong>Within your institution</strong> — other members of your
          institution may see your profile, the events you create, and your
          participation, according to the visibility settings of each item.
        </li>
        <li>
          <strong>Institution administrators</strong> — administrators of your
          institution can manage members, content, and reports within their
          community.
        </li>
        <li>
          <strong>Service providers</strong> — vendors who help us operate the
          platform, such as our hosting and database provider, email delivery
          provider, push-notification services, product-analytics provider
          (PostHog), and error-monitoring provider (Sentry). They may process your
          information only on our behalf.
        </li>
        <li>
          <strong>Legal and safety</strong> — when required by law or to protect
          the rights, property, or safety of OverYonder, our users, or the public.
        </li>
      </ul>

      <h2>Cookies and Similar Technologies</h2>
      <p>
        We use <strong>strictly necessary cookies</strong> to keep you signed in
        and operate core features of the service; these cannot be turned off, and
        disabling them may prevent you from logging in. With your consent, we also
        use <strong>analytics cookies</strong> (via PostHog) to understand how the
        service is used so we can improve it.
      </p>
      <p>
        You choose whether to allow analytics cookies through the consent banner
        shown on your first visit. Declining will not affect your ability to use
        the platform. Error monitoring (via Sentry) is used to keep the service
        reliable and does not set advertising or tracking cookies.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain your information for as long as your account is active or as
        needed to provide the service. When you delete your account, we delete or
        de-identify your personal information, except where we must retain it to
        comply with legal obligations or resolve disputes.
      </p>

      <h2>Your Rights and Choices</h2>
      <ul>
        <li>Access and update your profile information from your settings.</li>
        <li>Turn event-reminder push notifications on or off at any time.</li>
        <li>Request access to, correction of, or deletion of your personal data.</li>
        <li>Close your account by contacting us.</li>
      </ul>

      <h2>Security</h2>
      <p>
        We protect your information using encryption in transit and access
        controls, and we restrict access to authorized personnel. No method of
        transmission or storage is completely secure, so we cannot guarantee
        absolute security.
      </p>

      <h2>Children’s Privacy</h2>
      <p>
        OverYonder is intended for students and staff of participating colleges and
        universities. It is not directed to children under 13, and we do not
        knowingly collect personal information from them. If you are under the age
        of majority in your jurisdiction, please use OverYonder only in accordance
        with your institution’s policies.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will
        revise the “Last updated” date above and, where appropriate, notify you.
        Your continued use of OverYonder after changes take effect constitutes
        acceptance of the updated policy.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy or your data, contact us at{" "}
        <a href="mailto:support@overyonder.app">support@overyonder.app</a>.
      </p>
    </LegalPage>
  );
}
