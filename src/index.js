import React from "react";
import ReactDOM from "react-dom";
import { version } from "antd";
import "antd/dist/antd.css";
import "./index.css";

ReactDOM.render(
  <div className="App">
    <h1>antd version: {version}</h1>
  </div>,
  document.getElementById("root")
);
