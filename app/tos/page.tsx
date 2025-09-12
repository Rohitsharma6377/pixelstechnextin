import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Netcurion Technology",
  description:
    "Read the Terms of Service for using Netcurion Technology products and services, including acceptable use, accounts, and limitations of liability.",
};

export default function TOSPage() {
  return (
    <>
      <Breadcrumb
        pageName="Terms of Service"
        description="Please review our Terms of Service to understand permitted use, account responsibilities, and important legal terms."
      />

      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="prose max-w-none dark:prose-invert">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Netcurion Technology services, you agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            <h2>2. Accounts & Access</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities occurring under your account.
            </p>
            <h2>3. Acceptable Use</h2>
            <p>
              You agree not to misuse our services, attempt unauthorized access, or engage in any activity that disrupts or degrades the service.
            </p>
            <h2>4. Intellectual Property</h2>
            <p>
              All trademarks, logos, and content are the property of Netcurion Technology or its licensors and may not be used without permission.
            </p>
            <h2>5. Warranties & Disclaimers</h2>
            <p>
              Services are provided "as is" and "as available" without warranties of any kind. We disclaim all implied warranties to the fullest extent permitted by law.
            </p>
            <h2>6. Limitation of Liability</h2>
            <p>
              Netcurion Technology will not be liable for any indirect, incidental, or consequential damages arising from your use of our services.
            </p>
            <h2>7. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of our services constitutes acceptance of the updated Terms.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
