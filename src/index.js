import React from "react";
import ReactDOM from "react-dom";
import { version } from "antd";
import "antd/dist/antd.css";
import "./index.css";
import App from "./App";
/**
  * Data stub
 */
const data = {
  products: [],
  productsByCategory: [],
  homepageProducts: [],
  currencies: ['GBP'],
  defaultCurrency: 'GBP',
  slider: [],
  activeDeliveryMethods: [],
  // logged in
  user:{
    // ...this.state.user,
    isLoggedIn: false,
    isReady: true,
  },
  orders:[],
  // expose events & api
  ready:true,
  // events={this.events}
  // api={this.api}
}

/**
  * Meteor stub
 */
window.Meteor = {
  call () {
    if(typeof arguments[arguments.length - 1] === 'function'){
      arguments[arguments.length - 1](true, undefined)
    }
  }
}


ReactDOM.render(
  <App {...data} />,
  document.getElementById("root")
);
