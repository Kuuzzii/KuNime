const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';

// Extract query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const type = urlParams.get('type');
let currentServer = urlParams.get('server') || 'vidsrc.cc';

// Fetch movie details based on the ID
async function fetchMovieDetails() {
  const res = await fetch(`${BASE_URL}/${type}/${movieId}?api_key=${API_KEY}`);
  const data = await res.json();

  // Set movie details in the UI
  document.getElementById('movie-title').textContent = data.title || data.name;
  document.getElementById('movie-overview').textContent = data.overview || 'No description available.';
  changeServer(); // Set the video source
}

// Change the server for video embedding
function changeServer() {
  const server = document.getElementById('server').value;
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

// Initialize the page
fetchMovieDetails();
