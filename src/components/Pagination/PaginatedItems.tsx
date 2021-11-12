import React, { useState, useEffect, FC } from "react";
import ReactPaginate from "react-paginate";
import "./PaginatedItems.scss";

interface pattern {
  pattern: number;
  count: number;
}

interface patterns {
  patterns: Array<pattern>;
  notesCount?: number;
  increments?: Array<number>;
}

const itemsPerPage = 10;

const PaginatedItems: FC<patterns> = ({ patterns }) => {
  const [currentItems, setCurrentItems] = useState(patterns);
  const [pageCount, setPageCount] = useState(
    Math.ceil(patterns.length / itemsPerPage)
  );
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(patterns.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(patterns.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % patterns.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <>
      <div className="items">
        {currentItems &&
          currentItems.map((item, index) => (
            <div key={index}>
              <h3>Pattern {item.pattern}</h3>
              <h4>Count {item.count}</h4>
            </div>
          ))}
      </div>
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
    </>
  );
};

export default PaginatedItems;
