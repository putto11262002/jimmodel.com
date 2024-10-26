import Container from "@/components/container";
import webConfig from "@/config/web";
import { format } from "date-fns";

export default function Page() {
  return (
    <Container max="lg">
      <h1 className="text-lg font-semibold">
        {webConfig.fullCompanyName} Privacy Policy
      </h1>
      <p className="text-sm text-muted-foreground">
        Effective Date: {format(new Date(), "dd MMM yy")}
      </p>

      <p className="mt-4">
        At {webConfig.fullCompanyName}, we respect your privacy and are
        committed to protecting the personal information you provide to us. This
        Privacy Policy outlines how we collect, use, store, and share your
        information when you use our services.
      </p>

      <h2 className="font-semibold mt-4">1. Information We Collect</h2>
      <p>
        We collect the following personal information when you sign up for or
        use our services:
      </p>
      <ul className="list-disc list-inside mt-2">
        <li>
          Personal Information: Name, email, phone number, address, date of
          birth.
        </li>
        <li>
          Media Content: Photos, videos, or other media submitted as part of
          your profile.
        </li>
        <li>
          Cookies: We use cookies solely to ensure the necessary functionality
          of our platform and not for tracking or marketing purposes.
        </li>
      </ul>
      <h2 className="font-semibold mt-4">2. How We Use Your Information</h2>
      <p>Your data is collected for the following purposes:</p>

      <ul className="list-disc list-inside mt-2">
        <li>
          Job Matching: To match you with modeling jobs and opportunities.
        </li>
        <li>
          Profile Promotion: Your name and photos may be displayed on our
          website and social media to promote your profile to potential clients.
        </li>
        <li>
          Communication: To contact you regarding job notifications, account
          information, or important updates.
        </li>
      </ul>
      <h2 className="font-semibold mt-4">3. Data Sharing</h2>
      <p>We do not share your personal data with third parties, except:</p>

      <ul className="list-disc list-inside mt-2">
        <li>
          Clients: Direct clients or production companies who may hire you for
          modeling jobs.
        </li>
        <li>
          Service Providers: We may use third-party providers (e.g., for hosting
          or platform maintenance) who process your data on our behalf under
          strict confidentiality agreements.
        </li>
      </ul>
      <h2 className="font-semibold mt-4">4. Data Storage and Security</h2>
      <p>
        Your data is stored on our private servers and is protected by
        encryption both at rest and in transit. Only authorized personnel can
        access this information.
      </p>

      <h2 className="font-semibold mt-4">5. Data Retention</h2>
      <p>
        We retain your personal information until you request its removal from
        our database. You may contact us at any time to modify or delete your
        data.
      </p>

      <h2 className="font-semibold mt-4">6. Your Rights</h2>
      <p>You have the following rights regarding your personal information:</p>
      <ul className="list-disc list-inside mt-2">
        <li>
          Access and Correction: You may request access to or changes to your
          data.{" "}
        </li>
        <li>
          Data Deletion: You may request that we delete your personal data from
          our records.
        </li>
        <li>
          Consent Withdrawal: You can withdraw your consent for the processing
          of your data at any time.
        </li>
      </ul>
      <h2 className="font-semibold mt-4">7. Cookies</h2>
      <p>
        We use cookies only to support the functionality of our application. No
        tracking or marketing cookies are used.
      </p>

      <h2 className="font-semibold mt-4">8. Contact Information</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy or how
        we handle your data, please contact us at{" "}
        <a href={`mail:${webConfig.email}`}>{webConfig.email}</a>.
      </p>
    </Container>
  );
}
