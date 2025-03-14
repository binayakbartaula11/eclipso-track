"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { FaSpaceShuttle, FaExternalLinkAlt, FaSatellite, FaSync } from 'react-icons/fa';
import { getCurrentIssLocation, formatIssLocationForMap } from '@/services/issApi';
import { IssLocationResponse, IssLocationForMap } from '@/types';

const CACHE_DURATION = 5000; // 5 seconds cache

const IssLocationPreview: React.FC = () => {
  const [issLocation, setIssLocation] = useState<IssLocationForMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchIssData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use sessionStorage only if available
      if (typeof window !== 'undefined') {
        const cachedData = sessionStorage.getItem('iss-location');
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setIssLocation(data);
            setLoading(false);
            return;
          }
        }
      }

      const rawData = await getCurrentIssLocation();
      const formattedData = formatIssLocationForMap(rawData);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'iss-location',
          JSON.stringify({
            data: formattedData,
            timestamp: Date.now()
          })
        );
      }

      setIssLocation(formattedData);
      setRetryCount(0);
    } catch (err) {
      console.error('ISS fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch ISS location');

      if (retryCount < 3) {
        retryTimeoutRef.current = setTimeout(
          () => setRetryCount((c) => c + 1),
          3000 * (retryCount + 1)
        );
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchIssData();
    const interval = setInterval(fetchIssData, 10000);
    return () => {
      clearInterval(interval);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchIssData]);

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading && !issLocation) {
    return (
      <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30 flex items-center justify-center h-48">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <FaSatellite className="text-4xl text-indigo-400 mx-auto animate-spin" />
          </div>
          <p className="text-gray-400 animate-pulse">Acquiring satellite signal...</p>
        </div>
      </div>
    );
  }

  if (error && !issLocation) {
    return (
      <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
        <div className="text-center space-y-4">
          <FaSatellite className="text-red-400 text-4xl mx-auto animate-bounce" />
          <div className="space-y-2">
            <p className="text-gray-300 font-medium">{error}</p>
            <p className="text-sm text-gray-500">
              {retryCount < 3
                ? `Retrying in ${(3000 * (retryCount + 1)) / 1000}s...`
                : 'Max retries reached'}
            </p>
          </div>
          <button
            onClick={fetchIssData}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg 
              transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <FaSpaceShuttle className="text-sm" />
            Reconnect ({3 - retryCount} attempts left)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30
      hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="bg-indigo-600/30 p-3 rounded-full flex-shrink-0">
            <FaSpaceShuttle className="text-xl text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold truncate">ISS Live Tracker</h3>
        </div>
        <button
          onClick={fetchIssData}
          disabled={loading}
          className="p-2 rounded-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
          title="Refresh data"
        >
          <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="mb-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-900/20 p-3 rounded-lg">
            <p className="text-gray-500 text-sm mb-1">Latitude</p>
            <p className="text-white font-mono text-lg">
              {issLocation?.lat.toFixed(4)}°
            </p>
          </div>
          <div className="bg-indigo-900/20 p-3 rounded-lg">
            <p className="text-gray-500 text-sm mb-1">Longitude</p>
            <p className="text-white font-mono text-lg">
              {issLocation?.lng.toFixed(4)}°
            </p>
          </div>
        </div>

        <div className="bg-indigo-900/20 p-3 rounded-lg">
          <p className="text-gray-500 text-sm mb-1">Last Update</p>
          <div className="flex items-center justify-between">
            <p className="text-white text-sm font-mono">
              {issLocation && formatTime(issLocation.timestamp)}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-xs text-gray-400">{loading ? 'Updating' : 'Live'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-48 bg-black/40 rounded-lg overflow-hidden mb-4
        border border-indigo-900/30">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <p className="text-gray-400 text-sm text-center font-medium">
            {issLocation &&
              `Orbiting at ${(issLocation.altitude * 0.621371).toFixed(0)} miles | 
              Speed: ${(issLocation.velocity * 2.23694).toFixed(0)} mph`}
          </p>
        </div>
      </div>
      
      <Link 
        href="/iss-tracker" 
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 
          rounded-md transition-all duration-300 w-full flex items-center justify-center 
          gap-2 hover:gap-3 group"
      >
        <span>3D Tracker Map</span>
        <FaExternalLinkAlt className="text-xs group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default IssLocationPreview;
