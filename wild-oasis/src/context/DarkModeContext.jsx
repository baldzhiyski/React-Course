/* eslint-disable react/prop-types */

// Import React hooks and custom hooks
import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

// Create a context to hold dark mode state and toggler function
const DarkModeContext = createContext();

/**
 * DarkModeProvider wraps your app and provides dark mode state to children.
 * It reads the initial preference from localStorage (or OS setting),
 * applies the corresponding CSS class to the <html> element,
 * and exposes a toggle function.
 */
function DarkModeProvider({ children }) {
  // Keep dark mode preference in localStorage; default to OS preference
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
    "isDarkMode"
  );

  // Side effect: add/remove CSS classes on <html> based on isDarkMode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-mode");
      root.classList.remove("light-mode");
    } else {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    }
  }, [isDarkMode]); // Re-run whenever dark mode toggles

  // Toggle function to switch themes and persist to localStorage
  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev);
  }

  // Provide context value to children
  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

/**
 * Custom hook to consume dark mode context.
 * Throws an error if used outside the corresponding provider.
 */
function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}

export { DarkModeProvider, useDarkMode };
