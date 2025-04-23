window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('id');
  const server = urlParams.get('server');
  const type = urlParams.get('type');
  const episode = urlParams.get('episode'); // Get the episode parameter if available

  // Fetch movie/show details using the TMDB API
  fetchMovieDetails(movieId, server, type, episode);
};

async function fetchMovieDetails(movieId, server, type, episode) {
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=961334ce43e0adcaa714fddec89fcfd9`);
  const data = await res.json();

  // Set the movie/show title
  document.getElementById('movie-title').textContent = data.title || data.name;

  // Construct the embed URL for the video
  const embedURL = getEmbedURL(server, type, movieId, episode);
  document.getElementById('watch-video').src = embedURL;

  // If it's a TV show, fetch the episode list
  if (type === 'tv') {
    fetchEpisodes(movieId);
  }
}

function getEmbedURL(server, type, id, episode = null) {
  let embedURL = "";

  // Add logic to handle episodes
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

// Fetch episodes of the TV show
async function fetchEpisodes(tvShowId) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}/season/1?api_key=961334ce43e0adcaa714fddec89fcfd9`);
  const data = await res.json();
  const episodeList = data.episodes;
  displayEpisodes(episodeList);
}

// Display the episode list below the video player
function displayEpisodes(episodes) {
  const episodeContainer = document.createElement('div');
  episodeContainer.classList.add('episode-list');

  episodes.forEach((episode) => {
    const episodeItem = document.createElement('div');
    episodeItem.classList.add('episode-item');
    episodeItem.innerHTML = `
      <span class="episode-title">${episode.name}</span>
      <span class="episode-airdate">(${episode.air_date})</span>
      <a class="episode-link" href="watch?id=${episode.id}&server=vidsrc.cc&type=tv&episode=${episode.season_number}-${episode.episode_number}">Watch Now</a>
    `;
    episodeContainer.appendChild(episodeItem);
  });

  // Append the episode list to the page
  document.querySelector('.watch-container').appendChild(episodeContainer);
}
