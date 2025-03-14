// NASA API Types
export interface ApodResponse {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
}

export interface NeoObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    miles: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    feet: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
}

export interface NeoFeedResponse {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: NeoObject[];
  };
}

// Astronomy API Types
export interface CelestialBody {
  id: string;
  name: string;
  position: {
    horizontal: {
      altitude: {
        degrees: number;
        string: string;
      };
      azimuth: {
        degrees: number;
        string: string;
      };
    };
    equatorial: {
      rightAscension: {
        hours: number;
        string: string;
      };
      declination: {
        degrees: number;
        string: string;
      };
    };
  };
  distance: {
    fromEarth: {
      au: number;
      km: number;
      lightyears: number;
    };
  };
  extraInfo: {
    magnitude: number;
    constellation: {
      id: string;
      name: string;
      latinName: string;
    };
  };
}

export interface CelestialPositionsResponse {
  data: {
    dates: {
      [date: string]: {
        bodies: {
          [bodyName: string]: CelestialBody;
        };
      };
    };
  };
}

export interface StarChartResponse {
  data: {
    imageUrl: string;
  };
}

export interface MoonPhaseResponse {
  data: {
    imageUrl: string;
    phase: {
      phase: string;
      name: string;
      illumination: number;
      angle: number;
    };
  };
}

// ISS API Types
export interface IssLocationResponse {
  message: string;
  timestamp: number;
  iss_position: {
    latitude: string;
    longitude: string;
  };
}

export interface IssPassResponse {
  message: string;
  request: {
    latitude: number;
    longitude: number;
    altitude: number;
    passes: number;
    datetime: number;
  };
  response: Array<{
    duration: number;
    risetime: number;
  }>;
}

export interface PeopleInSpaceResponse {
  message: string;
  number: number;
  people: Array<{
    name: string;
    craft: string;
  }>;
}

export interface IssLocationForMap {
  lat: number;
  lng: number;
  timestamp: number;
}

// Celestial Event Types
export interface CelestialEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  type: 'eclipse' | 'meteor-shower' | 'planet-conjunction' | 'moon-phase' | 'other';
  location?: string;
  visibility?: string;
  imageUrl?: string;
}

// UI Types
export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// News Types
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  source: string;
  publishedAt: string;
} 