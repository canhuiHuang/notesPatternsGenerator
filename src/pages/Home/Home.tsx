import React, { useState, useEffect } from 'react';
import { wrap } from 'comlink';
import './Home.scss';
import GridTable from '../../components/GridTable/GridTable';
import LoadingDots from '../../components/Loading/Dots/Dots';

interface Pattern {
  pattern: Array<number>;
  args: Array<number>;
}

function Home() {
  const head = ['🎶 Pattern', 'Arguments 🎼'];
  const maxIncrement = 8;
  const argumentsCount = 4;
  const highestNote = 10;

  // Set up worker
  const worker = new Worker('./worker', { name: 'runGeneratorWorker', type: 'module' });
  const { getAllPossiblePatterns, filterPatterns } = wrap<import('./worker').RunGeneratorWorker>(worker);

  const [pageLoading, setPageLoading] = useState<Boolean>(true);
  const [infoLoading, setInfoLoading] = useState<Boolean>(false);
  const [patterns, setPatterns] = useState<Array<Pattern>>([]);
  const [filteredPatterns, setFilteredPatterns] = useState<Array<Pattern>>([]);
  const [args, setArgs] = useState<Array<number>>([1, 2, 1, 0]);

  const onFilterChange = async (e: any, index: number) => {
    const newArgs = args;
    newArgs[index] = Number(e.target.value);

    if (e.target.value >= -8 && e.target.value <= 8) {
      setInfoLoading(true);
      setArgs([...newArgs]);
      setFilteredPatterns(await filterPatterns(patterns, args));
      await setInfoLoading(false);
    }
  };

  // Init
  useEffect(() => {
    const init = async () => {
      setPageLoading(true);

      const allPatterns = await getAllPossiblePatterns(maxIncrement, highestNote);
      await setPatterns([...allPatterns]);
      setFilteredPatterns(await filterPatterns(allPatterns, args));
      await setPageLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-container">
      {pageLoading && <LoadingDots />}
      <div className="inputFields">
        <div className="arguments">
          <span>Arguments 3 out of {argumentsCount}: </span>
          <input
            type="number"
            min={-maxIncrement}
            max={maxIncrement}
            value={args[0] === 0 ? '' : args[0]}
            disabled={infoLoading ? true : false}
            onChange={(e) => onFilterChange(e, 0)}
          />
          <input
            type="number"
            min={-maxIncrement}
            max={maxIncrement}
            value={args[1] === 0 ? '' : args[1]}
            disabled={infoLoading ? true : false}
            onChange={(e) => onFilterChange(e, 1)}
          />
          <input
            type="number"
            min={-maxIncrement}
            max={maxIncrement}
            value={args[2] === 0 ? '' : args[2]}
            disabled={infoLoading ? true : false}
            onChange={(e) => onFilterChange(e, 2)}
          />
          {/* <input
            type="number"
            min={-maxIncrement}
            max={maxIncrement}
            value={args[3] === 0 ? '' : args[3]}
            disabled={infoLoading ? true : false}
            onChange={(e) => onFilterChange(e, 3)}
          /> */}
        </div>
        <div className="highest-note">
          <span>Max note: </span>
          <input type="number" disabled value={highestNote} />
        </div>
      </div>
      <GridTable items={filteredPatterns} head={head} loadingInfo={infoLoading} />
    </div>
  );
}

export default Home;
