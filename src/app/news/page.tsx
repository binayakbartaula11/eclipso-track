"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { FaExternalLinkAlt, FaSearch, FaFilter } from 'react-icons/fa';

// Sample news data for demonstration
const sampleNewsArticles = [
  {
    id: '1',
    title: 'James Webb Space Telescope Reveals New Discoveries',
    description: 'The James Webb Space Telescope continues to revolutionize our understanding of the universe with its latest observations of distant galaxies.',
    url: 'https://science.nasa.gov/mission/webb/latestnews/',
    imageUrl: 'https://www.nasa.gov/wp-content/uploads/2022/07/web_first_images_release.png?w=2048',
    source: 'NASA',
    publishedAt: '2023-10-15',
    category: 'Astronomy'
  },
  {
    id: '2',
    title: 'NASA\'s Perseverance Rover Finds Evidence of Ancient Martian Lake',
    description: 'The Perseverance rover has discovered compelling evidence that the Jezero Crater on Mars was once a lake environment that could have supported ancient microbial life.',
    url: 'https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-perseverance-rover-deciphers-ancient-history-of-martian-lake/',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA23239/PIA23239~orig.jpg?w=1865&h=1495&fit=clip&crop=faces%2Cfocalpoint',
    // source: 'NASA',
    publishedAt: '2023-09-28',
    category: 'Space Exploration'
  },
  {
    id: '3',
    title: 'SpaceX Successfully Launches Starship Prototype',
    description: 'SpaceX has successfully launched and landed a prototype of its Starship vehicle, designed to eventually carry humans to Mars.',
    url: 'https://www.spacex.com/launches/',
    imageUrl: 'https://techcrunch.com/wp-content/uploads/2021/05/HP_SN15_Desktop.jpg?w=1024',
    // source: 'NASA',
    publishedAt: '2023-09-15',
    category: 'Space Technology'
  },
  {
    id: '4',
    title: 'Astronomers Discover Earth-like Exoplanet in Habitable Zone',
    description: 'Astronomers have discovered a new exoplanet that is similar in size to Earth and orbits its star in the habitable zone, where liquid water could exist on its surface.',
    url: 'https://science.nasa.gov/universe/exoplanets/discovery-alert-a-super-earth-in-the-habitable-zone/',
    imageUrl: 'https://science.nasa.gov/wp-content/uploads/2024/01/toi715b1280-illo.jpg',
    // source: 'NASA',
    publishedAt: '2023-08-22',
    category: 'Astronomy'
  },
  {
    id: '5',
    title: 'NASA\'s Artemis Program Prepares for Moon Mission',
    description: 'NASA\'s Artemis program is making significant progress as it prepares to return humans to the Moon for the first time since the Apollo missions.',
    url: 'https://www.nasa.gov/humans-in-space/artemis/',
    imageUrl: 'https://cdn.mos.cms.futurecdn.net/2epY5LNfoPScFvNcGd7UbH-1200-80.jpg',
    // source: 'NASA',
    publishedAt: '2023-08-10',
    category: 'Space Exploration'
  },
  {
    id: '6',
    title: 'New Study Reveals Insights into Dark Matter',
    description: 'A new study using data from multiple telescopes has provided new insights into the nature of dark matter, the mysterious substance that makes up a significant portion of the universe.',
    url: 'https://www.sciencedaily.com/news/space_time/dark_matter/',
    imageUrl: 'https://www.uottawa.ca/about-us/sites/g/files/bhrskd336/files/styles/max_width_l_1470px/public/2024-03/istockphoto-1088863384-2048x2048_cleanup.jpg?itok=sKgT9LMH',
    // source: 'NASA',
    publishedAt: '2023-07-28',
    category: 'Astrophysics'
  },
];

