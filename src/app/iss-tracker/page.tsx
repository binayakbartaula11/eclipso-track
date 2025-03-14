"use client";

import React, { useState } from 'react';
import { FaSpaceShuttle, FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt, FaInfoCircle, FaUsers, FaRuler, FaWeight, FaLightbulb, FaFlask, FaGlobe, FaTools } from 'react-icons/fa';
import ISSMap from '@/components/iss-tracker/ISSMap';
import { motion } from 'framer-motion';

interface PassTime {
  duration: number;
  risetime: number;
}

interface ISSFact {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ISSTrackerPage = () => {
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [passes, setPasses] = useState<PassTime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasses, setShowPasses] = useState<boolean>(false);
  const [expandedFact, setExpandedFact] = useState<number | null>(null);

  const issFacts: ISSFact[] = [
    {
      icon: <FaInfoCircle className="text-indigo-400 text-xl" />,
      title: "Purpose",
      description: "It serves as a microgravity and space environment research laboratory where scientific research is conducted in astrobiology, astronomy, meteorology, physics, and other disciplines."
    },
    {
      icon: <FaRuler className="text-indigo-400 text-xl" />,
      title: "Size",
      description: "The ISS is the size of a football field (109 meters or 357 feet in length) and weighs around 420,000 kg (925,000 lbs). Its solar arrays alone are large enough to cover two tennis courts."
    },
    {
      icon: <FaTools className="text-indigo-400 text-xl" />,
      title: "Construction",
      description: "The ISS was launched and assembled in pieces starting in 1998. It has been continuously inhabited since November 2000."
    },
    {
      icon: <FaUsers className="text-indigo-400 text-xl" />,
      title: "Crew",
      description: "The ISS typically houses 6 astronauts at any given time, although it can support up to 10 during crew rotations or special missions. Astronauts from various countries live and work on the station for approximately 6 months at a time."
    },
    {
      icon: <FaWeight className="text-indigo-400 text-xl" />,
      title: "Microgravity",
      description: "The ISS provides an environment where the effects of gravity are extremely reduced, allowing scientists to conduct experiments that are impossible to replicate on Earth."
    },
    {
      icon: <FaLightbulb className="text-indigo-400 text-xl" />,
      title: "Power",
      description: "The ISS is powered by large solar arrays, which convert sunlight into electricity to support its operations and research."
    },
    {
      icon: <FaFlask className="text-indigo-400 text-xl" />,
      title: "Research Impact",
      description: "More than 2,800 scientific experiments in a wide range of fields have been conducted on the ISS, contributing to advancements in medicine, technology, and our understanding of space and Earth."
    },
    {
      icon: <FaGlobe className="text-indigo-400 text-xl" />,
      title: "Global Connectivity",
      description: "The ISS is continuously visible from the surface of Earth, and its position can be tracked in real time via various tracking websites and apps."
    }
  ];

