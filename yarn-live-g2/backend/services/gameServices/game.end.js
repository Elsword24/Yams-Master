const init = require("./game.init");
const tokens = require("./game.token");

const end = {
    checkEnd: (gameState) => {
      let hWinner = end.CheckEndHorizontal(gameState.grid);
      let vWinner = end.checkEndVertical(gameState.grid);
      let dWinner = end.checkEndDiagonal(gameState.grid);
      let endType = null;
      if ((hWinner != null) || (vWinner != null) || (dWinner != null)) {
        endType = "alignment";
      }
      let winner;
      if (endType === "alignment") {
        winner = hWinner || vWinner || dWinner;
      }
      const playersHaveRemainingTokens = tokens.checkAvailablePlayerTokens(gameState);
      if (!playersHaveRemainingTokens) {
        endType = "score";
        let scoreWinner = end.checkScores(gameState);
        winner = scoreWinner;
      }

      if (winner != null) {
        winner = winner.split(":")[1];
        loser = winner === "1" ? "2" : "1";
        gameType = gameState.gameType;
        winnerUsedTokens = init.MAX_TOKENS() - gameState[`player${winner}Tokens`];
        loserUsedTokens = init.MAX_TOKENS() - gameState[`player${loser}Tokens`];
        winnerScore = gameState[`player${winner}Score`];
        loserScore = gameState[`player${loser}Score`];
        if (endType === "alignment") {
          winnerScore = null;
          loserScore = null;
        }
        const gameResult = {
          gameType,
          winner,
          loser,
          winnerUsedTokens,
          loserUsedTokens,
          winnerScore,
          loserScore,
          endType,
        };
        return gameResult;
      }else{
        const gameResult = {
          gameType: null,
          winner: null,
          loser: null,
          winnerUsedTokens: null,
          loserUsedTokens: null,
          winnerScore: null,
          loserScore: null,
          endType: null,
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
      } else if (player1Score < player2Score) {
        winner = "player:2";
      } else {
        winner = "draw";
      }
      return winner;
    },
    CheckEndHorizontal: (grid) => {
      let winner = null;
      const isPlayer1Winner = grid.some((row) =>
        row.every((cell) => cell.owner === "player:1")
      );

      const isPlayer2Winner = grid.some((row) =>
        row.every((cell) => cell.owner === "player:2")
      );
      
      if (isPlayer1Winner) {
        winner = "player:1";
        return winner;
      }

      if (isPlayer2Winner) {
        winner = "player:2";
        return winner;
      }
    },
    checkEndVertical: (grid) => {
      let winner = null;
      const isPlayer1Winner = grid[0]
        .map((_, col) => grid.every((row) => row[col].owner === "player:1"))
        .some(Boolean);

      const isPlayer2Winner = grid[0]
        .map((_, col) => grid.every((row) => row[col].owner === "player:2"))
        .some(Boolean);

      if (isPlayer1Winner) {
        winner = "player:1";
        return winner;
      }

      if (isPlayer2Winner) {
        winner = "player:2";
      }
    },
    checkEndDiagonal: (grid) => {
      let winner = null;
      // Check for diagonal from top left to bottom right
      const isPlayer1WinnerFirstDiagonal = grid
        .map((row, index) => row[index])
        .every((cell) => cell.owner === "player:1");
      const isPlayer2WinnerFirstDiagonal = grid
        .map((row, index) => row[index])
        .every((cell) => cell.owner === "player:2");

      if (isPlayer1WinnerFirstDiagonal) {
        winner = "player:1";
        return winner;
      }

      if (isPlayer2WinnerFirstDiagonal) {
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
        winner = "player:1";
        return winner;
      }

      if (isPlayer2WinnerSecondDiagonal) {
        winner = "player:2";
        return winner;
      }
    },
}

module.exports = end;