export default function NewsPage() {
  const [articles, setArticles] = useState(sampleNewsArticles);
  const [filteredArticles, setFilteredArticles] = useState(sampleNewsArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // In a real app, this would fetch data from an API
  useEffect(() => {
    // Simulating API fetch
    setLoading(true);
    setTimeout(() => {
      setArticles(sampleNewsArticles);
      setFilteredArticles(sampleNewsArticles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterArticles(term, selectedCategory);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    filterArticles(searchTerm, category);
  };

  const filterArticles = (term: string, category: string) => {
    let filtered = articles;
    
    // Filter by search term
    if (term) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(term.toLowerCase()) || 
        article.description.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(article => article.category === category);
    }
    
    setFilteredArticles(filtered);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 glow-text">Space News</h1>
        
        <div className="bg-indigo-900/20 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30 mb-8">
          <p className="text-gray-300">
          Stay updated with the latest highlights in space exploration, astronomy, and astrophysics. We bring you only the best news from trusted sources, including NASA.
          </p>
        </div>
        
        {/* Featured News */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 gradient-text">Featured Story</h2>
          <div className="relative w-full h-[40vh] bg-black/40 rounded-lg border border-indigo-900/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
            {articles.length > 0 && (
              <Image
                src={articles[0].imageUrl}
                alt={articles[0].title}
                fill
                className="object-cover"
                unoptimized
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <span className="bg-indigo-600/70 text-white text-xs px-2 py-1 rounded-full mb-3 inline-block">
                Featured
              </span>
              <h3 className="text-2xl font-bold mb-2">{articles.length > 0 ? articles[0].title : 'Loading...'}</h3>
              <p className="text-gray-300 mb-4">
                {articles.length > 0 ? articles[0].description : 'Loading article description...'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {articles.length > 0 ? `${articles[0].source} • ${formatDate(articles[0].publishedAt)}` : 'Loading...'}
                </span>
                {articles.length > 0 && (
                  <a
                    href={articles[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 flex items-center gap-2"
                  >
                    Read More <FaExternalLinkAlt size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search news..."
                className="w-full bg-black/40 border border-indigo-900/50 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-indigo-900/30'}`}
                  onClick={() => handleCategoryFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'Space Exploration' ? 'bg-indigo-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-indigo-900/30'}`}
                  onClick={() => handleCategoryFilter('Space Exploration')}
                >
                  Space Exploration
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'Astronomy' ? 'bg-indigo-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-indigo-900/30'}`}
                  onClick={() => handleCategoryFilter('Astronomy')}
                >
                  Astronomy
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'Astrophysics' ? 'bg-indigo-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-indigo-900/30'}`}
                  onClick={() => handleCategoryFilter('Astrophysics')}
                >
                  Astrophysics
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'Space Technology' ? 'bg-indigo-600 text-white' : 'bg-black/40 text-gray-400 hover:bg-indigo-900/30'}`}
                  onClick={() => handleCategoryFilter('Space Technology')}
                >
                  Space Technology
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Latest News */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Latest News</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div 
                  key={article.id}
                  className="bg-indigo-900/10 backdrop-blur-sm rounded-lg border border-indigo-900/30 hover:border-indigo-500/50 transition-colors duration-300 overflow-hidden"
                >
                  <div className="relative h-48 bg-black/60">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-indigo-400 text-xs mb-2 block">{article.category}</span>
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{formatDate(article.publishedAt)}</span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                      >
                        Read More <FaExternalLinkAlt size={10} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-indigo-900/10 backdrop-blur-sm rounded-lg border border-indigo-900/30">
              <p className="text-gray-400">No news articles found matching your criteria.</p>
            </div>
          )}
        </div>
        
        {/* News Resources */}
        <div className="mt-12 bg-indigo-900/10 backdrop-blur-sm p-6 rounded-lg border border-indigo-900/30">
          <h2 className="text-2xl font-bold mb-4">Space News Resources</h2>
          <p className="text-gray-300 mb-6">
          Stay up to date with the latest news, missions, and space discoveries from top space agencies and private space companies worldwide.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://www.nasa.gov/news/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">NASA News</h3>
              <p className="text-gray-400 text-sm">Stay up to date with the latest developments from NASA, including updates on missions, groundbreaking scientific discoveries, space exploration advancements, and more.</p>
            </a>
            <a
              href="https://www.spacex.com/updates/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">SpaceX News</h3>
              <p className="text-gray-400 text-sm">Follow SpaceX for updates on their launches, missions, and advancements in space technology, including their Starship program and Falcon rockets.</p>
            </a>
            <a
              href="https://www.blueorigin.com/news"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">Blue Origin News</h3>
              <p className="text-gray-400 text-sm">Get updates on Blue Origin’s reusable rocket development, the New Shepard suborbital vehicle, and their lunar exploration plans with the Blue Moon lander.</p>
            </a>
            <a
              href="https://www.rocketlabusa.com/updates/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">Rocket Lab</h3>
              <p className="text-gray-400 text-sm">Keep up with Rocket Lab’s small satellite launch capabilities, designed to make space accessible for commercial and scientific enterprises.</p>
            </a>
            <a
              href="https://www.virgingalactic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">Virgin Galactic</h3>
              <p className="text-gray-400 text-sm">Follow Virgin Galactic's progress in commercial space tourism with their SpaceShipTwo suborbital vehicle.</p>
            </a>
            <a
              href="https://www.nasa.gov/missions/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/40 p-4 rounded-lg hover:bg-black/60 transition-colors duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">NASA Missions</h3>
              <p className="text-gray-400 text-sm">Learn about current and future NASA missions exploring Earth, the solar system, and beyond.</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
} 