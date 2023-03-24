import "./App.css";
import React from "react";
import ArtistTable from "./components/ArtistTable.js";

const App = () => {
  return (
    <div>
      <h1 className="title">Artists</h1>
      <ArtistTable />
    </div>
  );
};

export default App;
