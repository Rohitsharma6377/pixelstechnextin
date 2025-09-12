import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Netcurion Technology",
  description:
    "Understand Netcurion Technology's refund policy, including eligibility, timelines, and how to request a refund for eligible services.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Breadcrumb
        pageName="Refund Policy"
        description="Our refund policy outlines eligibility criteria, timelines, and the steps required to request a refund."
      />

      <section className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <div className="prose max-w-none dark:prose-invert">
            <h2>Eligibility</h2>
            <p>
              Refunds may be available for unused portions of prepaid services as specified in your service agreement. Custom development work is generally non-refundable once delivered.
            </p>
            <h2>How to Request</h2>
            <p>
              To request a refund, contact our support team with your order details and a description of the issue. We will review and respond promptly.
            </p>
            <h2>Processing Time</h2>
            <p>
              Approved refunds are typically processed within 5–10 business days to the original payment method, subject to your bank's processing times.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
