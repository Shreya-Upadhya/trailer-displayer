import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './Components/MovieList';
import MovieListHeading from './Components/MovieListHeading';
import SearchBox from './Components/SearchBox';
import AddFavourites from './Components/AddFavourites';
import RemoveFavourites from './Components/RemoveFavourites';


const App = () => {
	const [movies, setMovies] = useState([]);
	const [favourites, setFavourites] = useState([]);
	const [searchValue, setSearchValue] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');

	const getMovieRequest = async (searchValue) => {
		const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=5c2eb3f8`;

		const response = await fetch(url);
		const responseJson = await response.json();

		if (responseJson.Search) {
			setMovies(responseJson.Search);
		}
	};
	const getTrailerUrl = async (imdbID) => {
        const apiKey = '2fe32422e889db522eef20cd17b617c1'; // Replace with your TMDb API key
        const url = `https://api.themoviedb.org/3/find/${imdbID}?api_key=${apiKey}&external_source=imdb_id`;
        const response = await fetch(url);
        const data = await response.json();
        console.log('Data from TMDb API:', data);
        
        const movieId = data.movie_results[0]?.id;
        if (movieId) {
            const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
            const videosResponse = await fetch(videosUrl);
            const videosData = await videosResponse.json();
            console.log('Videos Data from TMDb API:', videosData);
            
            const trailer = videosData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            return trailer ? `https://www.youtube.com/embed/${trailer.key}` : ''; // Use 'embed' format
        }
        return '';
    };
const handlePosterClick = async (imdbID) => {
  const url = await getTrailerUrl(imdbID);
  setTrailerUrl(url); //  trailerUrl 
};
	useEffect(() => {
		getMovieRequest(searchValue);
	}, [searchValue]);

	useEffect(() => {
		const movieFavourites = JSON.parse(
			localStorage.getItem('react-ott-favourites')
		);

		if (movieFavourites) {
			setFavourites(movieFavourites);
		}
	}, []);

	const saveToLocalStorage = (items) => {
		localStorage.setItem('react-ott-favourites', JSON.stringify(items));
	};

	const addFavouriteMovie = (movie) => {
		const newFavouriteList = [...favourites, movie];
		setFavourites(newFavouriteList);
		saveToLocalStorage(newFavouriteList);
	};

	const removeFavouriteMovie = (movie) => {
		const newFavouriteList = favourites.filter(
			(favourite) => favourite.imdbID !== movie.imdbID
		);

		setFavourites(newFavouriteList);
		saveToLocalStorage(newFavouriteList);
	};

	return (
		
			<div className='container-fluid ott'>
				<nav className="navbar">
					<img src="/film.png" alt="Logo" className="logo" /> 
					<ul className="nav-list">
						<li className="nav-item"><a href="/home">Home</a></li>
						<li className="nav-item"><a href="/tvshows">Trending</a></li>
						<li className="nav-item"><a href="/tvshows">TVShows</a></li>
						<li className="nav-item"><a href="/series">Series</a></li>
						<li className="nav-item"><a href="/about">New</a></li>
						<li className="nav-item"><a href="/about">Blogs</a></li>
					</ul>
					<SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
				</nav>


				<div className='row d-flex align-items-center mt-4 mb-4'>
					<MovieListHeading heading='Movies' />
				</div>
				<div className='row'>
					<MovieList
						movies={movies}
						handleFavouritesClick={addFavouriteMovie}
						handlePosterClick={handlePosterClick}
						favouriteComponent={AddFavourites}
					/>
				</div>

				{trailerUrl && (
					<div className="trailer">
						<iframe width="560" height="315" src={trailerUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
					</div>
				)}

				<div className='row d-flex align-items-center mt-4 mb-4'>
					<MovieListHeading heading='Favourites' />
				</div>
				<div className='row'>
					<MovieList
						movies={favourites}
						handleFavouritesClick={removeFavouriteMovie}
						handlePosterClick={handlePosterClick}
						favouriteComponent={RemoveFavourites}
					/>
				</div>
			</div>
	
	);
};

export default App;