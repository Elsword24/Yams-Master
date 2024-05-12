// Durée d'un tour en secondes
const TURN_DURATION = 60;

const DECK_INIT = {
    dices: [
        { id: 1, value: '', locked: true },
        { id: 2, value: '', locked: true },
        { id: 3, value: '', locked: true },
        { id: 4, value: '', locked: true },
        { id: 5, value: '', locked: true },
    ],
    rollsCounter: 1,
    rollsMaximum: 3
};

const CHOICES_INIT = {
    isDefi: false,
    isSec: false,
    idSelectedChoice: null,
    availableChoices: [],
};

const GRID_INIT = [
    [
        { viewContent: '1', id: 'brelan1', owner: 'player:1', canBeChecked: false },
        { viewContent: '3', id: 'brelan3', owner: 'player:1', canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: 'player:1', canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: 'Full', id: 'full', owner: null, canBeChecked: false },
        { viewContent: 'Yam', id: 'yam', owner: null, canBeChecked: false },
        { viewContent: 'Défi', id: 'defi', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '6', id: 'brelan6', owner: null, canBeChecked: false },
        { viewContent: 'Sec', id: 'sec', owner: null, canBeChecked: false },
        { viewContent: 'Suite', id: 'suite', owner: null, canBeChecked: false },
        { viewContent: '≤8', id: 'moinshuit', owner: null, canBeChecked: false },
        { viewContent: '1', id: 'brelan1', owner: null, canBeChecked: false },
    ],
    [
        { viewContent: '3', id: 'brelan3', owner: null, canBeChecked: false },
        { viewContent: '2', id: 'brelan2', owner: null, canBeChecked: false },
        { viewContent: 'Carré', id: 'carre', owner: null, canBeChecked: false },
        { viewContent: '5', id: 'brelan5', owner: null, canBeChecked: false },
        { viewContent: '4', id: 'brelan4', owner: null, canBeChecked: false },
    ]
];

const ALL_COMBINATIONS = [
    { value: 'Brelan1', id: 'brelan1' },
    { value: 'Brelan2', id: 'brelan2' },
    { value: 'Brelan3', id: 'brelan3' },
    { value: 'Brelan4', id: 'brelan4' },
    { value: 'Brelan5', id: 'brelan5' },
    { value: 'Brelan6', id: 'brelan6' },
    { value: 'Full', id: 'full' },
    { value: 'Carré', id: 'carre' },
    { value: 'Yam', id: 'yam' },
    { value: 'Suite', id: 'suite' },
    { value: '≤8', id: 'moinshuit' },
    { value: 'Sec', id: 'sec' },
    { value: 'Défi', id: 'defi' }
];

