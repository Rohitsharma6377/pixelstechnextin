import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Netcurion Technology",
  description:
    "Learn how Netcurion Technology collects, uses, and protects your personal information. Read our Privacy Policy for details on data practices and your rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumb
        pageName="Privacy Policy"
        description="Your privacy matters. This policy explains what data we collect, how we use it, and the choices you have."
      />

      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="prose max-w-none dark:prose-invert">
            <h2>Information We Collect</h2>
            <p>
              We may collect personal information such as your name, email address, and usage data when you interact with our services.
            </p>
            <h2>How We Use Information</h2>
            <p>
              We use data to operate and improve our services, personalize your experience, communicate updates, and ensure security and compliance.
            </p>
            <h2>Data Sharing</h2>
            <p>
              We do not sell your data. We may share information with trusted processors to provide our services, subject to contractual safeguards.
            </p>
            <h2>Security</h2>
            <p>
              We implement administrative, technical, and physical safeguards designed to protect your information.
            </p>
            <h2>Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, or delete your data. Contact us to make a request.
            </p>
            <h2>Contact</h2>
            <p>
              If you have questions about this policy, please contact Netcurion Technology via our contact page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
