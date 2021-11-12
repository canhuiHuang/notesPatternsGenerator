import React, { useState } from "react";
import "./Home.scss";
import PaginatedItems from "../../components/Pagination/PaginatedItems";

function Home() {
  const highestNote = 10;

  const [patterns, setPatterns] = useState([
    { pattern: 123123, count: 8 },
    { pattern: 213123, count: 8 },
    { pattern: 235123, count: 8 },
    { pattern: 1234, count: 8 },
    { pattern: -23, count: 7 },
    { pattern: 1239, count: 8 },
    { pattern: 80219, count: 8 },
    { pattern: 231, count: 8 },
    { pattern: 513, count: 8 },
    { pattern: 123123, count: 8 },
    { pattern: 123, count: 8 },
    { pattern: 123123, count: 8 },
    { pattern: 123, count: 9 },
    { pattern: 213, count: 8 },
    { pattern: 123123, count: 8 },
    { pattern: 9283, count: 8 },
    { pattern: 123123, count: 8 },
    { pattern: -238, count: 8 },
    { pattern: 12, count: 8 },
    { pattern: 213, count: 8 },
    { pattern: 125, count: 8 },
  ]);

  return (
    <div className="home-container">
      <div className="inputFields">
        <input type="number" min={-8} max={8} />
        <input type="number" min={-8} max={8} />
        <input type="number" min={-8} max={8} />
        <input type="number" min={-8} max={8} />
      </div>
      <div className="highest-note">
        <input type="number" disabled value={highestNote} />
      </div>
      <PaginatedItems patterns={patterns} />
    </div>
  );
}

export default Home;
