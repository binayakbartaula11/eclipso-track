"use client";

import React from 'react';
import Layout from '@/components/layout/Layout';
import InteractiveStarMap from '@/components/star-map/InteractiveStarMap';
import { FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';

export default function StarMapPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 glow-text">Interactive Star Map</h1>
        
        <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30 mb-8">
          <p className="text-gray-300">
            Explore the night sky in real-time with our interactive 3D star map. 
            Zoom, rotate, and discover celestial objects including stars, planets, and constellations.
            <span className="block mt-2 text-sm">
              <FaInfoCircle className="inline-block mr-2 text-indigo-400" />
              Use your mouse to rotate the view, scroll to zoom in/out, and drag to pan around.
            </span>
          </p>
        </div>
        
        {/* Interactive 3D Star Map */}
        <InteractiveStarMap />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-indigo-900/10 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
            <h3 className="text-xl font-semibold mb-3">Stars</h3>
            <p className="text-gray-400 mb-4">
              Explore thousands of stars with detailed information about their distance, magnitude, and constellation.
            </p>
            <a 
              href="https://science.nasa.gov/universe/stars/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              Learn more <FaExternalLinkAlt size={12} />
            </a>
          </div>
          
          <div className="bg-indigo-900/10 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
            <h3 className="text-xl font-semibold mb-3">Planets</h3>
            <p className="text-gray-400 mb-4">
              Track the positions of planets in our solar system and learn about their current location in the night sky.
            </p>
            <a 
              href="https://science.nasa.gov/solar-system/planets/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              Explore planets <FaExternalLinkAlt size={12} />
            </a>
          </div>
          
          <div className="bg-indigo-900/10 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
            <h3 className="text-xl font-semibold mb-3">Constellations</h3>
            <p className="text-gray-400 mb-4">
              Discover the 88 official constellations and learn about their mythology and the stars that form them.
            </p>
            <a 
              href="https://www.tumblr.com/nasa/150688852794/zodiac" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              View constellations <FaExternalLinkAlt size={12} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 bg-indigo-900/10 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
          <h3 className="text-xl font-semibold mb-4">NASA Star and Planet Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a 
              href="https://eyes.nasa.gov/apps/solar-system/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300 flex flex-col"
            >
              <h4 className="text-lg font-semibold mb-2">NASA's Eyes on the Solar System</h4>
              <p className="text-gray-400 text-sm mb-4">
                An interactive 3D visualization of the solar system, planets, and NASA missions.
              </p>
              <span className="text-indigo-400 mt-auto inline-flex items-center gap-1">
                Visit <FaExternalLinkAlt size={12} />
              </span>
            </a>
            
            <a 
              href="https://science.nasa.gov/skywatching/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300 flex flex-col"
            >
              <h4 className="text-lg font-semibold mb-2">NASA Sky Watching</h4>
              <p className="text-gray-400 text-sm mb-4">
                Find out what's up in the night sky and when to see it with NASA's sky watching guide.
              </p>
              <span className="text-indigo-400 mt-auto inline-flex items-center gap-1">
                Visit <FaExternalLinkAlt size={12} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
} 