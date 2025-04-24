const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem; // Global variable to hold the currently selected movie/show
let currentIndex = 0; // Index to keep track of the current featured movie
const featuredMovies = []; // Array to store the featured movies

// Function to fetch the featured movies (e.g., trending movies)
async function fetchFeaturedMovies() {
  const movies = await fetchTrending('movie'); // Fetching trending movies
  featuredMovies.push(...movies); // Add fetched movies to the featuredMovies array
  changeFeaturedMovie(); // Call the function to initially display a featured movie
}

// Function to change the featured movie
function changeFeaturedMovie() {
  // Make sure there are movies in the array
  if (featuredMovies.length === 0) return;

  const movie = featuredMovies[currentIndex];
  const banner = document.getElementById('banner');
  const title = document.getElementById('banner-title');
  const description = document.getElementById('banner-description');
  
  // Change the banner content to the next movie
  banner.style.backgroundImage = `url(${IMG_URL}${movie.backdrop_path})`;
  title.textContent = movie.title || movie.name;
  description.textContent = movie.overview || 'No description available.';
  
  // Update the index to the next movie, or loop back to the first one
  currentIndex = (currentIndex + 1) % featuredMovies.length;
}

// Fetch Trending Movies/TV Shows/Anime
async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

async function fetchTrendingAnime() {
  let allResults = [];
  // Fetch from multiple pages to get more anime (max 3 pages for demo)
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

// Function to display the banner (featured movie/show) and set currentItem
function displayBanner(item) {
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
  document.getElementById('banner-description').textContent = item.overview || 'No description available.';
  // Set the currentItem to this movie/show
  currentItem = item;
  // Display the Play button (it might be hidden initially)
  document.getElementById('play-btn').style.display = 'inline-block'; // Ensure Play button is visible
}

// Display the list of movies, TV shows, or anime
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => showDetails(item);
    container.appendChild(img);
  });
}

// Function to show details of a selected movie/show
function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || 'No description available.';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
  document.getElementById('modal').style.display = 'flex';
}

// Change the server for video embedding (e.g., Vidsrc, Videasy)
function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === "movie" ? "movie" : "tv";
  let embedURL = "";

  if (server === "vidsrc.cc") {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
  } else if (server === "vidsrc.me") {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
  }

  document.getElementById('modal-video').src = embedURL;
}

// Close the modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

// Open the search modal
function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

// Close the search modal
function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

// Search TMDB for movies/shows
async function searchTMDB() {
  const query = document.getElementById('search-input').value;
  const resultsContainer = document.getElementById('search-results');

  if (!query.trim()) {
    resultsContainer.innerHTML = '';
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();

  // Clear previous search results
  resultsContainer.innerHTML = '';

  // Show search results
  data.results.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;

    // When a result is clicked, redirect to its detailed page
    img.onclick = () => {
      window.location.href = `watch.html?id=${item.id}&server=vidsrc.cc&type=${item.media_type}`;
    };
    resultsContainer.appendChild(img);
  });
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
  fetchFeaturedMovies(); // Call the fetchFeaturedMovies function to get movies for the rotation
}

// Run the init function when the page loads
init();

// Set an interval to change the featured movie every 10 seconds
setInterval(changeFeaturedMovie, 10000); // 10000 milliseconds = 10 seconds

// Attach search functionality to input field
document.getElementById('search-input').addEventListener('input', searchTMDB);

// Check if user is logged in
window.onload = function() {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = 'login.html'; // Redirect if user is not logged in
  } else {
    document.getElementById('welcome-message').innerText = `Welcome, ${username}`;
  }
};
