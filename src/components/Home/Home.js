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

    fetchItems = async endpoint => {
        const { movies, heroImage, searchTerm } = this.state;
        const result = await (await fetch(endpoint)).json();
        try {
            this.setState({
                movies: [...movies, ...result.results],
                heroImage: heroImage || result.results[0],
                loading: false,
                currentPage: result.page,
                totalPages: result.total_pages
            }, () => {
                if (searchTerm === '') {
                    localStorage.setItem("HomeState", JSON.stringify(this.state));
                }
            }
            );
        }
        catch (e) {
            console.log('There was an error: ', e);
        }
    }

    // fetchItems = endpoint => {

    //   fetch(endpoint)
    //     .then(result => result.json())
    //     .then(result => {
    //         console.log(result);

    //         this.setState({
    //             movies: [...this.state.movies, ...result.results],
    //             heroImage: this.state.heroImage || result.results[0],
    //             loading: false,
    //             currentPage: result.page,
    //             totalPages: result.total_pages,
    //          }, () => {
    //              if(this.state.searchTerm === '') {
    //                  localStorage.setItem('HomeState', JSON.stringify(this.state));
    //              }
    //          })
    //     })

    // }


    componentDidMount() {
        if (localStorage.getItem('HomeState')) {
            const state = JSON.parse(localStorage.getItem('HomeState'));
            this.setState({ ...state })
        } else {
            this.setState({ loading: true });
            this.fetchItems(this.createEndpoint('movie/popular', false, ''));
        }
    }

    createEndpoint = (type, loadMore, searchTerm) => {
        return `${apiConfig.API_URL}${type}?api_key=${apiConfig.API_KEY}&language=en-US&page=${loadMore
            && this.state.currentPage + 1}&query=${searchTerm}`;
    }

    updateItems = (loadMore, searchTerm) => {
        this.setState({
            movies: loadMore ? [...this.state.movies] : [],
            loading: true,
            searchTerm: loadMore ? this.state.searchTerm : searchTerm,
        }, () => {
            this.fetchItems(
                !this.state.searchTerm ?
                    this.createEndpoint('movie/popular', loadMore, '')
                    : this.createEndpoint('search/movie', loadMore, this.state.searchTerm));
        })
    }

    // loadMoreItems = () => {
    //     let endpoint = '';
    //     this.setState({ loading: true });
    //     if (this.state.searchTerm === '') {
    //         endpoint = `${apiConfig.API_URL}movie/popular?api_key=${apiConfig.API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;
    //     } else {
    //         endpoint = `${apiConfig.API_URL}search/movie?api_key=${apiConfig.API_KEY}&language=en-US&query=${this.state.searchTerm}&page=${this.state.currentPage}`;
    //     }
    //     this.fetchItems(endpoint);
    // }

    // searchItems = (searchTerm) => {
    //     console.log(searchTerm);
    //     let endpoint = ''
    //     this.setState({
    //         movies: [],
    //         loading: true,
    //         searchTerm: searchTerm
    //     });

    //     if (searchTerm === '') {
    //         endpoint = `${apiConfig.API_URL}movie/popular?api_key=${apiConfig.API_KEY}&language=en-US&page=1`;
    //     } else {
    //         endpoint = `${apiConfig.API_URL}search/movie?api_key=${apiConfig.API_KEY}&language=en-US&query=${searchTerm}`
    //     }

    //     this.fetchItems(endpoint);
    // }

    render() {
        return (
            <div className="rmdb-home">
                {this.state.heroImage && !this.state.searchTerm ?
                    <div>
                        <HeroImage
                            image={`${apiConfig.IMAGE_BASE_URL}${apiConfig.BACKDROP_SIZE}/${this.state.heroImage.backdrop_path}`}
                            text={this.state.heroImage.overview}
                            title={this.state.heroImage.original_title} />
                    </div> : null}
                        <SearchBar callback={this.updateItems} />
                <div className="rmdb-home-grid">
                    <FourColGrid
                        header={this.state.searchTerm ? 'Search Result' : 'Popular Movies'}
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
                    {(this.state.currentPage < this.state.totalPages && !this.state.loading) ?
                        <LoadMoreBtn text="Load More" clickHandler={this.updateItems} />
                        : null}

                </div>
            </div>
        )
    }
}
