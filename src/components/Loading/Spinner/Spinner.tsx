import React, { FC } from 'react';
import './Spinner.scss';

const Spinner: FC = () => {
  return (
    <div className="layer">
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
