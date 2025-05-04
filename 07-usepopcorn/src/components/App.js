import { useEffect, useState } from "react";
import { Navbar, Search, Logo, NumResults } from "./Navbar";
import { Box, Main, MovieList, WatchedList, WatchedSummary } from "./Main";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { SelectedMovie } from "./Main";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("batman"); // default search
  const [isLoading, setIsLoading] = useState(false);
  const KEY = process.env.REACT_APP_OMDB_API_KEY;

  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");

  function handleDisplayMovieDetails(movieId) {
    setSelectedId((selectedId) => (selectedId === movieId ? null : movieId));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function handleAddToWatched(movie) {
    const alreadyWatched = watched.some((m) => m.imdbID === movie.imdbID);
    if (!alreadyWatched) {
      setWatched((prev) => [...prev, movie]);
    }
  }

  function onCloseMovie() {
    setSelectedId("");
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAllMovies() {
      try {
        setError(""); // clear any previous errors
        setIsLoading(true);

        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        setMovies(data.Search || []);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
        setMovies([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    onCloseMovie();
    fetchAllMovies();

    // Clean up function
    return function () {
      controller.abort();
    };
  }, [KEY, query]); // Run the effect after the initial render and re-run it only when any of the listed dependencies change.

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              displayDetails={handleDisplayMovieDetails}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              isLoading={isLoading}
              onCloseMovie={onCloseMovie}
              watched={watched}
              onAddWatched={handleAddToWatched}
              KEY={KEY}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                handleDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
