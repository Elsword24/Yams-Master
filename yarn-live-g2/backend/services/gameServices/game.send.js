const grid = require("./game.grid");

const send = {
    forPlayer: {
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

      choiceViewState: (playerKey, gameState) => {
        const chociesViewState = {
          displayChoice: true,
          canMakeChoice: playerKey === gameState.currentTurn,
          idSelectedChoice: gameState.choice.idSelectedChoice,
          availableChoice: gameState.choice.availableChoice,
        };
        return chociesViewState;
      },

      gridViewState: (playerKey, game) => {
        const updatedGrid = grid.updateGridAfterSelectingChoice(
          game.gameState.choice.idSelectedChoice,
          game.gameState.grid
        );

        return {
          displayGrid: true,
          canSelectCells:
            playerKey === game.gameState.currentTurn &&
            game.gameState.choice.availableChoice.length > 0,
          grid: updatedGrid,
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
        // Adapt response according to current player
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
      choiceViewState: (playerKey, gameState) => {
        const choiceViewState = {
          displayChoice: true,
          canMakeChoice: playerKey === gameState.currentTurn,
          idSelectedChoice: gameState.choice.idSelectedChoice,
          availableChoice: gameState.choice.availableChoice,
        };
        return choiceViewState;
      },

      playerAndOppnonentInfosState: (playerKey, gameState) => {
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
        const gameInfos = {
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
}

module.exports = send;