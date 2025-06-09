import React from 'react'
import { Link } from "react-router-dom";

const MovieCard = ({movie}) => {
  // Destructure from the transformed movie object structure
  const {
    id,
    title,
    imdb_rating,
    poster_path,
    release_date,
    original_language,
    country
  } = movie;

  // Extract year from release_date
  const year = release_date ? new Date(release_date).getFullYear() : 'N/A';
  
  // Format language - capitalize first letter and handle multiple languages
  const formatLanguage = (lang) => {
    if (!lang || lang === 'N/A') return 'N/A';
    return lang.split(',')[0].trim().charAt(0).toUpperCase() + lang.split(',')[0].trim().slice(1);
  };

  return (
    <Link to={`/movie/${id}`}>
      <div className='movie-card fade-in'>
        <img 
          src={poster_path? poster_path : `/no-movie.png`} 
          className='hover:scale-104 transition-all duration-300 ease-in-out cursor-pointer'
          alt={title} 
        />

        <div className='mt-4'>
          <h3 className="hover-effect-for-text">{title}</h3>
          <div className='content'>
            <div className='rating'>
              <img src="/star.svg" alt="star icon" />
              <p className='hover:text-2xl hover:text-gradient transition-all duration-300 ease-in-out cursor-pointer'>
                {imdb_rating && imdb_rating !== 0 ? parseFloat(imdb_rating).toFixed(1) : 'N/A'}
              </p>
            </div>
            <span className='text-white'>•</span>
            <p className='lang hover:text-2xl hover:text-gradient transition-all duration-300 ease-in-out cursor-pointer'>
              {formatLanguage(original_language)}
            </p>
            <span className='text-white'>•</span>
            <p className='year hover:text-2xl hover:text-gradient transition-all duration-300 ease-in-out cursor-pointer'>
              {year}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard;