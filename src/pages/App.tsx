import React from "react";
import "../styles/main.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/General/Header";
import Home from "./Home/Home";
import Admin from "./Admin/Admin";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
