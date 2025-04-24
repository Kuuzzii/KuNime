const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

// Extract query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const type = urlParams.get('type');
let currentServer = urlParams.get('server') || 'vidsrc.cc';

// Go back to the previous page
function goBack() {
  window.history.back();
}

// Fetch movie details based on the ID
async function fetchMovieDetails() {
  const res = await fetch(`${BASE_URL}/${type}/${movieId}?api_key=${API_KEY}`);
  const data = await res.json();

  // Set movie details in the UI
  document.getElementById('movie-backdrop').style.backgroundImage = `url(${IMG_URL}${data.backdrop_path})`;
  document.getElementById('movie-poster').src = `${IMG_URL}${data.poster_path}`;
  document.getElementById('movie-title').textContent = data.title || data.name;
  document.getElementById('movie-overview').textContent = data.overview || 'No description available.';
  document.getElementById('movie-release-date').textContent = new Date(data.release_date || data.first_air_date).toLocaleDateString();
  document.getElementById('movie-runtime').textContent = `${data.runtime || data.episode_run_time[0]} min`;

  // Set genres
  const genresContainer = document.getElementById('movie-genres');
  data.genres.forEach(genre => {
    const genreTag = document.createElement('span');
    genreTag.className = 'genre-tag';
    genreTag.textContent = genre.name;
    genresContainer.appendChild(genreTag);
  });

  changeServer(); // Set the video source
}

// Change the server for video embedding
function changeServer() {
  const server = currentServer;
  let embedURL = "";

  if (server === "vidsrc.cc") {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${movieId}`;
  } else if (server === "vidsrc.me") {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${movieId}`;
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/${type}/${movieId}`;
  }

  document.getElementById('movie-video').src = embedURL;
}

// Play the movie (scroll to video section)
function playMovie() {
  document.querySelector('.video-container').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the page
fetchMovieDetails();
