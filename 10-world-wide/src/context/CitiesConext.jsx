import { useEffect } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useState } from 'react';

const CitiesContext = createContext();

const BASE_URL = 'http://localhost:8000';

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function fetchCities() {
      try {
        const res = await fetch(`${BASE_URL}/cities`);

        const data = await res.json();

        setCities(data);
      } catch (e) {
        alert('There was an error loading data ... ');
      }
    }

    fetchCities();
  }, []);
  return (
    <CitiesContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const citiesContext = useContext(CitiesContext);

  if (citiesContext === undefined)
    throw new Error('Cities context was used outside scope');
  return citiesContext;
}

export { CitiesProvider, useCities };
