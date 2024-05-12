const init = require('./game.init');

const choice = {
    findCombinations: (dices, isDefi, isFirstRoll) => {
      const allCombinations = init.allCombinations();
      const availableCombinations = [];
      const counts = Array(7).fill(0); 
      let sum = 0;

      dices.forEach((dice) => {
        const value = parseInt(dice.value);
        counts[value]++;
        sum += value;
      });
      const hasThreeOfAKind = counts.some((count) => count === 3);

      const hasPair = counts.some((count) => count === 2);

      const hasFourOfAKind = counts.some((count) => count >= 4);

      const yam = counts.some((count) => count === 5);

      const hasStraight =
        counts.slice(1, 6).every((count) => count >= 1) ||
        counts.slice(2, 7).every((count) => count >= 1); 

      const isLessThanEqual8 = sum <= 8;
      let full = false;
      if (hasThreeOfAKind && hasPair) {
        const threeOfAKindValue = counts.findIndex((count) => count === 3);
        const pairValue = counts.findIndex((count) => count === 2);
        full = threeOfAKindValue !== pairValue;
      }

      allCombinations.forEach((combination) => {
        if (
          (combination.id.startsWith("brelan") &&
            counts[parseInt(combination.id.slice(-1))] >= 3) ||
          (combination.id === "full" && full) ||
          (combination.id === "carre" && hasFourOfAKind) ||
          (combination.id === "yam" && yam) ||
          (combination.id === "suite" && hasStraight) ||
          (combination.id === "moinshuit" && isLessThanEqual8) ||
          (combination.id === "defi" && isDefi)
        ) {
          availableCombinations.push(combination);
        }
      });

      if (isFirstRoll) {
        const nonBrelanCombinations = availableCombinations.filter(
          (combination) => !combination.id.startsWith("brelan")
        );
        if (nonBrelanCombinations.length > 0) {
          availableCombinations.push({ id: "sec", value: "Sec" });
        }
      }

      return availableCombinations;
    },
}

module.exports = choice;