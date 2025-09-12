import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Netcurion Tech Pvt. Ltd.",
  description: "This is About Page for Netcurion Tech Pvt. Ltd.",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Us "
        description="At Netcurion Tech Pvt. Ltd. we are a team of passionate technologists and innovators dedicated to transforming ideas into cutting-edge software solutions. Founded in [Year], our company has grown from a small startup into a leading provider of software services, recognized for our commitment to quality, innovation, and customer satisfaction."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
