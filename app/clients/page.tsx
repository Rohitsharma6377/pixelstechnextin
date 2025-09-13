import Breadcrumb from "@/components/Common/Breadcrumb";
import Brands from "@/components/Brands";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients | Netcurion Technology",
  description:
    "A selection of clients who trust Netcurion Technology for cybersecurity, cloud, DevOps, and software engineering.",
  openGraph: {
    title: "Clients | Netcurion Technology",
    description:
      "Brands and teams that trust Netcurion Technology.",
    images: [
      { url: "/images/og/clients.svg", width: 1200, height: 630, alt: "Netcurion Clients" },
    ],
  },
};

export default function ClientsPage() {
  return (
    <>
      <Breadcrumb
        pageName="Our Clients"
        description="Great teams partner with us to secure and scale their platforms."
      />
      <Brands />
    </>
  );
}
