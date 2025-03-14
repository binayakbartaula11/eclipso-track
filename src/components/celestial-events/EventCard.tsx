"use client";

import React, { useState } from 'react';
import { CelestialEvent } from '@/types';
import { FaCalendarAlt, FaMapMarkerAlt, FaEye, FaArrowRight } from 'react-icons/fa';
import EventModal from './EventModal';

interface EventCardProps {
  event: CelestialEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-indigo-900/10 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30 hover:border-indigo-500/50 transition-colors duration-300 group">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <span className={`${getEventTypeIcon(event.type)} text-xs px-2 py-1 rounded-full`}>
            {getEventTypeName(event.type)}
          </span>
        </div>
        <p className="text-gray-400 mb-4">
          {event.description.length > 120 
            ? `${event.description.substring(0, 120)}...` 
            : event.description}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-400">
            <FaCalendarAlt className="mr-2 text-indigo-400" />
            <span>
              {formatDate(event.startDate)}
              {event.endDate && ` - ${formatDate(event.endDate)}`}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center text-sm text-gray-400">
              <FaMapMarkerAlt className="mr-2 text-indigo-400" />
              <span>{event.location}</span>
            </div>
          )}
          {event.visibility && (
            <div className="flex items-center text-sm text-gray-400">
              <FaEye className="mr-2 text-indigo-400" />
              <span>{event.visibility}</span>
            </div>
          )}
        </div>
        <button 
          onClick={openModal}
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300"
        >
          View Details <FaArrowRight className="ml-2 text-xs" />
        </button>
      </div>

      <EventModal 
        event={event} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
};

export default EventCard; 