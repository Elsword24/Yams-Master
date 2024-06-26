const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var uniqid = require("uniqid");
const GameService = require("./services/game.services");
const { gameState } = require("./services/gameServices/game.init");

// ---------------------------------------------------
// -------- CONSTANTS AND GLOBAL VARIABLES -----------
// ---------------------------------------------------

let queue = [];
let games = [];

// ---------------------------------
// -------- GAME METHODS -----------
// ---------------------------------

const updateClientsViewTimers = (game) => {
  game.player1Socket.emit(
    "game.timer",
    GameService.send.forPlayer.gameTimer("player:1", game.gameState)
  );
  game.player2Socket.emit(
    "game.timer",
    GameService.send.forPlayer.gameTimer("player:2", game.gameState)
  );
};

const updateClientsViewDecks = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
      "game.deck.view-state",
      GameService.send.forPlayer.deckViewState("player:1", game.gameState)
    );
    game.player2Socket.emit(
      "game.deck.view-state",
      GameService.send.forPlayer.deckViewState("player:2", game.gameState)
    );
  }, 200);
};

const updateClientsViewChoice = (game) => {
  game.player1Socket.emit(
    "game.choice.view-state",
    GameService.send.forPlayer.choiceViewState("player:1", game.gameState)
  );
  game.player2Socket.emit(
    "game.choice.view-state",
    GameService.send.forPlayer.choiceViewState("player:2", game.gameState)
  );
};

const updateClientsViewGrid = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
      "game.grid.view-state",
      GameService.send.forPlayer.gridViewState("player:1", game, GameService.grid)
    );
    game.player2Socket.emit(
      "game.grid.view-state",
      GameService.send.forPlayer.gridViewState("player:2", game)
    );
  }, 200);
};

const updateClientsViewPlayersInfos = (game) => {
  setTimeout(() => {
    game.player1Socket.emit(
      "game.score.view",
      GameService.send.forPlayer.playerAndOppnonentInfosState(
        "player:1",
        game.gameState
      )
    );
    game.player2Socket.emit(
      "game.score.view",
      GameService.send.forPlayer.playerAndOppnonentInfosState(
        "player:2",
        game.gameState
      )
    );
  }, 200);
};

const newPlayerInQueue = (socket) => {
  queue.push(socket);

  // Queue management
  if (queue.length >= 2) {
    const player1Socket = queue.shift();
    const player2Socket = queue.shift();
    createGame(player1Socket, player2Socket, "online");
  } else {
    socket.emit("queue.added", GameService.send.forPlayer.viewQueueState());
  }
};

const createGame = (player1Socket, player2Socket, type) => {
  // init objet (game) with this first level of structure:
  // - gameState : { .. evolutive object .. }
  // - idGame : just in case ;)
  // - player1Socket: socket instance key "joueur:1"
  // - player2Socket: socket instance key "joueur:2"
  const newGame = GameService.init.gameState();
  newGame["idGame"] = uniqid();
  newGame["gameState"]["gameType"] = type;
  newGame["gameState"]["gameStartTime"] = Date.now();
  newGame["gameState"]["gameEndTime"] = null;
  newGame["player1Socket"] = player1Socket;
  newGame["player2Socket"] = player2Socket;

  // push game into 'games' global array
  games.push(newGame);

  const gameIndex = GameService.util.findGameIndexById(games, newGame.idGame);

  // just notifying screens that game is starting
  games[gameIndex].player1Socket.emit(
    "game.start",
    GameService.send.forPlayer.gameViewState("player:1", games[gameIndex])
  );
  games[gameIndex].player2Socket.emit(
    "game.start",
    GameService.send.forPlayer.gameViewState("player:2", games[gameIndex])
  );

  updateClientsViewTimers(games[gameIndex]);
  updateClientsViewDecks(games[gameIndex]);
  updateClientsViewGrid(games[gameIndex]);
  updateClientsViewPlayersInfos(games[gameIndex]);

  games[gameIndex].gameInterval = setInterval(() => {

    games[gameIndex].gameState.timer--;

    updateClientsViewTimers(games[gameIndex]);

    if (games[gameIndex].gameState.timer === 0) {

      games[gameIndex].gameState.currentTurn =
        games[gameIndex].gameState.currentTurn === "player:1"
          ? "player:2"
          : "player:1";

      games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();

      games[gameIndex].gameState.deck = GameService.init.deck();

      games[gameIndex].gameState.choice = GameService.init.choice();

      // reset views also
      updateClientsViewTimers(games[gameIndex]);
      updateClientsViewDecks(games[gameIndex]);
      updateClientsViewChoice(games[gameIndex]);
      updateClientsViewGrid(games[gameIndex]);
    }
  }, 1000);

  // remove intervals at deconnection
  player1Socket.on("disconnect", () => {
    clearInterval(games[gameIndex].gameInterval);
  });

  player2Socket.on("disconnect", () => {
    clearInterval(games[gameIndex].gameInterval);
  });
};
const leaveQueue = (socket) => {
  const index = queue.indexOf(socket);
  if (index > -1) {
    queue.splice(index, 1);
  }

  socket.emit("queue.removed", GameService.send.forPlayer.viewQueueState());
};

// ---------------------------------------
// -------- SOCKETS MANAGEMENT -----------
// ---------------------------------------

