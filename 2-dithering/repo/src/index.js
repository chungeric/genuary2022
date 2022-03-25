import React from "react";
import ReactDOM from "react-dom";
import { Suspense } from "react/cjs/react.production.min";
import App from "./App";
import "./index.scss";

ReactDOM.render(
  <Suspense fallback={null}>
    <App />
  </Suspense>,
  document.getElementById("app")
);
