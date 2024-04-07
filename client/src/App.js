import { QuizData } from "./question";
import { Provider } from "react-redux";
import { rootReducer } from "./reducer/index";
import { createStore } from "redux";
import BackgroundChanger from "./exam";
import Test from "./test";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
// Create Redux store
export const store = createStore(rootReducer);

function App({props}) {
  return (
   <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/test">Test</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/" component={BackgroundChanger} />
          {/* Wrap only the Test component with Provider */}
          <Route path="/test" render={(props) => (
            <Provider store={store}>
              <Test {...props} questions={QuizData} />
            </Provider>
          )} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
