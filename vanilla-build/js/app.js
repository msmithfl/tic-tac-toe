import View from "./view.js";
import Store from "./store.js";

// Namespace
const App = {
  // All of our selected HTML elements
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBtn: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
    squares: document.querySelectorAll('[data-id="square"]'),
    modal: document.querySelector('[data-id="modal"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalBtn: document.querySelector('[data-id="modal-btn"]'),
    turn: document.querySelector('[data-id="turn"]'),
  },

  // Variable will not persist over browser refreshes
  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    console.log(p1Moves);

    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", // in-progress | complete
      winner, // 1 | 2 | null
    };
  },

  // Where we add event listeners to application, this is a function property on the App objects
  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    // Toggle menu - DONE
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    // Reset button - TODO
    App.$.resetBtn.addEventListener("click", (event) => {
      console.log("Reset the game.");
    });

    // New round button - TODO
    App.$.newRoundBtn.addEventListener("click", (event) => {
      console.log("Add a new round.");
    });

    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });

    // Click squares - TODO
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        // Checks if there is already a play, if so, return early

        // Helper method
        // Looks for the existing move in the moves array
        // by checking if the clicked Id exists in the array.
        // @param sqaureId
        // @return boolean
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }

        // Looks at the last element in an array to check last move
        const lastMove = App.state.moves.at(-1);

        // Helper method getting the opposite of current player
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);

        // If no moves have been made cyrrentPlayer is 1, otherwise set player to opposite of currentPlayer
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);

        const nextPlayer = getOppositePlayer(currentPlayer);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, you are up!`;

        // Assign X or O based on currentPlayer
        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLabel.classList = "turquoise";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        // Place icon
        square.replaceChildren(squareIcon);

        // Check if there is a winner or tie game
        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");

          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = "Tie game!";
          }

          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

// config array
const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

// listening for load, the initializing application

function init() {
  // keeps controller logic as simple as possible
  // orchestrates what happens to the state and view
  const view = new View();
  const store = new Store(players);

  console.log(store.game);

  view.bindGameResetEvent((event) => {
    view.closeAll();

    store.reset();

    view.clearMoves();

    view.setTurnIndicator(store.game.currentPlayer);
  });

  view.bindNewRoundEvent((event) => {
    console.log("New round event");
    console.log(event);
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    // Place an icon of the current player in a quare
    view.handlePlayerMove(square, store.game.currentPlayer);

    // Advance to the next state by pushing a move to the moves array
    store.playerMove(+square.id);

    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : "Tie!"
      );

      return;
    }

    // Set the next player's turn indicator
    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
