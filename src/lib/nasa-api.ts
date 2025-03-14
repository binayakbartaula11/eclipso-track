import axios from 'axios';

// Define types for APOD response
export interface APODResponse {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  copyright?: string;
}

// Define types for Planetary API response (for Earth assets)
export interface EarthAssetResponse {
  id: string;
  date: string;
  url: string;
  cloud_score?: number;
  resource?: {
    dataset: string;
    planet: string;
  };
}

// Define types for Earth imagery response
export interface EarthImageryResponse {
  id: string;
  date: string;
  url: string;
  cloud_score?: number;
  resource?: {
    dataset: string;
    planet: string;
  };
}

// Define type for NASA Library search response
export interface NasaLibrarySearchResponse {
  collection: {
    version: string;
    href: string;
    items: Array<{
      href: string;
      data: Array<{
        center: string;
        title: string;
        nasa_id: string;
        date_created: string;
        keywords?: string[];
        media_type: string;
        description?: string;
        description_508?: string;
        secondary_creator?: string;
        location?: string;
        photographer?: string;
      }>;
      links: Array<{
        href: string;
        rel: string;
        render?: string;
      }>;
    }>;
    metadata: {
      total_hits: number;
    };
    links?: Array<{
      rel: string;
      prompt: string;
      href: string;
    }>;
  };
}

// NASA API key - using DEMO_KEY for development
// In production, use environment variables
const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

// Fetch Astronomy Picture of the Day (APOD)
export const fetchAPOD = async (date?: string): Promise<APODResponse> => {
  try {
    const params: Record<string, string> = { api_key: NASA_API_KEY };
    if (date) {
      params.date = date;
    }
    
    const response = await axios.get<APODResponse>(
      'https://api.nasa.gov/planetary/apod',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching APOD data:', error);
    throw new Error('Failed to fetch APOD data');
  }
};

// Fetch Earth imagery for a specific location
export const fetchEarthImagery = async (
  lat: number,
  lon: number,
  date?: string,
  dim?: number
): Promise<EarthImageryResponse> => {
  try {
    const params: Record<string, string | number> = {
      api_key: NASA_API_KEY,
      lat,
      lon
    };
    
    if (date) params.date = date;
    if (dim) params.dim = dim;
    
    const response = await axios.get<EarthImageryResponse>(
      'https://api.nasa.gov/planetary/earth/imagery',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Earth imagery:', error);
    throw new Error('Failed to fetch Earth imagery');
  }
};

// Fetch Earth assets for a specific location
export const fetchEarthAssets = async (
  lat: number,
  lon: number,
  date?: string
): Promise<EarthAssetResponse[]> => {
  try {
    const params: Record<string, string | number> = {
      api_key: NASA_API_KEY,
      lat,
      lon
    };
    
    if (date) params.date = date;
    
    const response = await axios.get<EarthAssetResponse[]>(
      'https://api.nasa.gov/planetary/earth/assets',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Earth assets:', error);
    throw new Error('Failed to fetch Earth assets');
  }
};

// Search NASA image and video library
export const searchNasaLibrary = async (
  query: string,
  mediaType?: 'image' | 'video' | 'audio',
  yearStart?: string,
  yearEnd?: string
): Promise<NasaLibrarySearchResponse> => {
  try {
    const params: Record<string, string> = { q: query };
    
    if (mediaType) params.media_type = mediaType;
    if (yearStart) params.year_start = yearStart;
    if (yearEnd) params.year_end = yearEnd;
    
    const response = await axios.get<NasaLibrarySearchResponse>(
      'https://images-api.nasa.gov/search',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error searching NASA library:', error);
    throw new Error('Failed to search NASA library');
  }
}; 