io.on("connection", (socket) => {
  console.log(`[${socket.id}] socket connected`);

  socket.on("queue.join", () => {
    console.log(`[${socket.id}] new player in queue `);
    newPlayerInQueue(socket);
  });

  socket.on("queue.leave", () => {
    console.log(`[${socket.id}] player leave the queue`);
    leaveQueue(socket);
  });

  socket.on("game.dices.roll", () => {
    const gameIndex = GameService.util.findGameIndexBySocketId(
      games,
      socket.id
    );
    if (
      games[gameIndex].gameState.deck.rollsCounter <=
      games[gameIndex].gameState.deck.rollsMaximum -1
    ) {
      games[gameIndex].gameState.deck.dices = GameService.dices.roll(
        games[gameIndex].gameState.deck.dices
      );
      games[gameIndex].gameState.deck.rollsCounter++;

      const dices = games[gameIndex].gameState.deck.dices;
      const isDefi = false;
      const isFirstRoll = games[gameIndex].gameState.deck.rollsCounter === 1;

      const combinations = GameService.choice.findCombinations(
        dices,
        isDefi,
        isFirstRoll
      );

      games[gameIndex].gameState.choice.availableChoice = combinations;
    }
    else {
      games[gameIndex].gameState.deck.dices = GameService.dices.roll(
        games[gameIndex].gameState.deck.dices
      );
      games[gameIndex].gameState.deck.rollsCounter++;

      games[gameIndex].gameState.deck.dices = GameService.dices.lockEveryDice(
        games[gameIndex].gameState.deck.dices
      );

      const dices = games[gameIndex].gameState.deck.dices;
      const isDefi = false;
      const isFirstRoll = games[gameIndex].gameState.deck.rollsCounter === 1;

      const combinations = GameService.choice.findCombinations(
        dices,
        isDefi,
        isFirstRoll
      );

      games[gameIndex].gameState.choice.availableChoice = combinations;

      if (combinations.length == 0) {
        games[gameIndex].gameState.timer = 3;
      }
    }
   setTimeout(() => {
      updateClientsViewDecks(games[gameIndex]);
      updateClientsViewChoice(games[gameIndex]);
    }, 0);
  });

  socket.on("game.dices.lock", (idDice) => {
    const gameIndex = GameService.util.findGameIndexBySocketId(
      games,
      socket.id
    );
    const diceIndex = GameService.util.findDiceIndexByDiceId(
      games[gameIndex].gameState.deck.dices,
      idDice
    );

    games[gameIndex].gameState.deck.dices[diceIndex].locked =
      !games[gameIndex].gameState.deck.dices[diceIndex].locked;

    updateClientsViewDecks(games[gameIndex]);
  });

  socket.on("game.choice.selected", (data) => {
    const gameIndex = GameService.util.findGameIndexBySocketId(
      games,
      socket.id
    );

    games[gameIndex].gameState.choice.idSelectedChoice = data.choiceId;

    updateClientsViewChoice(games[gameIndex]);
    updateClientsViewGrid(games[gameIndex]);
  });

  socket.on("game.grid.selected", (data) => {
    const gameIndex = GameService.util.findGameIndexBySocketId(
      games,
      socket.id
    );

    games[gameIndex].gameState.grid = GameService.grid.resetcanBeCheckedCells(
      games[gameIndex].gameState.grid
    );

    games[gameIndex].gameState.grid = GameService.grid.selectCell(
      data.cellId,
      data.rowIndex,
      data.cellIndex,
      games[gameIndex].gameState.currentTurn,
      games[gameIndex].gameState.grid
    );
    GameService.score.detectAlignmentTypeAndScore(
      games[gameIndex].gameState,
      data.rowIndex,
      data.cellIndex
    ); 
    games[gameIndex].gameState.currentTurn =
      games[gameIndex].gameState.currentTurn === "player:1"
        ? "player:2"
        : "player:1";
    games[gameIndex].gameState.timer = GameService.timer.getTurnDuration();
    const VictoryResult = GameService.end.checkEnd(games[gameIndex].gameState);
    if (VictoryResult.winner != null) {
      if (VictoryResult.winner === "1") {
        games[gameIndex].player1Socket.emit(
          "game.over.p1",
          GameService.send.forPlayer.victoryState(VictoryResult.winner)
        );
        games[gameIndex].player2Socket.emit(
          "game.over.p1",
          GameService.send.forPlayer.victoryState(VictoryResult.winner)
        );
        } else if (VictoryResult.winner === "2") {
          games[gameIndex].player1Socket.emit(
            "game.over.p2",
            GameService.send.forPlayer.victoryState(VictoryResult.winner)
          );
          games[gameIndex].player2Socket.emit(
            "game.over.p2",
            GameService.send.forPlayer.victoryState(VictoryResult.winner)
          );
        } else {
          games[gameIndex].player1Socket.emit(
            "game.over.draw",
            GameService.send.forPlayer.victoryState(VictoryResult.winner)
          );
          games[gameIndex].player2Socket.emit(
            "game.over.draw",
            GameService.send.forPlayer.victoryState(VictoryResult.winner)
          );
        }
    }
    games[gameIndex].gameState.deck = GameService.init.deck();
    games[gameIndex].gameState.choice = GameService.init.choice();
    games[gameIndex].player1Socket.emit(
      "game.timer",
      GameService.send.forPlayer.gameTimer(
        "player:1",
        games[gameIndex].gameState
      )
    );
    games[gameIndex].player2Socket.emit(
      "game.timer",
      GameService.send.forPlayer.gameTimer(
        "player:2",
        games[gameIndex].gameState
      )
    );
    console.log(games[gameIndex].gameState.Player)
    updateClientsViewDecks(games[gameIndex]);
    updateClientsViewChoice(games[gameIndex]);
    updateClientsViewGrid(games[gameIndex]);
    updateClientsViewPlayersInfos(games[gameIndex]);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[${socket.id}] socket disconnected - ${reason}`);
  });
});

// -----------------------------------
// -------- SERVER METHODS -----------
// -----------------------------------

app.get("/", (req, res) => res.sendFile("index.html"));

http.listen(3000, function () {
  console.log("listening on *:3000");
});
