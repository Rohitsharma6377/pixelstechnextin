import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "The Future of Web Development: Trends to Watch in 2024",
    paragraph:
      "Explore the latest trends in web development, from AI-powered tools to WebAssembly and the rise of edge computing. Learn how these technologies are shaping the future of web applications.",
    image: "/images/blog/blog-01.jpg",
    author: {
      name: "Sarah Johnson",
      image: "/images/blog/author-01.png",
      designation: "Senior Web Developer",
    },
    tags: ["Web Development", "Technology"],
    publishDate: "2024",
  },
  {
    id: 2,
    title: "Mastering React Performance Optimization",
    paragraph:
      "Discover essential techniques for optimizing React applications, including code splitting, memoization, and virtual DOM optimization. Learn how to build faster, more efficient React applications.",
    image: "/images/blog/blog-02.jpg",
    author: {
      name: "Michael Chen",
      image: "/images/blog/author-02.png",
      designation: "React Specialist",
    },
    tags: ["React", "Performance"],
    publishDate: "2024",
  },
  {
    id: 3,
    title: "Building Scalable Microservices Architecture",
    paragraph:
      "Learn the best practices for designing and implementing microservices architecture. From service discovery to API gateways, understand how to build robust and scalable distributed systems.",
    image: "/images/blog/blog-03.jpg",
    author: {
      name: "Emily Rodriguez",
      image: "/images/blog/author-03.png",
      designation: "System Architect",
    },
    tags: ["Microservices", "Architecture"],
    publishDate: "2024",
  },
];
export default blogData;
