const TURN_DURATION = 60;
const MAX_TOKENS = 12;
const MINIMUM_ALIGNED_TOKENS = 3;

const DECK_INIT = {
  dices: [
    { id: 1, value: "", locked: true },
    { id: 2, value: "", locked: true },
    { id: 3, value: "", locked: true },
    { id: 4, value: "", locked: true },
    { id: 5, value: "", locked: true },
  ],
  rollsCounter: 1,
  rollsMaximum: 3,
};

const CHOICES_INIT = {
  isDefi: false,
  isSec: false,
  idSelectedChoice: null,
  availableChoices: [],
};

const GRID_INIT = [
  [
    { viewContent: "1", id: "brelan1", owner: null, canBeChecked: false },
    { viewContent: "3", id: "brelan3", owner: null, canBeChecked: false },
    { viewContent: "Défi", id: "defi", owner: null, canBeChecked: false },
    { viewContent: "4", id: "brelan4", owner: null, canBeChecked: false },
    { viewContent: "6", id: "brelan6", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "2", id: "brelan2", owner: null, canBeChecked: false },
    { viewContent: "Carré", id: "carre", owner: null, canBeChecked: false },
    { viewContent: "Sec", id: "sec", owner: null, canBeChecked: false },
    { viewContent: "Full", id: "full", owner: null, canBeChecked: false },
    { viewContent: "5", id: "brelan5", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "≤8", id: "moinshuit", owner: null, canBeChecked: false },
    { viewContent: "Full", id: "full", owner: null, canBeChecked: false },
    { viewContent: "Yam", id: "yam", owner: null, canBeChecked: false },
    { viewContent: "Défi", id: "defi", owner: null, canBeChecked: false },
    { viewContent: "Suite", id: "suite", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "6", id: "brelan6", owner: null, canBeChecked: false },
    { viewContent: "Sec", id: "sec", owner: null, canBeChecked: false },
    { viewContent: "Suite", id: "suite", owner: null, canBeChecked: false },
    { viewContent: "≤8", id: "moinshuit", owner: null, canBeChecked: false },
    { viewContent: "1", id: "brelan1", owner: null, canBeChecked: false },
  ],
  [
    { viewContent: "3", id: "brelan3", owner: null, canBeChecked: false },
    { viewContent: "2", id: "brelan2", owner: null, canBeChecked: false },
    { viewContent: "Carré", id: "carre", owner: null, canBeChecked: false },
    { viewContent: "5", id: "brelan5", owner: null, canBeChecked: false },
    { viewContent: "4", id: "brelan4", owner: null, canBeChecked: false },
  ],
];

const ALL_COMBINATIONS = [
  { value: "Brelan 1", id: "brelan1" },
  { value: "Brelan 2", id: "brelan2" },
  { value: "Brelan 3", id: "brelan3" },
  { value: "Brelan 4", id: "brelan4" },
  { value: "Brelan 5", id: "brelan5" },
  { value: "Brelan 6", id: "brelan6" },
  { value: "Full", id: "full" },
  { value: "Carré", id: "carre" },
  { value: "Yam", id: "yam" },
  { value: "Suite", id: "suite" },
  { value: "≤8", id: "moinshuit" },
  { value: "Sec", id: "sec" },
  { value: "Défi", id: "defi" },
];

const GAME_INIT = {
  gameState: {
    currentTurn: "player:1",
    timer: TURN_DURATION,
    player1Score: 0,
    player2Score: 0,
    player1Tokens: MAX_TOKENS,
    player2Tokens: MAX_TOKENS,
    grid: [],
    choices: {},
    deck: {},
  },
};

