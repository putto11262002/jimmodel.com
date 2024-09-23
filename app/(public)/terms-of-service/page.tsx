import Container from "@/components/container";
import webConfig from "@/config/web";
import { format } from "date-fns";

export default function Page() {
  return (
    <Container max="lg">
      <h1 className="text-lg font-semibold">
        {webConfig.fullCompanyName} Terms of Service
      </h1>

      <p className="text-sm text-muted-foreground">
        Effective Date: {format(new Date(), "dd MMM yy")}
      </p>

      <p className="mt-4">
        These Terms of Service govern your use of the J.I.M. Modeling Agency
        platform. By creating an account and using our services, you agree to
        abide by these terms.
      </p>

      <h2 className="font-semibold mt-4">1. Services Offered</h2>
      <p>We offer the following services through our platform:</p>

      <ul className="list-disc list-inside mt-2">
        <li>Profile Creation: Create and manage your modeling profile.</li>
        <li>
          Job Notifications: Receive notifications about available modeling
          jobs.
        </li>
      </ul>
      <h2 className="font-semibold mt-4">2. User Accounts</h2>
      <p>
        You must create an account to access our services. During registration,
        we will ask for personal information such as your name, email, phone
        number, address, and date of birth.
      </p>

      <h2 className="font-semibold mt-4">3.User Responsibilities</h2>
      <p>When using our platform, you agree to:</p>

      <ul className="list-disc list-inside mt-2">
        <li>Provide accurate and truthful information.</li>
        <li>
          Refrain from uploading inappropriate content (e.g., offensive photos,
          false information).
        </li>
        <li>Comply with any additional guidelines or policies we may have.</li>
      </ul>
      <h2 className="font-semibold mt-4">4. Account Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account for any
        violations of these terms, including the submission of false information
        or inappropriate content.
      </p>

      <h2 className="font-semibold mt-4">5. Content Ownership and License</h2>
      <p>
        While you retain ownership of the photos and videos you upload, you
        grant J.I.M. Modeling Agency the right to use this content to promote
        your profile and share it with our direct clients (e.g., production
        companies). This license is limited to promoting your modeling career
        and does not include any other use.
      </p>

      <h2 className="font-semibold mt-4">6. Payment and Fees</h2>
      <p>We do not charge any fees for the use of our services.</p>

      <h2 className="font-semibold mt-4">7. Limitation of Liability</h2>
      <p>We are not responsible for:</p>

      <ul className="list-disc list-inside mt-2">
        <li>
          Any data breaches or leaks resulting from unauthorized access to your
          data.
        </li>
        <li>
          Any errors or outages that affect the availability of our platform.
        </li>
      </ul>
      <h2 className="font-semibold mt-4">8. Dispute Resolution</h2>
      <p>
        All disputes arising under these terms will be governed by the laws of
        Bangkok, Thailand. Any legal action must be brought within this
        jurisdiction.
      </p>

      <h2 className="font-semibold mt-4">9. Changes to the Terms</h2>
      <p>
        We reserve the right to modify these Terms of Service at any time. Any
        changes will be communicated through email or platform announcements.
      </p>
    </Container>
  );
}
