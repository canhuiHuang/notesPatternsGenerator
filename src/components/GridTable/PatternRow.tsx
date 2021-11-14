import React, { FC } from "react";

interface Props {
  pattern: Array<number>;
}

const PatternRow: FC<Props> = ({ pattern }) => {
  const renderPatternNotes = () => {
    const notes = [];
    for (let i = 0; i < pattern.length; i++) {
      notes.push(<div key={i}>{pattern[i]}</div>);
    }
    return notes;
  };

  return (
    <div className={`pattern-row ${pattern.length > 0 ? "" : "disabled"}`}>
      {renderPatternNotes()}
    </div>
  );
};

export default PatternRow;
