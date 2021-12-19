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
  const highestNote = 17;

  // Set up worker
  const worker = new Worker('./worker', { name: 'runGeneratorWorker', type: 'module' });
  const { getAllPossiblePatterns, filterPatterns } = wrap<import('./worker').RunGeneratorWorker>(worker);

  // Other setups
  let applyArgsSum: boolean = false;
  if (localStorage.getItem('applyArgsSum') !== null) {
    applyArgsSum = JSON.parse(localStorage.getItem('applyArgsSum')!);
  }

  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [patterns, setPatterns] = useState<Array<Pattern>>([]);
  const [filteredPatterns, setFilteredPatterns] = useState<Array<Pattern>>([]);
  const [argsSumFilter, setArgsSumFilter] = useState<number>(8);

  const [applyArgsSumFilter, setApplyArgsSumFilter] = useState<boolean>(applyArgsSum);
  const [args, setArgs] = useState<Array<number>>([0, 0, 0, 0]);

  const setFilters = (args: Array<number>, argsSum: number, applyArgsSum: boolean) => {
    localStorage.setItem('args', JSON.stringify(args));
    localStorage.setItem('argsSum', JSON.stringify(argsSum));
    localStorage.setItem('applyArgsSum', JSON.stringify(applyArgsSum));

    setArgs(args);
    setArgsSumFilter(argsSum);
    setApplyArgsSumFilter(applyArgsSum);
  };

  const onFilterChange = async (e: any, index: number) => {
    const newArgs = args;
    newArgs[index] = Number(e.target.value);

    if (e.target.value >= -maxIncrement && e.target.value <= maxIncrement) {
      setInfoLoading(true);
      setFilters([...newArgs], argsSumFilter, applyArgsSumFilter);
      setFilteredPatterns(await filterPatterns(patterns, args, argsSumFilter, { argsFilter: true, argsSumFilter: applyArgsSumFilter }));
      await setInfoLoading(false);
    }
  };
  const onFilterReset = async () => {
    setInfoLoading(true);
    setFilters([0, 0, 0, 0], argsSumFilter, applyArgsSumFilter);
    setFilteredPatterns(
      await filterPatterns(patterns, [0, 0, 0, 0], argsSumFilter, { argsFilter: true, argsSumFilter: applyArgsSumFilter }),
    );
    await setInfoLoading(false);
  };

  const onArgsSumChange = async (e: any) => {
    setInfoLoading(true);
    setFilters(args, Number(e.target.value), applyArgsSumFilter);
    setFilteredPatterns(
      await filterPatterns(patterns, args, Number(e.target.value), { argsFilter: true, argsSumFilter: applyArgsSumFilter }),
    );
    await setInfoLoading(false);
  };
  const sumFilterSwitch = async () => {
    setInfoLoading(true);

    setFilteredPatterns(await filterPatterns(patterns, args, argsSumFilter, { argsFilter: true, argsSumFilter: !applyArgsSumFilter }));
    setFilters(args, argsSumFilter, !applyArgsSumFilter);
    await setInfoLoading(false);
  };

  // Init
  useEffect(() => {
    const init = async () => {
      setPageLoading(true);

      // Load filters from local storage
      const loadFiltersFromLocalStorage = () => {
        if (localStorage.getItem('args') !== null) {
          setArgs(JSON.parse(localStorage.getItem('args')!));
        }

        if (localStorage.getItem('argsSum') !== null) {
          setArgsSumFilter(JSON.parse(localStorage.getItem('argsSum')!));
        }

        if (localStorage.getItem('applyArgsSum') !== null) {
          setApplyArgsSumFilter(JSON.parse(localStorage.getItem('applyArgsSum')!));
        }
      };
      await loadFiltersFromLocalStorage();

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
            <div className="args-filters">
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
          </div>
          <div className="sum-arguments">
            <div className="label">Arguments Sum filters: </div>
            <div className="btns">
              <input type="number" value={argsSumFilter} disabled={infoLoading} onChange={onArgsSumChange} />
              <input type="checkbox" className="style4" defaultChecked={applyArgsSumFilter} onChange={sumFilterSwitch} />
            </div>
          </div>
        </div>

        <div className="highest-note">
          <span>Max note: </span>
          <input type="number" disabled value={highestNote} />
        </div>
      </div>
      <GridTable items={filteredPatterns} head={head} loadingInfo={infoLoading} pageReset={applyArgsSumFilter} />
    </div>
  );
}

export default Home;
