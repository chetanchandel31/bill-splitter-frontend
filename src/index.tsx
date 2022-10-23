import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./AppRoutes";
import "antd/dist/antd.min.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import AllProviders from "AllProviders";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AllProviders>
      <AppRoutes />
    </AllProviders>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
