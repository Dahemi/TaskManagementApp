import { useState } from "react";

import "./App.css";

import SideBar from "./Components/SideBar";
import Home from "./Components/Home";

function App() {
  return (
    <div className="bg-blue-800 text-pink-700 h-screen p-1">
      <Home />
      <SideBar />
    </div>
  );
}

export default App;
