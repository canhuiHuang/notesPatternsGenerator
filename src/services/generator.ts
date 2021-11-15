interface Pattern {
  pattern: Array<number>;
  args: Array<number>;
}
interface Filters {
  argsFilter: boolean;
  argsSumFilter: boolean;
}

const getPattern = (args: Array<number>, maxNote: number): Pattern => {
  // Calculate the sum of increments & return empty pattern if sum <= 0
  let incrementsSum = 0;
  for (let i = 0; i < args.length; i++) {
    incrementsSum += args[i];
  }
  if (incrementsSum <= 0) return { pattern: [], args };

  // Generate pattern
  const pattern = [1];
  for (let currentNote = 1, incrementIndex = 0; currentNote < maxNote; incrementIndex = (incrementIndex + 1) % args.length) {
    currentNote += args[incrementIndex];

    // Interpret the resulting negative notes
    // 0 --> 7
    // -1 --> 6
    // -2 --> 5
    // -3 --> 4
    // -4 --> 3
    // -5 --> 2
    // -6 --> 1
    // -7 --> 7
    if (currentNote <= 0) {
      if (currentNote === -7) {
        currentNote = 7;
      } else {
        currentNote += 7;
      }
    }

    // Push note to pattern if less or equal than 10 and if current increment is not zero
    if (currentNote <= maxNote && args[incrementIndex] !== 0) {
      pattern.push(currentNote);
    }
  }

  return { pattern, args };
};

const getAllPossiblePatterns = (maxIncrement: number, maxNote: number): Array<Pattern> => {
  const patterns: Array<Pattern> = [];
  // 1 arguments (17 executions)
  for (let i = 1; i <= maxIncrement; i++) {
    patterns.push(getPattern([i, 0, 0, 0], maxNote));
  }
  for (let i = -maxIncrement; i < 0; i++) {
    patterns.push(getPattern([i, 0, 0, 0], maxNote));
  }

  // 2 arguments (289 executions)
  for (let i = -maxIncrement; i <= maxIncrement; i++) {
    for (let j = -maxIncrement; j <= maxIncrement; j++) {
      if (j !== 0) patterns.push(getPattern([i, j, 0, 0], maxNote));
    }
  }

  // 3 arguments (4,913 executions)
  for (let i = -maxIncrement; i <= maxIncrement; i++) {
    for (let j = -maxIncrement; j <= maxIncrement; j++) {
      for (let k = -maxIncrement; k <= maxIncrement; k++) {
        if (k !== 0) patterns.push(getPattern([i, j, k, 0], maxNote));
      }
    }
  }

  // 4 arguments (83,521 executions)
  for (let i = -maxIncrement; i <= maxIncrement; i++) {
    for (let j = -maxIncrement; j <= maxIncrement; j++) {
      for (let k = -maxIncrement; k <= maxIncrement; k++) {
        for (let l = -maxIncrement; l <= maxIncrement; l++) {
          if (l !== 0) patterns.push(getPattern([i, j, k, l], maxNote));
        }
      }
    }
  }

  return patterns;
};

const filterPatterns = (list: Array<Pattern>, args: Array<number>, argsSum: number, filters: Filters): Array<Pattern> => {
  const { argsFilter, argsSumFilter } = filters;

  // If there are no arguments
  // if (args[0] === 0 && args[1] === 0 && args[2] === 0) {
  //   return list;
  // }

  // Find all patterns that match
  const currentPatterns: Array<Pattern> = [];

  // Get current Args
  const currentArgs: Array<number> = [];
  for (let k = 0; k < args.length; k++) {
    if (args[k] !== 0) {
      currentArgs.push(args[k]);
    }
  }

  for (let i = 0; i < list.length; i++) {
    // Find match
    const patternArgs = list[i].args;

    // Calculate current args sum
    let currentSum = 0;
    for (let j = 0; j < patternArgs.length; j++) {
      currentSum += patternArgs[j];
    }

    const push = () => {
      if (argsSumFilter) {
        if (currentSum === argsSum) currentPatterns.push(list[i]);
      } else {
        currentPatterns.push(list[i]);
      }
    };

    switch (currentArgs.length) {
      case 1:
        if (currentArgs[0] == patternArgs[0]) {
          push();
        }
        break;
      case 2:
        if (currentArgs[0] == patternArgs[0] && currentArgs[1] == patternArgs[1]) push();
        break;
      case 3:
        if (currentArgs[0] == patternArgs[0] && currentArgs[1] == patternArgs[1] && currentArgs[2] == patternArgs[2]) push();
        break;
      case 4:
        if (
          currentArgs[0] == patternArgs[0] &&
          currentArgs[1] == patternArgs[1] &&
          currentArgs[2] == patternArgs[2] &&
          currentArgs[3] == patternArgs[3]
        )
          push();
        break;

      default:
        push();
        break;
    }
  }
  //setLoading(false);
  return currentPatterns;
};

const generator = {
  getPattern,
  getAllPossiblePatterns,
  filterPatterns,
};
export default generator;
