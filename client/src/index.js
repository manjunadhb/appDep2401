import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";

let initialStoreObj = {
  loginDetails: {},
};

let loginReducer = (latestStoreObj = initialStoreObj, dispatchedObj) => {
  console.log("inside reducer");

  if (dispatchedObj.type == "login") {
    return { ...latestStoreObj, loginDetails: dispatchedObj.data };
  }

  return latestStoreObj;
};

let tasksReducer = (latestStoreObj = initialStoreObj, dispatchedObj) => {
  if (dispatchedObj.type == "addTask") {
    return { ...latestStoreObj };
  }

  return latestStoreObj;
};

let leavesReducer = (latestStoreObj = initialStoreObj, dispatchedObj) => {
  if (dispatchedObj.type == "applyLeave") {
    console.log("inside apply leave");
    return { ...latestStoreObj };
  }

  return latestStoreObj;
};

let store = createStore(
  combineReducers({ loginReducer, tasksReducer, leavesReducer }),
  applyMiddleware(thunk)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
