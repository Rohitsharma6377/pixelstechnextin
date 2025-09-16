// import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Blog from "@/components/Blog";
import Brands from "@/components/Brands";
import { FocusCardsDemo } from "@/components/card/Card";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Video from "@/components/Video";
import WhyUs from "@/components/WhyUs";
import TechSlider from "@/components/TechSlider";
// import Video from "@/components/Video";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Netcurion Technology | Cybersecurity, Cloud & Modern Software Engineering",
  description:
    "Netcurion Technology delivers secure, scalable solutions—from managed SOC and SIEM to cloud-native development, DevOps automation, and high-performance Next.js apps.",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <TechSlider />
      <Features />
      {/* <FocusCardsDemo/> */}
      <Video />
      {/* <Brands /> */}
      <AboutSectionOne />
      <AboutSectionTwo />
      <WhyUs />
      <Testimonials />
      {/* <Pricing /> */}
      <Blog />
      <Contact />
    </>
  );
}
