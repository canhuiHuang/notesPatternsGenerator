interface Pattern {
  pattern: Array<number>;
  args: Array<number>;
}
interface Filters {
  argsFilter: boolean;
  argsSumFilter: boolean;
}
interface Dict {
  [key: string]: number;
}

// Rules:
// Notes spectrum: [-1,-2,-3,-4,-5,-6,-7,1,2,3,4,5, ..., maxNote]
// Generate pattern until reaches 17 or beyond. Once that point is reach, the arguments are multiplied by -1 so that new notes are generated with these arguments. The order of arguments resets as well. Stops when note <= 1.
// When sum of arguments is equal to 0, stops generating notes when new note is <= 1 whether 17 or beyond is reached or not.
// Do not produce patterns whose sum of argument are negative.
// If note generated goes beyond -1, stop.

const getPattern = (args: Array<number>, maxNote: number): Pattern => {
  // Notes interpretation saved in a dictionary
  const dict: Dict = { '0': -7, '-1': -6, '-2': -5, '-3': -4, '-4': -3, '-5': -2, '-6': -1 };
  for (let i = 1; i <= maxNote; i++) {
    dict[i.toString()] = i;
  }

  // Calculate the sum of increments
  let incrementsSum = 0;
  for (let i = 0; i < args.length; i++) {
    incrementsSum += args[i];
  }

  // Return empty pattern if sum of increments < 0
  if (incrementsSum < 0) return { pattern: [], args };

  // Generate pattern
  const pattern = [1];

  // Run indicates whether keep producing pattern or not
  let run = true;

  // Indicates whether the pattern has just started to produce
  let justStarted = true;

  // Holds the note
  let note: number = 1;

  // Pattern generation PHASE 1
  for (let currentNote = 1, incrementIndex = 0; currentNote < maxNote && run; incrementIndex = (incrementIndex + 1) % args.length) {
    // New note generation
    currentNote += args[incrementIndex];

    // If note goes beyond -1, stops
    if (currentNote <= -7) {
      run = false;
    }

    // Interpret new note
    note = dict[currentNote.toString()];

    // If args Sum == 0 & currentNote is 1 or less.
    if (incrementsSum === 0 && note <= 1 && !justStarted) {
      run = false;
    }
    justStarted = false;

    // Push note to pattern if less or equal than maxNote and if current increment is not zero
    if (note <= maxNote && args[incrementIndex] !== 0) {
      pattern.push(note);
    }
  }

  // Pattern generation PHASE 2
  for (
    let currentNote = pattern[pattern.length - 1], incrementIndex = 0;
    currentNote > 1 && run;
    incrementIndex = (incrementIndex + 1) % args.length
  ) {
    // New note generation
    currentNote -= args[incrementIndex];

    // If note goes beyond 0, stops
    if (currentNote <= 0) {
      run = false;
    }

    // Interpret new note
    note = dict[currentNote.toString()];

    // Push note to pattern if greater or equal than 1 and if current increment is not zero
    if (note >= 1 && args[incrementIndex] !== 0) {
      pattern.push(note);
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
  return currentPatterns;
};

const generator = {
  getPattern,
  getAllPossiblePatterns,
  filterPatterns,
};
export default generator;
