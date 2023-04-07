// Namespace
const App = {
  // All of our selected HTML elements
  $: {
    menu: document.querySelector(".menu"),
    menuItems: document.querySelector(".items"),
  },

  // Where we add event listeners to application, this is a function property on the App objects
  init() {
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });
  },
};

// listening for load, the initializing application
window.addEventListener("load", App.init);