const GAME_INIT = {
    gameState: {
        currentTurn: 'player:1',
        timer: null,
        player1Score: 0,
        player2Score: 0,
        choices: {},
        deck: {},
        tokens: {
            'player:1':12,
            'player:2':12,
        } 
    }
}
const GameService = {

    init: {
        gameState: () => {
            const game = { ...GAME_INIT };
            game['gameState']['timer'] = TURN_DURATION;
            game['gameState']['deck'] = { ...DECK_INIT };
            game['gameState']['choices'] = { ...CHOICES_INIT };
            game['gameState']['grid'] = [ ...GRID_INIT];
            return game;
        },

        deck: () => {
            return { ...DECK_INIT };
        },

        choices: () => {
            return { ...CHOICES_INIT };
        },

        grid: () => {
            return [ ...GRID_INIT];
        }
    },

    send: {
        forPlayer: {
            viewGameState: (playerKey, game) => {
                return {
                    inQueue: false,
                    inGame: true,
                    idPlayer:
                        (playerKey === 'player:1')
                            ? game.player1Socket.id
                            : game.player2Socket.id,
                    idOpponent:
                        (playerKey === 'player:1')
                            ? game.player2Socket.id
                            : game.player1Socket.id
                };
            },

            viewQueueState: () => {
                return {
                    inQueue: true,
                    inGame: false,
                };
            },

            gameTimer: (playerKey, gameState) => {
                const playerTimer = gameState.currentTurn === playerKey ? gameState.timer : 0;
                const opponentTimer = gameState.currentTurn === playerKey ? 0 : gameState.timer;
                return { playerTimer: playerTimer, opponentTimer: opponentTimer };
            },

            deckViewState: (playerKey, gameState) => {
                const deckViewState = {
                    displayPlayerDeck: gameState.currentTurn === playerKey,
                    displayOpponentDeck: gameState.currentTurn !== playerKey,
                    displayRollButton: gameState.deck.rollsCounter <= gameState.deck.rollsMaximum,
                    rollsCounter: gameState.deck.rollsCounter,
                    rollsMaximum: gameState.deck.rollsMaximum,
                    dices: gameState.deck.dices
                };
                return deckViewState;
            },

            choicesViewState: (playerKey, gameState) => {

                const choicesViewState = {
                    displayChoices: true,
                    canMakeChoice: playerKey === gameState.currentTurn,
                    idSelectedChoice: gameState.choices.idSelectedChoice,
                    availableChoices: gameState.choices.availableChoices
                }

                return choicesViewState;
            },

            gridViewState: (playerKey, gameState) => {

                return {
                    displayGrid: true,
                    canSelectCells: (playerKey === gameState.currentTurn) && (gameState.choices.availableChoices.length > 0),
                    grid: gameState.grid
                };

            },
        }
    },

    timer: {  
        getTurnDuration: () => {
            return TURN_DURATION;
        }
    },

    dices: {
        roll: (dicesToRoll) => {
            const rolledDices = dicesToRoll.map(dice => {
                if (dice.value === "") {
                    // Si la valeur du dé est vide, alors on le lance en mettant le flag locked à false
                    const newValue = String(Math.floor(Math.random() * 6) + 1); // Convertir la valeur en chaîne de caractères
                    return {
                        id: dice.id,
                        value: newValue,
                        locked: false
                    };
                } else if (!dice.locked) {
                    // Si le dé n'est pas verrouillé et possède déjà une valeur, alors on le relance
                    const newValue = String(Math.floor(Math.random() * 6) + 1);
                    return {
                        ...dice,
                        value: newValue
                    };
                } else {
                    // Si le dé est verrouillé ou a déjà une valeur mais le flag locked est true, on le laisse tel quel
                    return dice;
                }
            });
            return rolledDices;
        },

        lockEveryDice: (dicesToLock) => {
            const lockedDices = dicesToLock.map(dice => ({
                ...dice,
                locked: true // Verrouille chaque dé
            }));
            return lockedDices;
        }
    },

    choices: {
        findCombinations: (dices, isDefi, isSec) => {
            const availableCombinations = [];
            const allCombinations = ALL_COMBINATIONS;

            const counts = Array(7).fill(0); // Tableau pour compter le nombre de dés de chaque valeur (de 1 à 6)
            let hasPair = false; // Pour vérifier si une paire est présente
            let threeOfAKindValue = null; // Stocker la valeur du brelan
            let hasThreeOfAKind = false; // Pour vérifier si un brelan est présent
            let hasFourOfAKind = false; // Pour vérifier si un carré est présent
            let hasFiveOfAKind = false; // Pour vérifier si un Yam est présent
            let hasStraight = false; // Pour vérifier si une suite est présente
            let sum = 0; // Somme des valeurs des dés

            // Compter le nombre de dés de chaque valeur et calculer la somme
            for (let i = 0; i < dices.length; i++) {
                const diceValue = parseInt(dices[i].value);
                counts[diceValue]++;
                sum += diceValue;
            }

            // Vérifier les combinaisons possibles
            for (let i = 1; i <= 6; i++) {
                if (counts[i] === 2) {
                    hasPair = true;
                } else if (counts[i] === 3) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                } else if (counts[i] === 4) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                    hasFourOfAKind = true;
                } else if (counts[i] === 5) {
                    threeOfAKindValue = i;
                    hasThreeOfAKind = true;
                    hasFourOfAKind = true;
                    hasFiveOfAKind = true;
                }
            }

            const sortedValues = dices.map(dice => parseInt(dice.value)).sort((a, b) => a - b); // Trie les valeurs de dé

            // Vérifie si les valeurs triées forment une suite
            hasStraight = sortedValues.every((value, index) => index === 0 || value === sortedValues[index - 1] + 1);

            // Vérifier si la somme ne dépasse pas 8
            const isLessThanEqual8 = sum <= 8;

            // Retourner les combinaisons possibles via leur ID
            allCombinations.forEach(combination => {
                if (
                    (combination.id.includes('brelan') && hasThreeOfAKind && parseInt(combination.id.slice(-1)) === threeOfAKindValue) ||
                    (combination.id === 'full' && hasPair && hasThreeOfAKind) ||
                    (combination.id === 'carre' && hasFourOfAKind) ||
                    (combination.id === 'yam' && hasFiveOfAKind) ||
                    (combination.id === 'suite' && hasStraight) ||
                    (combination.id === 'moinshuit' && isLessThanEqual8) ||
                    (combination.id === 'defi' && isDefi)
                ) {
                    availableCombinations.push(combination);
                }
            });


            const notOnlyBrelan = availableCombinations.some(combination => !combination.id.includes('brelan'));

            if (isSec && availableCombinations.length > 0 && notOnlyBrelan) {
                availableCombinations.push(allCombinations.find(combination => combination.id === 'sec'));
            }

            return availableCombinations;
        }
    },

    grid: {

        resetcanBeCheckedCells: (grid) => {
            const updatedGrid = grid.map(row => row.map(cell => {
                return { ...cell, canBeChecked: false };    
            }));

            return updatedGrid;
        },

        updateGridAfterSelectingChoice: (idSelectedChoice, grid) => {

            const updatedGrid = grid.map(row => row.map(cell => {
                if (cell.id === idSelectedChoice && cell.owner === null) {
                    return { ...cell, canBeChecked: true };
                } else {
                    return cell;
                }
            }));

            return updatedGrid;
        },

        selectCell: (idCell, rowIndex, cellIndex, currentTurn, grid, gameState) => {
            const updatedGrid = grid.map((row, rowIndexParsing) => row.map((cell, cellIndexParsing) => {
                if ((cell.id === idCell) && (rowIndexParsing === rowIndex) && (cellIndexParsing === cellIndex)) {
                    const currentPlayerTokens = gameState.tokens[currentTurn];
                    if (currentPlayerTokens >0) {
                        gameState.tokens[currentTurn]--;
                        return { ...cell, owner: currentTurn };
                    } else if (currentPlayerTokens === 0 ) {
                        console.log("EndGame");
                        return cell;
                        //TODO : return fact that game ended to index
                    } else {
                        return cell;
                    }
                } else {
                    return cell;
                }
            }))
        
            return updatedGrid;
        },
    

    },

    score:{
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

    utils: {
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
                if (games[i].player1Socket.id === socketId || games[i].player2Socket.id === socketId) {
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

        // calculateScoreAndWinner(grid, currentTurn, gameState) {
        //     // Fonction pour vérifier si les pions sont alignés
        //     console.log("current : ", gameState.currentTurn);
        //     function checkPointsAlignment(points) {
        //         if (points.length < 3) return 0; // Pas assez de pions pour former une combinaison
        //         const owner = points[0].owner;
        //         if (owner === null) return 0; // La combinaison n'appartient à aucun joueur
        //         if (points.length === 5) return owner; // Une combinaison de 5 pions signifie la victoire
        //         return points.length === 4 ? 2 : 1; // 2 points pour une combinaison de 4 pions, 1 point pour une combinaison de 3 pions
        //     }
        
        // //     let playerScores = {}; // Un objet pour stocker les scores de chaque joueur
        // //     let winner = null; // Variable pour stocker l'ID du vainqueur
        
        //     // Vérification des lignes
        //     for (let i = 0; i < grid.length; i++) {
        //         for (let j = 0; j < grid[i].length; j++) {
        //             for (let k = j; k < Math.min(j + 5, grid[i].length); k++) {
        //                 const points = [];
        //                 for (let l = j; l <= k; l++) {
        //                     points.push(grid[i][l]);
        //                 }
        //                 const alignmentResult = checkPointsAlignment(points);
        //                 if (alignmentResult > 0) {
        //                     if (gameState.currentTurn ==="player:1") {
        //                         console.log("player 1 ", playerScores)
        //                         playerScores[alignmentResult] = (playerScores[alignmentResult] || 0) + alignmentResult;
        //                     } else {
        //                         playerScores[alignmentResult] = (playerScores[alignmentResult] || 0) + alignmentResult;
        //                     }
        //                     // Ajouter des points au score du joueur et vérifier s'il y a un vainqueur

        //                     console.log(playerScores);
        //                     if (alignmentResult === 5) {
        //                         winner = alignmentResult; // Affecter le vainqueur si une combinaison de 5 pions est trouvée
        //                     }
        //                 }
        //             }
        //         }
        //     }
        
        //     // Vérification des colonnes
        //     // for (let j = 0; j < grid[0].length; j++) {
        //     //     for (let i = 0; i < grid.length; i++) {
        //     //         for (let k = i; k < Math.min(i + 5, grid.length); k++) {
        //     //             const points = [];
        //     //             for (let l = i; l <= k; l++) {
        //     //                 points.push(grid[l][j]);
        //     //             }
        //     //             const alignmentResult = checkPointsAlignment(points);
        //     //             if (alignmentResult > 0) {
        //     //                 console.log(alignmentResult);
        //     //                 playerScores[alignmentResult] = (playerScores[alignmentResult] || 0) + alignmentResult;
        //     //                 if (alignmentResult === 5) {
        //     //                     winner = alignmentResult;
        //     //                 }
        //     //             }
        //     //         }
        //     //     }
        //     // }
        
        //     // // Vérification des diagonales (de haut en bas)
        //     // for (let i = 0; i < grid.length; i++) {
        //     //     for (let j = 0; j < grid[i].length; j++) {
        //     //         for (let k = 0; k < Math.min(grid.length - i, grid[i].length - j, 5); k++) {
        //     //             const points = [];
        //     //             for (let l = 0; l <= k; l++) {
        //     //                 points.push(grid[i + l][j + l]);
        //     //             }
        //     //             const alignmentResult = checkPointsAlignment(points);
        //     //             if (alignmentResult > 0) {
        //     //                 playerScores[alignmentResult] = (playerScores[alignmentResult] || 0) + alignmentResult;
        //     //                 if (alignmentResult === 5) {
        //     //                     winner = alignmentResult;
        //     //                 }
        //     //             }
        //     //         }
        //     //     }
        //     // }
        
        // //     // // Vérification des diagonales (de bas en haut)
        // //     // for (let i = grid.length - 1; i >= 0; i--) {
        // //     //     for (let j = 0; j < grid[i].length; j++) {
        // //     //         for (let k = 0; k < Math.min(i + 1, grid[i].length - j, 5); k++) {
        // //     //             const points = [];
        // //     //             for (let l = 0; l <= k; l++) {
        // //     //                 points.push(grid[i - l][j + l]);
        // //     //             }
        // //     //             const alignmentResult = checkPointsAlignment(points);
        // //     //             if (alignmentResult > 0) {
        // //     //                 playerScores[alignmentResult] = (playerScores[alignmentResult] || 0) + alignmentResult;
        // //     //                 if (alignmentResult === 5) {
        // //     //                     winner = alignmentResult;
        // //     //                 }
        // //     //             }
        // //     //         }
        // //     //     }
        // //     // }
        
        // //     return { playerScores, winner };
        // // }
        
    }
}

module.exports = GameService;
