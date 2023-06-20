import { render, screen, act } from '@testing-library/react';
import App from './App';
import Home from './pages/Home';
import { fetchAllData, convertToArrayAndSortByTitle, getRecommendations } from './api';

test('Renders the App component', async () => {
  render(<App />);
  
  // Test to see if the App component renders
  await act(async () => {
      const appElement = screen.getByTestId('app');
      expect(appElement).toBeInTheDocument();
  });
});

test('Renders the Home component', () => {
  render(<Home />);

  const renderedText = screen.getByText('Thanks for the opportunity!');

  // Assertion: 1 - Existence of text means page loaded and rendered.
  expect(renderedText).toBeInTheDocument();
});

describe('fetchMovies', () => {
  // TEST: 1 - Mock the database call and test that it returns the expected data array
  it('Returns the expected movie data array', async () => {
    const result = await fetchAllData();
    const movieData = await convertToArrayAndSortByTitle(result.movieData);

    // Assertion: 1 - Result exists
    expect(movieData).toBeDefined();
    // Assertion: 2 - Result is an array
    expect(Array.isArray(movieData)).toBe(true);
    // Assertion: 3 - Result has at least one item
    expect(movieData.length).toBeGreaterThan(0);

  });

  // TEST: 2 - Movie data array is sorted correctly by title
  it('Sorts the movie data array by title', async () => {
    const result = await fetchAllData();
    const movieData = await convertToArrayAndSortByTitle(result.movieData);

    // Create a copy of the movieData array and sort it by title
    const sortedMovieData = [...movieData].sort((a, b) => a.title.localeCompare(b.title));

    // Assertion: The array is sorted correctly by title A-Z
    expect(movieData).toEqual(sortedMovieData);
  });
 
});

describe('getRecommendations', () => {
  // TEST: 1 - Input produces correct Output
  it('Returns an array of recommended movies', async () => {
    const selectedArray = [1, 2, 3, 4, 5, 6, 7, 8]; // Test sample input of movie IDs
    const expectedOutput = [
      {"id": "9", "title": "Braveheart (1995)"}, 
      {"id": "12", "title": "Apollo 13 (1995)"}, 
      {"id": "18", "title": "Clerks (1994)"}, 
      {"id": "20", "title": "Star Wars (1977)"}, 
      {"id": "21", "title": "Natural Born Killers (1994)"}, 
      {"id": "22", "title": "Professional, The (1994)"}, 
      {"id": "23", "title": "Pulp Fiction (1994)"}, 
      {"id": "24", "title": "Shawshank Redemption, The (1994)"}, 
      {"id": "26", "title": "Forrest Gump (1994)"}, 
      {"id": "27", "title": "Lion King, The (1994)"}
    ]; // Expected output

    const result = await getRecommendations(selectedArray);

    // Assertion: The result array contains objects with the "title" property
    expect(result).toEqual(
      expect.arrayContaining(expectedOutput.map(item => expect.objectContaining(item)))
    );
  });
});
