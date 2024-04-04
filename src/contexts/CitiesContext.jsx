/* eslint-disable react/prop-types */
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from "react";
const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [
    {
      cityName: "Lisbon",
      country: "Portugal",
      emoji: "🇵🇹",
      date: "2027-10-31T15:59:59.138Z",
      notes: "My favorite city so far!",
      position: {
        lat: 38.727881642324164,
        lng: -9.140900099907554,
      },
      id: 73930385,
    },
    {
      cityName: "Madrid",
      country: "Spain",
      emoji: "🇪🇸",
      date: "2027-07-15T08:22:53.976Z",
      notes: "",
      position: {
        lat: 40.46635901755316,
        lng: -3.7133789062500004,
      },
      id: 17806751,
    },
    {
      cityName: "Berlin",
      country: "Germany",
      emoji: "🇩🇪",
      date: "2027-02-12T09:24:11.863Z",
      notes: "Amazing 😃",
      position: {
        lat: 52.53586782505711,
        lng: 13.376933665713324,
      },
      id: 98443197,
    },
  ],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    //CITIES LOGIC

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    //CITY LOGIC
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, error: action.payload };

    default:
      throw new Error("Uknown action type");
  }
}

function CitiesProvider({ children }) {
  const initialState = {
    cities: [
      {
        cityName: "Lisbon",
        country: "Portugal",
        emoji: "🇵🇹",
        date: "2027-10-31T15:59:59.138Z",
        notes: "My favorite city so far!",
        position: {
          lat: 38.727881642324164,
          lng: -9.140900099907554,
        },
        id: 73930385,
      },
      {
        cityName: "Madrid",
        country: "Spain",
        emoji: "🇪🇸",
        date: "2027-07-15T08:22:53.976Z",
        notes: "",
        position: {
          lat: 40.46635901755316,
          lng: -3.7133789062500004,
        },
        id: 17806751,
      },
      {
        cityName: "Berlin",
        country: "Germany",
        emoji: "🇩🇪",
        date: "2027-02-12T09:24:11.863Z",
        notes: "Amazing 😃",
        position: {
          lat: 52.53586782505711,
          lng: 13.376933665713324,
        },
        id: 98443197,
      },
    ],
    isLoading: false,
    currentCity: {},
    error: "",
  };
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    dispatch({ type: "cities/loaded", payload: cities });
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    const data = cities.find((curr) => curr.id === Number(id));
    dispatch({ type: "city/loaded", payload: data });
  }
  async function createCity(newCity) {
    newCity = { ...newCity, id: parseInt(String(Date.now()).slice(-8)) };
    dispatch({ type: "city/created", payload: newCity });
  }

  async function deleteCity(id) {
    dispatch({ type: "city/deleted", payload: id });
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      "Cities contect was used outside the CitiesContext Provider"
    );
  return context;
}
export { CitiesProvider, useCities };
