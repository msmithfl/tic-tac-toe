// Namespace
const App = {
  // All of our selected HTML elements
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBtn: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
    squares: document.querySelectorAll('[data-id="square"]'),
  },

  // Variable will not persist over browser refreshes
  state: {
    currentPlayer: 1,
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

    // Click squares - TODO
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        // Check if square is filled
        if (square.hasChildNodes()) {
          return;
        }

        const currentPlayer = App.state.currentPlayer;

        const icon = document.createElement("i");

        // Assign X or O based on currentPlayer
        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x", "yellow");
        } else {
          icon.classList.add("fa-solid", "fa-o", "turquoise");
        }

        // Assign next player
        App.state.currentPlayer = App.state.currentPlayer === 1 ? 2 : 1;

        // Place icon
        square.replaceChildren(icon);
      });
    });
  },
};

// listening for load, the initializing application
window.addEventListener("load", App.init);
