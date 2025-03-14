"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaRocket, FaStar, FaGlobeAmericas, FaSpaceShuttle, FaNewspaper, FaArrowRight } from 'react-icons/fa';
import NasaApod from '@/components/ui/NasaApod';
import SimpleIssTracker from '@/components/iss-tracker/SimpleIssTracker';

const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  href, 
  color = "indigo" 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  href: string; 
  color?: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3), 0 0 10px rgba(79, 70, 229, 0.5)' }}
      className="hover-card bg-black/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl overflow-hidden"
    >
      <Link href={href} className="block p-6">
        <div className={`w-12 h-12 rounded-full bg-${color}-900/20 flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 glow-text">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="flex items-center text-indigo-400 font-medium">
          <span>Explore</span>
          <FaArrowRight className="ml-2" />
        </div>
      </Link>
    </motion.div>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
            >
              Embark on a Journey Through the Cosmos
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              Track celestial events, explore the stars, and stay connected with the universe through dynamic visualizations and up-to-the-minute data.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link 
                href="/celestial-events" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 glow-button"
              >
                View Celestial Events
              </Link>
              <Link 
                href="/star-map" 
                className="bg-transparent border border-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-900/20 transition-colors duration-200"
              >
                Explore Star Map
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Animated background elements */}
        {mounted && (
          <>
            <motion.div 
              className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-indigo-900/10 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-10 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            />
          </>
        )}
      </section>

      {/* NASA APOD Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-6 glow-text">NASA Astronomy Picture of the Day</h2>
                  <p className="text-gray-300 mb-6">
                    Each day, NASA features a different image or photograph of our fascinating universe, along with a brief explanation written by a professional astronomer.
                  </p>
                  <a 
                    href="https://www.nasa.gov/stem-content/astronomy-picture-of-the-day/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center transition-colors duration-200"
                  >
                    <span>View on NASA</span>
                    <FaArrowRight className="ml-2" />
                  </a>
                </motion.div>
              </div>
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl overflow-hidden shadow-lg hover-card"
                >
                  <NasaApod />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ISS Tracker Section */}
      <section className="py-16 bg-indigo-900/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse gap-8">
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-6 glow-text">International Space Station Tracker</h2>
                  <p className="text-gray-300 mb-6">
                    Track the International Space Station in real-time as it orbits the Earth at approximately 28,000 km/h. The ISS completes an orbit around Earth every 90 minutes.
                  </p>
                  <Link 
                    href="/iss-tracker" 
                    className="text-indigo-400 hover:text-indigo-300 flex items-center transition-colors duration-200"
                  >
                    <span>View Detailed ISS Tracker</span>
                    <FaArrowRight className="ml-2" />
                  </Link>
                </motion.div>
              </div>
              <div className="w-full md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-xl overflow-hidden shadow-lg hover-card"
                >
                  <SimpleIssTracker />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-6 glow-text">Explore the Universe</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Discover the wonders of space through our interactive tools and real-time data visualizations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <FeatureCard
                  title="Celestial Events"
                  description="Stay updated with upcoming celestial events like meteor showers, eclipses, and planetary alignments."
                  icon={<FaStar className="text-yellow-400 text-2xl" />}
                  href="/celestial-events"
                  color="yellow"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FeatureCard
                  title="Interactive Star Map"
                  description="Explore the night sky with our interactive 3D star map featuring constellations, planets, and stars."
                  icon={<FaGlobeAmericas className="text-blue-400 text-2xl" />}
                  href="/star-map"
                  color="blue"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <FeatureCard
                  title="ISS Tracker"
                  description="Track the International Space Station in real-time and find out when it will pass over your location."
                  icon={<FaSpaceShuttle className="text-indigo-400 text-2xl" />}
                  href="/iss-tracker"
                  color="indigo"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:col-span-2 lg:col-span-3"
              >
                <FeatureCard
                  title="Space News"
                  description="Stay informed with the latest news and discoveries in space exploration, astronomy, and astrophysics."
                  icon={<FaNewspaper className="text-pink-400 text-2xl" />}
                  href="/news"
                  color="pink"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
