"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaInfoCircle, FaRefresh } from 'react-icons/fa';
import axios from 'axios';

interface ApodResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

const CACHE_KEY = 'nasa-apod-cache';
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

const NasaApod: React.FC = () => {
  const [apodData, setApodData] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchApod = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Retrieve API key from env variables
      const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
      if (!apiKey) {
        setError('NASA API key not configured.'); // Set NEXT_PUBLIC_NASA_API_KEY in environment.
        return;
      }

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        const isToday = new Date(data.date).toDateString() === new Date().toDateString();
        if (isToday) {
          setApodData(data);
          return;
        }
      }

      const response = await axios.get<ApodResponse>(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
      );

      // Cache response with timestamp
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: response.data,
          timestamp: new Date().toISOString(),
        })
      );

      setApodData(response.data);
      setRetryCount(0);
    } catch (err) {
      console.error('APOD fetch error:', err);

      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.msg || err.message
        : 'Failed to load NASA Picture of the Day';

      setError(errorMessage);

      if (retryCount < MAX_RETRIES) {
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount((c) => c + 1);
        }, RETRY_DELAY * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchApod();
    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [fetchApod]);

  const toggleExplanation = () => {
    setIsExpanded((prev) => !prev);
  };

  if (loading && !apodData) {
    return (
      <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30 flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto" />
          <p className="text-gray-400 animate-pulse">Loading cosmic wonders...</p>
        </div>
      </div>
    );
  }

  if (error || !apodData) {
    return (
      <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
        <div className="text-center space-y-4">
          <FaInfoCircle className="text-red-400 text-4xl mx-auto animate-bounce" />
          <div className="space-y-2">
            <p className="text-gray-300 font-medium">{error}</p>
            <p className="text-sm text-gray-500">
              {retryCount < MAX_RETRIES
                ? `Retrying in ${(RETRY_DELAY * (retryCount + 1)) / 1000}s...`
                : 'Please check your connection'}
            </p>
          </div>
          <button
            onClick={fetchApod}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <FaRefresh className="text-sm" />
            Try Again ({MAX_RETRIES - retryCount} left)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-indigo-900/20 backdrop-blur-sm rounded-lg border border-indigo-900/30 overflow-hidden hover:shadow-xl transition-shadow duration-300"
      onClick={toggleExplanation}
    >
      <div className="relative h-64 md:h-80 group">
        {apodData.media_type === 'image' ? (
          <div className="w-full h-full relative">
            <Image
              src={apodData.hdurl || apodData.url}
              alt={apodData.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              priority
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/50">
            <iframe
              src={apodData.url}
              title={apodData.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className={`absolute bottom-0 left-0 right-0 p-4 space-y-1 transition-all duration-500 transform ${isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h3 className="text-lg font-bold text-white drop-shadow-lg">{apodData.title}</h3>
          <p className="text-xs text-indigo-200 font-mono">
            {new Date(apodData.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-24 opacity-80 translate-y-2'}`}>
          <p className="text-gray-300 text-sm leading-relaxed cursor-pointer">
            {apodData.explanation}
          </p>
        </div>
        
        <div className={`flex justify-between items-center border-t border-indigo-900/30 pt-4 transition-all duration-500 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="text-xs text-indigo-400 font-mono">
            {apodData.copyright ? `© ${apodData.copyright}` : 'NASA/JPL'}
          </span>
          <div className="flex gap-4">
            <a
              href={apodData.hdurl || apodData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              HD View <FaExternalLinkAlt className="text-xs" />
            </a>
            <a
              href="https://apod.nasa.gov/apod/archivepix.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              Archive <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NasaApod;
