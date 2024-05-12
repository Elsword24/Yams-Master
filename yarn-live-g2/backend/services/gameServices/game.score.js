const end = require("./game.end");
const init = require("./game.init");

const score = {
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
                } else {

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
                    gameState.grid[row][col].owner === gameState.grid[row][col + 1].owner &&
                    gameState.grid[row][col + 1].owner === gameState.grid[row][col + 2].owner &&
                    gameState.grid[row][col + 2].owner === gameState.grid[row][col + 3].owner
                    ) {
                    scoreToAdd = 2;
                    break;
                    }
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
    },
    calculateScoreVertical: (gameState) => {
        const gridColLength = gameState.grid[0].length;
        let scoreToAdd = 0;

        for (let col = 0; col < gridColLength; col++) {
            for (let row = 0; row < gameState.grid.length - (init.MINIMUM_ALIGNED_TOKENS() - 1); row++) {
            if (gameState.grid[row][col].owner) {
                // Check if the owner is player 1
                if (gameState.grid[row][col].owner === "player:1") {
                if (row === gameState.grid.length - init.MINIMUM_ALIGNED_TOKENS()) {
                    if (
                        gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                        gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner
                    ) {
                    scoreToAdd = 1;
                    }
                } else {
                    if (
                        gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                        gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner &&
                        gameState.grid[row + 2][col].owner === gameState.grid[row + 3][col].owner
                    ) {
                        scoreToAdd = 2;
                        break;
                    }
                    if (
                        gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                        gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner
                    ) {
                        scoreToAdd = 1;
                    }
                }
                } else {
                    if (row === gameState.grid.length - init.MINIMUM_ALIGNED_TOKENS()) {
                        if (
                            gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                            gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner
                        ) {
                            scoreToAdd = 1;
                        }
                    } else {
                        if (
                            gameState.grid[row][col].owner === gameState.grid[row + 1][col].owner &&
                            gameState.grid[row + 1][col].owner === gameState.grid[row + 2][col].owner &&
                            gameState.grid[row + 2][col].owner === gameState.grid[row + 3][col].owner
                        ) {
                            scoreToAdd = 2;
                            break;
                        }
                        if (
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
    },
    calculateScoreDiagonal: (gameState, lastRowIndex, lastColIndex) => {
        const currentPlayer = gameState.currentTurn;
        let newDiagonalPoints = 0;

        const diagonalBLtoTR = score.gatherDiagonal(gameState, lastRowIndex, lastColIndex, 1, -1);
        const diagonalTLtoBR = score.gatherDiagonal(gameState, lastRowIndex, lastColIndex, 1, 1);

        newDiagonalPoints += score.calculatePointsFromDiagonal(diagonalBLtoTR, currentPlayer);
        newDiagonalPoints += score.calculatePointsFromDiagonal(diagonalTLtoBR, currentPlayer);

        if (newDiagonalPoints >= 0) {
            score.updatePlayerScore(gameState, newDiagonalPoints, "diagonal");
        }
    },
    calculatePoints: (count) => {
        if (count >= 4) return 2;
        if (count >= 3) return 1;
        return 0;
    },

    calculatePointsFromDiagonal: (cells, currentPlayer) => {
        let count = 0;
        let points = 0;
        
        cells.forEach((cell) => {
            if (cell.owner === currentPlayer) {
                count++;
            } else {
                points += score.calculatePoints(count);
                count = 0; 
            }
        });
    
        points += score.calculatePoints(count);
        return points;
    },

    updatePlayerScore: (gameState, additionalPoints, scoreType) => {
        if (gameState.currentTurn === "player:1") {
            gameState.player1Score += additionalPoints;
        } else {
            gameState.player2Score += additionalPoints;
        }
    },

    detectAlignmentTypeAndScore: (gameState, lastRowIndex, lastColIndex) => {
        const currentPlayer = gameState.currentTurn;
        let isHorizontal = false;
        let isVertical = false;
        let isDiagonal = false;
        
        const row = gameState.grid[lastRowIndex];
        if (
            score.checkAlignment(row.map(cell => cell.owner === currentPlayer), lastColIndex)
        ) {
            isHorizontal = true;
        }
        
        const column = gameState.grid.map(row => row[lastColIndex].owner === currentPlayer);
        if (score.checkAlignment(column, lastRowIndex)) {
            isVertical = true;
        }
        
        const diagonalTLtoBR = score.gatherDiagonal(gameState, lastRowIndex, lastColIndex, 1, 1);
        if (score.checkAlignment(diagonalTLtoBR.map(cell => cell.owner === currentPlayer), diagonalTLtoBR.findIndex(cell => cell.row === lastRowIndex && cell.col === lastColIndex))) {
            isDiagonal = true;
        }
        
        const diagonalBLtoTR = score.gatherDiagonal(gameState, lastRowIndex, lastColIndex, 1, -1);
        if (score.checkAlignment(diagonalBLtoTR.map(cell => cell.owner === currentPlayer), diagonalBLtoTR.findIndex(cell => cell.row === lastRowIndex && cell.col === lastColIndex))) {
            isDiagonal = true;
        }
        
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
    
    checkAlignment: (alignmentArray, centralIndex) => {    
        let left = centralIndex - 1;
        let right = centralIndex + 1;
        let count = 1;
        while (left >= 0 && alignmentArray[left]) {
            count++;
            left--;
        }
        
        while (right < alignmentArray.length && alignmentArray[right]) {
            count++;
            right++;
        }
        return count >= init.MINIMUM_ALIGNED_TOKENS();
    },
    gatherDiagonal: (gameState, startRow, startCol, rowIncrement, colIncrement) => {
        const diagonal = [];
        let row = startRow;
        let col = startCol;

        while (row >= 0 && col >= 0 && row < gameState.grid.length && col < gameState.grid[0].length) {
            diagonal.unshift({ row, col, owner: gameState.grid[row][col].owner });
            row -= rowIncrement;
            col -= colIncrement;
        }

        row = startRow + rowIncrement;
        col = startCol + colIncrement;
        while (row >= 0 && col >= 0 && row < gameState.grid.length && col < gameState.grid[0].length) {
            diagonal.push({ row, col, owner: gameState.grid[row][col].owner });
            row += rowIncrement;
            col += colIncrement;
        }

        return diagonal;
    },
}

module.exports = score;