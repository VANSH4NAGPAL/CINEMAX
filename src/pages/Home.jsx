import React from "react";
import { useDebounce } from "react-use";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import FadeInOnScroll from '../components/FadeInOnScroll';
import WAVES from 'vanta/dist/vanta.waves.min';

// OMDb API Configuration
const API_BASE_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "b9bd48a6"; // Free demo key

// Popular movie titles to show when no search (mix of classics and recent hits)
const POPULAR_MOVIES = [
  "The Dark Knight", "Inception", "Pulp Fiction", "The Godfather",
  "Avengers: Endgame", "Spider-Man: No Way Home", "Top Gun: Maverick", "Dune",
  "Interstellar", "The Matrix", "Forrest Gump", "The Shawshank Redemption",
  "Joker", "Black Panther", "Wonder Woman", "Iron Man"
];

const App = () => {
  const [searchTerm, setsearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [DebouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovieDetails = async (imdbID) => {
    try {
      const detailUrl = `${API_BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
      const response = await fetch(detailUrl);
      const data = await response.json();
      return data.Response === "True" ? data : null;
    } catch (error) {
      console.error(`Error fetching details for ${imdbID}:`, error);
      return null;
    }
  };

  const fetchMovies = useCallback(async (query = '') => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      let movieIds = [];
      
      if (query) {
        // Search for movies first (this gives us basic info + IMDb IDs)
        const searchUrl = `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
        console.log('Search URL:', searchUrl);
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.Response === "True") {
          movieIds = data.Search?.slice(0, 12) || []; // Limit to 12 results
        } else {
          setErrorMessage(data.Error || "No movies found");
          setMovieList([]);
          return;
        }
      } else {
        // For popular movies, first search for each title to get IMDb ID
        console.log('Fetching popular movies...');
        const popularMoviePromises = POPULAR_MOVIES.slice(0, 8).map(async (title) => {
          try {
            const searchUrl = `${API_BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}&type=movie`;
            const response = await fetch(searchUrl);
            const data = await response.json();
            return data.Response === "True" ? { imdbID: data.imdbID, Title: data.Title, Year: data.Year } : null;
          } catch (error) {
            console.error(`Error searching for ${title}:`, error);
            return null;
          }
        });
        
        const popularResults = await Promise.all(popularMoviePromises);
        movieIds = popularResults.filter(movie => movie !== null);
      }

      if (movieIds.length === 0) {
        setErrorMessage("No movies found");
        setMovieList([]);
        return;
      }

      // Now fetch complete details for each movie using IMDb ID
      console.log(`Fetching details for ${movieIds.length} movies...`);
      const detailPromises = movieIds.map(movie => fetchMovieDetails(movie.imdbID));
      const detailedMovies = await Promise.all(detailPromises);
      const validMovies = detailedMovies.filter(movie => movie !== null);

      // Transform OMDb detailed data to match your MovieCard component structure
      const transformedMovies = validMovies.map(movie => {
        // Parse genres from string to array
        const genres = movie.Genre !== "N/A" ? movie.Genre.split(', ') : [];
        
        // Parse vote count (remove commas)
        const voteCount = movie.imdbVotes !== "N/A" ? 
          parseInt(movie.imdbVotes.replace(/,/g, '')) || 0 : 0;
        
        // Parse rating
        const rating = movie.imdbRating !== "N/A" ? parseFloat(movie.imdbRating) || 0 : 0;
        
        // Parse release date
        const releaseYear = movie.Year.includes('–') ? movie.Year.split('–')[0] : movie.Year;
        const releaseDate = movie.Released !== "N/A" ? movie.Released : `${releaseYear}-01-01`;
        
        return {
          id: movie.imdbID,
          title: movie.Title,
          original_title: movie.Title,
          poster_path: movie.Poster !== "N/A" ? movie.Poster : null,
          backdrop_path: movie.Poster !== "N/A" ? movie.Poster : null, // OMDb doesn't have backdrop
          overview: movie.Plot !== "N/A" ? movie.Plot : "No plot available",
          release_date: releaseDate,
          vote_average: rating,
          vote_count: voteCount,
          popularity: rating * voteCount / 1000, // Create popularity score
          adult: movie.Rated === "R" || movie.Rated === "NC-17" || movie.Rated === "X",
          genre_ids: genres, // Keep as array of strings
          genres: genres, // Also provide as genres array
          original_language: movie.Language?.split(',')[0]?.toLowerCase() || "en",
          video: false,
          // Additional OMDb specific data
          rated: movie.Rated,
          runtime: movie.Runtime,
          director: movie.Director,
          writer: movie.Writer,
          actors: movie.Actors,
          awards: movie.Awards,
          metascore: movie.Metascore !== "N/A" ? parseInt(movie.Metascore) : null,
          imdb_rating: rating,
          imdb_votes: voteCount,
          box_office: movie.BoxOffice,
          production: movie.Production,
          country: movie.Country,
          language: movie.Language
        };
      });
      
      console.log('Transformed movies with full details:', transformedMovies);
      setMovieList(transformedMovies);
      
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
      setMovieList([]);
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
              Find{" "}Details About 
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                &nbsp;Movies
              </span>{" "}
              You Enjoy
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