import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Play,
  Star,
  Calendar,
  Clock,
  Globe,
  DollarSign,
  Building2,
  Tag,
  MapPin,
  Languages,
  ArrowLeft,
  Youtube,
  Users,
  Award,
} from "lucide-react";

// API Configuration
const OMDB_API_BASE_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || "b9bd48a6";
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [trailerError, setTrailerError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch movie details using OMDb API with IMDb ID
        const detailUrl = `${OMDB_API_BASE_URL}?apikey=${OMDB_API_KEY}&i=${id}&plot=full`;
        const response = await fetch(detailUrl);
        const data = await response.json();

        if (data.Response === "True") {
          setMovie(data);
          // Fetch trailer after getting movie details
          fetchTrailer(data.Title, data.Year);
        } else {
          console.error("Failed to fetch movie details:", data.Error);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };
    fetchDetails();
  }, [id]);

  const fetchTrailer = async (title, year) => {
    console.log("YouTube API Key:", YOUTUBE_API_KEY ? "Available" : "Not available");
    
    if (!YOUTUBE_API_KEY) {
      console.warn("YouTube API key not provided");
      setTrailerError("YouTube API key not configured");
      return;
    }

    setLoadingTrailer(true);
    setTrailerError(null);
    
    try {
      // Search for trailer on YouTube
      const searchQuery = `${title} ${year} official trailer`;
      console.log("Searching for trailer:", searchQuery);
      
      const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
        searchQuery
      )}&type=video&key=${YOUTUBE_API_KEY}`;

      const response = await fetch(youtubeUrl);
      const data = await response.json();

      console.log("YouTube API Response:", data);

      if (data.error) {
        console.error("YouTube API Error:", data.error);
        setTrailerError(`YouTube API Error: ${data.error.message}`);
        return;
      }

      if (data.items && data.items.length > 0) {
        // Look for the best trailer match
        const trailerVideo = data.items.find(item => 
          item.snippet.title.toLowerCase().includes('trailer') ||
          item.snippet.title.toLowerCase().includes('official')
        ) || data.items[0];
        
        const videoId = trailerVideo.id.videoId;
        const trailerEmbedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
        
        console.log("Found trailer:", trailerVideo.snippet.title);
        console.log("Trailer URL:", trailerEmbedUrl);
        
        setTrailerUrl(trailerEmbedUrl);
      } else {
        console.log("No trailer found for:", searchQuery);
        setTrailerError("No trailer found");
      }
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
      setTrailerError(`Failed to fetch trailer: ${error.message}`);
    } finally {
      setLoadingTrailer(false);
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  if (!movie)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Premium Dark Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/30 via-black to-black"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(139,92,246,0.1)_120deg,transparent_240deg)] animate-pulse"></div>

        <div className="flex flex-col items-center space-y-8">
          {/* Ultra Premium Spinner */}
          <div className="relative">
            {/* Ambient Glow */}
            <div className="absolute -inset-6 bg-gradient-to-r from-violet-600/20 via-transparent to-violet-600/20 rounded-full blur-xl animate-pulse"></div>

            {/* Main Ring */}
            <div
              className="w-20 h-20 border-[1.5px] border-transparent bg-gradient-to-r from-violet-400 via-white to-violet-400 rounded-full animate-spin shadow-2xl shadow-violet-500/30"
              style={{
                background:
                  "conic-gradient(from 0deg, #a855f7, #ffffff, #a855f7)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))",
                animationDuration: "3s",
              }}
            ></div>

            {/* Premium Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-gradient-to-br from-white via-violet-200 to-violet-400 rounded-lg flex items-center justify-center shadow-xl border border-white/30">
                <div className="w-3 h-3 bg-violet-600 rounded-sm animate-pulse shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Luxury Typography */}
          <div className="text-center space-y-6">
            <h2 className="text-xl font-extralight text-white/95 tracking-[0.2em] uppercase">
              Loading
            </h2>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-1 h-1 bg-white/80 rounded-full animate-bounce shadow-lg shadow-white/20"></div>
              <div
                className="w-1 h-1 bg-white/60 rounded-full animate-bounce shadow-lg shadow-white/20"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1 h-1 bg-white/40 rounded-full animate-bounce shadow-lg shadow-white/20"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );

  // Helper functions
  const formatRuntime = (runtime) => {
    if (!runtime || runtime === "N/A") return "N/A";
    const minutes = parseInt(runtime.replace(" min", ""));
    if (isNaN(minutes)) return runtime;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatBudget = (budget) => {
    if (!budget || budget === "N/A") return "N/A";
    const numBudget = parseInt(budget.replace(/[$,]/g, ""));
    if (isNaN(numBudget)) return budget;

    if (numBudget >= 1000000000) {
      return `$${(numBudget / 1000000000).toFixed(1)}B`;
    }
    if (numBudget >= 1000000) {
      return `$${(numBudget / 1000000).toFixed(1)}M`;
    }
    return `$${numBudget.toLocaleString()}`;
  };

  const getRatingColor = (rating) => {
    if (!rating || rating === "N/A") return "text-gray-400";
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "text-emerald-400";
    if (numRating >= 6) return "text-amber-400";
    return "text-rose-400";
  };

  const getRatingBg = (rating) => {
    if (!rating || rating === "N/A") return "bg-gray-500/20 border-gray-500/30";
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "bg-emerald-500/20 border-emerald-500/30";
    if (numRating >= 6) return "bg-amber-500/20 border-amber-500/30";
    return "bg-rose-500/20 border-rose-500/30";
  };

  // Parse genres from OMDb format
  const genres =
    movie.Genre && movie.Genre !== "N/A" ? movie.Genre.split(", ") : [];

  // Parse IMDb votes
  const voteCount =
    movie.imdbVotes && movie.imdbVotes !== "N/A"
      ? parseInt(movie.imdbVotes.replace(/,/g, "")) || 0
      : 0;

  // Get poster and backdrop URLs
  const posterUrl =
    movie.Poster && movie.Poster !== "N/A" ? movie.Poster : null;
  const backdropUrl = posterUrl; // OMDb doesn't have separate backdrop, use poster

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-500/2 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 pt-8 pl-6 lg:pl-12">
        <button
  onClick={handleBackClick}
  className="group flex items-center gap-2 sm:gap-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-xl px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl border border-slate-700/50 hover:border-slate-600/50 cursor-pointer fixed top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-50"
>
  <ArrowLeft
    size={16}
    className="text-cyan-400 group-hover:text-cyan-300 group-hover:-translate-x-1 transition-all duration-300 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
  />
  <span className="text-white font-medium sm:font-semibold group-hover:text-cyan-100 transition-colors duration-300 text-sm sm:text-base lg:text-lg hidden xs:inline">
    Back to Movies
  </span>
  <span className="text-white font-medium group-hover:text-cyan-100 transition-colors duration-300 text-xs xs:hidden">
    Back
  </span>
</button>
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-6 py-8 lg:px-12 lg:py-12">
        {/* Enhanced Header Section */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
            <div className="flex-row">
              <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight bg-gradient-to-r from-white via-cyan-100 to-purple-100 bg-clip-text text-transparent">
                {movie.Title}
              </h1>

              {/* Enhanced Movie Info Row */}
              <div className="flex flex-wrap items-center gap-6 text-gray-300 text-lg mb-6">
                <span className="font-semibold text-cyan-400">
                  {movie.Year}
                </span>
                <span className="text-gray-500">•</span>
                {movie.Rated && movie.Rated !== "N/A" && (
                  <>
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg ${
                        movie.Rated === "R" ||
                        movie.Rated === "NC-17" ||
                        movie.Rated === "X"
                          ? "bg-gradient-to-r from-red-600 to-red-700"
                          : "bg-gradient-to-r from-blue-600 to-blue-700"
                      }`}
                    >
                      {movie.Rated}
                    </span>
                    <span className="text-gray-500">•</span>
                  </>
                )}
                {movie.Runtime && (
                  <span className="font-semibold flex items-center gap-2">
                    <Clock size={18} className="text-purple-400" />
                    {formatRuntime(movie.Runtime)}
                  </span>
                )}
              </div>
            </div>

            {/* Enhanced Rating */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div
                className={`group flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${getRatingBg(
                  movie.imdbRating
                )}`}
              >
                <Star
                  className="text-amber-400 fill-current drop-shadow-lg group-hover:rotate-12 transition-transform duration-300"
                  size={28}
                />
                <div className="flex flex-col">
                  <span
                    className={`font-bold text-2xl transition-all duration-300 group-hover:scale-110 ${getRatingColor(
                      movie.imdbRating
                    )}`}
                  >
                    {movie.imdbRating && movie.imdbRating !== "N/A"
                      ? parseFloat(movie.imdbRating).toFixed(1)
                      : "N/A"}
                  </span>
                  <span className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors duration-300">
                    ({voteCount ? voteCount.toLocaleString() : "N/A"} votes)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section with Exact Dimensions */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Left - Poster with exact dimensions: 302px × 441px */}
          <div className="flex-shrink-0">
            <div className="relative group">
              {posterUrl ? (
                <div className="relative flex justify-center">
                  {/* Glowing border effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-700"></div>

                  <img
                    src={posterUrl}
                    alt={movie.Title}
                    className="relative w-[302px] h-[441px] object-cover rounded-2xl shadow-2xl border border-slate-700/50 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-purple-500/25"
                  />

                  {/* Overlay gradient for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="w-[302px] h-[441px] bg-gradient-to-br from-slate-800 via-purple-900/20 to-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg mb-4 mx-auto flex items-center justify-center">
                      <Star className="text-slate-500" size={24} />
                    </div>
                    <span className="text-gray-400 text-lg font-medium">
                      No Poster
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Trailer/Backdrop Section */}
          <div className="flex-1 lg:flex-initial">
            <div className="relative rounded-3xl overflow-hidden w-full lg:w-[772px] h-[441px] shadow-2xl border border-slate-700/50 group">
              {showTrailer && trailerUrl ? (
                // Show YouTube iframe when trailer is active
                <iframe
                  src={trailerUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title="Movie Trailer"
                />
              ) : backdropUrl ? (
                // Show backdrop with play button overlay
                <>
                  <img
                    src={backdropUrl}
                    alt={movie.Title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Enhanced Overlay Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

                  {/* Play Button Overlay - Show if trailer exists */}
                  {(trailerUrl || loadingTrailer) && (
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-all duration-300 cursor-pointer"
                      onClick={trailerUrl ? toggleTrailer : undefined}
                    >
                      {loadingTrailer ? (
                        <div className="bg-black/70 text-white p-6 rounded-full shadow-2xl backdrop-blur-sm border border-gray-600/30 flex items-center gap-3">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading trailer...</span>
                        </div>
                      ) : (
                        <div className="bg-red-600/90 hover:bg-red-500 text-white p-6 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-red-400/30">
                          <Play size={32} className="ml-1" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* No Trailer Available Message */}
                  {!trailerUrl && !loadingTrailer && trailerError && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-black/70 text-white p-4 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-600/30 text-center">
                        <Youtube size={24} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No trailer available</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // No backdrop available
                <div className="w-full h-full bg-gradient-to-br from-slate-700 via-purple-800/30 to-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-slate-600 rounded-xl mb-4 mx-auto flex items-center justify-center">
                      <Play className="text-slate-400" size={32} />
                    </div>
                    <span className="text-gray-400 text-xl font-medium">
                      No Backdrop Available
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Genres Section */}
        <div className="mb-16">
          <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-2">
            <Tag size={16} />
            Genres
          </h3>
          <div className="flex flex-wrap gap-4">
            {genres.map((genre, index) => (
              <span
                key={index}
                className="px-8 py-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 text-white rounded-2xl font-semibold border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:scale-105 shadow-xl backdrop-blur-sm hover:shadow-purple-500/20 cursor-pointer"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-wrap gap-6 mb-16">
          

          {movie.imdbID && (
            <a
              href={`https://www.imdb.com/title/${movie.imdbID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-10 py-5 rounded-2xl transition-all duration-300 font-semibold shadow-2xl hover:shadow-slate-500/30 hover:scale-105 border border-slate-600/50 backdrop-blur-sm flex items-center gap-3"
            >
              <span className="text-lg">View on IMDb</span>
              <Star
                size={20}
                className="text-amber-400 group-hover:rotate-12 transition-transform duration-300"
              />
            </a>
          )}
        </div>

        {/* Enhanced Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <Tag size={18} className="text-purple-400" />
                Plot
              </h3>
              <p className="text-gray-200 leading-relaxed text-lg font-light">
                {movie.Plot && movie.Plot !== "N/A"
                  ? movie.Plot
                  : "No plot available for this movie."}
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <Calendar size={18} className="text-cyan-400" />
                Release Information
              </h3>
              <p className="text-white text-xl font-semibold">
                {movie.Released && movie.Released !== "N/A"
                  ? movie.Released
                  : `${movie.Year}`}
              </p>
              <p className="text-gray-400 text-sm mt-2">Release Date</p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <MapPin size={18} className="text-pink-400" />
                Country
              </h3>
              <p className="text-white text-lg font-semibold">
                {movie.Country && movie.Country !== "N/A"
                  ? movie.Country
                  : "Not specified"}
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <Languages size={18} className="text-blue-400" />
                Languages
              </h3>
              <p className="text-white text-lg font-semibold">
                {movie.Language && movie.Language !== "N/A"
                  ? movie.Language
                  : "Not specified"}
              </p>
            </div>

            {movie.Metascore && movie.Metascore !== "N/A" && (
              <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:border-slate-600/50">
                <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider">
                  Metascore
                </h3>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-2xl font-bold ${
                      parseInt(movie.Metascore) >= 81
                        ? "text-green-400"
                        : parseInt(movie.Metascore) >= 61
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {movie.Metascore}/100
                  </span>
                  <span className="text-gray-400 text-sm">Critic Score</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <Users size={18} className="text-amber-400" />
                Cast & Crew
              </h3>
              <div className="space-y-4">
                {movie.Director && movie.Director !== "N/A" && (
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Director</p>
                    <p className="text-white font-semibold text-lg">{movie.Director}</p>
                  </div>
                )}
                {movie.Writer && movie.Writer !== "N/A" && (
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Writer</p>
                    <p className="text-white font-semibold">{movie.Writer}</p>
                  </div>
                )}
                {movie.Actors && movie.Actors !== "N/A" && (
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Actors</p>
                    <p className="text-white font-semibold">{movie.Actors}</p>
                  </div>
                )}
              </div>
            </div>

            {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
              <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:border-slate-600/50">
                <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                  <DollarSign size={18} className="text-green-400" />
                  Box Office
                </h3>
                <p className="text-white text-2xl font-bold">
                  {formatBudget(movie.BoxOffice)}
                </p>
                <p className="text-gray-400 text-sm mt-2">Total Earnings</p>
              </div>
            )}

            {movie.Production && movie.Production !== "N/A" && (
              <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:border-slate-600/50">
                <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                  <Building2 size={18} className="text-indigo-400" />
                  Production
                </h3>
                <p className="text-white text-lg font-semibold">
                  {movie.Production}
                </p>
              </div>
            )}

            {movie.Awards && movie.Awards !== "N/A" && (
              <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 hover:border-slate-600/50">
                <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                  <Award size={18} className="text-yellow-400" />
                  Awards
                </h3>
                <p className="text-white font-semibold leading-relaxed">
                  {movie.Awards}
                </p>
              </div>
            )}

            {movie.Website && movie.Website !== "N/A" && (
              <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 hover:border-slate-600/50">
                <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                  <Globe size={18} className="text-teal-400" />
                  Official Website
                </h3>
                <a
                  href={movie.Website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:text-teal-300 font-semibold text-lg transition-colors duration-300 underline-offset-4 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}

            {/* Additional Ratings */}
            {movie.Ratings && movie.Ratings.length > 0 && (
              <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:border-slate-600/50">
                <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                  <Star size={18} className="text-purple-400" />
                  Additional Ratings
                </h3>
                <div className="space-y-4">
                  {movie.Ratings.map((rating, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">
                        {rating.Source}
                      </span>
                      <span className="text-white font-bold">
                        {rating.Value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS for fadeInUp animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MovieDetails;