const inArray = (array, element, start = 0) => {
	const type = Array.isArray(element);
	const lengthOfElement = type ? element.length : null;
	for (let i = start; i < array.length; i++) {
		if (array[i] != element && !type) continue;
		else if (array[i] === element) return i;
		else if (array[i].length != lengthOfElement) continue;
		else if (array[i].every((val, index) => val === element[index])) return i;
	}
	return false;
};

const updateList = (list, move) => {
	let newList = [];
	switch (move) {
		case "w":
			newList.push([list[0][0], Math.round((list[0][1] - 1.2) * 10) / 10]);
			break;
		case "a":
			newList.push([Math.round((list[0][0] - 1.2) * 10) / 10, list[0][1]]);
			break;
		case "s":
			newList.push([list[0][0], Math.round((list[0][1] + 1.2) * 10) / 10]);
			break;
		case "d":
			newList.push([Math.round((list[0][0] + 1.2) * 10) / 10, list[0][1]]);
			break;
		case "stop":
			return;
	}
	for (let i = 0; i < list.length - 1; i++) {
		newList.push(list[i]);
	}
	return newList;
};

let playing = true;
let AI = true;
AI = false;

let foodList = [];

let move = "w";
let newMove = false;
let lastMove = "a";

let snakeList = [
	[23, 23],
	[23, 24.2],
	[23, 25.4],
];

const savedSnakeList = [
	[23, 23],
	[23, 24.2],
	[23, 25.4],
];

let snakeLength = 3;
let foodEaten = 0;

// console.log(inArray([1,2,3,1,5], 1, 1)

let movesDict = {
	w: "w",
	a: "a",
	d: "d",
	s: "s",
	ArrowRight: "d",
	ArrowLeft: "a",
	ArrowDown: "s",
	ArrowUp: "w",
	" ": "stop",
};

let moveWordsDict = {
	w: "Up",
	a: "Left",
	d: "Right",
	s: "Down",
};

let lastMoveAdded = "stop";

const addMove = (move, containerId) => {
	if (move === lastMoveAdded && containerId != "next") {
		let lastMoveToAdd = document.getElementById(`${containerId}MovesContainer`)
			.lastChild.firstChild;
		lastMoveToAdd.innerHTML = `X${parseInt(lastMoveToAdd.innerHTML[1]) + 1}`;
		return;
	}
	if (containerId != "next") lastMoveAdded = move;

	let container = document.getElementById(`${containerId}MovesContainer`);

	let moveWrapper = document.createElement("div");
	moveWrapper.className = `moveWrapper ${move}`;

	let svgArrow = document.getElementById("cloneMe");

	svgArrow = svgArrow.cloneNode((deep = true));
	svgArrow.removeAttribute("id");
	svgArrow.removeAttribute("style");

	let moveCounter = document.createElement("div");
	moveCounter.innerHTML = "x1";
	moveCounter.className = "moveCounter";

	let moveName = document.createElement("div");
	moveName.innerHTML = move;
	moveName.className = "moveName";

	moveWrapper.append(moveCounter, svgArrow, moveName);
	container.append(moveWrapper);
};

const makeFood = (number = 1) => {
	for (let i = 0; i < number; i++) {
		let x = Math.round((0.2 + 1.2 * Math.round(Math.random() * 37)) * 10) / 10;
		let y = Math.round((0.2 + 1.2 * Math.round(Math.random() * 37)) * 10) / 10;
		while (inArray(foodList, [x, y]) || inArray(snakeList, [x, y])) {
			x = Math.round((0.2 + 1.2 * Math.round(Math.random() * 37)) * 10) / 10;
			y = Math.round((0.2 + 1.2 * Math.round(Math.random() * 37)) * 10) / 10;
		}

		foodList.push([x, y]);
		let board = document.getElementById("snakeBoard");
		let food = document.createElement("div");
		food.className = "food";
		food.id = `${x}-${y}`;
		food.style = `left: ${x}vw; top: ${y}vw;`;
		board.appendChild(food);
	}
};

const getDirection = (e) => {
	if (movesDict[e.key]) {
		lastMove = move;
		move = movesDict[e.key];
		e.preventDefault();

		newMove = true;
		addMove(moveWordsDict[move], "next");
		if (document.getElementById("nextMovesContainer").childNodes.length > 1) {
			document.getElementById("nextMovesContainer").firstChild.remove();
		}
	} else if (e.key === "g") {
		console.log(snakeList);
	}
};

let leftToGrow = 0;

