import axios from 'axios';

const ISS_API_CURRENT_LOCATION =
  process.env.NEXT_PUBLIC_ISS_API_CURRENT_LOCATION ||
  'https://api.wheretheiss.at/v1/satellites/25544';
const ISS_API_PASS_PREDICTIONS =
  process.env.NEXT_PUBLIC_ISS_API_PASS_PREDICTIONS ||
  'https://api.open-notify.org/iss-pass.json';
const ISS_API_PEOPLE_IN_SPACE =
  'https://api.open-notify.org/astros.json';

// Get the current location of the ISS
export const getCurrentIssLocation = async () => {
  try {
    const response = await axios.get(ISS_API_CURRENT_LOCATION);
    return response.data;
  } catch (error) {
    console.error('Error fetching ISS location:', error);
    throw error;
  }
};

// Get the predicted passes of the ISS for a specific location
export const getIssPasses = async (
  latitude: number,
  longitude: number,
  altitude: number = 0,
  passes: number = 5
) => {
  try {
    const response = await axios.get(ISS_API_PASS_PREDICTIONS, {
      params: {
        lat: latitude,
        lon: longitude,
        alt: altitude,
        n: passes,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ISS passes:', error);
    throw error;
  }
};

// Get the current number of people in space and their names
export const getPeopleInSpace = async () => {
  try {
    const response = await axios.get(ISS_API_PEOPLE_IN_SPACE);
    return response.data;
  } catch (error) {
    console.error('Error fetching people in space:', error);
    throw error;
  }
};

// Format ISS location data for use with maps.
// Supports both open-notify (with "iss_position") and wheretheiss.at response formats.
export const formatIssLocationForMap = (data: any) => {
  if (!data) return null;

  // Open-Notify API structure
  if (data.iss_position) {
    const { latitude, longitude } = data.iss_position;
    return {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      // If altitude/velocity aren't provided, fallback to 0
      altitude: data.altitude || 0,
      velocity: data.velocity || 0,
      timestamp: data.timestamp,
    };
  }

  // wheretheiss.at API structure
  if (data.latitude && data.longitude) {
    return {
      lat: data.latitude,
      lng: data.longitude,
      altitude: data.altitude || 0,
      velocity: data.velocity || 0,
      timestamp: data.timestamp,
    };
  }

  return null;
};

// Named export for the API service
const issApiService = {
  getCurrentIssLocation,
  getIssPasses,
  getPeopleInSpace,
  formatIssLocationForMap,
};

export default issApiService;
