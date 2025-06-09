import React from "react";
import { useDebounce } from "react-use";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import FadeInOnScroll from '../components/FadeInOnScroll';
import WAVES from 'vanta/dist/vanta.waves.min';

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [DebouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useDebounce(() =>setDebouncedSearchTerm(searchTerm),500,[searchTerm])

  const fetchMovies = useCallback(async (query = '') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const REGION = 'US';
      const endpoint = query
  ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&region=${REGION}`
  : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&region=${REGION}`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      if (data.response === "False") {
        setErrorMessage(
          data.Error || "Failed to fetch movies. Please try again later."
        );
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(DebouncedSearchTerm);
  }, [DebouncedSearchTerm]);

  // Vanta.js initialization
  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = WAVES({
        el: vantaRef.current,
        mouseControls: false,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x23153c,
        shininess: 30.00,
        waveHeight: 15.00,
        waveSpeed: 0.75,
        zoom: 0.65
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    }
  }, []);

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>{searchTerm ? `${searchTerm} - Movie Search Results` : 'Discover Popular Movies - Movie Search App'}</title>
        <meta name="description" content={searchTerm ? `Find ${searchTerm} movies and discover new films. Browse our collection of popular movies with ratings, reviews and details.` : 'Discover popular movies, search for your favorites, and explore new films. Find movie ratings, reviews, and detailed information about the latest releases.'} />
        <meta name="keywords" content="movies, movie search, popular movies, film discovery, movie ratings, cinema, entertainment" />
        <meta property="og:title" content={searchTerm ? `${searchTerm} - Movie Search Results` : 'Discover Popular Movies'} />
        <meta property="og:description" content="Find and discover amazing movies with our easy-to-use movie search platform" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </head>

      <main 
        ref={vantaRef}
        className="min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        {/* Content */}
        <div className="relative z-20">
          <header className="text-center py-20 px-6">
            <div className="mb-8 relative">
              <img 
                src="./hero-img.png" 
                alt="Movie Discovery Hero Banner - Find Your Next Favorite Film" 
                className="mx-auto max-w-md w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                loading="eager"
                width="400"
                height="300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-lg blur-2xl"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Find{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Movies
              </span>{" "}
              You'll Enjoy
              <br />
              <span className="text-3xl md:text-4xl text-gray-300 font-light">
                Without the Hassle
              </span>
            </h1>
            
            <div className="max-w-2xl mx-auto transform transition-all duration-500 hover:scale-105">
              <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm} />
            </div>
          </header>

          <section className="px-6 pb-20" role="main" aria-label="Movie Results">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-12 text-center">
                {searchTerm ? `Search Results for "${searchTerm}"` : "Popular Movies"}
              </h2>
              
              {isLoading ? (
                <div role="status" aria-label="Loading movies">
                  <Spinner />
                </div>
              ) : errorMessage ? (
                <div className="text-center py-20" role="alert">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
                    <p className="text-red-400 text-lg">{errorMessage}</p>
                  </div>
                </div>
              ) : (
                <ul 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  role="list"
                  aria-label={`${movieList.length} movies found`}
                >
                  {movieList.map((movie, index) => (
                    <FadeInOnScroll key={movie.id}>
                      <li 
                        className="transform hover:scale-105 transition-all duration-300 hover:z-10 relative will-change-transform"
                        style={{ animationDelay: `${Math.min(index * 0.05, 1)}s` }}
                        role="listitem"
                      >
                        <MovieCard movie={movie} />
                      </li>
                    </FadeInOnScroll>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default App;