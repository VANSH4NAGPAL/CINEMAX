// App.js
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from 'react';

const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));

const LoadingSpinner = ({ isVisible, onLoadingComplete }) => {
  useEffect(() => {
    // Ensure loader stays for at least 1.5 seconds
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 1300);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center z-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Elegant background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse top-1/4 left-1/4"></div>
        <div className="absolute w-0.5 h-0.5 bg-yellow-400/20 rounded-full animate-ping top-1/3 right-1/4"></div>
        <div className="absolute w-1.5 h-1.5 bg-white/8 rounded-full animate-pulse bottom-1/3 left-1/3"></div>
        <div className="absolute w-0.5 h-0.5 bg-white/15 rounded-full animate-ping top-2/3 right-1/3"></div>
        <div className="absolute w-1 h-1 bg-yellow-400/15 rounded-full animate-pulse bottom-1/4 right-1/2"></div>
      </div>
      
      {/* Main loader container */}
      <div className="relative flex flex-col items-center space-y-8">
        
        {/* Premium logo/brand area */}
        <div className="text-center mb-6">
          <div className="text-4xl font-light text-white mb-3 tracking-wide">
            CINEMAX
          </div>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-3"></div>
          <div className="text-white/40 text-xs font-light tracking-widest uppercase">
            Explore Movie Details
          </div>
        </div>

        {/* Sophisticated spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-yellow-400 rounded-full animate-spin"></div>
          
          {/* Inner elements */}
          <div className="absolute top-3 left-3 w-10 h-10 border border-white/10 rounded-full"></div>
          <div 
            className="absolute top-3 left-3 w-10 h-10 border-t border-white/60 rounded-full"
            style={{
              animation: 'spin 2s linear infinite reverse'
            }}
          ></div>
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Elegant loading text */}
        <div className="text-center">
          <div className="text-white/80 text-sm font-light mb-4 tracking-wide">
            Loading
          </div>
          
          {/* Minimalist dots */}
          <div className="flex justify-center space-x-2">
            <div 
              className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div 
              className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: '300ms' }}
            ></div>
            <div 
              className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: '600ms' }}
            ></div>
          </div>
        </div>
        
        {/* Subtle progress indicator */}
        <div className="w-48 h-px bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"
          ></div>
        </div>
        
      </div>
      
      {/* Minimal accent elements */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>
    </div>
  );
};

const PageTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  return (
    <>
      <LoadingSpinner isVisible={isLoading} onLoadingComplete={handleLoadingComplete} />
      <div 
        className={`transition-all duration-700 ease-out ${
          showContent 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-4'
        }`}
      >
        {children}
      </div>
    </>
  );
};

const App = () => {
  return (
    <Suspense fallback={<PageTransition><div /></PageTransition>}>
      <Routes>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          } 
        />
        <Route 
          path="/movie/:id" 
          element={<MovieDetails />} 
        />
      </Routes>
    </Suspense>
  );
};

export default App;