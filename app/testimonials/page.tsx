import Breadcrumb from "@/components/Common/Breadcrumb";
import Testimonials from "@/components/Testimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials | Netcurion Technology",
  description:
    "What our customers say about partnering with Netcurion Technology for secure, modern software delivery.",
  openGraph: {
    title: "Testimonials | Netcurion Technology",
    description:
      "Customer success stories with Netcurion Technology.",
    images: [
      { url: "/images/og/testimonials.svg", width: 1200, height: 630, alt: "Netcurion Testimonials" },
    ],
  },
};

export default function TestimonialsPage() {
  return (
    <>
      <Breadcrumb
        pageName="Testimonials"
        description="Real outcomes from real teams — security improved, delivery accelerated."
      />
      <Testimonials />
    </>
  );
}
