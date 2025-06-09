import React from 'react'
import { Link } from "react-router-dom";

const MovieCard = ({movie : {id,title,vote_average,poster_path,release_date,original_language,vote_count}}) => {
  return (
    <Link to={`/movie/${id}`}>
    <div className='movie-card fade-in'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}`:
        `/no-movie.png`} className='hover:scale-104 transition-all duration-300 ease-in-out cursor-pointer'
        alt={title} />

        <div className='mt-4'>
            <h3 className="hover-effect-for-text">{title}</h3>
            <div className='content'>
                <div className='rating'>
                    <img src="/star.svg" alt="star icon" />
                    <p className='hover:text-2xl hover:text-gradient transition-all duration-300 ease-in-out cursor-pointer'>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>
                <span className='text-white'>•</span>
                <p className='lang hover:text-2xl hover:text-gradient transition-all duration-300 ease-in-out cursor-pointer'>{original_language}</p>
                <span className='text-white '>•</span>
                <p className='year hover:text-2xl hover:text-gradient transition-all duration-300 ease-in-out cursor-pointer'>{release_date ? release_date.split('-')[0]:'N/A'}</p>
            </div>
        </div>
    </div>
    </Link>
  )
}

export default MovieCard