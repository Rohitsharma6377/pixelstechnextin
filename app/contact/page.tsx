import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Netcurion Technology | Talk to Our Experts",
  description:
    "Get in touch with Netcurion Technology for cybersecurity, cloud, DevOps, and software engineering services. Request a consultation or support—our team will respond quickly.",
  keywords: [
    "Netcurion Technology",
    "contact",
    "cybersecurity",
    "cloud",
    "DevOps",
    "Next.js",
    "managed IT",
  ],
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Netcurion Technology"
        description="Speak with our team about managed SOC, cloud security, DevOps automation, and modern app development. We’ll respond promptly to your request."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
