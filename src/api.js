// =====================================================
// UTIL API: Fetch all movies and users from JSON-SERVER
// =====================================================
export async function fetchAllData() {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const moviesResponse = await fetch("http://localhost:3030/movies", requestOptions);
    const usersResponse = await fetch("http://localhost:3030/users", requestOptions);

    if (!moviesResponse.ok || !usersResponse.ok) {
      throw new Error("Failed to fetch data from the server");
    }

    const movieData = await moviesResponse.json();
    const userData = await usersResponse.json();

    return { movieData, userData };
  } catch (error) {
    console.error("An error occurred while fetching data :: fetchAllData :: ", error);
    throw error;
  }
}

// =============================================================
// UTIL FUNC: Convert movies object into array and sort by title
// =============================================================
export async function convertToArrayAndSortByTitle(movies) {
  const movieData = Object.entries(movies).map(([id, title]) => ({
      id,
      title
  }));
  movieData.sort((a, b) => a.title.localeCompare(b.title));
  return movieData;
}

// ======================================================
// RECOMMENDATION ALGORITHM:
// DESCRIPTION: Most matches within results. Most common occurences within the delta.
// STEP 1: Create new object array that includes matches of the selected movies against all users
// STEP 2: Find and sort the most matches by highest to lowest. Example, given 5 matches: 5/5, 4/5, 3/5 (Top 10)
// STEP 3: Find the delta of the most matches, flatten into one array and then count the occurrences of each match within the delta and then sort by most (Top 10)
// STEP 4: Take the highest counts, cross reference against data source and return those as the recommendations (Top 10)
// ======================================================
export async function getRecommendations(selectedArray) {
  const data = await fetchAllData();
  const { movieData, userData } = data;

  // STEP: 1
  const matchArray = userData.map((user) => {
    const matches = user.movies.filter((movie) => selectedArray.includes(movie)).length;
    return {
      user_id: user.user_id,
      movies: user.movies,
      matches: matches
    };
  });
  matchArray.sort((a, b) => b.matches - a.matches);

  // STEP: 2
  const matchedAll = matchArray.filter((user) => user.matches === selectedArray.length);
  const bestMatchesArray = matchedAll.length > 0 ? matchedAll : matchArray.slice(0, 10);

  // STEP: 3
  const deltaArray = bestMatchesArray.flatMap((user) => {
      return user.movies.filter(movie => !selectedArray.includes(movie));
  });
  
  // Count the occurrences...
  const movieIdCounts = {};
  deltaArray.forEach((movieId) => {
      movieIdCounts[movieId] = (movieIdCounts[movieId] || 0) + 1;
  });
  
  // Sort the movie IDs by most...
  const sortedMovieIds = Object.keys(movieIdCounts).sort((a, b) => {
      return movieIdCounts[b] - movieIdCounts[a];
  });
  
  // Take the top 10...
  const topRecommendedMoviesArray = sortedMovieIds.slice(0, 10);

  // STEP: 4
  const finalRecommendationsArray = topRecommendedMoviesArray
  .filter((movieId, index) => topRecommendedMoviesArray.indexOf(movieId) === index)
  .map((movieId) => ({ id: movieId.toString(), title: movieData[movieId] }));

  // TODO: Remove this console.log
  // console.log("FINAL RECOMMENDATIONS ARRAY: ", finalRecommendationsArray);

  return finalRecommendationsArray;
}
