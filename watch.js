window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('id'); // Get the movie/show id
  const server = urlParams.get('server'); // Get the selected server (e.g., Vidsrc)
  const type = urlParams.get('type'); // Get the type (movie or tv)
  const episode = urlParams.get('episode'); // Get the episode parameter if available

  // Fetch movie/show details using the TMDB API
  fetchMovieDetails(movieId, server, type, episode);
};

async function fetchMovieDetails(movieId, server, type, episode) {
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=961334ce43e0adcaa714fddec89fcfd9`);
  const data = await res.json();

  // Set the movie/show title
  document.getElementById('movie-title').textContent = data.title || data.name;

  // Set the description (overview)
  const description = data.overview || "No description available.";  // Default description if not available
  document.getElementById('banner-title').textContent = data.title || data.name;  // Featured title
  document.getElementById('banner-description').textContent = description;  // Featured description

  // Construct the embed URL for the video
  const embedURL = getEmbedURL(server, type, movieId, episode);
  document.getElementById('watch-video').src = embedURL;
}

function getEmbedURL(server, type, id, episode = null) {
  let embedURL = "";

  // Handling video embedding based on the server
  if (server === "vidsrc.cc") {
    if (episode) {
      embedURL = `https://vidsrc.cc/v2/embed/${type}/${id}?episode=${episode}`; // Handle episode parameter
    } else {
      embedURL = `https://vidsrc.cc/v2/embed/${type}/${id}`;
    }
  } else if (server === "vidsrc.me") {
    if (episode) {
      embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${id}&episode=${episode}`;
    } else {
      embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${id}`;
    }
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/${type}/${id}`;
  }

  return embedURL;
}
