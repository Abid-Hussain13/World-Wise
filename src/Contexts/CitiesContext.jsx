import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

// const BASE_URL = "http://localhost:2000";
const BASE_URL = "https://world-wise-b7zc.onrender.com";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  mapPositionSet: [40, 10],
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "isLoading":
      return {
        ...state,
        isLoading: true,
      };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/added":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "focus/delete/city":
      return {
        ...state,
        mapPositionSet: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "gotError":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

const CitiesContext = createContext();
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, mapPositionSet }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    async function getCities() {
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        console.log(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "gotError",
          payload: "There was an Error in Loading Cities.",
        });
      }
    }
    getCities();
  }, []);

  const getCity = useCallback(async function getCity(id) {
    dispatch({ type: "isLoading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);

      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "gotError",
        payload: "There was an Error in Loading City.",
      });
    }
  }, []);

  async function addCity(newCity) {
    dispatch({ type: "isLoading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/added", payload: data });
    } catch {
      dispatch({
        type: "gotError",
        payload: "There was an Error in adding city.",
      });
    }
  }

  async function deleteCity(id, mapPos) {
    dispatch({ type: "isLoading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "focus/delete/city", payload: Object.values(mapPos) });

      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({
        type: "city/deleted",
        payload: id,
      });
    } catch {
      dispatch({
        type: "gotError",
        payload: "There was an Error in Deleting City.",
      });
    }
  }

  return (
    <CitiesContext
      value={{
        cities,
        isLoading,
        currentCity,
        mapPositionSet,
        getCity,
        addCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context == undefined)
    throw new Error("CitiesProvider must be used out of bound.");
  return context;
}

export { CitiesProvider, useCities };
