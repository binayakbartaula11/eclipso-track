import axios from 'axios';

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;
const NASA_API_BASE_URL = 'https://api.nasa.gov';

// Create an axios instance for NASA API
const nasaApiClient = axios.create({
  baseURL: NASA_API_BASE_URL,
  params: {
    api_key: NASA_API_KEY,
  },
});

// Get Astronomy Picture of the Day
export const getApod = async (date?: string) => {
  try {
    const response = await nasaApiClient.get('/planetary/apod', {
      params: {
        date,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching APOD:', error);
    throw error;
  }
};

// Get Near Earth Objects
export const getNeoFeed = async (startDate: string, endDate: string) => {
  try {
    const response = await nasaApiClient.get('/neo/rest/v1/feed', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching NEO feed:', error);
    throw error;
  }
};

// Get Earth imagery
export const getEarthImagery = async (lat: number, lon: number, date: string) => {
  try {
    const response = await nasaApiClient.get('/planetary/earth/imagery', {
      params: {
        lat,
        lon,
        date,
        dim: 0.15, // degrees
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Earth imagery:', error);
    throw error;
  }
};

// Get Mars rover photos
export const getMarsRoverPhotos = async (rover: string, sol: number) => {
  try {
    const response = await nasaApiClient.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
      params: {
        sol,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Mars rover photos:', error);
    throw error;
  }
};

// Get NASA image and video library search results
export const searchNasaLibrary = async (query: string) => {
  try {
    const response = await axios.get('https://images-api.nasa.gov/search', {
      params: {
        q: query,
        media_type: 'image,video',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching NASA library:', error);
    throw error;
  }
};

// Create a named object for the default export
const nasaApiService = {
  getApod,
  getNeoFeed,
  getEarthImagery,
  getMarsRoverPhotos,
  searchNasaLibrary,
};

export default nasaApiService; 