"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { fetchAPOD, APODResponse } from '@/lib/nasa-api';

interface NasaApodProps {
  date?: string;
  className?: string;
}

const NasaApod: React.FC<NasaApodProps> = ({ date, className = '' }) => {
  const [apodData, setApodData] = useState<APODResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getApodData = async () => {
      try {
        setLoading(true);
        const data = await fetchAPOD(date);
        setApodData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching APOD:', err);
        setError('Failed to load NASA Picture of the Day');
      } finally {
        setLoading(false);
      }
    };

    getApodData();
  }, [date]);

  if (loading) {
    return (
      <div className={`bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30 flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <FaSpinner className="animate-spin h-8 w-8 text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading NASA Picture of the Day...</p>
        </div>
      </div>
    );
  }

  if (error || !apodData) {
    return (
      <div className={`bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30 ${className}`}>
        <div className="text-center">
          <FaInfoCircle className="text-red-500 text-3xl mx-auto mb-4" />
          <p className="text-gray-400">{error || 'Failed to load NASA Picture of the Day'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-indigo-900/20 backdrop-blur-sm rounded-lg border border-indigo-900/30 overflow-hidden ${className}`}>
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
        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
          {apodData.explanation}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {apodData.copyright ? `© ${apodData.copyright}` : 'NASA'}
          </span>
          <a
            href={`https://apod.nasa.gov/apod/astropix.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
          >
            View on NASA <FaExternalLinkAlt size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NasaApod; 