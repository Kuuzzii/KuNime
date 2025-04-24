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

// Fetch Trending Anime
async function fetchTrendingAnime() {
  let allResults = [];

  for (let page = 1; page <= 3; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(
      (item) => item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }

  return allResults;
}

// Function to display the banner (featured movie/show) and set currentItem
function displayBanner(item) {
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
  document.getElementById('banner-description').textContent = item.overview || 'No description available.';
  currentItem = item; // Set the current item
  document.getElementById('play-btn').style.display = 'inline-block'; // Ensure Play button is visible
}

// Display the list of movies, TV shows, or anime
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach((item) => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;

    img.onclick = () => {
      const type = item.media_type === 'movie' ? 'movie' : 'tv';
      const server = 'vidsrc.cc'; // Default server
      window.location.href = `watch.html?id=${item.id}&server=${server}&type=${type}`;
    };

    container.appendChild(img);
  });
}

// Perform search
async function performSearch() {
  const query = document.getElementById('search-bar').value.trim();
  const resultsSection = document.getElementById('search-results-section');
  const resultsContainer = document.getElementById('search-results');

  if (!query) {
    resultsSection.style.display = 'none';
    resultsContainer.innerHTML = '';
    return;
  }

  try {
    const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    displayList(data.results, 'search-results');
    resultsSection.style.display = 'block'; // Show results section
  } catch (error) {
    console.error('Error performing search:', error);
    resultsContainer.innerHTML = '<p>Error fetching search results.</p>';
    resultsSection.style.display = 'block';
  }
}

// Initialize and fetch trending data (movies, TV shows, anime)
async function init() {
  const movies = await fetchTrending('movie');
  const tvShows = await fetchTrending('tv');
  const anime = await fetchTrendingAnime();

  displayBanner(movies[Math.floor(Math.random() * movies.length)]); // Display random featured movie/show
  displayList(movies, 'movies-list');
  displayList(tvShows, 'tvshows-list');
  displayList(anime, 'anime-list');
}

// Run the init function when the page loads
init();
