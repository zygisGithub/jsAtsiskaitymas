// HTML elements
const logout = document.getElementById('logout')
const movieCreationDisplay = document.getElementById('movieCreation')
const titleInput = document.getElementById('createTitle')
const imageInput = document.getElementById('createImage')
const seatsInput = document.getElementById('createSeats')
const create = document.getElementById('createMovie')
const movieList = document.getElementById('movieList')
const singleMovie = document.getElementById('singleMovie')
const singleMovieClose = document.getElementById('singleMovieClose')
const singleMovieTitle = document.getElementById('singleMovieTitle')
const singleMovieImg = document.getElementById('singleMovieImage')
const singleMovieSeats = document.getElementById('singleMovieSeats')

// Variables
let removingItem = false
const userType = localStorage.getItem('userType')

// Imports
import { login } from "./login.js"
import { movieCreation } from "./createMovie.js"

// Functionality
login()

if (logout) {
    logout.onclick = () => {
        window.location = './index.html'
    }
}

if (movieCreationDisplay && movieList) {
    create.onclick = () => {
        movieCreation(titleInput.value, imageInput.value, seatsInput.value)
    }
}

function getMoviesFromLocalStorage() {
    const movies = []
    const keys = Object.keys(localStorage)

    keys.forEach(key => {
        if (key.startsWith('movie_')) {
            const movieJSON = localStorage.getItem(key)
            if (movieJSON) {
                try {
                    const movie = JSON.parse(movieJSON)
                    movies.push(movie)
                } catch (e) {
                    console.error('error', e)
                }
            }
        }
    })

    return movies
}

function saveMovieToLocalStorage(movie) {
    localStorage.setItem(`movie_${movie.title}`, JSON.stringify(movie))
}

function displayMovies() {
    if (movieList) {
        movieList.innerHTML = ''
        const movies = getMoviesFromLocalStorage()
        movies.forEach(movie => {
            const reservedSeats = movie.seats.filter(seat => seat.reserved).length
            const totalSeats = movie.seats.length
            const movieElement = document.createElement('div')
            if (userType === 'admin') {
                movieElement.innerHTML = `
                    <img src="${movie.img}" alt="${movie.title}">
                    <h2>${movie.title}</h2>
                    <p>Seats: ${totalSeats - reservedSeats}/${totalSeats}</p>
                    <div class="button remove">Remove</div>`
            } else {
                movieElement.innerHTML = `
                    <img src="${movie.img}" alt="${movie.title}">
                    <h2>${movie.title}</h2>
                    <p>Seats: ${totalSeats - reservedSeats}/${totalSeats}</p>`
            }
            movieElement.className = 'movie'

            movieList.appendChild(movieElement)
            movieElement.onclick = (event) => {
                if (!removingItem && !event.target.classList.contains('remove')) {
                    singleMovie.style.display = 'flex'
                    singleMovieTitle.innerHTML = movie.title
                    singleMovieImg.style.backgroundImage = `url('${movie.img}')`
                    displaySeats(movie)
                    singleMovie.style.transform = 'scale(1)'
                }
            }
        })
    }
}

function displaySeats(movie) {
    singleMovieSeats.innerHTML = ''
    movie.seats.forEach((seat, index) => {
        const seatBox = document.createElement('div')
        seatBox.className = 'seat'
        seatBox.textContent = `Seat ${index + 1}`
        if (seat.reserved) {
            seatBox.classList.add('reserved')
            seatBox.textContent += ` (Reserved by ${seat.reservedBy})`
        }
        seatBox.onclick = () => {
            if (userType === 'user' && !seat.reserved) {
                reserveSeat(movie.title, index, userType)
            } else if (userType === 'admin') {
                handleAdminSeatClick(movie.title, index, seat.reserved, seat.reservedBy)
            }
        }
        singleMovieSeats.append(seatBox)
    })
}

function handleAdminSeatClick(movieTitle, seatNumber, isReserved, reservedBy) {
    if (isReserved) {
        if (confirm(`This seat is reserved by ${reservedBy}. Do you want to cancel the reservation?`)) {
            cancelReservation(movieTitle, seatNumber)
        }
    } else {
        reserveSeat(movieTitle, seatNumber, userType)
    }
}

function reserveSeat(movieTitle, seatNumber, reservedBy) {
    const movies = getMoviesFromLocalStorage()
    const movie = movies.find(m => m.title === movieTitle)
    if (movie) {
        movie.seats[seatNumber] = { reserved: true, reservedBy }
        saveMovieToLocalStorage(movie)
        displaySeats(movie)
        displayMovies() // Refresh movie list to update seats count
        // console.log(`Reserved seat ${seatNumber + 1} for ${movieTitle} by ${reservedBy}`)
    }
}

function cancelReservation(movieTitle, seatNumber) {
    const movies = getMoviesFromLocalStorage()
    const movie = movies.find(m => m.title === movieTitle)
    if (movie) {
        movie.seats[seatNumber] = { reserved: false, reservedBy: null }
        saveMovieToLocalStorage(movie)
        displaySeats(movie)
        displayMovies()
        // console.log(`Cancelled reservation for seat ${seatNumber + 1} for ${movieTitle}`)
    }
}

if (movieList) {
    movieList.addEventListener('click', event => {
        const clickedElement = event.target
        if (clickedElement.classList.contains('remove')) {
            const movieElement = clickedElement.closest('.movie')
            if (movieElement) {
                const title = movieElement.querySelector('h2').textContent
                removeMovieFromLocalStorage(title)
                movieElement.remove()
            }
        }
    })
}

function removeMovieFromLocalStorage(title) {
    const keys = Object.keys(localStorage)

    keys.forEach(key => {
        if (key.startsWith('movie_')) {
            const movieJSON = localStorage.getItem(key)
            if (movieJSON) {
                try {
                    removingItem = true
                    const movie = JSON.parse(movieJSON)
                    setTimeout(() => {
                        removingItem = false
                        if (movie.title === title) {
                            localStorage.removeItem(key)
                        }
                    }, 40)
                } catch (e) {
                    console.error('error', e)
                }
            }
        }
    })
}

displayMovies()
if (singleMovie) {
    singleMovieClose.onclick = () => {
        setTimeout(() => {
            singleMovie.style.display = 'none'
        }, 200)
    }
}

