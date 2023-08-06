const floors = document.querySelector("#numFloors");
const lifts = document.querySelector("#numLifts");
const submit = document.querySelector("#submitBtn");
const building = document.querySelector(".building");
const floorDiv = document.querySelector(".floors");
let liftDiv = document.querySelector(".lifts");
const form = document.querySelector("form");
const title = document.querySelector(".title");
const back = document.querySelector(".back");
const commands = document.querySelector(".commands");

let liftPositons = new Set();

const validateUserInput = () => {
  //Add validation on no of lifts and floors
  if (floors.value === "" || lifts.value === "") {
    alert("Please enter the number of floors and lifts");
    return;
  }
  if (
    (floors.value < 2 && floors.value > 8) ||
    (lifts.value < 1 && lifts.value > 4)
  ) {
    alert("Please enter a minimum of 5 floors and 1 lift");
    return;
  }
  form.classList.add("hide");
  title.classList.add("hide");
  back.classList.remove("hide");
  createFloors();
};

function createButton(text, floor, direction) {
  const button = document.createElement("button");
  button.classList.add("button");
  button.innerHTML = text;
  button.setAttribute("floor", floor);
  button.setAttribute("direction", direction);
  return button;
}

const createFloorsAndLifts = () => {
  commands.innerHTML = "";
  floorDiv.innerHTML = "";

  //Create the floors
  for (let i = floors.value - 1; i >= 0; i--) {
    let floor = document.createElement("div");
    floor.classList.add("floor");
    floorDiv.appendChild(floor);
    if (i == 0) {
      for (let j = 0; j < lifts.value; j++) {
        let lift = document.createElement("div");
        lift.setAttribute("key", j);
        lift.setAttribute("direction", "up");
        lift.setAttribute("status", "ideal");
        lift.setAttribute("floor", i);
        lift.classList.add("lift");
        lift.classList.add("LIFT" + j + "_" + i);
        lift.classList.add("FLOOR" + i);

        liftPositons.add(i + "_" + j);
        floor.appendChild(lift);
      }
    }

    const command = document.createElement("div");
    command.classList.add("command");
    if (i === floors.value - 1) {
      const down = createButton("Down", i, "down");
      command.appendChild(down);
    } else if (i === 0) {
      const up = createButton("Up", i, "up");
      command.appendChild(up);
    } else {
      const up = createButton("Up", i, "up");
      const down = createButton("Down", i, "down");
      command.appendChild(up);
      command.appendChild(down);
    }
    commands.appendChild(command);
  }
  building.classList.add("show");
  const move = document.querySelectorAll(".button");
  move.forEach((button) => {
    button.addEventListener("click", () => runQueue(button));
  });
};

submit.addEventListener("click", createFloorsAndLifts);

const getPossibleLift = (floorNo) => {
  let searchUp = floorNo;
  let searchDown = floorNo;
  let totalFloors = floors.value;

  let nearestLift;
  while (searchUp <= totalFloors || searchDown >= 0) {
    nearestLift = document.querySelector(".FLOOR" + searchUp);
    if (nearestLift) break;
    nearestLift = document.querySelector(".FLOOR" + searchDown);
    if (nearestLift) break;
    searchUp++;
    searchDown--;
  }

  return nearestLift;
};

//Add while loop for handling queue
const runQueue = (button) => {
  const floorNo = button.getAttribute("floor");
  const direction = button.getAttribute("direction");
  const nearestLift = getPossibleLift(floorNo);

  setTimeout(() => {
    moveLift(nearestLift, floorNo + "_" + direction);
  }, 1000);
};

const moveLift = (lift, floor) => {
  const floorNo = floor.split("_")[0];
  const direction = floor.split("_")[1];
  const move = -(floorNo * 200);

  const liftNo = lift.getAttribute("key");
  const liftPreviousFloor = lift.getAttribute("floor");
  lift.classList.remove("FLOOR" + liftPreviousFloor);
  lift.classList.remove("LIFT" + liftNo);

  lift.style.transform = `translateY(${move}px)`;
  lift.setAttribute("direction", direction);
  lift.setAttribute("status", "running");
  lift.setAttribute("floor", floorNo);
  lift.classList.add("animate");
  lift.classList.add("LIFT" + lift.getAttribute("key") + "_" + floorNo);
  lift.classList.add("FLOOR" + floorNo);

  lift.addEventListener("transitionend", (e) => onTransitionEnd(e, lift));
};

const onTransitionEnd = (event, lift) => {
  if (event.propertyName == "transform") {
    lift.setAttribute("status", "ideal");
    lift.classList.remove("animate");
    console.log("LIFT: ", lift);
  }
};
