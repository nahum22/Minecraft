document.querySelector("#start-game").addEventListener("click", startGame);

function checkNeighbors(element) {
  const num = (parseInt(element.id.replace("a", "")) + 40).toString();
  const typecast = document.querySelector("#a" + num).getAttribute("type");

  const numRight = (parseInt(element.id.replace("a", "")) + 1).toString();
  const typeRight = document
    .querySelector("#a" + numRight)
    .getAttribute("type");

  const numLeft = (parseInt(element.id.replace("a", "")) - 1).toString();
  const typeLeft = document.querySelector("#a" + numLeft).getAttribute("type");

  console.log(typecast);
  if (typecast === "empty" && typeLeft === "empty" && typeRight === "empty") {
    return false;
  }
  return true;
}

function startGame() {
  document.querySelector(".intro-screen").style.display = "none";
  document.querySelector(".minecraft-background").style.display = "block";
}

// Define the terrain types
const land = "<div class='earth block' type='earth'></div>";
const rock = "<div class='rock block' type='rock'></div>";
const water = "<div class='water block' type='water'></div>";
const cloud = "<div class='cloud block' type='cloud'></div>";
const grass = "<div class='grass block' type='grass'></div>";
const empty = "<div class='block empty' type='empty'></div>";
const tree = "<div class='tree block' type='tree'></div>";

const terrains = ["sky", "earth", "tree", "lava", "rock", "water"];
const resources = {};
let resource = "";
let tool = "";

class BackgoundGenerator {
  constructor(background) {
    this.background = background;
  }

  generate() {}
  //25
  rows = [
    empty.repeat(40),
    empty.repeat(40),
    empty.repeat(40),
    empty.repeat(40),
    empty.repeat(40),
    empty.repeat(40),

    empty.repeat(24) + grass.repeat(3) + empty.repeat(13),
    empty.repeat(24) + grass.repeat(3) + empty.repeat(13),
    empty.repeat(24) + grass.repeat(3) + empty.repeat(13),
    empty.repeat(25) + tree + empty.repeat(14),
    empty.repeat(25) + tree + empty.repeat(14),
    empty.repeat(9) +
      tree.repeat(5) +
      empty.repeat(11) +
      tree +
      empty.repeat(14),
    empty.repeat(10) +
      tree.repeat(3) +
      empty.repeat(12) +
      tree +
      empty.repeat(14),
    water.repeat(24) + rock.repeat(16),
    water.repeat(24) + rock.repeat(16),
    water.repeat(24) + rock.repeat(16),
    water.repeat(24) + grass.repeat(16),
    water.repeat(24) + grass.repeat(16),
    rock.repeat(24) + grass.repeat(16),
    rock.repeat(24) + grass.repeat(16),
    rock.repeat(24) + grass.repeat(16),
    rock.repeat(24) + grass.repeat(16),
    land.repeat(24) + grass.repeat(16),
    land.repeat(24) + grass.repeat(16),

    land.repeat(24) + grass.repeat(16),

    land.repeat(24) + land.repeat(16),
  ];

  init() {
    let tool = "";
    for (const row of this.rows) {
      this.background.innerHTML += `<div class='row'> ${row} </div>`;
    }
    const tiles = document.querySelectorAll(".block");
    const tools = document.querySelectorAll(".tool");
    tools.forEach((item) => item.addEventListener("click", chooseTool));
    let i = 0;
    tiles.forEach((item) => {
      item.addEventListener("click", gameAction);
      item.id = "a" + i;
      i++;
    });
  }
}

function resetTools() {
  const tools = document.querySelectorAll(".tool");
  tools.forEach((item) => item.classList.remove("selectedTool"));
  tool = "";
}

function chooseTool(event) {
  resetTools();
  tool = event.target.id;
  event.target.classList.add("selectedTool");
}

function gameAction(event) {
  console.log(tool);
  //  if (event.target.getAttribute("type") === "empty") {
  if (checkNeighbors(event.target) && tool.length === 0) {
    toFill(event.target);
  } else {
    if (checkCanBeLaveraged(event.target.getAttribute("type"))) {
      event.target.className = "block";
      leverage(event.target.getAttribute("type"));
      showBasket();
      event.target.setAttribute("type", "empty");
    }
  }
}

//
function checkCanBeLaveraged(brick) {
  if ((brick === "grass" || brick === "earth") && tool == "shovel") {
    return true;
  }
  if (brick === "rock" && tool == "pickaxe") {
    console.log("salvage rock");
    return true;
  }

  if (brick === "tree" && tool == "axe") {
    return true;
  }
  if (brick === "water" && tool == "bucket") {
    return true;
  }
}

const background = document.querySelector(".minecraft-background");
function leverage(resource) {
  if (resources[resource]) {
    resources[resource] += 1;
  } else {
    resources[resource] = 1;
  }
}

function showBasket() {
  const container = document.querySelector(".inventory");
  container.innerHTML = "";
  Object.entries(resources).forEach(([key, value]) => {
    container.innerHTML += `<div class='${key} block resource'></div><div>${value}</div> `;
  });
  document
    .querySelectorAll(".resource")
    .forEach((item) => item.addEventListener("click", () => setResource(item)));
}

function setResource(item) {
  const array = item.className.split(" ");
  tool = "";
  resource = array[0];
}

function deplete(resource) {
  if (resources[resource]) {
    resources[resource] -= 1;
    if (resources[resource] === 0) {
      delete resources[resource];
    }
  }
}

function toFill(item) {
  if (resources[resource]) {
    item.classList.add(resource);
    item.setAttribute("type", resource);
    deplete(resource);
    showBasket();
  }
}

const newgame = new BackgoundGenerator(background);

newgame.init();
