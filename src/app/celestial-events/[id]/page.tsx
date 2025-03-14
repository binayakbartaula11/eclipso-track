"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { CelestialEvent } from '@/types';
import { FaCalendarAlt, FaMapMarkerAlt, FaEye, FaArrowLeft, FaClock, FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

// Sample celestial events data (same as in the main page)
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

export default function CelestialEventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<CelestialEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const eventId = params.id as string;
    const foundEvent = sampleEvents.find(e => e.id === eventId);
    
    if (foundEvent) {
      setEvent(foundEvent);
    }
    
    setLoading(false);
  }, [params.id]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'eclipse':
        return 'text-yellow-500';
      case 'meteor-shower':
        return 'text-blue-500';
      case 'planet-conjunction':
        return 'text-purple-500';
      case 'moon-phase':
        return 'text-gray-400';
      default:
        return 'text-indigo-500';
    }
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'eclipse':
        return 'Eclipse';
      case 'meteor-shower':
        return 'Meteor Shower';
      case 'planet-conjunction':
        return 'Planet Conjunction';
      case 'moon-phase':
        return 'Moon Phase';
      default:
        return 'Other';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'eclipse':
        return 'bg-yellow-600/30 text-yellow-300';
      case 'meteor-shower':
        return 'bg-blue-600/30 text-blue-300';
      case 'planet-conjunction':
        return 'bg-purple-600/30 text-purple-300';
      case 'moon-phase':
        return 'bg-gray-600/30 text-gray-300';
      default:
        return 'bg-indigo-600/30 text-indigo-300';
    }
  };

  // Calculate days until event
  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-gray-400 mb-6">The celestial event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/celestial-events" className="inline-flex items-center text-indigo-400 hover:text-indigo-300">
              <FaArrowLeft className="mr-2" /> Back to All Events
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const daysUntil = getDaysUntil(event.startDate);
  const isPast = daysUntil < 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/celestial-events" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-4">
            <FaArrowLeft className="mr-2" /> Back to All Events
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold glow-text">{event.title}</h1>
          <div className="flex items-center mt-2">
            <span className={`${getEventTypeIcon(event.type)} text-xs px-2 py-1 rounded-full mr-3`}>
              {getEventTypeName(event.type)}
            </span>
            {!isPast && (
              <span className="text-indigo-300 text-sm">
                {daysUntil === 0 ? 'Today!' : `${daysUntil} days until this event`}
              </span>
            )}
            {isPast && (
              <span className="text-gray-500 text-sm">
                This event has passed
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-indigo-900/10 backdrop-blur-sm rounded-lg border border-indigo-900/30 overflow-hidden">
              {event.imageUrl ? (
                <div className="relative h-64 md:h-80">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="h-64 md:h-80 bg-gradient-to-br from-indigo-900/30 to-black flex items-center justify-center">
                  <span className={`text-6xl ${getEventTypeColor(event.type)}`}>
                    {event.type === 'eclipse' && '☀️'}
                    {event.type === 'meteor-shower' && '☄️'}
                    {event.type === 'planet-conjunction' && '🪐'}
                    {event.type === 'moon-phase' && '🌕'}
                  </span>
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">About this Event</h2>
                <p className="text-gray-300 mb-6">
                  {event.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaCalendarAlt className="mr-3 text-indigo-400 mt-1" />
                    <div>
                      <h3 className="font-medium">Date & Time</h3>
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
                        <h3 className="font-medium">Location</h3>
                        <p className="text-gray-400">{event.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {event.visibility && (
                    <div className="flex items-start">
                      <FaEye className="mr-3 text-indigo-400 mt-1" />
                      <div>
                        <h3 className="font-medium">Visibility</h3>
                        <p className="text-gray-400">{event.visibility}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-indigo-900/10 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
              <h2 className="text-xl font-semibold mb-4">Viewing Tips</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <FaInfoCircle className="mr-2 text-indigo-400 mt-1" />
                  <span>Find a dark location away from city lights for the best viewing experience.</span>
                </li>
                <li className="flex items-start">
                  <FaInfoCircle className="mr-2 text-indigo-400 mt-1" />
                  <span>Allow your eyes at least 20 minutes to adjust to the darkness.</span>
                </li>
                <li className="flex items-start">
                  <FaInfoCircle className="mr-2 text-indigo-400 mt-1" />
                  <span>Check local weather forecasts for clear skies.</span>
                </li>
                <li className="flex items-start">
                  <FaInfoCircle className="mr-2 text-indigo-400 mt-1" />
                  <span>Bring binoculars or a telescope for enhanced viewing.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-indigo-900/10 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
              <h2 className="text-xl font-semibold mb-4">Related Resources</h2>
              <div className="space-y-3">
                <a 
                  href="https://www.nasa.gov/solar-system/skywatching/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-400 hover:text-indigo-300"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  <span>NASA Skywatching Guide</span>
                </a>
                <a 
                  href="https://earthsky.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-400 hover:text-indigo-300"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  <span>EarthSky</span>
                </a>
                <a 
                  href="https://www.timeanddate.com/astronomy/night/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-400 hover:text-indigo-300"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  <span>Time and Date Night Sky</span>
                </a>
              </div>
            </div>
            
            <div className="bg-indigo-900/10 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
              <h2 className="text-xl font-semibold mb-4">Countdown</h2>
              {!isPast ? (
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-300 mb-2">
                    {daysUntil}
                  </div>
                  <div className="text-gray-400">
                    {daysUntil === 1 ? 'Day' : 'Days'} Remaining
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <FaClock className="inline mr-1" /> Event starts on {formatDate(event.startDate)}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xl text-gray-500 mb-2">
                    This event has already occurred
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <FaClock className="inline mr-1" /> Event occurred on {formatDate(event.startDate)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">More {getEventTypeName(event.type)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleEvents
              .filter(e => e.type === event.type && e.id !== event.id)
              .slice(0, 3)
              .map(relatedEvent => (
                <Link 
                  key={relatedEvent.id} 
                  href={`/celestial-events/${relatedEvent.id}`}
                  className="bg-indigo-900/10 backdrop-blur-sm p-4 rounded-lg border border-indigo-900/30 hover:border-indigo-500/50 transition-colors duration-300"
                >
                  <h3 className="font-medium mb-2">{relatedEvent.title}</h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{relatedEvent.description}</p>
                  <div className="text-xs text-gray-500">
                    <FaCalendarAlt className="inline mr-1" /> {formatDate(relatedEvent.startDate)}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 