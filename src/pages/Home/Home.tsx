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
  const highestNote = 10;

  // Set up worker
  const worker = new Worker('./worker', { name: 'runGeneratorWorker', type: 'module' });
  const { getAllPossiblePatterns, filterPatterns } = wrap<import('./worker').RunGeneratorWorker>(worker);

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [patterns, setPatterns] = useState<Array<Pattern>>([]);
  const [filteredPatterns, setFilteredPatterns] = useState<Array<Pattern>>([]);
  const [argsSumFilter, setArgsSumFilter] = useState<number>(8);
  const [applyArgsSumFilter, setApplyArgsSumFilter] = useState<boolean>(false);
  const [args, setArgs] = useState<Array<number>>([-2, 2, -2, 2]);

  const onFilterChange = async (e: any, index: number) => {
    const newArgs = args;
    newArgs[index] = Number(e.target.value);

    if (e.target.value >= -maxIncrement && e.target.value <= maxIncrement) {
      setInfoLoading(true);
      setArgs([...newArgs]);
      setFilteredPatterns(await filterPatterns(patterns, args, argsSumFilter, { argsFilter: true, argsSumFilter: applyArgsSumFilter }));
      await setInfoLoading(false);
    }
  };
  const onFilterReset = async () => {
    setInfoLoading(true);
    setArgs([0, 0, 0, 0]);
    setFilteredPatterns(
      await filterPatterns(patterns, [0, 0, 0, 0], argsSumFilter, { argsFilter: true, argsSumFilter: applyArgsSumFilter }),
    );
    await setInfoLoading(false);
  };

  const onArgsSumChange = async (e: any) => {
    setInfoLoading(true);
    setArgsSumFilter(Number(e.target.value));
    setFilteredPatterns(
      await filterPatterns(patterns, args, Number(e.target.value), { argsFilter: true, argsSumFilter: applyArgsSumFilter }),
    );
    await setInfoLoading(false);
  };
  const sumFilterSwitch = async () => {
    setInfoLoading(true);

    setFilteredPatterns(await filterPatterns(patterns, args, argsSumFilter, { argsFilter: true, argsSumFilter: !applyArgsSumFilter }));
    setApplyArgsSumFilter(!applyArgsSumFilter);
    await setInfoLoading(false);
  };

  // Init
  useEffect(() => {
    const init = async () => {
      setPageLoading(true);

      const allPatterns = await getAllPossiblePatterns(maxIncrement, highestNote);
      await setPatterns([...allPatterns]);
      setFilteredPatterns(await filterPatterns(allPatterns, args, argsSumFilter, { argsFilter: true, argsSumFilter: applyArgsSumFilter }));
      await setPageLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-container">
      {pageLoading && <LoadingDots />}
      <div className="inputFields">
        <div className="filters">
          <div className="arguments">
            <span>Arguments filters: </span>
            <input
              type="number"
              min={-maxIncrement}
              max={maxIncrement}
              value={args[0] === 0 ? '' : args[0]}
              disabled={infoLoading}
              onChange={(e) => onFilterChange(e, 0)}
            />
            <input
              type="number"
              min={-maxIncrement}
              max={maxIncrement}
              value={args[1] === 0 ? '' : args[1]}
              disabled={infoLoading}
              onChange={(e) => onFilterChange(e, 1)}
            />
            <input
              type="number"
              min={-maxIncrement}
              max={maxIncrement}
              value={args[2] === 0 ? '' : args[2]}
              disabled={infoLoading}
              onChange={(e) => onFilterChange(e, 2)}
            />
            <input
              type="number"
              min={-maxIncrement}
              max={maxIncrement}
              value={args[3] === 0 ? '' : args[3]}
              disabled={infoLoading}
              onChange={(e) => onFilterChange(e, 3)}
            />
            <button className="btn btn-primary" onClick={onFilterReset}>
              Reset
            </button>
          </div>
          <div className="sum-arguments">
            <span>Arguments Sum filters: </span>
            <input type="number" value={argsSumFilter} disabled={infoLoading} onChange={onArgsSumChange} />
            <input type="checkbox" className="style4" defaultChecked={applyArgsSumFilter} onChange={sumFilterSwitch} />
          </div>
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
