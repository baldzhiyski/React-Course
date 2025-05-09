import Header from "./Header";
import Main from "./Main";
import { useEffect, useReducer } from "react";
function App() {
  const initialState = {
    questions: [],
    status: "loading",
  };

  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };

      case "dataFailed":
        return { ...state, status: "error" };

      default:
        throw new Error("Unexpected acton type !");
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(function () {
    async function fetchQuestions() {
      const response = await fetch("http://localhost:8000/questions");

      if (!response.ok) {
        dispatch({ type: "dataFailed" });
      }

      const data = await response.json();

      dispatch({ type: "dataReceived", payload: data });
    }

    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main></Main>
    </div>
  );
}

export default App;
