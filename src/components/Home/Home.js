import React, { Component } from 'react';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';
import * as apiConfig from '../../config';
import './Home.css';

export default class Home extends Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: ''

    }

    fetchItems = (endpoint) => {
        fetch(endpoint)
        .then(result => result.json())
        .then(result => {
            console.log(result);

            this.setState({
                movies: [...this.state.movies, ...result.results],
                heroImage: this.state.heroImage || result.results[0],
                loading: false,
                currentPage: result.page,
                totalPages: result.total_pages,
             }, () => {
                 if(this.state.searchTerm === '') {
                     localStorage.setItem('HomeState', JSON.stringify(this.state));
                 }
             })
        })

    }
    loadMoreItems = () => {
        let endpoint = '';
        this.setState({ loading: true });
        if(this.state.searchTerm === '') {
            endpoint = `${apiConfig.API_URL}movie/popular?api_key=${apiConfig.API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;
        } else {
            endpoint = `${apiConfig.API_URL}search/movie?api_key=${apiConfig.API_KEY}&language=en-US&query=${this.state.searchTerm}&page=${this.state.currentPage }`;
        }
        this.fetchItems(endpoint);
    }

    componentDidMount() {
        if(localStorage.getItem('HomeState')) {
            const state = JSON.parse(localStorage.getItem('HomeState'));
            this.setState({ ...state})
        } else {
            this.setState({loading: true});
            const endpoint = `${apiConfig.API_URL}movie/popular?api_key=${apiConfig.API_KEY}&language=en-US&page=1`;
            this.fetchItems(endpoint);
        }
    }

    searchItems = (searchTerm) => {
        console.log(searchTerm);
        let endpoint = ''
        this.setState({
            movies: [],
            loading: true,
            searchTerm: searchTerm
        });

        if (searchTerm === '') {
            endpoint = `${apiConfig.API_URL}movie/popular?api_key=${apiConfig.API_KEY}&language=en-US&page=${this.state.currentPage + 1 }`;
        } else {
            endpoint = `${apiConfig.API_URL}search/movie?api_key=${apiConfig.API_KEY}&language=en-US&query=${searchTerm}&page=${this.state.currentPage + 1 }`
        }
        
        this.fetchItems(endpoint);
    }

    render() {
        return (
            <div className="rmdb-home">
                {this.state.heroImage ? 
                <div>
                    <HeroImage
                     image={`${apiConfig.IMAGE_BASE_URL}${apiConfig.BACKDROP_SIZE}/${this.state.heroImage.backdrop_path}`}
                     text={this.state.heroImage.overview}
                     title={this.state.heroImage.original_title}/>
                    <SearchBar callback={this.searchItems}/>
                </div> : null }
                <div className="rmdb-home-grid">
                <FourColGrid
                 header={this.state.searchTerm ? 'Search Result': 'Popular Movies'}
                 loading={this.state.loading}
                 >
                     {this.state.movies.map((element, i) => {
                      return <MovieThumb 
                                key={element.id}
                                clickable={true}
                                image={element.poster_path ? `${apiConfig.IMAGE_BASE_URL}${apiConfig.POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                                movieId={element.id}
                                movieName={element.original_title}
                      />   
                     })}
                </FourColGrid>
                {this.state.loading ? <Spinner /> : null}
                {(this.state.currentPage <= this.state.totalPages && !this.state.loading) ? 
                <LoadMoreBtn text="Load More" clickHandler={this.loadMoreItems} />
                : null}

                </div>
            </div>
        )
    }
}
