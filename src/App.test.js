import { render, screen, act } from '@testing-library/react';
import App from './App';
import Home from './pages/Home';
import { fetchAllData, convertToArrayAndSortByTitle, getRecommendations } from './api';

// =====================================================
// TEST 1: Test to see if the App component renders
// TEST 2: Test to see if the Home component renders
// =====================================================

test('Renders the App component', async () => {
  render(<App />);
  // TEST 1:
  await act(async () => {
      const appElement = screen.getByTestId('app');
      expect(appElement).toBeInTheDocument();
  });
});

test('Renders the Home component', () => {
  render(<Home />);
  // TEST 2:
  const renderedText = screen.getByText('Thanks for the opportunity!');

  // Assertion: 1 - Existence of text means page loaded and rendered.
  expect(renderedText).toBeInTheDocument();
});

// =====================================================
// TEST 3: Mock the database call and test that it returns the expected data array
// TEST 4: Movie data array is sorted correctly by title
// =====================================================

describe('fetchMovies', () => {
  // TEST 3: 
  it('Returns the expected movie data array', async () => {
    const result = await fetchAllData();
    const { movieData } = result;
    const sortedMovies = await convertToArrayAndSortByTitle(movieData);

    // Assertion: 1 - Result exists
    expect(sortedMovies).toBeDefined();
    // Assertion: 2 - Result is an array
    expect(Array.isArray(sortedMovies)).toBe(true);
    // Assertion: 3 - Result has at least one item
    expect(sortedMovies.length).toBeGreaterThan(0);

  });

  // TEST 4:
  it('Sorts the movie data array by title', async () => {
    const result = await fetchAllData();
    const { movieData } = result;
    const sortedMovies = await convertToArrayAndSortByTitle(movieData);

    // Create a copy of the movieData array and sort it by title
    const sortedMovieData = [...sortedMovies].sort((a, b) => a.title.localeCompare(b.title));

    // Assertion: The array is sorted correctly by title A-Z
    expect(sortedMovies).toEqual(sortedMovieData);
  });
 
});

// =====================================================
// TEST 5: Input produces correct Output
// =====================================================

describe('getRecommendations', () => {
  // TEST 5: 
  it('Returns an array of recommended movies', async () => {
    const selectedArray = [1, 2, 3, 4, 5, 6, 7, 8];
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
    ];

    const result = await getRecommendations(selectedArray);

    // Assertion: The result array is in the right order
    expect(result).toEqual(expectedOutput);
    // Assertion: The result array contains objects with the "title" property
    expect.arrayContaining(expectedOutput.map(item => expect.objectContaining(item)));
  });
});