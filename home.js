const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let featuredMovies = [];
let currentIndex = 0;

// Fetch Trending Movies for Banner
async function fetchFeaturedMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const data = await res.json();
  featuredMovies = data.results;
  updateFeaturedBanner();
  setInterval(updateFeaturedBanner, 8000); // Change movie every 8 seconds
}

// Update Featured Banner
function updateFeaturedBanner() {
  if (featuredMovies.length === 0) return;
  const movie = featuredMovies[currentIndex];
  document.getElementById('featured-banner').style.backgroundImage = `url(${IMG_URL}${movie.backdrop_path})`;
  document.getElementById('featured-title').textContent = movie.title;
  document.getElementById('featured-description').textContent = movie.overview;
  document.getElementById('featured-rating').textContent = `⭐ ${movie.vote_average}/10`;
  document.getElementById('featured-year-genre').textContent = `${movie.release_date.split('-')[0]} | ${movie.genre_ids.join(', ')}`;
  currentIndex = (currentIndex + 1) % featuredMovies.length;
}

// Play Featured Movie
function playFeaturedMovie() {
  const movie = featuredMovies[currentIndex];
  window.location.href = `watch.html?id=${movie.id}&type=movie`;
}

// Initialize
async function init() {
  await fetchFeaturedMovies();
}

init();