  const handleFindPasses = async () => {
    if (!latitude || !longitude) {
      setError('Please enter both latitude and longitude.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      
      if (data.message === 'success') {
        setPasses(data.response);
        setShowPasses(true);
      } else {
        setError('Failed to fetch ISS pass times. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching ISS pass times:', error);
      setError('An error occurred while fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setError(null);
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const formatPassTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const toggleFact = (index: number) => {
    if (expandedFact === index) {
      setExpandedFact(null);
    } else {
      setExpandedFact(index);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 glow-text">International Space Station Tracker</h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Track the International Space Station in real-time as it orbits Earth at approximately 28,000 km/h. 
            The ISS completes an orbit around Earth every 90 minutes, traveling at an altitude of about 400 kilometers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-indigo-900/30">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaSpaceShuttle className="mr-2 text-indigo-400" />
                  Live ISS Tracker
                </h2>
              </div>
              <ISSMap />
            </div>
          </div>

          <div>
            <div className="bg-black/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl overflow-hidden shadow-lg mb-8">
              <div className="p-4 border-b border-indigo-900/30">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaCalendarAlt className="mr-2 text-indigo-400" />
                  Find ISS Pass Times
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4">
                  Enter your coordinates to find out when the ISS will pass over your location.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="latitude" className="block text-gray-300 mb-1">Latitude</label>
                    <input
                      type="text"
                      id="latitude"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g. 40.7128"
                      className="w-full bg-indigo-900/10 border border-indigo-900/30 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="longitude" className="block text-gray-300 mb-1">Longitude</label>
                    <input
                      type="text"
                      id="longitude"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g. -74.0060"
                      className="w-full bg-indigo-900/10 border border-indigo-900/30 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleGetLocation}
                      className="flex items-center justify-center bg-indigo-900/50 hover:bg-indigo-900/70 text-white px-4 py-2 rounded-md transition-colors duration-200"
                    >
                      <FaMapMarkerAlt className="mr-2" />
                      Use My Location
                    </button>
                    
                    <button
                      onClick={handleFindPasses}
                      disabled={loading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Find Passes'}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}
                </div>
              </div>
            </div>

            {showPasses && passes.length > 0 && (
              <div className="bg-black/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl overflow-hidden shadow-lg mb-8">
                <div className="p-4 border-b border-indigo-900/30">
                  <h2 className="text-xl font-semibold">Upcoming ISS Passes</h2>
                </div>
                <div className="p-4">
                  <ul className="space-y-4">
                    {passes.map((pass, index) => (
                      <li key={index} className="border-b border-indigo-900/30 last:border-b-0 pb-3 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-indigo-400">{formatPassTime(pass.risetime)}</p>
                            <p className="text-sm text-gray-400">Duration: {formatDuration(pass.duration)}</p>
                          </div>
                          <div className="bg-indigo-900/30 text-xs px-2 py-1 rounded-full">
                            Pass #{index + 1}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ISS Facts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center glow-text">ISS Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {issFacts.map((fact, index) => (
              <motion.div
                key={index}
                className={`bg-black/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl overflow-hidden shadow-lg hover-card cursor-pointer ${expandedFact === index ? 'md:col-span-2 lg:col-span-4' : ''}`}
                onClick={() => toggleFact(index)}
                layout
                transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
              >
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    {fact.icon}
                    <h3 className="text-lg font-semibold ml-2">{fact.title}</h3>
                  </div>
                  <motion.p 
                    className="text-gray-300"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expandedFact === index 
                      ? fact.description 
                      : fact.description.length > 100 
                        ? `${fact.description.substring(0, 100)}...` 
                        : fact.description}
                  </motion.p>
                  {fact.description.length > 100 && (
                    <button 
                      className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFact(index);
                      }}
                    >
                      {expandedFact === index ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-black/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-indigo-900/30">
              <h2 className="text-xl font-semibold">About the ISS</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                The International Space Station (ISS) is a modular space station in low Earth orbit. It's a multinational collaborative project involving NASA, Roscosmos, JAXA, ESA, and CSA.
              </p>
              <p className="text-gray-300 mb-4">
                The ISS serves as a microgravity and space environment research laboratory where scientific research is conducted in astrobiology, astronomy, meteorology, physics, and other fields. It&apos;s also used to test spacecraft systems and equipment required for future long-duration missions to the Moon and Mars.
              </p>
              <p className="text-gray-300">
                The station is divided into two sections: the Russian Orbital Segment and the United States Orbital Segment.
              </p>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-indigo-900/30">
              <h2 className="text-xl font-semibold">ISS Resources</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.nasa.gov/mission_pages/station/main/index.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    NASA: International Space Station
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.nasa.gov/multimedia/nasatv" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    NASA: ISS Live Stream
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/International_Space_Station" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    ESA: International Space Station
                  </a>
                </li>
                <li>
                  <a 
                    href="https://spotthestation.nasa.gov/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Spot The Station: NASA ISS Sightings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISSTrackerPage; 