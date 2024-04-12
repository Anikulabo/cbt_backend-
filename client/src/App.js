import { QuizData } from "./question";
import { Provider } from "react-redux";
import { rootReducer } from "./reducer/index";
import { createStore } from "redux";
import BackgroundChanger from "./exam";
import Test from "./test";
import Login from "./Login";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

// Create Redux store
export const store = createStore(rootReducer);

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <Provider store={store}>
                <Login />
              </Provider>
            }
          />
          <Route
            path="/registration"
            element={
              <Provider store={store}>
                <BackgroundChanger />
              </Provider>
            }
          />
          {/* Wrap only the Test component with Provider */}
          <Route
            path="/test"
            element={
              <Provider store={store}>
                <Test questions={QuizData} />
              </Provider>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
