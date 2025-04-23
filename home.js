const API_KEY = '961334ce43e0adcaa714fddec89fcfd9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

// This function will be triggered when the search input is changed
async function searchTMDB() {
  const query = document.getElementById('search-input').value;
  if (!query.trim()) {
    document.getElementById('search-results').innerHTML = ''; // Clear results if search query is empty
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();

  const container = document.getElementById('search-results');
  container.innerHTML = ''; // Clear previous results

  if (data.results.length > 0) {
    data.results.forEach(item => {
      // Filter to show only items that have a poster and are either movies or TV shows
      if (!item.poster_path || (item.media_type !== 'movie' && item.media_type !== 'tv')) return;

      const img = document.createElement('img');
      img.src = `${IMG_URL}${item.poster_path}`;
      img.alt = item.title || item.name;
      img.onclick = () => {
        window.location.href = `watch.html?id=${item.id}&server=vidsrc.cc&type=${item.media_type}`;
      };
      container.appendChild(img);
    });
  } else {
    container.innerHTML = 'No results found for your search.';
  }
}
