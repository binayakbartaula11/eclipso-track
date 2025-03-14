"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaMoon, FaSun, FaRocket, FaStar, FaGlobeAmericas, FaSpaceShuttle, FaNewspaper } from 'react-icons/fa';
import { MenuItem } from '@/types';

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: <FaRocket className="text-indigo-400" />,
  },
  {
    id: 'celestial-events',
    label: 'Celestial Events',
    href: '/celestial-events',
    icon: <FaStar className="text-indigo-400" />,
  },
  {
    id: 'star-map',
    label: 'Star Map',
    href: '/star-map',
    icon: <FaGlobeAmericas className="text-indigo-400" />,
  },
  {
    id: 'iss-tracker',
    label: 'ISS Tracker',
    href: '/iss-tracker',
    icon: <FaSpaceShuttle className="text-indigo-400" />,
  },
  {
    id: 'news',
    label: 'Space News',
    href: '/news',
    icon: <FaNewspaper className="text-indigo-400" />,
  },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeItem, setActiveItem] = useState('home');
  const [mounted, setMounted] = useState(false);

  // Only run client-side code after mounting
  useEffect(() => {
    setMounted(true);
    
    // Check if light mode is already enabled
    const isLightMode = document.documentElement.classList.contains('light-mode');
    setIsDarkMode(!isLightMode);
    
    // Update active menu item based on current path
    const path = window.location.pathname;
    const currentPath = path === '/' ? 'home' : path.slice(1);
    
    // Find the matching menu item
    const matchedItem = menuItems.find(item => 
      item.href === '/' ? currentPath === 'home' : item.href.includes(currentPath)
    );
    
    if (matchedItem) {
      setActiveItem(matchedItem.id);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-mode');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-indigo-900/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 z-10">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              className="relative"
            >
              <FaRocket className="text-indigo-500 text-2xl" />
              <motion.div 
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.6) 0%, rgba(79,70,229,0) 70%)' }}
              />
            </motion.div>
            <span className="text-xl font-bold gradient-text">EclipsoTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`transition-all duration-300 flex items-center gap-2 py-2 px-3 rounded-md ${
                  activeItem === item.id 
                    ? 'text-white font-medium bg-indigo-900/20 border-b-2 border-indigo-500' 
                    : 'text-gray-300 hover:text-white hover:bg-indigo-900/10'
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                {item.icon}
                {item.label}
                {activeItem === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            {mounted && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/40 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-full bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/40 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 py-4 border-t border-indigo-900/30 overflow-hidden"
            >
              <nav className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`transition-colors duration-200 flex items-center gap-3 p-3 rounded-md ${
                      activeItem === item.id 
                        ? 'text-white font-medium bg-indigo-900/20 border-l-2 border-indigo-500' 
                        : 'text-gray-300 hover:text-white hover:bg-indigo-900/10'
                    }`}
                    onClick={() => {
                      setActiveItem(item.id);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header; 