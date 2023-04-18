const initialValue = {
  moves: [],
};

export default class Store {
  #state = initialValue;

  constructor() {}

  get game() {
    return "dummy value";
  }

  #getState() {
    return this.#state;
  }

  #saveState(stateOrFn) {
    // gets previous state
    const prevState = this.#getState();

    // checks what type of argument
    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid arugment passed to saveState");
    }

    this.#state = newState;
  }
}
