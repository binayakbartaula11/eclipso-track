import axios from 'axios';

const ASTRONOMY_API_BASE_URL = 'https://api.astronomyapi.com/api/v2';
const ASTRONOMY_APP_ID = process.env.NEXT_PUBLIC_ASTRONOMY_API_APP_ID;
const ASTRONOMY_APP_SECRET = process.env.NEXT_PUBLIC_ASTRONOMY_API_APP_SECRET;

// Create an axios instance for Astronomy API
const astronomyApiClient = axios.create({
  baseURL: ASTRONOMY_API_BASE_URL,
  headers: {
    'Authorization': `Basic ${Buffer.from(`${ASTRONOMY_APP_ID}:${ASTRONOMY_APP_SECRET}`).toString('base64')}`,
    'Content-Type': 'application/json',
  },
});

// Get the positions of celestial bodies
export const getCelestialPositions = async (
  latitude: number,
  longitude: number,
  date: string,
  bodies: string[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']
) => {
  try {
    const response = await astronomyApiClient.get('/bodies/positions', {
      params: {
        latitude,
        longitude,
        from_date: date,
        to_date: date,
        time: '12:00:00',
        elevation: 0,
        bodies: bodies.join(','),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching celestial positions:', error);
    throw error;
  }
};

// Get the star chart for a specific location and time
export const getStarChart = async (
  latitude: number,
  longitude: number,
  date: string,
  time: string = '12:00:00',
  style: string = 'default',
  width: number = 1000,
  height: number = 1000
) => {
  try {
    const response = await astronomyApiClient.post('/studio/star-chart', {
      style,
      observer: {
        latitude,
        longitude,
        date,
        time,
      },
      view: {
        type: 'area',
        parameters: {
          position: {
            equatorial: {
              rightAscension: 0,
              declination: 0,
            },
          },
          zoom: 2,
        },
      },
      width,
      height,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching star chart:', error);
    throw error;
  }
};

// Get the moon phase for a specific date
export const getMoonPhase = async (date: string) => {
  try {
    const response = await astronomyApiClient.get('/moon/phase', {
      params: {
        format: 'png',
        style: 'default',
        date,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching moon phase:', error);
    throw error;
  }
};

// Create a named object for the default export
const astronomyApiService = {
  getCelestialPositions,
  getStarChart,
  getMoonPhase,
};

export default astronomyApiService; 