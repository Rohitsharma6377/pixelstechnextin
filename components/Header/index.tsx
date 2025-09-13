"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { useAuth } from "@/app/auth-context";
import { useRouter } from "next/navigation";

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  const usePathName = usePathname();
  const { user, loading, logout } = useAuth();
  const role = user?.role?.toLowerCase();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const toggleUserMenu = () => setUserMenuOpen((v) => !v);
  const onLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <header
        className={`header fixed left-0 top-0 z-[9999] w-full transition-all duration-300 ${
          sticky ? "bg-transparent" : "bg-transparent"
        }`}
      >
        <div className="container">
          {/* Nav shell */}
          <div
            className={`mt-3 flex items-center justify-between rounded-2xl border border-slate-900/5 bg-slate-100/70 px-3 py-2 shadow-md ring-1 ring-black/5 backdrop-blur md:px-5 lg:mt-5 dark:border-white/10 dark:bg-white/5 dark:ring-white/10`}
          >
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link href="/" className="header-logo flex items-center gap-3 py-2 lg:py-1">
                <Image
                  src="/images/logo/logo.jpeg"
                  alt="Netcurion Tech Pvt. Ltd. logo"
                  width={140}
                  height={40}
                  priority
                  className="h-9 w-auto"
                />
                {/* <span className="sr-only">Netcurion Tech Pvt. Ltd.</span> */}
                <div className="leading-tight">
                  <div className="text-sm font-extrabold text-indigo-700 dark:text-indigo-400">Netcurion</div>
                  <div className="text-sm font-semibold text-indigo-700/90 dark:text-indigo-300">Technology</div>
                </div>
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[7px] rotate-45" : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? "opacity-0 " : " "
                    }`}
                  />
                  <span
                    className={`relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white ${
                      navbarOpen ? " top-[-8px] -rotate-45" : " "
                    }`}
                  />
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 dark:border-body-color/20 dark:bg-[#0b1220] lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visibility top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12">
                    {menuData.map((menuItem, index) => (
                      <li key={index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            className={`flex py-2 text-base font-medium lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                              usePathName === menuItem.path
                                ? "text-indigo-700 font-semibold dark:text-indigo-400"
                                : "text-slate-700 hover:text-indigo-700 dark:text-white/80 dark:hover:text-white"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              className="flex cursor-pointer items-center justify-between py-2 text-base text-dark group-hover:text-primary dark:text-white/70 dark:group-hover:text-white lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg width="25" height="24" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 dark:bg-dark lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu.map((submenuItem, index) => (
                                <Link
                                  href={submenuItem.path}
                                  key={index}
                                  className="block rounded py-2.5 text-sm text-dark hover:text-primary dark:text-white/70 dark:hover:text-white lg:px-3"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                    {!!user && (
                      <li className="group relative">
                        <Link
                          href="/upload"
                          className={`flex py-2 text-base font-medium lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            usePathName === "/upload"
                              ? "text-indigo-700 font-semibold dark:text-indigo-400"
                              : "text-slate-700 hover:text-indigo-700 dark:text-white/80 dark:hover:text-white"
                          }`}
                        >
                          Upload
                        </Link>
                      </li>
                    )}
                    {!!user && role === "admin" && (
                      <li className="group relative">
                        <Link
                          href="/admin"
                          className={`flex py-2 text-base font-medium lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            usePathName === "/admin"
                              ? "text-indigo-700 font-semibold dark:text-indigo-400"
                              : "text-slate-700 hover:text-indigo-700 dark:text-white/80 dark:hover:text-white"
                          }`}
                        >
                          Admin
                        </Link>
                      </li>
                    )}
                    {!!user && role === "admin" && (
                      <li className="group relative">
                        <Link
                          href="/blog/new"
                          className={`flex py-2 text-base font-medium lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                            usePathName === "/blog/new"
                              ? "text-indigo-700 font-semibold dark:text-indigo-400"
                              : "text-slate-700 hover:text-indigo-700 dark:text-white/80 dark:hover:text-white"
                          }`}
                        >
                          New Post
                        </Link>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
              {/* Inline actions for md+ screens */}
              {!!user && role === "ADMIN" && (
                <button
                  type="button"
                  onClick={() => router.push("/admin")}
                  className="hidden rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 md:inline-flex"
                >
                  Dashboard
                </button>
              )}
              {!!user && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="hidden rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 md:inline-flex"
                >
                  Logout
                </button>
              )}

              {/* Mobile profile menu (icon + dropdown) */}
              {!!user && (
                <div className="relative md:hidden" tabIndex={0} onBlur={() => setUserMenuOpen(false)}>
                  <button
                    type="button"
                    onClick={toggleUserMenu}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white"
                    aria-label="User menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M12 2.25a5.25 5.25 0 0 0-3.712 8.988 8.25 8.25 0 1 0 7.424 0A5.25 5.25 0 0 0 12 2.25Zm0 1.5a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5ZM6.75 19.5a5.25 5.25 0 0 1 10.5 0v.75h-10.5v-.75Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-md border border-white/10 bg-white py-1 text-sm shadow-lg dark:bg-slate-900">
                      {role === "admin" && (
                        <button
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                          onClick={() => {
                            setUserMenuOpen(false);
                            router.push("/admin");
                          }}
                        >
                          Dashboard
                        </button>
                      )}
                      <button
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-white/5"
                        onClick={onLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
