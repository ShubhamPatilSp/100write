'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  MdDashboard,
  MdOutlineScreenSearchDesktop,
} from 'react-icons/md';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FaUserCheck } from 'react-icons/fa';
import { GiMagicSwirl } from 'react-icons/gi';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FiXSquare, FiX } from 'react-icons/fi';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', icon: <MdDashboard size={20} />, label: 'Dashboard' },
    { href: '/dashboard/documents', icon: <IoDocumentTextOutline size={20} />, label: 'Documents' },
  ];

  const toolLinks = [
    { href: '/dashboard/ai-detector', icon: <MdOutlineScreenSearchDesktop size={20} />, label: 'AI Detector' },
    { href: '/dashboard/ai-humanizer', icon: <FaUserCheck size={20} />, label: 'AI Humanizer' },
    { href: '/dashboard/ai-generator', icon: <GiMagicSwirl size={20} />, label: 'AI Generator' },
  ];

  const activeLinkClasses = 'bg-orange-600 text-white';
  const inactiveLinkClasses = 'text-gray-400 hover:bg-gray-700';

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      ></div>

      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-[#1A1A1A] text-white flex flex-col p-5 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold hover:text-orange-400 transition-colors">100 Write</h1>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1">
          <ul>
            {navLinks.map(link => (
              <li key={link.href} className="mb-3">
                <Link href={link.href} className={`flex items-center py-2.5 px-4 rounded-lg font-semibold text-sm ${pathname === link.href ? activeLinkClasses : inactiveLinkClasses}`}>
                  {link.icon}
                  <span className="ml-4">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <h2 className="text-xs text-gray-500 uppercase tracking-wider mb-4 px-4">AI Tools</h2>
            <ul>
              {toolLinks.map(link => (
                <li key={link.href} className="mb-3">
                  <Link href={link.href} className={`flex items-center py-2.5 px-4 rounded-lg font-semibold text-sm ${pathname === link.href ? activeLinkClasses : inactiveLinkClasses}`}>
                    {link.icon}
                    <span className="ml-4">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="mt-auto space-y-4">
          <div className="p-4 bg-[#FE5A23] text-white rounded-lg text-left font-body">
            <FiXSquare className="h-7 w-7 mb-2" />
            <h3 className="font-bold text-sm">Free Limit reached</h3>
            <p className="text-xs mt-1 mb-3">Upgrade to get unlimited Access to our features</p>
            <Link href="/dashboard/settings" className="bg-white text-black font-bold py-2 px-4 rounded-lg w-full inline-block text-center text-sm">
              Upgrade Now &rarr;
            </Link>
          </div>

          {session && (
            <div className="relative">
              {dropdownOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-[#2a2a2a] rounded-lg shadow-lg py-1">
                  <Link href="/dashboard/settings" className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                    Account Settings
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              )}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full p-2 flex justify-between items-center hover:bg-gray-700 rounded-lg text-left"
              >
                <div>
                  <p className="text-sm font-semibold">{session.user?.name || session.user?.email}</p>
                  {session.user?.name && <p className="text-xs text-gray-400">{session.user?.email}</p>}
                </div>
                {dropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
