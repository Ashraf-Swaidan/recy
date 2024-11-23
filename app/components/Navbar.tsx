"use client";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const { isLoaded, userId } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // In case the user signs out while on the page.
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="">
      <nav className="flex items-center justify-between py-4 px-6">
        {/* Logo and Links */}
        <div className="flex items-center gap-7">
          <Image src="/RecyLogo.svg" alt="Recy logo" width={80} height={80} />

          {/* Desktop Links */}
          <div className="hidden md:flex gap-7">
            <Link href="/">
              <div
                className={`${
                  pathname === "/" ? "font-bold text-orange-600" : "text-stone-600"
                } `}
              >
                Home
              </div>
            </Link>
            <Link href="/create-recipe">
              <div
                className={`${
                  pathname === "/create-recipe"
                    ? "font-bold text-orange-600"
                    : "text-stone-600"
                } `}
              >
                Create Recipe
              </div>
            </Link>
            <Link href="/MyCookbook">
              <div
                className={`${
                  pathname === "/MyCookbook"
                    ? "font-bold text-orange-600"
                    : "text-stone-600"
                } `}
              >
                My Cookbook
              </div>
            </Link>

            {/* Login and Signup links for desktop if user is signed out */}
            {!userId && (
              <>
                <Link href="/sign-in">
                  <div
                    className={`${
                      pathname === "/sign-in"
                        ? "font-bold text-orange-600"
                        : "text-stone-600"
                    } `}
                  >
                    Login
                  </div>
                </Link>
                <Link href="/sign-up">
                  <div
                    className={`${
                      pathname === "/sign-up"
                        ? "font-bold text-orange-600"
                        : "text-stone-600"
                    } `}
                  >
                    Sign Up
                  </div>
                </Link>
              </>
            )}
            
          </div>
        </div>

        {/* Right-side Links and Mobile Menu Icons */}
        <div className="flex items-center gap-6">
          {/* UserButton for Mobile and Desktop */}
          {userId ? (
            <div className="flex items-center">
              <UserButton />
            </div>
          ) : null}

          {/* Hamburger Icon for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-50 shadow-md flex flex-col items-center gap-4 p-4">
          <Link href="/">
            <div
              className={`${
                pathname === "/" ? "font-bold text-stone-800" : "text-stone-600"
              } hover:text-stone-800 transition duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </div>
          </Link>
          <Link href="/create-recipe">
            <div
              className={`${
                pathname === "/create-recipe"
                  ? "font-bold text-stone-800"
                  : "text-stone-600"
              } hover:text-stone-800 transition duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              Create Recipe
            </div>
          </Link>
          <Link href="/MyCookbook">
            <div
              className={`${
                pathname === "/MyCookbook"
                  ? "font-bold text-stone-800"
                  : "text-stone-600"
              } hover:text-stone-800 transition duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Cookbook
            </div>
          </Link>

          {/* Login and Signup links for mobile if user is signed out */}
          {!userId ? (
            <>
              <Link href="/sign-in">
                <div
                  className={`${
                    pathname === "/sign-in"
                      ? "font-bold text-stone-800"
                      : "text-stone-600"
                  } hover:text-stone-800 transition duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </div>
              </Link>
              <Link href="/sign-up">
                <div
                  className={`${
                    pathname === "/sign-up"
                      ? "font-bold text-stone-800"
                      : "text-stone-600"
                  } hover:text-stone-800 transition duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </div>
              </Link>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Navbar;
