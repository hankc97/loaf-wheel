export const getNextRandomValue = (entryCount: number) => {
  return Math.floor(Math.random() * entryCount);
};

export function shuffle<TIn>(array: TIn[]): TIn[] {
  let currentIndex: number = array.length,
    randomIndex: number | undefined;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const populateSelectionTable = (rewards: Array<Reward>): Reward[] => {
  const selectTable: Reward[] = [];
  for (let i = 0; i < rewards.length; i++) {
    const totalEntries = Math.floor(rewards[i].odds);
    for (let j = 0; j < totalEntries; j++) {
      selectTable.push(rewards[i]);
    }
  }

  return shuffle(selectTable);
};

export interface Reward {
  odds: number;
  id: string;
}

export const pickAReward = (rewards: Array<Reward>) => {
  let selectionTable = populateSelectionTable(rewards);

  while (true) {
    let luckyNumber = getNextRandomValue(selectionTable.length);

    const reward = selectionTable[luckyNumber];
    return reward;
  }
};
