'use client';

import React from 'react';
import { FiMenu } from 'react-icons/fi';
import Link from 'next/link';

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="lg:hidden bg-white sticky top-0 z-30">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/dashboard">
          <h1 className="text-xl font-bold text-gray-800">100 Write</h1>
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Open sidebar"
        >
          <FiMenu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