const doAIone = () => {
	let direction = [
		foodList[0][0] - snakeList[0][0],
		foodList[0][1] - snakeList[0][1],
	];
	let directionKeys = ["", ""];
	if (direction[1] < 0) {
		directionKeys[1] = "w";
	} else {
		directionKeys[1] = "s";
	}
	if (direction[0] < 0) {
		directionKeys[0] = "a";
	} else {
		directionKeys[0] = "d";
	}
	let movesOrder = [];

	if (
		(move === "a" && directionKeys[0] === "d") ||
		(move === "d" && directionKeys[0] === "a")
	) {
		movesOrder = [directionKeys[1], directionKeys[0]];
	} else {
		movesOrder = [directionKeys[0], directionKeys[1]];
	}

	let movesList = [];

	if (movesOrder[0] === "a" || movesOrder[0] === "d") {
		for (
			let i = 0;
			i < Math.round(Math.abs(foodList[0][0] - snakeList[0][0]) / 1.2);
			i++
		) {
			movesList.push(movesOrder[0]);
		}
		for (
			let i = 0;
			i < Math.round(Math.abs(foodList[0][1] - snakeList[0][1]) / 1.2);
			i++
		) {
			movesList.push(movesOrder[1]);
		}
	} else {
		//(movesOrder[0] === "w" || movesOrder[0] === "s") {
		for (
			let i = 0;
			i < Math.round(Math.abs(foodList[0][0] - snakeList[0][0]) / 1.2);
			i++
		) {
			movesList.push(movesOrder[0]);
		}
		for (
			let i = 0;
			i < Math.round(Math.abs(foodList[0][1] - snakeList[0][1]) / 1.2);
			i++
		) {
			movesList.push(movesOrder[1]);
		}
	}

	return movesList;
};

const doAItwo = () => {
	let direction = [
		foodList[0][0] - snakeList[0][0],
		foodList[0][1] - snakeList[0][1],
	];
	let directionKeys = ["", ""];
	if (direction[1] < 0) {
		directionKeys[1] = "w";
	} else {
		directionKeys[1] = "s";
	}
	if (direction[0] < 0) {
		directionKeys[0] = "a";
	} else {
		directionKeys[0] = "d";
	}
	let movesOrder = [];

	if (
		(move === "a" && directionKeys[0] === "d") ||
		(move === "d" && directionKeys[0] === "a")
	) {
		movesOrder = [directionKeys[1], directionKeys[0]];
	} else {
		movesOrder = [directionKeys[0], directionKeys[1]];
	}

	let movesList = [];

	if (movesOrder[0] === "a" || movesOrder[0] === "d") {
		for (
			let i = 0;
			i < Math.round(Math.abs(foodList[0][0] - snakeList[0][0]) / 1.2);
			i++
		) {
			movesList.push(movesOrder[0]);
		}
		for (
			let i = 0;
			i < Math.round(Math.abs(foodList[0][1] - snakeList[0][1]) / 1.2);
			i++
		) {
			movesList.push(movesOrder[1]);
		}
	} else {
		//(movesOrder[0] === "w" || movesOrder[0] === "s") {
		for (
			let i = 0;
			i < Math.round(Math.abs(foodList[0][0] - snakeList[0][0]) / 1.2);
			i++
		) {
			movesList.push(movesOrder[0]);
		}
		for (
			let i = 0;
			i < Math.round(Math.abs(foodList[0][1] - snakeList[0][1]) / 1.2);
			i++
		) {
			movesList.push(movesOrder[1]);
		}
	}
	let listOK = false;
	let testList = snakeList;
	let loopCounter = 0;
	let max = 0;
	let backup = [];
	let bigLoopCounter = 0;

	while (!listOK && bigLoopCounter < 10) {
		while (!listOK && loopCounter < 100) {
			loopCounter++;
			testList = snakeList;
			listOK = true;
			console.log("looping");
			for (let i = 0; i < movesList.length; i++) {
				if (i > max) {
					max = i;
					backup = movesList;
					loopCounter = 0;
				}

				console.log(movesList);

				testList = updateList(testList, movesList[i]);

				console.log(inArray(testList, testList[0], 1));
				if (inArray(testList, testList[0], 1)) {
					console.log("stuff");
					if (movesList[i] === "w" || movesList[i] === "s") {
						movesList[i] = "a";
					} else {
						movesList[i] = "w";
					}
					listOK = false;
					break;
				}
			}
		}

		while (!listOK && 200 > loopCounter > 100) {
			movesList = backup;
			loopCounter++;
			testList = snakeList;
			listOK = true;
			console.log("looping");
			for (let i = 0; i < movesList.length; i++) {
				if (i > max) {
					max = i;
					backup = movesList;
					loopCounter = 0;
				}

				console.log(movesList);

				testList = updateList(testList, movesList[i]);

				console.log(inArray(testList, testList[0], 1));
				if (inArray(testList, testList[0], 1)) {
					console.log("stuff");
					if (movesList[i] === "w" || movesList[i] === "s") {
						movesList[i] = "d";
					} else {
						movesList[i] = "s";
					}
					listOK = false;
					break;
				}
			}
		}
		loopCounter = 0;

		bigLoopCounter++;
	}

	// listOK = false

	// for (let i = 0; i < movesList.length - 1; i++) {
	// 	if (
	// 		(movesList[i] === "w" || movesList[i] === "s") &&
	// 		(movesList[i + 1] === "w" || movesList[i + 1] === "s") &&
	// 		movesList[i] != movesList[i + 1]
	// 	) {
	// 		movesList.splice(i + 1, 0, "d");
	// 	} else if (
	// 		(movesList[i] === "a" || movesList[i] === "d") &&
	// 		(movesList[i + 1] === "a" || movesList[i + 1] === "d") &&
	// 		movesList[i] != movesList[i + 1]
	// 	) {
	// 		movesList.splice(i + 1, 0, "w");
	// 	}
	// }

	// while (!listOK) {
	// 	listOK = true;
	// 	for (let i = 0; i < movesList.length; i++) {
	// 		console.log(movesList);
	// 		updateList(testList, movesList[i]);
	// 		if (inArray(testList, testList[0], 1)) {
	// 			// if (movesList[i] === "w" || movesList[i] === "s") {
	// 			// 	movesList[i] = "d";
	// 			// 	let checkList = updateList(testList, "d");
	// 			// 	if (inArray(checkList, checkList[0], 1)) {
	// 			// 		movesList[i] = "a";
	// 			// 	}
	// 			// } else {
	// 			// 	movesList[i] = "s";
	// 			// 	let checkList = updateList(testList, "s");
	// 			// 	if (inArray(checkList, checkList[0], 1)) {
	// 			// 		movesList[i] = "w";
	// 			// 	}
	// 			// }

	// 			console.log('STOPPING')
	// 			testList.splice(i, testList.length-i)
	// 			testList.push('stop')
	// 			listOK = false;
	// 			break;
	// 		}
	// 	}
	// }

	return movesList;
};

