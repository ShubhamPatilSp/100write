'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (e) {
      // ignore
    }
  };

  const navLinks = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#FFF7F2] pt-4"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center">
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <span className="bg-white text-primary font-bold px-3 py-1.5 border-r border-gray-200 font-heading">100</span>
              <span className="bg-primary text-white font-bold px-3 py-1.5 font-heading">Write</span>
            </div>
          </div>
        </Link>

        {/* Navigation Menu */}
        {session && (
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium text-sm hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-gray-700'}`}>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover font-body">
                Dashboard
              </Link>
              <button 
                onClick={handleSignOut}
                className="text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                Log In
              </Link>
              <Link href="/signup" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover font-body">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
