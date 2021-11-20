import React, { useState, useEffect, FC } from 'react';
import ReactPaginate from 'react-paginate';
import './GridTable.scss';
import PatternRow from './PatternRow';
import ArgumentsRow from './ArgumentsRow';
// import Select from '../Select/Select';
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
  const itemsPerPage = 12;
  const [currentItems, setCurrentItems] = useState(items);
  const [pageCount, setPageCount] = useState(Math.ceil(items.length / itemsPerPage));
  const [itemOffset, setItemOffset] = useState(0);
  const [copied, setCopied] = useState('');

  const triggerPatternsBorder = (): void => {
    const tableBody = document.querySelector('ul.gt-body');
    if (tableBody?.classList.contains('show-border')) tableBody.classList.remove('show-border');
    else {
      tableBody?.classList.add('show-border');
    }
  };

  const grabOnPagePatterns = () => {
    const text = document.createElement('textarea');

    const rows = document.querySelectorAll('.pattern-row');

    if (rows !== null) {
      let patternsText = '';
      for (let i = 0; i < rows.length; i++) {
        const numbers = rows[i].children;
        let patternText = '';
        for (let j = 0; j < numbers.length; j++) {
          // Shown the numbers as selected in the UI
          numbers[j].classList.add('selected');

          // Show copied message
          setCopied('patterns');

          // Clear selected style & copied message
          setTimeout(() => {
            numbers[j].classList.remove('selected');
          }, 900);
          setTimeout(() => {
            setCopied('');
          }, 990);

          if (j < numbers.length - 1) {
            patternText += numbers[j].innerHTML + ' ';
          } else {
            patternText += numbers[j].innerHTML + '\n';
          }
        }
        patternsText += patternText;
      }
      text.value = patternsText;
      text.select();
      navigator.clipboard.writeText(text.value);
    }
  };

  const grabOnPageArguments = () => {
    const text = document.createElement('textarea');

    const rows = document.querySelectorAll('.arguments-row');

    if (rows !== null) {
      let argumentsText = '';
      for (let i = 0; i < rows.length; i++) {
        const numbers = rows[i].children;
        let argumentText = '';
        for (let j = 0; j < numbers.length; j++) {
          // Shown the numbers as selected in the UI
          numbers[j].classList.add('selected');

          // Show copied message
          setCopied('arguments');

          // Clear selected style & copied message
          setTimeout(() => {
            numbers[j].classList.remove('selected');
          }, 900);
          setTimeout(() => {
            setCopied('');
          }, 990);

          if (j < numbers.length - 1) {
            argumentText += numbers[j].innerHTML + ' ';
          } else {
            argumentText += numbers[j].innerHTML + '\n';
          }
        }
        argumentsText += argumentText;
      }
      text.value = argumentsText;
      text.select();
      navigator.clipboard.writeText(text.value);
    }
  };

  const tableHead = () => {
    const headLabels = [];
    for (let i = 0; i < head.length; i++) {
      headLabels.push(
        <li className="gt-cell" key={i}>
          {i === 1 && copied === 'arguments' && <span className="copied-text right">COPIED</span>}
          {i === 0 && <i onClick={grabOnPagePatterns} className="far fa-copy left"></i>}
          {head[i]}
          {i === 1 && <i onClick={grabOnPageArguments} className="far fa-copy right"></i>}
          {i === 0 && <i onClick={triggerPatternsBorder} className="fas fa-align-right border-icon"></i>}
          {i === 0 && copied === 'patterns' && <span className="copied-text left">COPIED</span>}
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

  // const handleOptionSelect = (event: any): void => {
  //   setItemsPerPage(event.target.value);
  // };

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