let AICount = 0;

let AIMoves = [];

const update = (reset) => {
	console.log("updating");
	if (reset)
		snakeList = [
			[23, 23],
			[23, 24.2],
			[23, 25.4],
		];
	// if (AI) {
	// 	AIMoves = doAItwo();
	// 	AI = false;
	// }

	// if (AIMoves.length > 0) {
	// 	move = AIMoves[0];
	// 	AIMoves.shift();
	// } else {
	// 	AIMoves = doAItwo();
	// 	move = AIMoves[0];
	// 	AIMoves.shift();
	// }

	if (!playing) return;

	if (newMove) {
		addMove(moveWordsDict[move], "last");
		newMove = false;
	}
	const head = document.getElementById("head");

	switch (move) {
		case "w":
			snakeList.unshift([
				snakeList[0][0],
				Math.round((snakeList[0][1] - 1.2) * 10) / 10,
			]);
			break;
		case "a":
			snakeList.unshift([
				Math.round((snakeList[0][0] - 1.2) * 10) / 10,
				snakeList[0][1],
			]);
			break;
		case "s":
			snakeList.unshift([
				snakeList[0][0],
				Math.round((snakeList[0][1] + 1.2) * 10) / 10,
			]);
			break;
		case "d":
			snakeList.unshift([
				Math.round((snakeList[0][0] + 1.2) * 10) / 10,
				snakeList[0][1],
			]);
			break;
		case "stop":
			return;
	}

	if (
		snakeList[0][0] > 44.6 ||
		snakeList[0][0] < 0.2 ||
		snakeList[0][1] > 44.6 ||
		snakeList[0][1] < 0.2 ||
		inArray(snakeList, snakeList[0], 1)
	) {
		console.log(inArray(snakeList, snakeList[0], 1));
		//add lose mechanic
		clearInterval(updateId);
		console.log(snakeList);

		document.getElementById("finalLength").innerHTML =
			"final length: " + snakeLength;
		document.getElementById("totalEaten").innerHTML =
			"total food eaten: " + foodEaten;
		document
			.getElementById("lossMenu")
			.style.setProperty("display", "inline-flex");

		// playing = false;

		snakeList.pop();
		return;
	}

	head.style = `left: ${snakeList[0][0]}vw; top: ${snakeList[0][1]}vw;`;
	for (let i = 1; i < snakeList.length - 1; i++) {
		let body = document.getElementById(`body-${i}`);
		if (body === null) continue;
		body.style = `left: ${snakeList[i][0]}vw; top: ${snakeList[i][1]}vw;`;
	}

	if (
		inArray(foodList, snakeList[0], 0) ||
		inArray(foodList, snakeList[0], 0) === 0
	) {
		document.getElementById(`${snakeList[0][0]}-${snakeList[0][1]}`).remove();
		foodList.splice(inArray(foodList, [snakeList[0][0], snakeList[0][1]]), 1);
		leftToGrow += parseInt(document.getElementById("foodDisplay").innerHTML);
		makeFood();
		foodEaten++;
		document.getElementById("foodCountDisplay").innerHTML = foodEaten;
	}

	if (leftToGrow) {
		let newTail = document.createElement("div");
		newTail.className = "snake";
		newTail.id = `body-${snakeList.length - 1}`;
		newTail.style = `left: ${snakeList[snakeList.length - 1][0]}vw; top: ${
			snakeList[snakeList.length - 1][1]
		}vw;`;
		document.getElementById("snakeBoard").appendChild(newTail);
		leftToGrow--;

		snakeLength++;
		document.getElementById("lengthDisplay").innerHTML = snakeLength;
	} else snakeList.pop();
};

