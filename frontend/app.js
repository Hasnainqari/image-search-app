document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-button");
  const searchInput = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");
  const recentSearchesUl = document.getElementById("recent-searches");
  const loadMoreButton = document.getElementById("load-more");

  let currentPage = 1;
  let currentQuery = "";

  async function fetchImages(query, page) {
    try {
      const response = await fetch(`/api/search?q=${query}&page=${page}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
      return { results: [], total: 0 };
    }
  }

  async function fetchRecentSearches() {
    try {
      const response = await fetch("/api/recent");
      const data = await response.json();
      recentSearchesUl.innerHTML = data
        .map((search) => `<li>${search}</li>`)
        .join("");
    } catch (error) {
      console.error("Error fetching recent searches:", error);
    }
  }

  function displayImages(images) {
    resultsDiv.innerHTML += images
      .map(
        (image) => `
            <div class="result-item">
                <a href="${image.pageURL}" target="_blank">
                    <img src="${image.previewURL}" alt="${image.tags}">
                </a>
                <p>${image.tags}</p>
            </div>
        `
      )
      .join("");
  }

  searchButton.addEventListener("click", async () => {
    currentQuery = searchInput.value.trim();
    if (!currentQuery) return;
    currentPage = 1;
    resultsDiv.innerHTML = "";
    const data = await fetchImages(currentQuery, currentPage);
    displayImages(data.hits);
    loadMoreButton.style.display = data.hits.length > 0 ? "block" : "none";
    fetchRecentSearches();
  });

  loadMoreButton.addEventListener("click", async () => {
    currentPage++;
    const data = await fetchImages(currentQuery, currentPage);
    displayImages(data.hits);
    loadMoreButton.style.display = data.hits.length > 0 ? "block" : "none";
  });

  fetchRecentSearches();
});
