"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaRocket,
  FaStar,
  FaGlobeAmericas,
  FaSpaceShuttle,
  FaNewspaper,
  FaArrowUp,
} from "react-icons/fa";

// Pre-generate random positions for stars with deterministic values to avoid hydration mismatch
const generateStarPositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    top: `${(i * 13) % 100}%`,
    left: `${(i * 17) % 100}%`,
    size: (i % 3) + 1,
    animationDelay: `${i % 5}s`,
  }));
};

const starPositions = generateStarPositions(30);
const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative mt-20 bg-black/80 backdrop-blur-md border-t border-indigo-900/30">
      {/* Animated stars - only render client-side */}
      {mounted && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {starPositions.map((star, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: parseFloat(star.animationDelay),
              }}
            />
          ))}
        </div>
      )}

      {/* Scroll to top button - fixed position */}
      {mounted && showScrollButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-[9999] w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors duration-300"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 15px rgba(79, 70, 229, 0.7)",
          }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowUp size={20} />
        </motion.button>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 10 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FaRocket className="text-indigo-500 text-2xl" />
              </motion.div>
              <span className="text-xl font-bold gradient-text">
                EclipsoTrack
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Your gateway to the cosmos. Track celestial events, explore the
              stars, and stay updated with the latest in space exploration.
            </p>
            <div className="flex space-x-5 mb-6">
              <motion.a
                href="https://github.com/binayakbartaula11"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, rotate: 5, color: "#ffffff" }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub size={22} />
              </motion.a>
              <motion.a
                href="https://x.com/BartaulaBinayak"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, rotate: 5, color: "#1DA1F2" }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter size={22} />
              </motion.a>
              {/* <motion.a
                href="https://instagram.com/binayak_bartaula"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, rotate: 5, color: "#E1306C" }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram size={22} />
              </motion.a> */}
              <motion.a
                href="https://linkedin.com/in/binayakbartaula"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, rotate: 5, color: "#0077B5" }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin size={22} />
              </motion.a>
              <motion.a
                href="https://binayakio.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                whileHover={{ scale: 1.2, rotate: 5, color: "#34b7f1" }} // Color for globe icon on hover
                whileTap={{ scale: 0.9 }}
              >
                <FaGlobe size={22} />
              </motion.a>
            </div>
          </div>

          <div className="md:col-span-3 md:ml-auto">
            <h3 className="text-white font-semibold mb-4 glow-text">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <FaRocket className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/celestial-events"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <FaStar className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Celestial Events
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/star-map"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <FaGlobeAmericas className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Star Map
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/iss-tracker"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <FaSpaceShuttle className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    ISS Tracker
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                >
                  <FaNewspaper className="text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    Space News
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-white font-semibold mb-4 glow-text">
              Space Industry Leaders
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-2 bg-indigo-500 rounded-full mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  NASA
                </a>
              </li>
              <li>
                <a
                  href="https://www.spacex.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-2 bg-indigo-500 rounded-full mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  SpaceX
                </a>
              </li>
              <li>
                <a
                  href="https://www.blueorigin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-2 bg-indigo-500 rounded-full mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Blue Origin
                </a>
              </li>
              <li>
                <a
                  href="https://www.cnsa.gov.cn/english/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-2 bg-indigo-500 rounded-full mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  China National Space Administration
                </a>
              </li>
              <li>
                <a
                  href="https://www.virgingalactic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-2 bg-indigo-500 rounded-full mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Virgin Galactic
                </a>
              </li>
              <li>
                <a
                  href="https://www.esa.int/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-2 bg-indigo-500 rounded-full mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  European Space Agency
                </a>
              </li>
              <li>
                <a
                  href="https://www.arianespace.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 group flex items-center"
                >
                  <span className="w-0 group-hover:w-2 h-2 bg-indigo-500 rounded-full mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  Arianespace
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-indigo-900/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} EclipsoTrack. All rights reserved.
            </p>
            {/* <div className="flex items-center">
              {mounted && (
                <motion.button
                  onClick={scrollToTop}
                  className="text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowUp size={12} className="ml-1" />
                </motion.button>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
