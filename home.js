const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let featuredMovies = [];
let currentIndex = 0;

// Fetch Trending Movies for Banner
async function fetchFeaturedMovies() {
  try {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch featured movies: ${res.status}`);
    }
    const data = await res.json();
    featuredMovies = data.results;
    updateFeaturedBanner();
    setInterval(updateFeaturedBanner, 8000); // Change movie every 8 seconds
  } catch (error) {
    console.error('Error fetching featured movies:', error);
  }
}

// Update Featured Banner
function updateFeaturedBanner() {
  if (featuredMovies.length === 0) {
    console.error('No featured movies available to display.');
    return;
  }
  const movie = featuredMovies[currentIndex];
  document.getElementById('featured-banner').style.backgroundImage = `url(${IMG_URL}${movie.backdrop_path})`;
  document.getElementById('featured-title').textContent = movie.title || 'No Title Available';
  document.getElementById('featured-description').textContent = movie.overview || 'No description available.';
  document.getElementById('featured-rating').textContent = `⭐ ${movie.vote_average || 'N/A'}/10`;
  document.getElementById('featured-year-genre').textContent = `${movie.release_date?.split('-')[0] || 'Unknown Year'} | ${movie.genre_ids?.join(', ') || 'Unknown Genres'}`;
  currentIndex = (currentIndex + 1) % featuredMovies.length;
}

// Play Featured Movie
function playFeaturedMovie() {
  if (featuredMovies.length === 0) {
    console.error('No movie to play.');
    return;
  }
  const movie = featuredMovies[currentIndex];
  window.location.href = `watch.html?id=${movie.id}&type=movie`;
}

// Initialize and Fetch Data
async function init() {
  await fetchFeaturedMovies();
}

init();
