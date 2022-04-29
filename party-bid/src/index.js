import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { initContract } from "./utils";

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <Router>
        <App />
      </Router>,
      document.querySelector("#root")
    );
  })
  .catch(console.error);
