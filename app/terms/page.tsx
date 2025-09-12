import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Netcurion Technology",
  description:
    "Review the Terms of Use governing your access to and use of Netcurion Technology websites, products, and services.",
};

export default function TermsOfUsePage() {
  return (
    <>
      <Breadcrumb
        pageName="Terms of Use"
        description="These Terms of Use outline acceptable use, user responsibilities, and important legal terms for using our websites and services."
      />

      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="prose max-w-none dark:prose-invert">
            <h2>1. Scope</h2>
            <p>
              These Terms of Use apply to your access to and use of Netcurion Technology websites and publicly available resources.
            </p>
            <h2>2. User Responsibilities</h2>
            <p>
              You agree not to misuse our websites, attempt unauthorized access, or disrupt normal operation. Content you submit must comply with applicable laws.
            </p>
            <h2>3. Intellectual Property</h2>
            <p>
              Content on this site is owned by Netcurion Technology or its licensors and is protected by intellectual property laws.
            </p>
            <h2>4. Changes</h2>
            <p>
              We may modify these Terms of Use at any time. Continued use signifies acceptance of the updated terms.
            </p>
            <h2>5. Contact</h2>
            <p>
              For questions regarding these Terms, please contact us via the contact page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