document.addEventListener("keydown", getDirection);

let updateId = setInterval(update, 100);
makeFood(1);

const setSpeed = () => {
	clearInterval(updateId);
	updateId = setInterval(
		update,
		1000 / parseInt(document.getElementById("gameSpeedDisplay").innerHTML)
	);
	let r = document.querySelector(":root");
	r.style.setProperty(
		"--interval",
		`${
			1000 / parseInt(document.getElementById("gameSpeedDisplay").innerHTML)
		}ms`
	);
};

document.getElementById("foodMultiplierRange").addEventListener("input", () => {
	if (
		foodList.length ===
		parseInt(document.getElementById("foodMultiplierDisplay").innerHTML)
	) {
		console.log("if");
		return;
	} else if (
		foodList.length <
		parseInt(document.getElementById("foodMultiplierDisplay").innerHTML)
	) {
		console.log("else if");
		makeFood(
			parseInt(document.getElementById("foodMultiplierDisplay").innerHTML) -
				foodList.length
		);
	} else {
		while (
			foodList.length >
			parseInt(document.getElementById("foodMultiplierDisplay").innerHTML)
		) {
			document.getElementById(`${foodList[0][0]}-${foodList[0][1]}`).remove();
			foodList.shift();
		}
	}
});

// document.addEventListener("keydown", () => {
// 	clearInterval(updateId);
// });

const reset = () => {
	foodEaten = 0;
	snakeLength = 3;
	leftToGrow = 0;

	document.getElementById("lengthDisplay").innerHTML = snakeLength;
	document.getElementById("foodCountDisplay").innerHTML = foodEaten;

	clearInterval(updateId);
	console.log("resetting");
	// while (snakeList.length > 3) {

	// 	let segment = document.getElementById(`body-${snakeList.length-1}`)
	// 	document.getElementById(`body-${snakeList.length - 2}`).remove();
	// 	console.log(segment)
	// 	snakeList.pop()
	// }

	for (let i = snakeList.length - 1; i > 2; i--) {
		let body = document.getElementById(`body-${i}`);
		if (body != null) body.remove();
	}
	snakeList = savedSnakeList;
	console.log(snakeList);
	console.log(savedSnakeList);
	document.getElementById("head").style = `left: 23vw; top: 23vw;`;
	document.getElementById("body-1").style = `left: 23vw; top: 24.2vw;`;
	document.getElementById("body-2").style = `left: 23vw; top: 25.4vw;`;

	move = "w";
	playing = true;
	update(true);
	updateId = setInterval(
		update,
		1000 / parseInt(document.getElementById("gameSpeedDisplay").innerHTML)
	);
	let r = document.querySelector(":root");
	r.style.setProperty(
		"--interval",
		`${
			1000 / parseInt(document.getElementById("gameSpeedDisplay").innerHTML)
		}ms`
	);
	document.getElementById("lossMenu").style.setProperty("display", "none");
};

document.getElementById("gameSpeedRange").addEventListener("input", setSpeed);
