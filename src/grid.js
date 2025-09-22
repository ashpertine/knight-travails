import { boardGraph } from "./graph.js";
import Knight from "./images/knight.svg";

const createGrid = () => {
  const mainContainer = document.querySelector(".main-container");
  //delete all mainContainer children
  while (mainContainer.firstChild) {
    mainContainer.removeChild(mainContainer.firstChild);
  }
  for (let y = 7; y >= 0; y--) {
    for (let x = 0; x < 8; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if ((x % 2 == 0 && y % 2 == 1) || (x % 2 == 1 && y % 2 == 0)) {
        cell.classList.add("black");
      } else {
      }
      cell.id = `${x}-${y}`;

      mainContainer.appendChild(cell);
    }
  }
};

const placeKnight = (cell, options, i = null) => {
  const cellDiv = document.getElementById(cell);
  while (cellDiv.firstChild) {
    cellDiv.removeChild(cellDiv.lastChild);
  }
  const orderText = document.createElement("span");
  const knightIcon = new Image();
  knightIcon.src = Knight;
  knightIcon.id = "knight";
  if (options.ghost && i) {
    knightIcon.classList.add("ghost");
    orderText.innerText = i;
    orderText.style.color = "#d0c451";
  } else if (options.start) {
    orderText.innerText = "start";
  } else if (options.end) {
    orderText.innerText = "end";
  }

  cellDiv.append(orderText);
  cellDiv.append(knightIcon);
};

const setStartEndPos = () => {
  const mainContainer = document.querySelector(".main-container");
  const startButton = document.querySelector(".start-button");
  const resetButton = document.querySelector(".reset-button");
  let positions = {
    start: null,
    end: null,
  };
  return new Promise((resolve) => {
    let error = document.querySelector(".error-start");

    function handleClick(event) {
      if (!positions["start"] && !positions["end"]) {
        createGrid();
      }
      error.innerText = "";
      error.classList.remove("visible");

      if (event.target.tagName !== "DIV") return;

      if (positions["start"] == null) {
        let starting_cell = event.target.id;
        positions["start"] = starting_cell;
        placeKnight(starting_cell, { start: true });
        document.getElementById(starting_cell).style.backgroundColor = "green";
        return;
      } else if (positions["end"] == null) {
        let ending_cell = event.target.id;
        positions["end"] = ending_cell;
        placeKnight(ending_cell, { end: true });
        document.getElementById(ending_cell).style.backgroundColor = "purple";
        return;
      }
    }

    function handleStart() {
      if (positions["start"] && positions["end"]) {
        mainContainer.removeEventListener("click", handleClick);
        startButton.removeEventListener("click", handleStart);
        resolve(positions);
      } else {
        if (!(positions["start"] || positions["end"])) {
          error.innerText = "Select a starting and ending position!";
        } else if (!positions["end"]) {
          error.innerText = "Select an ending position!";
        } else {
          error.innerText = "Select a starting position!";
        }
        error.classList.add("visible");
      }
    }

    function handleReset() {
      positions = {
        start: null,
        end: null,
      };
      createGrid();
    }

    mainContainer.addEventListener("click", handleClick);
    startButton.addEventListener("click", handleStart);
    resetButton.addEventListener("click", handleReset);
  });
};

const getPositions = (positions) => {
  for (let [key, value] of Object.entries(positions)) {
    value = value.split("-");
    positions[key] = value;
  }

  return boardGraph.knight_moves(positions["start"], positions["end"]);
};

const showGhosts = async (position_order) => {
  const mainContainer = document.querySelector(".main-container");

  mainContainer.style.pointerEvents = "none";

  for (let i = 1; i < position_order.length; i++) {
    let positionArr = position_order[i].split(",");
    let positionString = positionArr.join("-");
    await new Promise((resolve) =>
      setTimeout(() => {
        placeKnight(positionString, { ghost: true }, i);
        resolve();
      }, 1000),
    );
  }

  mainContainer.style.pointerEvents = "auto";
};

const displayLoop = async () => {
  while (true) {
    let positions = await setStartEndPos();
    if (!positions.start || !positions.end) return;
    let positionOrder = getPositions(positions);

    showGhosts(positionOrder);
  }
};

export { createGrid, setStartEndPos, getPositions, displayLoop, showGhosts };
