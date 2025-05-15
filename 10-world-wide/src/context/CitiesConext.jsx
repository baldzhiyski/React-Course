import { useEffect, useReducer } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import { useState } from 'react';

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };

    case 'cities/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case 'cities/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((c) => c.id !== action.payload),
        currentCity: {},
      };

    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };

    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

const BASE_URL = 'http://localhost:8000';

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities`);

        const data = await res.json();

        dispatch({ type: 'cities/loaded', payload: data });
      } catch (e) {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading data ...',
        });
      }
    }

    fetchCities();
  }, []);

  const getCityById = useCallback(
    async function getCityById(cityId) {
      if (Number(cityId) === currentCity.id) return;

      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities/${cityId}`);

        const data = await res.json();

        dispatch({ type: 'city/loaded', payload: data });
      } catch (e) {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading data ...',
        });
      }
    },
    [currentCity.id]
  );

  async function deleteCity(cityId) {
    dispatch({ type: 'loading' });
    try {
      await fetch(`${BASE_URL}/cities/${cityId}`, {
        method: 'DELETE',
      });

      dispatch({
        type: 'cities/deleted',
        payload: cityId,
      });
    } catch (e) {
      dispatch({
        type: 'rejected',
        payload: 'There was an error loading data ...',
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      dispatch({
        type: 'cities/created',
        payload: data,
      });
    } catch (e) {
      dispatch({
        type: 'rejected',
        payload: 'There was an error loading data ...',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities: cities,
        isLoading: isLoading,
        currentCity: currentCity,
        getCityById: getCityById,
        createCity,
        deleteCity,
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
