import React, { FC } from 'react';

interface Props {
  args: Array<number>;
}

const ArgumentsRow: FC<Props> = ({ args }) => {
  const mapIncrements = (n: number) => {
    if (n > 0) return '+' + n;
    else return n;
  };

  const renderArguments = () => {
    const notes = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] !== 0) notes.push(<div key={i}>{mapIncrements(args[i])}</div>);
    }
    return notes;
  };

  return <div className="arguments-row">{renderArguments()}</div>;
};

export default ArgumentsRow;
