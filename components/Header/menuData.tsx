import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    path: "/about",
    newTab: false,
  },
  {
    id: 21,
    title: "Services",
    path: "/services",
    newTab: false,
  },
  {
    id: 22,
    title: "Clients",
    path: "/clients",
    newTab: false,
  },
  {
    id: 23,
    title: "Testimonials",
    path: "/testimonials",
    newTab: false,
  },
  {
    id: 33,
    title: "Blog",
    path: "/blog",
    newTab: false,
  },
  {
    id: 3,
    title: "Support",
    path: "/contact",
    newTab: false,
  },
  {
    id: 4,
    title: "Pages",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "About Page",
        path: "/about",
        newTab: false,
      },
      {
        id: 42,
        title: "Contact Page",
        path: "/contact",
        newTab: false,
      },
      {
        id: 43,
        title: "All Blog",
        path: "/blog",
        newTab: false,
      },
      
      {
        id: 45,
        title: "Blog Details",
        path: "/blog-details",
        newTab: false,
      },
      {
        id: 46,
        title: "Privacy Policy",
        path: "/privacy-policy",
        newTab: false,
      },
      {
        id: 47,
        title: "Refund Policy",
        path: "/refund-policy",
        newTab: false,
      },
      {
        id: 48,
        title: "Terms of Service",
        path: "/tos",
        newTab: false,
      },
      
    ],
  },
];
export default menuData;
