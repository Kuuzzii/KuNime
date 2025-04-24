const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

// Perform Search
async function performSearch() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) {
    document.getElementById('results-container').innerHTML = '';
    return;
  }

  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();

  displayResults(data.results);
}

// Display Search Results
function displayResults(results) {
  const container = document.getElementById('results-container');
  container.innerHTML = '';

  results.forEach(result => {
    if (result.poster_path) {
      const img = document.createElement('img');
      img.src = `${IMG_URL}${result.poster_path}`;
      img.alt = result.title || result.name;
      img.onclick = () => {
        const type = result.media_type === 'movie' ? 'movie' : 'tv';
        window.location.href = `watch.html?id=${result.id}&type=${type}`;
      };
      container.appendChild(img);
    }
  });
}
