const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem; // Global variable to hold the currently selected movie/show

// Redirect to the dedicated watch page
function goToMoviePage() {
  if (!currentItem) {
    console.error('No featured movie selected.');
    return;
  }
  const movieId = currentItem.id;
  const type = currentItem.media_type === 'movie' ? 'movie' : 'tv'; // Determine if it's a movie or TV show
  window.location.href = `watch.html?id=${movieId}&type=${type}`;
}

// Fetch Trending Movies/TV Shows/Anime
async function fetchTrending(type) {
  try {
    const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${type}: ${res.status}`);
    }
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
}

// Fetch Trending Anime
async function fetchTrendingAnime() {
  try {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch anime: ${res.status}`);
    }
    const data = await res.json();
    return data.results.filter(item => item.original_language === 'ja' && item.genre_ids.includes(16));
  } catch (error) {
    console.error('Error fetching anime:', error);
    return [];
  }
}

// Function to display the banner (featured movie/show)
function displayBanner(item) {
  if (!item) {
    console.error('No featured movie to display.');
    return;
  }
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name || 'No Title Available';
  document.getElementById('banner-description').textContent = item.overview || 'No description available.';
  currentItem = item; // Set the current item
}

// Display the list of movies, TV shows, or anime
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear previous content

  if (!items || items.length === 0) {
    container.innerHTML = '<p>No content available.</p>';
    return;
  }

  items.forEach(item => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => {
      const type = item.media_type === 'movie' ? 'movie' : 'tv';
      window.location.href = `watch.html?id=${item.id}&type=${type}`;
    };
    container.appendChild(img);
  });
}

// Initialize and fetch trending data
async function init() {
  try {
    const movies = await fetchTrending('movie');
    const tvShows = await fetchTrending('tv');
    const anime = await fetchTrendingAnime();

    displayBanner(movies[Math.floor(Math.random() * movies.length)]);
    displayList(movies, 'movies-list');
    displayList(tvShows, 'tvshows-list');
    displayList(anime, 'anime-list');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Run the init function when the page loads
init();
