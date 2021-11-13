import React, { useState, useEffect, FC } from "react";
import ReactPaginate from "react-paginate";
import "./GridTable.scss";
import PatternRow from "./PatternRow";
import ArgumentsRow from "./ArgumentsRow";

interface Pattern {
  pattern: Array<number>;
  args: Array<number>;
}

interface Props {
  head: Array<String>;
  items: Array<Pattern>;
  itemsPerPage: number;
}

const GridTable: FC<Props> = ({ head, items, itemsPerPage }) => {
  const [loading, setLoading] = useState(false);
  const [currentItems, setCurrentItems] = useState(items);
  const [pageCount, setPageCount] = useState(
    Math.ceil(items.length / itemsPerPage)
  );
  const [itemOffset, setItemOffset] = useState(0);

  const tableHead = () => {
    const headLabels = [];
    for (let i = 0; i < head.length; i++) {
      headLabels.push(
        <li className="gt-cell" key={i}>
          {head[i]}
        </li>
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
        </li>
      );
    }
    return <ul className="gt-body gt-row">{rows}</ul>;
  };

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  // Lifecycle
  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  return (
    <div className={`grid-table ${loading ? "loading" : ""}`}>
      {tableHead()}
      {tableBody()}
      <div className="paginator">
        <ReactPaginate
          breakLabel="..."
          nextLabel="🡺"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="🡸"
          marginPagesDisplayed={1}
        />
      </div>
    </div>
  );
};

export default GridTable;
