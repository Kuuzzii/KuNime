const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

// Extract query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const type = urlParams.get('type');
let currentServer = urlParams.get('server') || 'vidsrc.cc';

// Example data for episodes and servers
const episodes = [
  { id: 1, title: "Episode 1", videoUrl: "https://example.com/episode1.mp4" },
  { id: 2, title: "Episode 2", videoUrl: "https://example.com/episode2.mp4" },
  { id: 3, title: "Episode 3", videoUrl: "https://example.com/episode3.mp4" },
];

const servers = [
  { id: "vidsrc.cc", name: "VidSrc.cc" },
  { id: "vidsrc.me", name: "VidSrc.me" },
  { id: "player.videasy.net", name: "Video Easy" },
];

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

  initSelectors(); // Initialize episode and server selectors
  changeServer(); // Set the video source
}

// Initialize the selectors
function initSelectors() {
  const episodeSelect = document.getElementById("episode-select");
  const serverSelect = document.getElementById("server-select");

  // Populate episodes
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.videoUrl;
    option.textContent = episode.title;
    episodeSelect.appendChild(option);
  });

  // Populate servers
  servers.forEach((server) => {
    const option = document.createElement("option");
    option.value = server.id;
    option.textContent = server.name;
    serverSelect.appendChild(option);
  });

  // Set default selections
  episodeSelect.value = episodes[0].videoUrl;
  serverSelect.value = currentServer;
}

// Change the server for video embedding
function changeServer() {
  const server = document.getElementById("server-select").value;
  currentServer = server; // Update the current server
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

// Change the episode for video playback
function changeEpisode() {
  const episodeSelect = document.getElementById("episode-select");
  const videoPlayer = document.getElementById("movie-video");

  // Update the video source to the selected episode
  videoPlayer.src = episodeSelect.value;
  videoPlayer.play();
}

// Play the movie (scroll to video section)
function playMovie() {
  document.querySelector('.video-container').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the page
fetchMovieDetails();
