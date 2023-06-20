// =====================================================
// UTIL API: Fetch all movies and users from JSON server
// =====================================================
export async function fetchAllData() {
    try {
      // Fetch DATA from JSON server
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const moviesResponse = await fetch("http://localhost:3030/movies", requestOptions);
      const usersResponse = await fetch("http://localhost:3030/users", requestOptions);
  
      // Check if the response status is OK (200)
      if (!moviesResponse.ok || !usersResponse.ok) {
        throw new Error("Failed to fetch data from the server");
      }
  
      const movieData = await moviesResponse.json();
      const userData = await usersResponse.json();
      return { movieData, userData };
    } catch (error) {
      // Handle the error here (e.g., logging, displaying an error message)
      console.error("An error occurred while fetching data :: fetchAllData :: ", error);
      throw error;
    }
  }
  

// =====================================================
// UTIL API: Convert movies object into array and sort by title
// =====================================================
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
// 1: Create new object array that includes matches of the selected movies against all users
// 2: Find and sort the most matches by highest to lowest. Example, given 5 matches: 5/5, 4/5, 3/5 (Top 10)
// 3: Find the delta of the most matches and then count the occurrences of each match within the delta (Top 10)
// 4: Take the highest counts and return those as the recommendations (Top 10)
// ======================================================
export async function getRecommendations(selectedArray) {
    // Fetch DATA from JSON server
    const data = await fetchAllData();
  
    // STEP: 1
    // Loop through all users to find and return a new array of objects that contains the user_id, the full movies array of ids, AND number of matches.
    // Sort the new array from highest number of matches to lowest.
    const matchArray = data.userData.map((user) => {
      const matches = user.movies.filter((movie) => selectedArray.includes(movie)).length;
      return {
        user_id: user.user_id,
        movies: user.movies,
        matches: matches
      };
    });
    matchArray.sort((a, b) => b.matches - a.matches);
    // TODO: Remove this console.log
    console.log("STEP:1 MATCH ARRAY: ", matchArray);
  
    // STEP: 2
    // Check if there are any users who have matches equal to the length of the selectedArray
    // If YES, include all those users in the bestMatchesArray
    // If NO, take the top 10 results from the sorted matchArray
    const matchedAll = matchArray.filter((user) => user.matches === selectedArray.length);
    const bestMatchesArray = matchedAll.length > 0 ? matchedAll : matchArray.slice(0, 10);
    // CONSIDER: instead of all or nothing...accept a minimum number of matches...
    // ...maybe if matchedAll.length is less than 10, then take the difference from matchArray to round out the 10
    // TODO: Remove this console.log
    console.log("STEP:2 BEST MATCHES ARRAY: ", bestMatchesArray);

    // STEP: 3
    // Map the bestMatchesArray by removing the selectedArray items from each "movies" array for each user.
    // Create a new array called deltaArray that flattens all users' movies array into one.
    const deltaArray = bestMatchesArray.flatMap((user) => {
        return user.movies.filter(movie => !selectedArray.includes(movie));
    });
    
    // Count the occurrences of each movie ID in the deltaArray
    const movieIdCounts = {};
    deltaArray.forEach((movieId) => {
        movieIdCounts[movieId] = (movieIdCounts[movieId] || 0) + 1;
    });
    
    // Sort the movie IDs by their count in descending order
    const sortedMovieIds = Object.keys(movieIdCounts).sort((a, b) => {
        return movieIdCounts[b] - movieIdCounts[a];
    });
    
    // Take the top 10 most common movie IDs
    const topRecommendedMoviesArray = sortedMovieIds.slice(0, 10);
    
    // TODO: Remove this console.log
    console.log("STEP 3: TOP MOVIE IDS", topRecommendedMoviesArray);
  

    // STEP: 4
    // Cross reference the topRecommendedMoviesArray of movie ids with the movieData object to create the finalRecommendationsArray
    // The finalRecommendationsArray is an array of objects that include id and title of recommended movies
    const finalRecommendationsArray = topRecommendedMoviesArray
    .filter((movieId, index) => topRecommendedMoviesArray.indexOf(movieId) === index)
    .map((movieId) => ({ id: movieId.toString(), title: data.movieData[movieId] }));

    // TODO: Remove this console.log
    console.log("STEP:4 FINAL RECOMMENDATIONS ARRAY: ", finalRecommendationsArray);
  
    return finalRecommendationsArray;
  }
  