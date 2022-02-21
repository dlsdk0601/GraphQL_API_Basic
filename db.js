import fetch from "node-fetch";

// let movies = [
//     {
//         id: 1,
//         name: "Avengers",
//         score: 12,
//     },
//     {
//         id: 2,
//         name: "The Godfather I",
//         score: 13,
//     },
//     {
//         id: 3,
//         name: "Logan",
//         score: 14,
//     },
//     {
//         id: 4,
//         name: "SpiderMan",
//         score: 15,
//     },
// ]

// export const getMovies = () => movies;

// export const getById = id => {
//     const filtered = movies.filter(movie => movie.id === id);
//     return filtered[0];
// }

// export const deleteMovie = (id) => {
//     const cleaned = movies.filter(mv => mv.id !== id);
//     if(movies.length > cleaned.length){
//         movies = cleaned;
//         return true;
//     }else{
//         return false;
//     }
// }

// export const addMovie = (name, score) => {
//     const newMovie = {
//         id: Date.now(),
//         name,
//         score
//     }

//     movies.push(newMovie);
//     return newMovie;
// }

const API_URL = "https://yts.mx/api/v2/list_movies.json?";

export const getMovies = (limit, rating) => {
    let REQUEST_URL = API_URL;
    if(limit > 0){
        REQUEST_URL += `limit=${limit}` 
    }
    if(rating > 0){
        REQUEST_URL += `&minimum_rating=${rating}` 
    }
    return fetch(`${REQUEST_URL}`)
            .then(res => res.json())
            .then(json => json.data.movies);
}