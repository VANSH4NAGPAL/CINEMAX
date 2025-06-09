import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play, Star, Calendar, Clock, Globe, DollarSign, Building2, Tag, MapPin, Languages, X, ArrowLeft } from "lucide-react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch movie details
        const movieRes = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
        const movieData = await movieRes.json();
        
        // Fetch videos (trailers)
        const videosRes = await fetch(`${API_BASE_URL}/movie/${id}/videos`, API_OPTIONS);
        const videosData = await videosRes.json();
        
        setMovie(movieData);
        setVideos(videosData.results || []);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate('/');
  };

  
 if (!movie) return (
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
        <div className="w-20 h-20 border-[1.5px] border-transparent bg-gradient-to-r from-violet-400 via-white to-violet-400 rounded-full animate-spin shadow-2xl shadow-violet-500/30" 
             style={{
               background: 'conic-gradient(from 0deg, #a855f7, #ffffff, #a855f7)',
               WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
               mask: 'radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px))',
               animationDuration: '3s'
             }}>
        </div>
        
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
          <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce shadow-lg shadow-white/20" style={{animationDelay: '0.2s'}}></div>
          <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce shadow-lg shadow-white/20" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  </div>
);

  const trailer = videos.find(video => video.type === "Trailer" && video.site === "YouTube") || videos[0];
  const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatBudget = (budget) => {
    if (budget >= 1000000000) {
      return `$${(budget / 1000000000).toFixed(1)}B`;
    }
    if (budget >= 1000000) {
      return `$${(budget / 1000000).toFixed(1)}M`;
    }
    return `$${budget.toLocaleString()}`;
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-emerald-400";
    if (rating >= 6) return "text-amber-400";
    return "text-rose-400";
  };

  const getRatingBg = (rating) => {
    if (rating >= 8) return "bg-emerald-500/20 border-emerald-500/30";
    if (rating >= 6) return "bg-amber-500/20 border-amber-500/30";
    return "bg-rose-500/20 border-rose-500/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-500/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-500/2 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 pt-8 pl-6 lg:pl-12">
        <button
          onClick={handleBackClick}
          className="group flex items-center gap-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-xl px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl border border-slate-700/50 hover:border-slate-600/50"
        >
          <ArrowLeft 
            size={20} 
            className="text-cyan-400 group-hover:text-cyan-300 group-hover:-translate-x-1 transition-all duration-300" 
          />
          <span className="text-white font-semibold group-hover:text-cyan-100 transition-colors duration-300">
            Back to Movies
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
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-2xl text-gray-300 italic mb-4 font-light">"{movie.tagline}"</p>
              )}
              
              {/* Enhanced Movie Info Row */}
              <div className="flex flex-wrap items-center gap-6 text-gray-300 text-lg mb-6">
                <span className="font-semibold text-cyan-400">{new Date(movie.release_date).getFullYear()}</span>
                <span className="text-gray-500">•</span>
                {movie.adult && (
                  <>
                    <span className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg">18+</span>
                    <span className="text-gray-500">•</span>
                  </>
                )}
                {movie.runtime && (
                  <span className="font-semibold flex items-center gap-2">
                    <Clock size={18} className="text-purple-400" />
                    {formatRuntime(movie.runtime)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Enhanced Rating */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`group flex items-center gap-4 px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${getRatingBg(movie.vote_average)}`}>
                <Star className="text-amber-400 fill-current drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" size={28} />
                <div className="flex flex-col">
                  <span className={`font-bold text-2xl transition-all duration-300 group-hover:scale-110 ${getRatingColor(movie.vote_average)}`}>
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors duration-300">({movie.vote_count.toLocaleString()} votes)</span>
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
                    alt={movie.title}
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
                    <span className="text-gray-400 text-lg font-medium">No Poster</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Backdrop/Video with exact dimensions: 772px × 441px */}
          <div className="flex-1 lg:flex-initial">
            <div className="relative rounded-3xl overflow-hidden w-full lg:w-[772px] h-[441px] shadow-2xl border border-slate-700/50 group">
              {showTrailer && trailer ? (
                <div className="relative w-full h-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
                    title={trailer.name || "Movie Trailer"}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <button
                    onClick={() => setShowTrailer(false)}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  {backdropUrl ? (
                    <img 
                      src={backdropUrl} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 via-purple-800/30 to-slate-800 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-slate-600 rounded-xl mb-4 mx-auto flex items-center justify-center">
                          <Play className="text-slate-400" size={32} />
                        </div>
                        <span className="text-gray-400 text-xl font-medium">No Backdrop Available</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Overlay Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
                  
                  {/* Enhanced Play Button */}
                  {trailer && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        onClick={() => setShowTrailer(true)}
                        className="group/play relative"
                      >
                        {/* Pulsing rings */}
                        <div className="absolute inset-0 bg-white/10 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 bg-white/5 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                        
                        {/* Main button */}
                        <div className="relative bg-white/15 hover:bg-white/25 rounded-full p-8 transition-all duration-300 backdrop-blur-xl border border-white/20 hover:border-white/40 hover:scale-110 shadow-2xl">
                          <Play className="text-white fill-current group-hover/play:scale-110 transition-transform duration-300" size={56} />
                        </div>
                      </button>
                    </div>
                  )}
                </>
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
            {movie.genres?.map((genre, index) => (
              <span 
                key={genre.id}
                className="px-8 py-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 text-white rounded-2xl font-semibold border border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:scale-105 shadow-xl backdrop-blur-sm hover:shadow-purple-500/20 cursor-pointer"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-wrap gap-6 mb-16">
          {movie.homepage && (
            <a 
              href={movie.homepage} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-5 rounded-2xl transition-all duration-300 flex items-center gap-4 font-semibold shadow-2xl hover:shadow-purple-500/30 hover:scale-105 border border-purple-500/30 backdrop-blur-sm"
            >
              <Globe size={24} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-lg">Official Website</span>
              <div className="w-2 h-2 bg-white/60 rounded-full group-hover:w-6 group-hover:h-0.5 transition-all duration-300"></div>
            </a>
          )}
          {movie.imdb_id && (
            <a 
              href={`https://www.imdb.com/title/${movie.imdb_id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-10 py-5 rounded-2xl transition-all duration-300 font-semibold shadow-2xl hover:shadow-slate-500/30 hover:scale-105 border border-slate-600/50 backdrop-blur-sm flex items-center gap-3"
            >
              <span className="text-lg">View on IMDb</span>
              <Star size={20} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
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
                Synopsis
              </h3>
              <p className="text-gray-200 leading-relaxed text-lg font-light">
                {movie.overview || "No synopsis available for this movie."}
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <Calendar size={18} className="text-cyan-400" />
                Release Information
              </h3>
              <p className="text-white text-xl font-semibold">
                {new Date(movie.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-400 text-sm mt-2">Worldwide Release</p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <MapPin size={18} className="text-pink-400" />
                Production Countries
              </h3>
              <p className="text-white text-lg font-semibold">
                {movie.production_countries?.map(country => country.name).join(' • ') || 'Not specified'}
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider">Release Status</h3>
              <span className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-bold shadow-lg ${
                movie.status === 'Released' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  movie.status === 'Released' ? 'bg-emerald-400' : 'bg-amber-400'
                } animate-pulse`}></div>
                {movie.status}
              </span>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <Languages size={18} className="text-blue-400" />
                Languages
              </h3>
              <p className="text-white text-lg font-semibold">
                {movie.spoken_languages?.map(lang => lang.english_name).join(' • ') || movie.original_language?.toUpperCase() || 'Not specified'}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <DollarSign size={18} className="text-green-400" />
                Production Budget
              </h3>
              <p className="text-white text-2xl font-bold">
                {movie.budget ? formatBudget(movie.budget) : 'Undisclosed'}
              </p>
              <p className="text-gray-400 text-sm mt-2">Estimated Investment</p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <DollarSign size={18} className="text-emerald-400" />
                Box Office Revenue
              </h3>
              <p className="text-white text-2xl font-bold">
                {movie.revenue ? formatBudget(movie.revenue) : 'Undisclosed'}
              </p>
              <p className="text-gray-400 text-sm mt-2">Worldwide Earnings</p>
            </div>

            {movie.tagline && (
              <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 hover:border-slate-600/50">
                <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider">Official Tagline</h3>
                <p className="text-white text-xl font-semibold italic leading-relaxed">"{movie.tagline}"</p>
              </div>
            )}

            <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:border-slate-600/50">
              <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider flex items-center gap-3">
                <Building2 size={18} className="text-orange-400" />
                Production Studios
              </h3>
              <p className="text-white text-lg font-semibold leading-relaxed">
                {movie.production_companies?.map(company => company.name).join(' • ') || 'Not specified'}
              </p>
            </div>

            {/* Profit/Loss indicator if both budget and revenue are available */}
            {movie.budget && movie.revenue && (
              <div className="bg-slate-800/30 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 hover:border-slate-600/50">
                <h3 className="text-gray-400 text-sm mb-6 font-bold uppercase tracking-wider">Financial Performance</h3>
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                    movie.revenue > movie.budget 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {movie.revenue > movie.budget ? 'Profitable' : 'Loss'}
                  </div>
                  <p className="text-white text-lg font-semibold">
                    {formatBudget(Math.abs(movie.revenue - movie.budget))} {movie.revenue > movie.budget ? 'Profit' : 'Loss'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
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