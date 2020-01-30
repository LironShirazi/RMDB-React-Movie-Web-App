import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MovieThumb.css';


const MovieThumb = ({image, movieId, movieName, clickable}) => (
        <div className="rmdb-moviethumb">
            {clickable ? 
                <Link to={{ pathname: `/${movieId}`, movieName: `${movieName}` }}>
                    <img src={image} alt="moviethumb" />
                </Link>
                :
                <img src={image} alt="moviethumb" />
            }
        </div>
    );

MovieThumb.propTypes = {
    movieName : PropTypes.string,
    image : PropTypes.string,
    movieId : PropTypes.number 
}



export default MovieThumb;