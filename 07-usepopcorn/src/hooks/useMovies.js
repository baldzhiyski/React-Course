import { useEffect, useState } from "react";

// Custom hook: useMovies
// Accepts a 'query' string and an optional 'callback' function
export function useMovies(query) {
  // State to store the list of fetched movies
  const [movies, setMovies] = useState([]);

  // State to track loading state (for showing spinners, etc.)
  const [isLoading, setIsLoading] = useState(false);

  // Your OMDb API key from .env (best practice for security)
  const KEY = process.env.REACT_APP_OMDB_API_KEY;

  // State to track and show errors
  const [error, setError] = useState("");

  // Side-effect: runs whenever query or KEY changes
  useEffect(() => {
    // Create a controller to allow aborting the fetch if the component unmounts or query changes quickly
    const controller = new AbortController();

    // Define the async fetch logic inside useEffect
    async function fetchAllMovies() {
      try {
        setError(""); // Clear any previous error
        setIsLoading(true); // Show loading indicator

        // Make the API request using fetch
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        // Handle HTTP errors
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // OMDb-specific API error handling
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        // Set the fetched movies
        setMovies(data.Search || []);
        setError(""); // Clear errors if everything went well
      } catch (err) {
        // Don't set error if the fetch was aborted
        if (err.name !== "AbortError") {
          setError(err.message);
        }
        setMovies([]); // Reset movies on error
      } finally {
        setIsLoading(false); // Stop loading indicator
      }
    }

    // Don't fetch if query is too short
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // Call the fetch function
    fetchAllMovies();

    // Cleanup: abort ongoing fetch request if component unmounts or dependencies change
    return () => {
      controller.abort();
    };
  }, [KEY, query]); // Effect dependencies: re-run if query or API key changes

  // Return movie data and loading/error states to the component
  return { movies, isLoading, error };
}
