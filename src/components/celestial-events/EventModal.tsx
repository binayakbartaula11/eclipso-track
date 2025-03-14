"use client";

import React from 'react';
import { CelestialEvent } from '@/types';
import { FaCalendarAlt, FaMapMarkerAlt, FaEye, FaTimes, FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface EventModalProps {
  event: CelestialEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get NASA resource URL based on event type
  const getNasaResourceUrl = (type: string) => {
    switch (type) {
      case 'eclipse':
        return 'https://science.nasa.gov/Eclipses/';
      case 'meteor-shower':
        return 'https://solarsystem.nasa.gov/asteroids-comets-and-meteors/meteors-and-meteorites/overview/';
      case 'planet-conjunction':
        return 'https://solarsystem.nasa.gov/planets/overview/';
      case 'moon-phase':
        return 'https://moon.nasa.gov/';
      default:
        return 'https://www.nasa.gov/';
    }
  };

  // Calculate days until event
  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!event) return null;

  const daysUntil = getDaysUntil(event.startDate);
  const isPast = daysUntil < 0;
  const nasaResourceUrl = getNasaResourceUrl(event.type);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-indigo-950/90 to-black/90 rounded-lg shadow-xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              aria-label="Close modal"
            >
              <FaTimes size={24} />
            </button>

            {/* Event header with image */}
            <div className="relative h-64 md:h-80">
              {event.imageUrl ? (
                <div className="w-full h-full relative">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover rounded-t-lg"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-64 md:h-80 bg-gradient-to-br from-indigo-900/30 to-black flex items-center justify-center rounded-t-lg">
                  <span className="text-6xl">
                    {event.type === 'eclipse' && '☀️'}
                    {event.type === 'meteor-shower' && '☄️'}
                    {event.type === 'planet-conjunction' && '🪐'}
                    {event.type === 'moon-phase' && '🌕'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{event.title}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    event.type === 'eclipse' ? 'bg-yellow-600/50 text-yellow-200' :
                    event.type === 'meteor-shower' ? 'bg-blue-600/50 text-blue-200' :
                    event.type === 'planet-conjunction' ? 'bg-purple-600/50 text-purple-200' :
                    'bg-gray-600/50 text-gray-200'
                  }`}>
                    {event.type === 'eclipse' ? 'Eclipse' :
                     event.type === 'meteor-shower' ? 'Meteor Shower' :
                     event.type === 'planet-conjunction' ? 'Conjunction' :
                     'Moon Phase'}
                  </span>
                  {!isPast ? (
                    <span className="text-indigo-300 text-sm">
                      {daysUntil === 0 ? 'Today!' : `${daysUntil} days until this event`}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      This event has passed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Event details */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">About this Event</h3>
                  <p className="text-gray-300 mb-6">
                    {event.description}
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <FaCalendarAlt className="mr-3 text-indigo-400 mt-1" />
                      <div>
                        <h4 className="font-medium">Date & Time</h4>
                        <p className="text-gray-400">
                          {formatDate(event.startDate)}
                          {event.endDate && ` - ${formatDate(event.endDate)}`}
                        </p>
                      </div>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="mr-3 text-indigo-400 mt-1" />
                        <div>
                          <h4 className="font-medium">Location</h4>
                          <p className="text-gray-400">{event.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {event.visibility && (
                      <div className="flex items-start">
                        <FaEye className="mr-3 text-indigo-400 mt-1" />
                        <div>
                          <h4 className="font-medium">Visibility</h4>
                          <p className="text-gray-400">{event.visibility}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-indigo-900/20 backdrop-blur-sm p-4 rounded-lg border border-indigo-900/30">
                    <h3 className="text-lg font-semibold mb-3">Viewing Tips</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start">
                        <FaInfoCircle className="mr-2 text-indigo-400 mt-1 flex-shrink-0" />
                        <span>Find a dark location away from city lights for the best viewing experience.</span>
                      </li>
                      <li className="flex items-start">
                        <FaInfoCircle className="mr-2 text-indigo-400 mt-1 flex-shrink-0" />
                        <span>Allow your eyes at least 20 minutes to adjust to the darkness.</span>
                      </li>
                      <li className="flex items-start">
                        <FaInfoCircle className="mr-2 text-indigo-400 mt-1 flex-shrink-0" />
                        <span>Check local weather forecasts for clear skies.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-900/20 backdrop-blur-sm p-4 rounded-lg border border-indigo-900/30">
                    <h3 className="text-lg font-semibold mb-3">NASA Resources</h3>
                    <a 
                      href={nasaResourceUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-indigo-400 hover:text-indigo-300 mb-2"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      <span>NASA Guide</span>
                    </a>
                    <a 
                      href="https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-indigo-400 hover:text-indigo-300"
                    >
                      <FaExternalLinkAlt className="mr-2" />
                      <span>Astronomy Picture of the Day</span>
                    </a>
                  </div>
                  
                  {!isPast && (
                    <div className="bg-indigo-900/20 backdrop-blur-sm p-4 rounded-lg border border-indigo-900/30">
                      <h3 className="text-lg font-semibold mb-3">Countdown</h3>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-300 mb-1">
                          {daysUntil}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {daysUntil === 1 ? 'Day' : 'Days'} Remaining
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventModal; 