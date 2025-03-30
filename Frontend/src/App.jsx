"use client";

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import "./App.css";
import EditorWrapper from "./pages/EditorWrapper";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";

const App = () => {
  let isLoggedin = localStorage.getItem("isLoggedIn");

  let ID = localStorage.getItem("userId");

  return (
    <LiveblocksProvider
      publicApiKey={
        "pk_prod_OEZXDz3pozgxSIrqpZoWuEZLdU5rSZUg61J6Y84vzKNX1ODE0jbzTgCYZBpA0oBN"
      }
    >
      <BrowserRouter>
        <Routes>
        <Route path = "/About"element = {<About />}/>
        <Route path = "/Contact"element = {<Contact />}/>
        <Route path = "/Services"element = {<Services />}/>
          <Route
            path="/"
            element={isLoggedin ? <Home /> : <Navigate to="/login" />}
          />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/CollaborativeEditor/:projectID"
            element={isLoggedin ? <EditorWrapper /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={isLoggedin ? <NoPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </LiveblocksProvider>
  );
};

export default App;
