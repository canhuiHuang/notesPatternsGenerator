import React, { useState, useEffect } from 'react';
import './Home.scss';
import GridTable from '../../components/GridTable/GridTable';
import generator from '../../services/generator';

interface Pattern {
  pattern: Array<number>;
  args: Array<number>;
}

function Home() {
  const head = ['Pattern', 'Arguments'];
  const maxIncrement = 8;
  const highestNote = 10;

  const [patterns, setPatterns] = useState<Array<Pattern>>([]);
  const [args, setArgs] = useState<Array<number>>([0, 0, 0, 0]);

  const filter = (): Array<Pattern> => {
    const filteredPatterns: Array<Pattern> = [];
    for (let i = 0; i < patterns.length; i++) {
      // Check if the args of current pattern contains the state args.
    }

    return filteredPatterns;
  };

  const onFilterChange = (e: any, index: number): void => {
    const newArgs = args;
    newArgs[index] = e.target.value;

    if (e.target.value >= -8 && e.target.value <= 8) {
      setArgs([...newArgs]);
    }
  };

  useEffect(() => {
    setPatterns(generator.getAllPossiblePatterns(maxIncrement, highestNote));
  }, []);

  return (
    <div className="home-container">
      <div className="inputFields">
        <div className="arguments">
          <span>Arguments: </span>
          <input type="number" min={-8} max={8} value={args[0]} onChange={(e) => onFilterChange(e, 0)} />
          <input type="number" min={-8} max={8} value={args[1]} onChange={(e) => onFilterChange(e, 1)} />
          <input type="number" min={-8} max={8} value={args[2]} onChange={(e) => onFilterChange(e, 2)} />
          <input type="number" min={-8} max={8} value={args[3]} onChange={(e) => onFilterChange(e, 3)} />
        </div>
        <div className="highest-note">
          <span>Max note: </span>
          <input type="number" disabled value={highestNote} />
        </div>
      </div>

      <GridTable items={patterns} head={head} itemsPerPage={10} />
    </div>
  );
}

export default Home;
