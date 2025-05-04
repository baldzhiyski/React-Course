import { useEffect, useState } from "react";
import { Navbar, Search, Logo, NumResults } from "./Navbar";
import { Box, Main, MovieList, WatchedList, WatchedSummary } from "./Main";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { SelectedMovie } from "./Main";
import { useMovies } from "../hooks/useMovies";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("batman"); // default search
  const [selectedId, setSelectedId] = useState("");
  const KEY = process.env.REACT_APP_OMDB_API_KEY;

  // Custom Hooks here
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

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
