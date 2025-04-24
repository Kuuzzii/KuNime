const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem; // Global variable to hold the currently selected movie/show

// Redirect to the dedicated watch page
function goToMoviePage() {
  const movieId = currentItem.id;
  const type = currentItem.media_type === 'movie' ? 'movie' : 'tv'; // Determine if it's a movie or TV show
  const server = 'vidsrc.cc'; // Default to 'vidsrc.cc', or let the user select a server
  window.location.href = `watch.html?id=${movieId}&server=${server}&type=${type}`; // Redirect to watch.html
}

// Fetch Trending Movies/TV Shows/Anime
async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

async function fetchTrendingAnime() {
  let allResults = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }
  return allResults;
}

// Display the list of movies, TV shows, or anime
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (items.length === 0) {
    container.innerHTML = '<p>No content available.</p>';
    return;
  }
  items.forEach(item => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    container.appendChild(img);
  });
}

// Initialize and fetch trending data
async function init() {
  const movies = await fetchTrending('movie');
  const tvShows = await fetchTrending('tv');
  const anime = await fetchTrendingAnime();

  displayList(movies, 'movies-list');
  displayList(tvShows, 'tvshows-list');
  displayList(anime, 'anime-list');
}

// Run the init function when the page loads
init();