const GameService = {
  init :{
    gameState: () => {
      const game = { ...GAME_INIT };
      game["gameState"]["timer"] = TURN_DURATION;
      game["gameState"]["deck"] = { ...DECK_INIT };
      game["gameState"]["choices"] = { ...CHOICES_INIT };
      game["gameState"]["grid"] = [...GRID_INIT];
      return game;
    },
    deck: () => ({ ...DECK_INIT }),
    choices: () => ({ ...CHOICES_INIT }),
    grid: () => [...GRID_INIT],
    allCombinations: () => [...ALL_COMBINATIONS],
    MINIMUM_ALIGNED_TOKENS: () => MINIMUM_ALIGNED_TOKENS,
    MAX_TOKENS: () => MAX_TOKENS,
  },
  timer :{
    getTurnDuration: () => TURN_DURATION,
  },
  dices :{
    roll: (dicesToRoll) => {
      const rolledDices = dicesToRoll.map((dice) => {
        if (dice.value === "") {
          // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
          const newValue = String(Math.floor(Math.random() * 6) + 1);
          return {
            id: dice.id,
            value: newValue,
            locked: false,
          };
        } else if (!dice.locked) {
          // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
          const newValue = String(Math.floor(Math.random() * 6) + 1);
          return {
            ...dice,
            value: newValue,
          };
        } else {
          // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
          return dice;
        }
      });
      return rolledDices;
    },
    lockEveryDice: (dicesToLock) => {
      const lockedDices = dicesToLock.map((dice) => ({
        ...dice,
        locked: true,
      }));
      return lockedDices;
    },
},
  send: {
    forPlayer: {
      // Return conditionnaly gameState custom objet for player views
      gameViewState: (playerKey, game) => {
        return {
          inQueue: false,
          inGame: true,
          idPlayer:
            playerKey === "player:1"
              ? game.player1Socket.id
              : game.player2Socket.id,
          idOpponent:
            playerKey === "player:1"
              ? game.player2Socket.id
              : game.player1Socket.id,
        };
      },

      choicesViewState: (playerKey, gameState) => {
        const chociesViewState = {
          displayChoices: true,
          canMakeChoice: playerKey === gameState.currentTurn,
          idSelectedChoice: gameState.choices.idSelectedChoice,
          availableChoices: gameState.choices.availableChoices,
        };
        return chociesViewState;
      },

      gridViewState: (playerKey, game) => {
        // set canBeChecked to true to cells that has owner to null and the id matches the selected choice
        const updatedGrid = grid.updateGridAfterSelectingChoice(
          game.gameState.choices.idSelectedChoice,
          game.gameState.grid
        );

        return {
          displayGrid: true,
          canSelectCells:
            playerKey === game.gameState.currentTurn &&
            game.gameState.choices.availableChoices.length > 0,
          grid: updatedGrid,
          // use this findPlayerIdBySocketId to get the player key by socket id
          socketIdPlayer1: game.player1Socket.id,
          socketIdPlayer2: game.player2Socket.id,
        };
      },
      viewQueueState: () => {
        return {
          inQueue: true,
          inGame: false,
        };
      },
      gameTimer: (playerKey, gameState) => {
        // Selon la clé du joueur on adapte la réponse (player / opponent)
        const playerTimer =
          gameState.currentTurn === playerKey ? gameState.timer : 0;
        const opponentTimer =
          gameState.currentTurn === playerKey ? 0 : gameState.timer;
        return { playerTimer: playerTimer, opponentTimer: opponentTimer };
      },
      deckViewState: (playerKey, gameState) => {
        const deckViewState = {
          displayPlayerDeck: gameState.currentTurn === playerKey,
          displayOpponentDeck: gameState.currentTurn !== playerKey,
          displayRollButton:
            gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
          rollsCounter: gameState.deck.rollsCounter,
          rollsMaximum: gameState.deck.rollsMaximum,
          dices: gameState.deck.dices,
        };
        return deckViewState;
      },
      choicesViewState: (playerKey, gameState) => {
        const choicesViewState = {
          displayChoices: true,
          canMakeChoice: playerKey === gameState.currentTurn,
          idSelectedChoice: gameState.choices.idSelectedChoice,
          availableChoices: gameState.choices.availableChoices,
        };
        return choicesViewState;
      },

      playerAndOppnonentInfosState: (playerKey, gameState) => {
        // i want to return the player and opponent infos about score and remaining tokens
        const playerInfos = {
          score:
            playerKey === "player:1"
              ? gameState.player1Score
              : gameState.player2Score,
          tokens:
            playerKey === "player:1"
              ? gameState.player1Tokens
              : gameState.player2Tokens,
          playerKey: playerKey,
        };
        const opponentInfos = {
          score:
            playerKey === "player:1"
              ? gameState.player2Score
              : gameState.player1Score,
          tokens:
            playerKey === "player:1"
              ? gameState.player2Tokens
              : gameState.player1Tokens,
          playerKey: playerKey === "player:1" ? "player:2" : "player:1",
        };
        return { playerInfos: playerInfos, opponentInfos: opponentInfos };
      },

      victoryState: (gameResult) => {
        console.log("gameResult", gameResult);
        // return a json object "gameInfos" with all the inside infos of GameResult
        const gameInfos = {
          gameDuration: gameResult.gameDuration,
          winner: gameResult.winner,
          loser: gameResult.loser,
          gameType: gameResult.gameType,
          winnerUsedTokens: gameResult.winnerUsedTokens,
          loserUsedTokens: gameResult.loserUsedTokens,
          winnerScore: gameResult.winnerScore,
          loserScore: gameResult.loserScore,
          victoryType: gameResult.victoryType,
        };
        return {gameInfos: gameInfos};
      },
    },
},
  choices: {
    findCombinations: (dices, isDefi, isFirstRoll) => {
      const allCombinations = init.allCombinations();
      const availableCombinations = [];
      const counts = Array(7).fill(0); // Counts for dice values from 1 to 6
      let sum = 0;

      // Count dice values and calculate the total sum
      dices.forEach((dice) => {
        const value = parseInt(dice.value);
        counts[value]++;
        sum += value;
      });

      // -------------------------------- //
      // CHECK Combination -------------- //
      // -------------------------------- //

      // -------------------------------- //
      // (1) Brelan
      // -------------------------------- //
      const hasThreeOfAKind = counts.some((count) => count === 3);

      // -------------------------------- //
      // (2) Pairs (Not used in the game but in full)
      // -------------------------------- //
      const hasPair = counts.some((count) => count === 2);

      // -------------------------------- //
      // (3) Carré
      // -------------------------------- //
      const hasFourOfAKind = counts.some((count) => count >= 4);

      // -------------------------------- //
      // (4) Yam
      // -------------------------------- //
      const yam = counts.some((count) => count === 5);

      // -------------------------------- //
      // (5) Suite
      // -------------------------------- //
      const hasStraight =
        counts.slice(1, 6).every((count) => count >= 1) ||
        counts.slice(2, 7).every((count) => count >= 1); // Check for sequences 1-2-3-4-5 or 2-3-4-5-6

      // -------------------------------- //
      // (6) ≤8
      // -------------------------------- //
      const isLessThanEqual8 = sum <= 8;

      // -------------------------------- //
      // (7) Full
      // -------------------------------- //
      let full = false;
      if (hasThreeOfAKind && hasPair) {
        const threeOfAKindValue = counts.findIndex((count) => count === 3);
        const pairValue = counts.findIndex((count) => count === 2);
        full = threeOfAKindValue !== pairValue;
      }

      // Determine available combinations based on the current state of the dices
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

      // -------------------------------- //
      // (8) Sec
      // -------------------------------- //
      if (isFirstRoll) {
        const nonBrelanCombinations = availableCombinations.filter(
          (combination) => !combination.id.startsWith("brelan")
        );
        if (nonBrelanCombinations.length > 0) {
          availableCombinations.push({ id: "sec", value: "Sec" });
        }
      }

      return availableCombinations;
      // return [
      //   { id: "brelan1", value: "Brelan 1" },
      //   { id: "brelan3", value: "Brelan 3" },
      //   { id: "brelan4", value: "Brelan 4" },
      //   { id: "brelan6", value: "Brelan 6" },
      //   { id: "full", value: "Full" },
      //   { id: "carre", value: "Carré" },
      //   { id: "yam", value: "Yam" },
      //   { id: "moinshuit", value: "≤8" },
      //   { id: "sec", value: "Sec" },
      // ]; // For testing purposes
    },

    filterChoicesEnabler: (grid, combinations) => {
      combinations.map((combination) => {
        // Check if any row has at least one cell that can use this combination
        const isCombinationUsable = grid.some((row, rowIndex) => {
          return row.some((cell) => {
            return cell.id === combination.id && cell.owner === null;
          });
        });

        // Set the combination enabled property based on the result
        combination.enabled = isCombinationUsable;
      });
      return combinations;
    },
},
  grid :{
    resetcanBeCheckedCells: (grid) => {
      const updatedGrid = grid.map((row) =>
        row.map((cell) => ({ ...cell, canBeChecked: false }))
      );

      return updatedGrid;
    },

    updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {
      const updatedGrid = grid.map((row) =>
        row.map((cell) =>
          cell.id === idSelectedChoice && cell.owner === null
            ? { ...cell, canBeChecked: true }
            : cell
        )
      );
      return updatedGrid;
    },

    selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid) => {
      const updatedGrid = grid.map((row, rowIndexGrid) =>
        row.map((cell, cellIndexGrid) =>
          rowIndexGrid === rowIndex && cellIndexGrid === cellIndex
            ? { ...cell, owner: currentTurn }
            : cell
        )
      );

      return updatedGrid;
    },
},
  tokens :{
    checkAvailablePlayerTokens: (gameState) => {
      TokensOnGridForPlayers = {
        player1: 0,
        player2: 0,
      };

      TokensOnGridForPlayers.player1 = gameState.grid.reduce((acc, row) => {
        return acc + row.filter((cell) => cell.owner === "player:1").length;
      }, 0);

      TokensOnGridForPlayers.player2 = gameState.grid.reduce((acc, row) => {
        return acc + row.filter((cell) => cell.owner === "player:2").length;
      }, 0);

      AvailableTokensForPlayers = {
        player1: init.MAX_TOKENS() - TokensOnGridForPlayers.player1,
        player2: init.MAX_TOKENS() - TokensOnGridForPlayers.player2,
      };
      gameState.player1Tokens = AvailableTokensForPlayers.player1;
      gameState.player2Tokens = AvailableTokensForPlayers.player2;
      if (
        AvailableTokensForPlayers.player1 === 0 ||
        AvailableTokensForPlayers.player2 === 0
      ) {
        return false;
      } else {
        return true;
      }
    },
},
  score :{
    calculateScoreHorizontal: (gameState) => {
        let scoreToAdd = 0;
        for (let row = 0; row < gameState.grid.length; row++) {
            for (
            let col = 0;
            col < gameState.grid[row].length - (init.MINIMUM_ALIGNED_TOKENS() - 1);
            col++
            ) {
            // Check if the cell has an owner
            if (gameState.grid[row][col].owner) {
                // Check if the owner is player 1
                if (gameState.grid[row][col].owner === "player:1") {
                // Check if the row is at the end of the grid
                if (col === gameState.grid[row].length - init.MINIMUM_ALIGNED_TOKENS()) {
                    if (
                    // For example : [0,2], [0,3], [0,4]
                    gameState.grid[row][col].owner === gameState.grid[row][col + 1].owner &&
                    gameState.grid[row][col + 1].owner === gameState.grid[row][col + 2].owner
                    ) {
                    scoreToAdd = 1;
                    }
                } else {
                    if (
                    // For example : [0,0], [0,1], [0,2], [0,3] // [0,1], [0,2], [0,3], [0,4]
                    gameState.grid[row][col].owner === gameState.grid[row][col + 1].owner &&
                    gameState.grid[row][col + 1].owner === gameState.grid[row][col + 2].owner &&
                    gameState.grid[row][col + 2].owner === gameState.grid[row][col + 3].owner
                    ) {
                    scoreToAdd = 2;
                    break;
                    }
                    if (
                    // For example : [0,0], [0,1], [0,2] // [0,1], [0,2], [0,3]
                    gameState.grid[row][col].owner === gameState.grid[row][col + 1].owner &&
                    gameState.grid[row][col + 1].owner === gameState.grid[row][col + 2].owner
                    ) {
                    scoreToAdd = 1;
                    }
                }
                // Check if the owner is player 2
                } else {
                // Check if the row is at the end of the grid

                // In yam case, col == 2 (init.MINIMUM_ALIGNED_TOKENS() = 3)
                if (col === gameState.grid[row].length - init.MINIMUM_ALIGNED_TOKENS()) {
                    if (
                    // For example : [0,2], [0,3], [0,4]
                    gameState.grid[row][col].owner === gameState.grid[row][col + 1].owner &&
                    gameState.grid[row][col + 1].owner === gameState.grid[row][col + 2].owner
                    ) {
                    scoreToAdd = 1;
                    }
                } else {
                    // For example : [0,0], [0,1], [0,2], [0,3] // [0,1], [0,2], [0,3], [0,4]
                    if (
                    gameState.grid[row][col].owner === gameState.grid[row][col + 1].owner &&
                    gameState.grid[row][col + 1].owner === gameState.grid[row][col + 2].owner &&
                    gameState.grid[row][col + 2].owner === gameState.grid[row][col + 3].owner
                    ) {
                    scoreToAdd = 2;
                    break;
                    }
                    // For example : [0,0], [0,1], [0,2] // [0,1], [0,2], [0,3]
                    if (
                    gameState.grid[row][col].owner === gameState.grid[row][col + 1].owner &&
                    gameState.grid[row][col + 1].owner === gameState.grid[row][col + 2].owner
                    ) {
                    scoreToAdd = 1;
                    }
                }
                }
            }
            }
        }

        if(gameState.currentTurn === "player:1") {
            gameState.player1Score += scoreToAdd;
        } else {
            gameState.player2Score += scoreToAdd;
        }
        console.log("-----------------------------------------------------------------------------------------------");
        console.log("horizontal score to add to ", gameState.currentTurn, " : ", scoreToAdd);
        console.log("Global score of player 1 : ", gameState.player1Score);
        console.log("Global score of player 2 : ", gameState.player2Score);
    },
    calculateScoreVertical: (gameState) => {
        const gridColLength = gameState.grid[0].length;
        let scoreToAdd = 0;

        for (let col = 0; col < gridColLength; col++) {
            for (let row = 0; row < gameState.grid.length - (init.MINIMUM_ALIGNED_TOKENS() - 1); row++) {
            //  Check if the cell has an owner
            if (gameState.grid[row][col].owner) {
                // Check if the owner is player 1
                if (gameState.grid[row][col].owner === "player:1") {
                // Check if the row is at the end of the grid
                // In yam case, row == 2 (init.MINIMUM_ALIGNED_TOKENS() = 3)
                if (row === gameState.grid.length - init.MINIMUM_ALIGNED_TOKENS()) {
                    if (
                        // For example : [2,0], [3,0], [4,0]
                        gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                        gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner
                    ) {
                    scoreToAdd = 1;
                    }
                } else {
                    if (
                        // For example : [0,0], [1,0], [2,0], [3,0] // [1,0], [2,0], [3,0], [4,0]
                        gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                        gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner &&
                        gameState.grid[row + 2][col].owner === gameState.grid[row + 3][col].owner
                    ) {
                        scoreToAdd = 2;
                        break;
                    }
                    if (
                        // For example : [0,0], [1,0], [2,0] / [1,0], [2,0], [3,0]
                        gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                        gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner
                    ) {
                        scoreToAdd = 1;
                    }
                }
                // Check if the owner is player 2
                } else {
                    // Check if the row is at the end of the grid
                    if (row === gameState.grid.length - init.MINIMUM_ALIGNED_TOKENS()) {
                        if (
                            // For example : [2,0], [3,0], [4,0]
                            gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                            gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner
                        ) {
                            scoreToAdd = 1;
                        }
                    } else {
                        if (
                        // For example : [0,0], [1,0], [2,0], [3,0]
                            gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                            gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner &&
                            gameState.grid[row + 2][col].owner === gameState.grid[row + 3][col].owner
                        ) {
                            scoreToAdd = 2;
                            break;
                        }
                        if (
                            // For example : [0,0], [1,0], [2,0] / [1,0], [2,0], [3,0]
                            gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                            gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner
                        ) {
                            scoreToAdd = 1;
                        }
                    }
                }
            }
            }
        }

        if(gameState.currentTurn === "player:1") {
            gameState.player1Score += scoreToAdd;
        } else {
            gameState.player2Score += scoreToAdd;
        }
        console.log("-----------------------------------------------------------------------------------------------");
        console.log("vertical score to add to ", gameState.currentTurn, " : ", scoreToAdd);
        console.log("Global score of player 1 : ", gameState.player1Score);
        console.log("Global score of player 2 : ", gameState.player2Score);
    },
    calculateScoreDiagonal: (gameState, lastRowIndex, lastColIndex) => {
        const currentPlayer = gameState.currentTurn;
        let newDiagonalPoints = 0;

        // Get diagonals involving the newly placed cell
        const diagonalBLtoTR = score.gatherDiagonal(gameState, lastRowIndex, lastColIndex, 1, -1);
        const diagonalTLtoBR = score.gatherDiagonal(gameState, lastRowIndex, lastColIndex, 1, 1);

        // Calculate scores incrementally for both diagonals
        newDiagonalPoints += score.calculatePointsFromDiagonal(diagonalBLtoTR, currentPlayer);
        newDiagonalPoints += score.calculatePointsFromDiagonal(diagonalTLtoBR, currentPlayer);

        // Ensure only the positive difference is added
        if (newDiagonalPoints >= 0) {
            score.updatePlayerScore(gameState, newDiagonalPoints, "diagonal");
        }
    },
    // Calculate the score points based on the alignment count
    calculatePoints: (count) => {
        if (count >= 4) return 2;
        if (count >= 3) return 1;
        return 0;
    },

    // Calculate points from a diagonal array of cells
    calculatePointsFromDiagonal: (cells, currentPlayer) => {
        let count = 0;
        let points = 0;
        
        cells.forEach((cell) => {
            if (cell.owner === currentPlayer) {
                count++;
            } else {
                points += score.calculatePoints(count);
                count = 0; // Reset counter after a break
            }
        });
    
        // Add points from the final sequence
        points += score.calculatePoints(count);
        return points;
    },

    // Update the player's score
    updatePlayerScore: (gameState, additionalPoints, scoreType) => {
        if (gameState.currentTurn === "player:1") {
            gameState.player1Score += additionalPoints;
        } else {
            gameState.player2Score += additionalPoints;
        }
        
        console.log(`-----------------------------------------------------------------------------------------------`);
        console.log(`${scoreType} score to add to`, gameState.currentTurn, ":", additionalPoints);
        console.log("Global score of player 1:", gameState.player1Score);
        console.log("Global score of player 2:", gameState.player2Score);
    },

    detectAlignmentTypeAndScore: (gameState, lastRowIndex, lastColIndex) => {
        const currentPlayer = gameState.currentTurn;
        let isHorizontal = false;
        let isVertical = false;
        let isDiagonal = false;
        
        // Check horizontal alignment (row-based)
        const row = gameState.grid[lastRowIndex];
        if (
            score.checkAlignment(row.map(cell => cell.owner === currentPlayer), lastColIndex)
        ) {
            isHorizontal = true;
        }
        
        // Check vertical alignment (column-based)
        const column = gameState.grid.map(row => row[lastColIndex].owner === currentPlayer);
        if (score.checkAlignment(column, lastRowIndex)) {
            isVertical = true;
        }
        
        // Check diagonals (Top-left to Bottom-right)
        const diagonalTLtoBR = score.gatherDiagonal(gameState, lastRowIndex, lastColIndex, 1, 1);
        if (score.checkAlignment(diagonalTLtoBR.map(cell => cell.owner === currentPlayer), diagonalTLtoBR.findIndex(cell => cell.row === lastRowIndex && cell.col === lastColIndex))) {
            isDiagonal = true;
        }
        
        // Check diagonals (Bottom-left to Top-right)
        const diagonalBLtoTR = score.gatherDiagonal(gameState, lastRowIndex, lastColIndex, 1, -1);
        if (score.checkAlignment(diagonalBLtoTR.map(cell => cell.owner === currentPlayer), diagonalBLtoTR.findIndex(cell => cell.row === lastRowIndex && cell.col === lastColIndex))) {
            isDiagonal = true;
        }
        
        // Calculate score based on detected alignment type
        if (isHorizontal) {
            score.calculateScoreHorizontal(gameState);
        }
        if (isVertical) {
            score.calculateScoreVertical(gameState);
        }
        if (isDiagonal) {
            score.calculateScoreDiagonal(gameState, lastRowIndex, lastColIndex);
        }
    },
    
    // Helper function to check alignment in an array
    checkAlignment: (alignmentArray, centralIndex) => {    
        let left = centralIndex - 1;
        let right = centralIndex + 1;
        let count = 1;
        
        // Check consecutive tokens to the left
        while (left >= 0 && alignmentArray[left]) {
            count++;
            left--;
        }
        
        // Check consecutive tokens to the right
        while (right < alignmentArray.length && alignmentArray[right]) {
            count++;
            right++;
        }
        
        // Determine if the alignment matches the minimum requirement
        return count >= init.MINIMUM_ALIGNED_TOKENS();
    },
    
    // Helper function to gather diagonals based on an incremental direction
    gatherDiagonal: (gameState, startRow, startCol, rowIncrement, colIncrement) => {
        const diagonal = [];
        let row = startRow;
        let col = startCol;

        // Move backward to the start of the diagonal
        while (row >= 0 && col >= 0 && row < gameState.grid.length && col < gameState.grid[0].length) {
            diagonal.unshift({ row, col, owner: gameState.grid[row][col].owner });
            row -= rowIncrement;
            col -= colIncrement;
        }

        // Move forward to extend the diagonal
        row = startRow + rowIncrement;
        col = startCol + colIncrement;
        while (row >= 0 && col >= 0 && row < gameState.grid.length && col < gameState.grid[0].length) {
            diagonal.push({ row, col, owner: gameState.grid[row][col].owner });
            row += rowIncrement;
            col += colIncrement;
        }

        return diagonal;
    },
},
  victory :{
    checkVictory: (gameState) => {
      let horizontalWinner = victory.checkVictoryHorizontal(gameState.grid);
      let verticalWinner = victory.checkVictoryVertical(gameState.grid);
      let diagonalWinner = victory.checkVictoryDiagonal(gameState.grid);
      // to check if the victory type is alignment, one of the three checks must return a winner different than null
      let victoryType = null;
      if ((horizontalWinner != null) || (verticalWinner != null) || (diagonalWinner != null)) {
        victoryType = "alignment";
      }
      let winner;
      if (victoryType === "alignment") {
        winner = horizontalWinner || verticalWinner || diagonalWinner;
        console.log("The winner is: ", winner);
      }
      const playersHaveRemainingTokens = tokens.checkAvailablePlayerTokens(gameState);
      if (!playersHaveRemainingTokens) {
        console.log("The game is over, no more tokens available");
        victoryType = "score";
        let scoreWinner = victory.checkScores(gameState);
        winner = scoreWinner;
      }

      if (winner != null) {
        winner = winner.split(":")[1];
        gameState.gameEndTime = Date.now();
        gameDurationTimestamp = gameState.gameEndTime - gameState.gameStartTime;
        // now format it like this: 00:00:00, remove hours part if less than 1 hour
        gameDuration = new Date(gameDurationTimestamp).toISOString().substr(11, 8);
        console.log("Game duration (in victory.js): ", gameDuration);
        loser = winner === "1" ? "2" : "1";
        gameType = gameState.gameType;
        winnerUsedTokens = init.MAX_TOKENS() - gameState[`player${winner}Tokens`];
        loserUsedTokens = init.MAX_TOKENS() - gameState[`player${loser}Tokens`];
        winnerScore = gameState[`player${winner}Score`];
        loserScore = gameState[`player${loser}Score`];
        if (victoryType === "alignment") {
          winnerScore = null;
          loserScore = null;
        }
        const gameResult = {
          gameType,
          gameDuration,
          winner,
          loser,
          winnerUsedTokens,
          loserUsedTokens,
          winnerScore,
          loserScore,
          victoryType,
        };
        return gameResult;
      }else{
        const gameResult = {
          gameType: null,
          gameDuration: null,
          winner: null,
          loser: null,
          winnerUsedTokens: null,
          loserUsedTokens: null,
          winnerScore: null,
          loserScore: null,
          victoryType: null,
        };
        return gameResult;
      }
    },
    checkScores: (gameState) => {
      let player1Score = gameState.player1Score;
      let player2Score = gameState.player2Score;
      let winner = null;
      if (player1Score > player2Score) {
        winner = "player:1";
        console.log("The winner is player 1");
      } else if (player1Score < player2Score) {
        winner = "player:2";
        console.log("The winner is player 2");
      } else {
        winner = "draw";
        console.log("It's a draw");
      }
      return winner;
    },
    checkVictoryHorizontal: (grid) => {
      let winner = null;
      const isPlayer1Winner = grid.some((row) =>
        row.every((cell) => cell.owner === "player:1")
      );

      const isPlayer2Winner = grid.some((row) =>
        row.every((cell) => cell.owner === "player:2")
      );
      
      if (isPlayer1Winner) {
        console.log("(Horizontal) player 1 is the winner");
        winner = "player:1";
        return winner;
      }

      if (isPlayer2Winner) {
        console.log("(Horizontal) player 2 is the winner");
        winner = "player:2";
        return winner;
      }
    },
    checkVictoryVertical: (grid) => {
      let winner = null;
      const isPlayer1Winner = grid[0]
        .map((_, col) => grid.every((row) => row[col].owner === "player:1"))
        .some(Boolean);

      const isPlayer2Winner = grid[0]
        .map((_, col) => grid.every((row) => row[col].owner === "player:2"))
        .some(Boolean);

      if (isPlayer1Winner) {
        console.log("(Vertical) player 1 is the winner");
        winner = "player:1";
        return winner;
      }

      if (isPlayer2Winner) {
        console.log("(Vertical) player 2 is the winner");
        winner = "player:2";
      }
    },
    checkVictoryDiagonal: (grid) => {
      let winner = null;
      // Check for diagonal from top left to bottom right
      const isPlayer1WinnerFirstDiagonal = grid
        .map((row, index) => row[index])
        .every((cell) => cell.owner === "player:1");
      const isPlayer2WinnerFirstDiagonal = grid
        .map((row, index) => row[index])
        .every((cell) => cell.owner === "player:2");

      if (isPlayer1WinnerFirstDiagonal) {
        console.log("(Diagonal) player 1 is the winner");
        winner = "player:1";
        return winner;
      }

      if (isPlayer2WinnerFirstDiagonal) {
        console.log("(Diagonal) player 2 is the winner");
        winner = "player:2";
        return winner;
      }

      // Check for diagonal from top right to bottom left
      const isPlayer1WinnerSecondDiagonal = grid
        .map((row, index) => row[grid.length - index - 1])
        .every((cell) => cell.owner === "player:1");
      const isPlayer2WinnerSecondDiagonal = grid
        .map((row, index) => row[grid.length - index - 1])
        .every((cell) => cell.owner === "player:2");

      if (isPlayer1WinnerSecondDiagonal) {
        console.log("player 1 is the winner");
        winner = "player:1";
        return winner;
      }

      if (isPlayer2WinnerSecondDiagonal) {
        console.log("player 2 is the winner");
        winner = "player:2";
        return winner;
      }
    },
},
  utils :{
    // Return game index in global games array by id
    findGameIndexById: (games, idGame) => {
      for (let i = 0; i < games.length; i++) {
        if (games[i].idGame === idGame) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
    },

    findGameIndexBySocketId: (games, socketId) => {
      for (let i = 0; i < games.length; i++) {
        if (
          games[i].player1Socket.id === socketId ||
          games[i].player2Socket.id === socketId
        ) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
    },

    findDiceIndexByDiceId: (dices, idDice) => {
      for (let i = 0; i < dices.length; i++) {
        if (dices[i].id === idDice) {
          return i; // Retourne l'index du jeu si le socket est trouvé
        }
      }
      return -1;
    },

    generateCombinationsFromArray: (array, combinationLength) => {
      const result = [];

      const combine = (startIndex, combination) => {
        if (combination.length === combinationLength) {
          result.push([...combination]);
          return;
        }

        for (let i = startIndex; i < array.length; i++) {
          combination.push(array[i]);
          combine(i + 1, combination);
          combination.pop();
        }
      };

      combine(0, []);
      return result;
    },
},
};

module.exports = GameService;
