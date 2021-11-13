import React, { FC } from "react";

interface Props {
  args: Array<number>;
}

const ArgumentsRow: FC<Props> = ({ args }) => {
  const mapIncrements = (n: number) => {
    if (n > 0) return "+" + n;
    else if (n === 0) return "";
    else return n;
  };

  const renderArguments = () => {
    const notes = [];
    for (let i = 0; i < args.length; i++) {
      notes.push(<div key={i}>{mapIncrements(args[i])}</div>);
    }
    return notes;
  };

  return <div className="arguments-row">{renderArguments()}</div>;
};

export default ArgumentsRow;
