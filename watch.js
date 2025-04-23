window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('id');
  const server = urlParams.get('server');
  const type = urlParams.get('type');

  // Fetch movie/show details using the TMDB API
  fetchMovieDetails(movieId, server, type);
};

async function fetchMovieDetails(movieId, server, type) {
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=961334ce43e0adcaa714fddec89fcfd9`);
  const data = await res.json();

  // Set the movie/show title
  document.getElementById('movie-title').textContent = data.title || data.name;

  // Construct the embed URL for the video
  const embedURL = getEmbedURL(server, type, movieId);
  document.getElementById('watch-video').src = embedURL;
}

function getEmbedURL(server, type, id) {
  let embedURL = "";

  if (server === "vidsrc.cc") {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${id}`;
  } else if (server === "vidsrc.me") {
    embedURL = `https://vidsrc.net/embed/${type}/?tmdb=${id}`;
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/${type}/${id}`;
  }

  return embedURL;
}
