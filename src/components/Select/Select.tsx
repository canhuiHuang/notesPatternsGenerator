import React, { FC } from 'react';
import './Select.scss';

interface Props {
  value: number;
  values: Array<any>;
  onOptionSelect: Function;
}

const Select: FC<Props> = ({ value, values, onOptionSelect }) => {
  const renderOptions = () => {
    const options = [];
    for (let i = 0; i < values.length; i++) {
      options.push(
        <option key={i} value={values[i]} selected={values[i] === value}>
          {values[i]} patterns per page
        </option>,
      );
    }
    return options;
  };

  return (
    <div className="custom-select">
      <select name="custom-select" onChange={(e) => onOptionSelect(e)}>
        {renderOptions()}
      </select>
      <div className="select-arrow">⮯</div>
    </div>
  );
};

export default Select;
