import React, { useState, useEffect, FC } from 'react';
import ReactPaginate from 'react-paginate';
import './GridTable.scss';
import PatternRow from './PatternRow';
import ArgumentsRow from './ArgumentsRow';
import Select from '../Select/Select';
import LoadingSpinner from '../Loading/Spinner/Spinner';

interface Pattern {
  pattern: Array<number>;
  args: Array<number>;
}

interface Props {
  head: Array<String>;
  items: Array<Pattern>;
  loadingInfo: Boolean;
}

const GridTable: FC<Props> = ({ head, items, loadingInfo }) => {
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentItems, setCurrentItems] = useState(items);
  const [pageCount, setPageCount] = useState(Math.ceil(items.length / itemsPerPage));
  const [itemOffset, setItemOffset] = useState(0);

  const tableHead = () => {
    const headLabels = [];
    for (let i = 0; i < head.length; i++) {
      headLabels.push(
        <li className="gt-cell" key={i}>
          {head[i]}
        </li>,
      );
    }
    return <ul className="gt-head gt-row">{headLabels}</ul>;
  };

  const tableBody = () => {
    const rows = [];
    for (let i = 0; i < currentItems.length; i++) {
      rows.push(
        <li key={i}>
          <div className="gt-cell pattern-cell">
            <PatternRow pattern={currentItems[i].pattern} />
          </div>
          <div className="gt-cell">
            <ArgumentsRow args={currentItems[i].args} />
          </div>
        </li>,
      );
    }
    return <ul className="gt-body gt-row">{rows}</ul>;
  };

  const handlePageClick = (event: any): void => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  const handleOptionSelect = (event: any): void => {
    setItemsPerPage(event.target.value);
  };

  // Lifecycle
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  return (
    <div className="grid-table-container">
      <div className="grid-table">
        {loadingInfo && <LoadingSpinner />}
        {tableHead()}
        {tableBody()}
      </div>
      <div className="paginator">
        <ReactPaginate
          breakLabel="..."
          nextLabel="🡺"
          onPageChange={handlePageClick}
          pageRangeDisplayed={6}
          pageCount={pageCount}
          previousLabel="🡸"
          marginPagesDisplayed={1}
        />
        {/* <Select value={itemsPerPage} values={[5, 10, 15, 20, 25]} onOptionSelect={handleOptionSelect} /> */}
      </div>
    </div>
  );
};

export default GridTable;
