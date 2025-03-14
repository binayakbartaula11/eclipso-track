"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { LatLngExpression } from 'leaflet';
import { FaSpaceShuttle } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map to avoid issues with SSR (server-side rendering)
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then(mod => mod.ZoomControl), { ssr: false });

// Custom icon for the ISS - only created on client side
const createISSIcon = () => {
  if (typeof window !== 'undefined') {
    // Using dynamic import with a workaround for Leaflet
    // This is a special case where we need to use the Leaflet instance
    // We'll handle this in the ESLint config
    const L = require('leaflet');
    return new L.DivIcon({
      className: 'iss-icon',
      html: '<div class="iss-icon-inner"><svg viewBox="0 0 24 24" width="32" height="32"><path fill="#4f46e5" d="M21,9h-3.5c-0.08,0-0.14,0.01-0.21,0.03L13.93,5.67c-0.15-0.15-0.34-0.23-0.54-0.23H9.5c-0.21,0-0.4,0.08-0.54,0.23 L5.6,9.03C5.53,9.01,5.47,9,5.39,9H3c-1.1,0-2,0.9-2,2v2c0,1.1,0.9,2,2,2h2.39c0.08,0,0.14-0.01,0.21-0.03l3.36,3.36 c0.15,0.15,0.34,0.23,0.54,0.23h3.89c0.21,0,0.4-0.08,0.54-0.23l3.36-3.36c0.08,0.02,0.14,0.03,0.21,0.03H21c1.1,0,2-0.9,2-2v-2 C23,9.9,22.1,9,21,9z M21,13h-3.5c-0.5,0-0.92,0.19-1.26,0.53l-3.1,3.1H10.5l-3.1-3.1C7.06,13.19,6.64,13,6.14,13H3v-2h3.14 c0.5,0,0.92-0.19,1.26-0.53l3.1-3.1h2.61l3.1,3.1C16.56,10.81,16.97,11,17.47,11H21V13z M12,10.5c-0.83,0-1.5,0.67-1.5,1.5 s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S12.83,10.5,12,10.5z"></path></svg><div class="pulse"></div></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }
  return null;
};

// ISS location interface
interface IssLocation {
  iss_position: {
    latitude: string;
    longitude: string;
  };
  timestamp: number;
}

interface ISSData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
}

interface ISSApiResponse {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
  visibility: string;
  footprint: number;
  daynum: number;
  solar_lat: number;
  solar_lon: number;
  units: string;
}

const ISSMap = () => {
  const [issData, setIssData] = useState<ISSData | null>(null);
  const [path, setPath] = useState<LatLngExpression[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const fetchISSData = async () => {
      try {
        const response = await axios.get<ISSApiResponse>('https://api.wheretheiss.at/v1/satellites/25544');
        const data = response.data;
        const { latitude, longitude, altitude, velocity, timestamp } = data;
        
        setIssData({
          latitude,
          longitude,
          altitude,
          velocity,
          timestamp
        });

        // Update path with the latest ISS location
        // Limit path length to prevent performance issues
        setPath(prevPath => {
          const newPath = [...prevPath, [latitude, longitude] as LatLngExpression];
          if (newPath.length > 50) {
            return newPath.slice(-50);
          }
          return newPath;
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ISS data:', error);
        setError('Failed to fetch ISS data. Please try again later.');
        setLoading(false);
      }
    };

    // Fetch ISS data every 5 seconds
    const interval = setInterval(fetchISSData, 5000);
    fetchISSData(); // Initial fetch

    return () => clearInterval(interval);
  }, []);

  // Format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Don't render anything on the server
  if (!mounted) return null;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-black/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl">
        <div className="text-center">
          <FaSpaceShuttle className="animate-spin text-indigo-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-300">Loading ISS location data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-black/40 backdrop-blur-sm border border-indigo-900/30 rounded-xl">
        <div className="text-center p-6">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!issData) return null;

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-indigo-900/30 shadow-lg">
      <style jsx global>{`
        .iss-icon-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.3);
          animation: pulse 2s infinite;
          z-index: -1;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
      
      <MapContainer 
        center={[issData.latitude, issData.longitude]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <Marker 
          position={[issData.latitude, issData.longitude]} 
          icon={createISSIcon()}
        >
          <Popup>
            <div className="p-2">
              <h3 className="text-lg font-semibold mb-2">ISS Location</h3>
              <p className="mb-1"><span className="font-medium">Latitude:</span> {issData.latitude.toFixed(4)}°</p>
              <p className="mb-1"><span className="font-medium">Longitude:</span> {issData.longitude.toFixed(4)}°</p>
              <p className="mb-1"><span className="font-medium">Altitude:</span> {issData.altitude.toFixed(2)} km</p>
              <p className="mb-1"><span className="font-medium">Velocity:</span> {issData.velocity.toFixed(2)} km/h</p>
              <p className="mb-1"><span className="font-medium">Last Updated:</span> {formatDate(issData.timestamp)}</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Draw the ISS path */}
        <Polyline 
          positions={path} 
          color="#4f46e5" 
          weight={3} 
          opacity={0.7} 
          dashArray="5, 10"
        />
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[1000] bg-black/70 backdrop-blur-md p-3 rounded-lg border border-indigo-900/30 text-white text-sm max-w-xs">
        <h4 className="font-semibold mb-1 text-indigo-400">Current ISS Data</h4>
        <p><span className="text-gray-400">Altitude:</span> {issData.altitude.toFixed(2)} km</p>
        <p><span className="text-gray-400">Velocity:</span> {issData.velocity.toFixed(2)} km/h</p>
      </div>
    </div>
  );
};

export default ISSMap; 