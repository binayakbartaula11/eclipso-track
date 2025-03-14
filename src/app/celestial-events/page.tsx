"use client";

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import EventCard from '@/components/celestial-events/EventCard';
import { CelestialEvent } from '@/types';
import { FaFilter, FaSearch, FaSun, FaMeteor, FaGlobeAmericas, FaMoon, FaArrowRight, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import { fetchAPOD, APODResponse } from '@/lib/nasa-api';
import Image from 'next/image';

// Sample celestial events data
const sampleEvents: CelestialEvent[] = [
  {
    id: '1',
    title: 'Total Solar Eclipse',
    description: 'A total solar eclipse occurs when the Moon completely blocks the Sun, revealing the Sun\'s outer atmosphere known as the corona.',
    startDate: new Date('2024-04-08'),
    type: 'eclipse',
    location: 'North America',
    visibility: 'Visible from parts of Mexico, United States, and Canada',
  },
  {
    id: '2',
    title: 'Lyrid Meteor Shower',
    description: 'The Lyrids are an annual meteor shower that peaks in April. They are caused by the Earth passing through the debris left by Comet C/1861 G1 Thatcher.',
    startDate: new Date('2024-04-16'),
    endDate: new Date('2024-04-25'),
    type: 'meteor-shower',
    visibility: 'Best viewed from the Northern Hemisphere',
  },
  {
    id: '3',
    title: 'Venus-Jupiter Conjunction',
    description: 'A close approach of Venus and Jupiter in the night sky, appearing less than 0.5 degrees apart.',
    startDate: new Date('2024-05-23'),
    type: 'planet-conjunction',
    visibility: 'Visible worldwide shortly after sunset',
  },
  {
    id: '4',
    title: 'Full Moon (Strawberry Moon)',
    description: 'The full moon in June is known as the Strawberry Moon because it coincides with the ripening of strawberries in North America.',
    startDate: new Date('2024-06-21'),
    type: 'moon-phase',
    visibility: 'Visible worldwide',
  },
  {
    id: '5',
    title: 'Perseid Meteor Shower',
    description: 'One of the most popular meteor showers, the Perseids are known for producing numerous bright meteors. They are associated with the comet Swift-Tuttle.',
    startDate: new Date('2024-07-17'),
    endDate: new Date('2024-08-24'),
    type: 'meteor-shower',
    visibility: 'Best viewed from the Northern Hemisphere',
  },
  {
    id: '6',
    title: 'Partial Lunar Eclipse',
    description: 'A partial lunar eclipse occurs when the Earth moves between the Sun and the Moon, but they are not precisely aligned. Only part of the Moon\'s visible surface moves into the Earth\'s shadow.',
    startDate: new Date('2024-09-18'),
    type: 'eclipse',
    visibility: 'Visible from Europe, Africa, Asia, and Australia',
  },
];

export default function CelestialEventsPage() {
  const [filteredEvents, setFilteredEvents] = useState<CelestialEvent[]>(sampleEvents);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [apodData, setApodData] = useState<APODResponse | null>(null);
  const [apodLoading, setApodLoading] = useState<boolean>(true);
  const [apodError, setApodError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch NASA's Astronomy Picture of the Day
    const getApodData = async () => {
      try {
        setApodLoading(true);
        const data = await fetchAPOD();
        setApodData(data);
        setApodError(null);
      } catch (err) {
        console.error('Error fetching APOD:', err);
        setApodError('Failed to load NASA Picture of the Day');
      } finally {
        setApodLoading(false);
      }
    };

    getApodData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterEvents(term, selectedType);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
    filterEvents(searchTerm, type);
  };

  const filterEvents = (term: string, type: string) => {
    let filtered = sampleEvents;
    
    // Filter by search term
    if (term) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term.toLowerCase()) || 
        event.description.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Filter by event type
    if (type !== 'all') {
      filtered = filtered.filter(event => event.type === type);
    }
    
    setFilteredEvents(filtered);
  };

  // Filter events by type
  const eclipses = sampleEvents.filter(event => event.type === 'eclipse');
  const meteorShowers = sampleEvents.filter(event => event.type === 'meteor-shower');
  const conjunctions = sampleEvents.filter(event => event.type === 'planet-conjunction');
  const moonPhases = sampleEvents.filter(event => event.type === 'moon-phase');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 glow-text">Celestial Events</h1>
        
        <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30 mb-8">
          <p className="text-gray-300">
            Track upcoming celestial events including solar and lunar eclipses, meteor showers, and planetary conjunctions.
            {/* Get detailed information, countdowns, and visibility maps for each event. */}
          </p>
        </div>
        
        {/* NASA APOD Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">NASA Astronomy Picture of the Day</h2>
          
          {apodLoading ? (
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30 flex items-center justify-center h-64">
              <div className="text-center">
                <FaSpinner className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-4" />
                <p className="text-gray-400">Loading NASA Picture of the Day...</p>
              </div>
            </div>
          ) : apodError ? (
            <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
              <div className="text-center">
                <p className="text-red-400">{apodError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : apodData && (
            <div className="bg-indigo-900/20 backdrop-blur-sm rounded-lg border border-indigo-900/30 overflow-hidden">
              <div className="relative h-64 md:h-80">
                {apodData.media_type === 'image' ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={apodData.url}
                      alt={apodData.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <iframe
                      src={apodData.url}
                      title={apodData.title}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white">{apodData.title}</h3>
                  <p className="text-sm text-gray-300">{new Date(apodData.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-4">
                  {apodData.explanation.length > 300 
                    ? `${apodData.explanation.substring(0, 300)}...` 
                    : apodData.explanation}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {apodData.copyright ? `© ${apodData.copyright}` : 'NASA'}
                  </span>
                  <a
                    href="https://www.nasa.gov/stem-content/astronomy-picture-of-the-day"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                  >
                    View on NASA <FaExternalLinkAlt size={12} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Featured Event Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Eclipses Section */}
          <div className="bg-gradient-to-br from-yellow-900/30 to-black/40 backdrop-blur-sm p-6 rounded-lg border border-yellow-900/30 hover:border-yellow-500/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <FaSun className="text-yellow-500 mr-3 text-2xl" />
              <h2 className="text-xl font-bold text-yellow-100">Eclipses</h2>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Solar and lunar eclipses occur when the Sun, Earth, and Moon align. Witness these rare astronomical events.
            </p>
            <p className="text-yellow-200 text-sm mb-2">Upcoming: {eclipses.length} events</p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => handleTypeFilter('eclipse')}
                className="inline-flex items-center text-yellow-400 hover:text-yellow-300 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300"
              >
                View Details <FaArrowRight className="ml-2" />
              </button>
              <a 
                href="https://www.timeanddate.com/eclipse/list.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-yellow-400/70 hover:text-yellow-300 text-xs font-medium"
              >
                <FaExternalLinkAlt className="mr-1" /> Don't Miss These Eclipses
              </a>
            </div>
          </div>

          {/* Meteor Showers Section */}
          <div className="bg-gradient-to-br from-blue-900/30 to-black/40 backdrop-blur-sm p-6 rounded-lg border border-blue-900/30 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <FaMeteor className="text-blue-500 mr-3 text-2xl" />
              <h2 className="text-xl font-bold text-blue-100">Meteor Showers</h2>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Meteor showers occur when Earth passes through debris left by comets, creating streaks of light in the night sky.
            </p>
            <p className="text-blue-200 text-sm mb-2">Upcoming: {meteorShowers.length} events</p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => handleTypeFilter('meteor-shower')}
                className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300"
              >
                View Details <FaArrowRight className="ml-2" />
              </button>
              <a 
                href="https://www.amsmeteors.org/meteor-showers/meteor-shower-calendar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-blue-400/70 hover:text-blue-300 text-xs font-medium"
              >
                <FaExternalLinkAlt className="mr-1" /> Catch the Meteor Showers
              </a>
            </div>
          </div>

          {/* Conjunctions Section */}
          <div className="bg-gradient-to-br from-purple-900/30 to-black/40 backdrop-blur-sm p-6 rounded-lg border border-purple-900/30 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <FaGlobeAmericas className="text-purple-500 mr-3 text-2xl" />
              <h2 className="text-xl font-bold text-purple-100">Conjunctions</h2>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Planetary conjunctions occur when two or more planets appear close to each other in the night sky.
            </p>
            <p className="text-purple-200 text-sm mb-2">Upcoming: {conjunctions.length} events</p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => handleTypeFilter('planet-conjunction')}
                className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300"
              >
                View Details <FaArrowRight className="ml-2" />
              </button>
              <a 
                href="https://www.skyatnightmagazine.com/news/planetary-alignment-2025" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-purple-400/70 hover:text-purple-300 text-xs font-medium"
              >
                <FaExternalLinkAlt className="mr-1" /> Conjunctions to Watch
              </a>
            </div>
          </div>

          {/* Moon Phases Section */}
          <div className="bg-gradient-to-br from-gray-800/30 to-black/40 backdrop-blur-sm p-6 rounded-lg border border-gray-700/30 hover:border-gray-500/50 transition-all duration-300 group">
            <div className="flex items-center mb-4">
              <FaMoon className="text-gray-400 mr-3 text-2xl" />
              <h2 className="text-xl font-bold text-gray-100">Moon Phases</h2>
            </div>
            <p className="text-gray-300 mb-4 text-sm">
              Follow the lunar cycle from new moon to full moon, including special events like supermoons and blue moons.
            </p>
            <p className="text-gray-200 text-sm mb-2">Upcoming: {moonPhases.length} events</p>
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => handleTypeFilter('moon-phase')}
                className="inline-flex items-center text-gray-400 hover:text-gray-300 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300"
              >
                View Details <FaArrowRight className="ml-2" />
              </button>
              <a 
                href="https://www.timeanddate.com/moon/phases/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-gray-400/70 hover:text-gray-300 text-xs font-medium"
              >
                <FaExternalLinkAlt className="mr-1" /> Phases of the Moon Ahead
              </a>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full bg-black/40 border border-indigo-900/50 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedType === 'all' ? 'bg-indigo-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-indigo-900/30'}`}
                  onClick={() => handleTypeFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedType === 'eclipse' ? 'bg-yellow-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-yellow-900/30'}`}
                  onClick={() => handleTypeFilter('eclipse')}
                >
                  Eclipses
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedType === 'meteor-shower' ? 'bg-blue-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-blue-900/30'}`}
                  onClick={() => handleTypeFilter('meteor-shower')}
                >
                  Meteor Showers
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedType === 'planet-conjunction' ? 'bg-purple-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-purple-900/30'}`}
                  onClick={() => handleTypeFilter('planet-conjunction')}
                >
                  Conjunctions
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedType === 'moon-phase' ? 'bg-gray-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-gray-900/30'}`}
                  onClick={() => handleTypeFilter('moon-phase')}
                >
                  Moon Phases
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">{selectedType === 'all' ? 'All Upcoming Events' : `Upcoming ${getEventTypeName(selectedType)}`}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">No celestial events found matching your criteria.</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
          <h2 className="text-2xl font-bold mb-4">NASA Resources</h2>
          <p className="text-gray-300 mb-6">
            Explore space with NASA&apos;s official data and imagery resources:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://api.nasa.gov/planetary/apod?api_key=NEXT_PUBLIC_NASA_API_KEY"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300 flex items-start"
            >
              <div className="bg-indigo-900/50 p-2 rounded-lg mr-3">
                <FaExternalLinkAlt className="text-indigo-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Exoplanets</h3>
                <p className="text-gray-400 text-sm">Discover planets beyond our solar system and explore the growing field of exoplanet research.</p>
              </div>
            </a>
            <a
              href="https://science.nasa.gov/exoplanets/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300 flex items-start"
            >
              <div className="bg-indigo-900/50 p-2 rounded-lg mr-3">
                <FaExternalLinkAlt className="text-indigo-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">The Search for Life in the Universe</h3>
                <p className="text-gray-400 text-sm">Investigate ongoing missions and research in the quest to find signs of life elsewhere in the cosmos.</p>
              </div>
            </a>
            <a
              href="https://science.nasa.gov/universe/overview/building-blocks"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300 flex items-start"
            >
              <div className="bg-indigo-900/50 p-2 rounded-lg mr-3">
                <FaExternalLinkAlt className="text-indigo-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Dark Matter & Dark Energy</h3>
                <p className="text-gray-400 text-sm">Explore the mysterious substances that make up most of the universe, yet remain largely invisible and poorly understood.</p>
              </div>
            </a>
            <a
              href="https://science.nasa.gov/universe/the-big-bang/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300 flex items-start"
            >
              <div className="bg-indigo-900/50 p-2 rounded-lg mr-3">
                <FaExternalLinkAlt className="text-indigo-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">The Big Bang</h3>
                <p className="text-gray-400 text-sm">Delve into the origins of the universe, from the explosive event that began it all to the ongoing expansion and evolution of space.</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Helper function to get event type name
function getEventTypeName(type: string) {
  switch (type) {
    case 'eclipse':
      return 'Eclipses';
    case 'meteor-shower':
      return 'Meteor Showers';
    case 'planet-conjunction':
      return 'Conjunctions';
    case 'moon-phase':
      return 'Moon Phases';
    default:
      return 'Events';
  }
} 