"use client";

import { useEffect, useState } from "react";
import { FaSync, FaExclamationTriangle, FaSatellite } from "react-icons/fa";

// Define TypeScript interfaces
interface ISSPosition {
  latitude: string;
  longitude: string;
  timestamp: number;
}

const SimpleIssTracker = () => {
  const [issPosition, setIssPosition] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchIssPosition = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using a more reliable API that provides CORS headers
      const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // The data structure is different for this API
      if (data.latitude === undefined || data.longitude === undefined) {
        throw new Error("Invalid ISS position data structure");
      }

      setIssPosition({
        latitude: data.latitude.toString(),
        longitude: data.longitude.toString(),
        timestamp: data.timestamp || Math.floor(Date.now() / 1000)
      });
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching ISS position:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch ISS position");
      setIssPosition(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssPosition();
    
    const interval = setInterval(fetchIssPosition, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatCoordinate = (value: string, positiveSuffix: string, negativeSuffix: string) => {
    const num = parseFloat(value);
    return `${Math.abs(num).toFixed(4)}° ${num >= 0 ? positiveSuffix : negativeSuffix}`;
  };

  return (
    <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
      <div className="flex items-center gap-3 mb-4">
        <FaSatellite className="text-indigo-400 text-xl" />
        <h2 className="text-xl font-semibold">ISS Live Tracker</h2>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-32 gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-gray-400 text-sm">Locating ISS...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-32 gap-3">
          <FaExclamationTriangle className="text-yellow-500 text-xl" />
          <p className="text-gray-300 text-center">{error}</p>
          <button
            onClick={fetchIssPosition}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <FaSync /> Try Again
          </button>
        </div>
      ) : issPosition ? (
        <div className="space-y-4">
          <p className="text-gray-300">
            Current ISS Position:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Latitude</p>
              <p className="text-white font-mono">
                {formatCoordinate(issPosition.latitude, "N", "S")}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Longitude</p>
              <p className="text-white font-mono">
                {formatCoordinate(issPosition.longitude, "E", "W")}
              </p>
            </div>
          </div>
          {lastUpdated && (
            <p className="text-gray-400 text-sm">
              Last updated: {lastUpdated.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-400">No position data available</p>
      )}
    </div>
  );
};

export default SimpleIssTracker;