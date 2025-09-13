import Features from "@/components/Features";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Netcurion Technology",
  description:
    "Explore Netcurion Technology services: Managed SOC & SIEM, Cloud-Native Engineering, DevOps Automation, Modern App Development, and more.",
  openGraph: {
    title: "Services | Netcurion Technology",
    description:
      "Managed SOC, Cloud Engineering, DevOps Automation, and Modern App Development from Netcurion Technology.",
    images: [
      {
        url: "/images/og/services.svg",
        width: 1200,
        height: 630,
        alt: "Netcurion Technology Services",
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <Breadcrumb
        pageName="Our Services"
        description="Secure, scalable solutions across cybersecurity, cloud, DevOps and modern product engineering."
      />
      <Features />
    </>
  );
}
