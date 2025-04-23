// Firebase initialization
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Global variable to hold the currently selected movie/show
const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem;

// This function will be called when the Play button is clicked
function goToMoviePage() {
  document.getElementById('play-btn').style.display = 'none';
  document.getElementById('banner-description').style.display = 'none';

  const movieId = currentItem.id;
  const type = currentItem.media_type === "movie" ? "movie" : "tv"; // Determine if it's a movie or TV show
  const server = 'vidsrc.cc';

  window.location.href = `watch.html?id=${movieId}&server=${server}&type=${type}`;
}

// Firebase Authentication - Sign-up function
function signUp() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      alert('Sign-up successful! Welcome, ' + user.email);
      closeLoginModal();
    })
    .catch(error => {
      const errorMessage = error.message;
      alert('Error: ' + errorMessage);
    });
}

// Firebase Authentication - Log-in function
function logIn() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      alert('Login successful! Welcome back, ' + user.email);
      closeLoginModal();
    })
    .catch(error => {
      const errorMessage = error.message;
      alert('Error: ' + errorMessage);
    });
}

// Display user info after login
function showUserInfo(user) {
  document.getElementById('sign-up-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('user-info').style.display = 'block';
  document.getElementById('user-name').textContent = user.email;
}

// Firebase Authentication - Log-out function
function logOut() {
  auth.signOut()
    .then(() => {
      alert('Logged out successfully');
      document.getElementById('user-info').style.display = 'none';
      document.getElementById('sign-up-form').style.display = 'block';
      document.getElementById('login-form').style.display = 'block';
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Error: ' + errorMessage);
    });
}

// Detect user's auth state
auth.onAuthStateChanged(user => {
  if (user) {
    showUserInfo(user);
  }
});

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
  if (!query.trim()) {
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();

  const container = document.getElementById('search-results');
  container.innerHTML = '';
  data.results.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };
    container.appendChild(img);
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
}

// Run the init function when the page loads
init();
