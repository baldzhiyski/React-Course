import { useEffect, useState } from "react";

/**
 * Custom hook that syncs a piece of React state with localStorage.
 *
 * @param {any} initialState - The default state value to use if no item exists in localStorage.
 * @param {string} key - The key under which the state is stored in localStorage.
 * @returns {[any, function]} - An array with the current value and a setter function (like useState).
 */
export function useLocalStorageState(initialState, key) {
  // Initialize state with value from localStorage (if it exists), or use the default
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);

      // If a value exists in localStorage, parse and return it
      // Otherwise, use the initialState passed to the hook
      return stored ? JSON.parse(stored) : initialState;
    } catch (e) {
      console.error("Failed to parse localStorage value:", e);
      return initialState; // fallback in case of corrupted localStorage data
    }
  });

  // Whenever the state `value` or the `key` changes, update localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Failed to write to localStorage:", e);
    }
  }, [value, key]);

  // Return the state and the setter function, just like useState
  return [value, setValue];
}
