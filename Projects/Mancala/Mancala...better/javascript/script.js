const getIt = ID => {
  return document.getElementById(ID)
}


let speedConstant = 1
let inputedSpeed = 1
let timeBetweenMoves = 250

let powerBarMovingSpeed = 5
let handTime = 70
let toHandTime = 70


getIt("faster").addEventListener("click", () => {
  inputedSpeed  += 0.1
  speedConstant = 1/inputedSpeed
  inputedSpeed = Math.floor(inputedSpeed*10+.2)/10
  speedConstant = Math.floor(speedConstant*10)/10
  console.log(speedConstant)
  timeBetweenMoves = 250 * speedConstant
  powerBarMovingSpeed = 5 * speedConstant
  handTime = 70 * speedConstant
  toHandTime = 70 * speedConstant
  getIt("speedWindow").innerHTML = inputedSpeed
})

getIt("slower").addEventListener("click", () => {
  if (inputedSpeed === 0) return

  inputedSpeed  -= 0.1
  speedConstant = 1/inputedSpeed
  inputedSpeed = Math.floor(inputedSpeed*10)/10
  speedConstant = Math.floor(speedConstant*10)/10
  timeBetweenMoves = 250 * speedConstant
  powerBarMovingSpeed = 5 * speedConstant
  handTime = 70 * speedConstant
  toHandTime = 70 * speedConstant
  getIt("speedWindow").innerHTML = inputedSpeed
})


let computerRondo = false

const rondoToggle = (button) => {
  if (computerRondo) {
    button.innerHTML = "Click to stop the AI from playing itself"
    computerRondo = false
  } else {
    button.innerHTML = "Click for the AI to play itself"
    computerRondo = true
    computerMove()
  }
}

let versusComputer = false

const addNut = pocket => {
  if (typeof pocket === 'string') pocket = getIt(pocket)
  let original = getIt("theOne")
  let nut = original.cloneNode(true)
  nut.id = ""
  pocket.append(nut)
}

const newGame = () => {
  window.location.reload()
}

const getMovesFromPosition = (position, number, player) => {
  let moveOrder
  if (player === "1") {
    moveOrder = ['leftWell', 'pocket2-1', 'pocket2-2', 'pocket2-3', 'pocket2-4', 'pocket2-5', 'pocket2-6', 'pocket1-6', 'pocket1-5', 'pocket1-4', 'pocket1-3', 'pocket1-2', 'pocket1-1']
  } else {
    moveOrder = ['pocket2-1', 'pocket2-2', 'pocket2-3', 'pocket2-4', 'pocket2-5', 'pocket2-6', 'rightWell', 'pocket1-6', 'pocket1-5', 'pocket1-4', 'pocket1-3', 'pocket1-2', 'pocket1-1']
    
  }
  
  let start = moveOrder.indexOf(position)
  const moves = []
  for (let i = start + 1; i < start + 1 + number; i++) {
    moves.push(moveOrder[i % moveOrder.length])
  }
  return moves
}

const sleep = time => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("resolved");
    }, time);
  });
}





const computerToggle = button => {
  if (versusComputer) {
    versusComputer = false
    button.innerHTML = "Play Versus Computer"
  } else {
    versusComputer = true
    button.innerHTML = "Play 1 v 1"
  }
}

const countOccurrences = (list, item) => {
  let number = 0
  for (let next of list) {
    if (item === next) number += 1
  }
  return number
}


const removeAllChildren = element => {
  while (element.firstChild) {
    element.childNodes[0].remove()
  }
}









let computerPlayer = "1"




async function computerMove() {
  console.log("\n\n\n")
  
  const allSpaces =  ['pocket2-1', 'pocket2-2', 'pocket2-3', 'pocket2-4', 'pocket2-5', 'pocket2-6', 'rightWell', 'pocket1-6', 'pocket1-5', 'pocket1-4', 'pocket1-3', 'pocket1-2', 'pocket1-1']
  let board = {}
  allSpaces.forEach(element => {
    board[element] = getIt(element).childElementCount
    console.log(element, board[element])
  });
  
  const savedBoard = board
  console.log(savedBoard, "is the saved version")
  let currentAmount = 0
  let amounts = [0,0,0,0,0,0,]
  console.log("the board is")
  console.log(board)
  for (let i = 1; i < 7; i++) {
    allSpaces.forEach(element => {
      board[element] = getIt(element).childElementCount
    });
    console.log(board)
    if (board[`pocket${computerPlayer}-${i}`] < 1) continue
    
    
    let moves = getMovesFromPosition(`pocket${computerPlayer}-${i}`, board[`pocket${computerPlayer}-${i}`], computerPlayer)
    
    currentAmount += computerPlayer === "2" ? countOccurrences(moves, "rightWell") : countOccurrences(moves, "leftWell")
    moves.forEach(move => {
      board[move] += 1
    })
    // console.log(`before while: ${currentAmount} ${i}`)

    while (moves[moves.length - 1] > 1 && !(moves[moves.length - 1] === "rightWell" || moves[moves.length - 1] === "leftWell")) {
      moves = getMovesFromPosition(moves[moves.length - 1], board[moves[moves.length - 1]], computerPlayer)
      
      currentAmount += computerPlayer === "2" ? countOccurrences(moves, "rightWell") : countOccurrences(moves, "leftWell")
      moves.forEach(move => {
        board[move] += 1
      })
  
    }


    // console.log(`after while ${currentAmount} ${i}`)
   
  
    if (moves[moves.length-1][6] === computerPlayer) {
      console.log("in if")
      console.log(moves[moves.length-1])

      currentAmount += 1 + board[`pocket${computerPlayer === "2" ? "1" : "2"}-${moves[moves.length-1][8]}`]
    }
    // console.log(`after if ${currentAmount} ${i}`)
    console.log(board)
    amounts[i-1] = currentAmount
    currentAmount = 0
  }
  

  console.log(amounts)
  
  

  let max = Math.max(...amounts)
  if (max === 0) {
    console.log("Computer could not find viable move")
    throw new Error("Computer could not find viable move")
    
  }
  console.log(max)

  let index = amounts.indexOf(max)
  console.log(index)
  let clickNumber = 1 + index
  
  let clickId = `pocket${computerPlayer}-${clickNumber}`
  currentPlayer = computerPlayer
  console.log("clicked: " + clickId)
  getIt(clickId).click()
  
 
 
}



let currentPlayer = "1"
let playing = false










for (let i = 1; i < 3; i++) {
  for (let j = 1; j < 7; j++) {
    let pocket = getIt(`pocket${i}-${j}`)

    for (let b = 0; b < 4; b++) {
      addNut(pocket)
      
    }

    pocket.addEventListener('click', async function move() {
      if (currentPlayer != i.toString() || playing || getIt(`pocket${i}-${j}`).childElementCount === 0) return
      playing = true
      let hand = getIt("playerTwo")
      if (currentPlayer === "1") hand = getIt("playerOne")

      for(let k = 0; k < 4 * getIt(`pocket${i}-${j}`).childElementCount; k++) {
        addNut(hand)
        getIt(`pocket${i}-${j}`).childNodes[0].remove()
        await sleep(handTime)
      }
      removeAllChildren(getIt(`pocket${i}-${j}`))

      let steps = getMovesFromPosition(`pocket${i}-${j}`, hand.childElementCount, currentPlayer)
      
      for (let k = 0; k < steps.length; k++) {
        let nextPocket = getIt(steps[k])
        addNut(nextPocket)
        //bean.id = Math.floor(Math.random*8) === 1 ? "it" : ""
        hand.childNodes[0].remove()
        await sleep(timeBetweenMoves)
      }
      removeAllChildren(hand)
      
     if (steps[0]) {
      while (getIt(steps[steps.length-1]).childElementCount > 1 && !(steps[steps.length-1] === "leftWell" || steps[steps.length-1] === "rightWell")) {

     
      player1 = getIt("leftWell").childElementCount
      player2 = getIt("rightWell").childElementCount
      document.querySelector(":root").style.setProperty("--position", `${100 * player1/(player1+player2)}%`)

        while(getIt(steps[steps.length-1]).childElementCount != 0) {
          addNut(hand)
          getIt(steps[steps.length-1]).childNodes[0].remove()
          await sleep(toHandTime)
        }
       
        // removeAllChildren(getIt(steps[steps.length-1]))
        console.log("clear?")

        steps = getMovesFromPosition(steps[steps.length-1], hand.childElementCount, currentPlayer)
        
        for (let k = 0; k < steps.length; k++) {
          
          let nextPocket = getIt(steps[k])
          addNut(nextPocket)
          hand.childNodes[0].remove()
          await sleep(timeBetweenMoves)
        }
      }
      

      if (currentPlayer === steps[steps.length-1][6]) {
        
        let well = currentPlayer === '1' ? getIt("leftWell") : getIt("rightWell")
        addNut(well)
        getIt(steps[steps.length-1]).childNodes[0].remove()

        let oppositeId = steps[steps.length-1]
       
        if (oppositeId[6] === "1") {
          oppositeId = `pocket2-${oppositeId[8]}`
        } else {
          oppositeId = `pocket1-${oppositeId[8]}`
        }
        

        let oppositePocket = getIt(oppositeId)
        while (oppositePocket.childElementCount > 0) {
          addNut(well)
          oppositePocket.childNodes[0].remove()
        }
        removeAllChildren(oppositePocket)
      }
    } 

      
      let topTotal = 0
      let bottomTotal = 0

      for (let k = 1; k < 7; k++) {
        topTotal += getIt(`pocket1-${k}`).childElementCount
        bottomTotal += getIt(`pocket2-${k}`).childElementCount

      }
      if (!(topTotal && bottomTotal)) {
        let number
        let well
        if (topTotal === 0) {
           number = 2
          well = getIt("rightWell")
        } else if (bottomTotal === 0){
          number = 1
          well = getIt("leftWell")
        }
        for (let k = 1; k < 7; k++) {
          while(getIt(`pocket${number}-${k}`).childElementCount > 0) {
            addNut(well)
            getIt(`pocket${number}-${k}`).childNodes[0].remove()
            await sleep(handTime)
          }
        }

        currentPlayer = 0
        
        

        let playerOne = getIt("leftWell").childElementCount
        let playerTwo = getIt("rightWell").childElementCount
        if (playerOne > playerTwo) {

          getIt("player").innerHTML = `Player One Wins!! ${playerOne}-${playerTwo}\n Press any key to play again!`
          getIt("player").className = "green"
          
        } else if (playerTwo > playerOne) {
          getIt("player").innerHTML = `Player Two Wins!! ${playerTwo}-${playerOne}\n Press any key to play again!`
          getIt("player").className = "red"
        } else {
          getIt("player").innerHTML = 'It was a tie!! 25-25\n Press any key to play again!'
          getIt("player").className = "yellow"
        }
        document.addEventListener("keydown", () => {
          window.location.reload()
        })
        return
        
        // getIt("player").innerHTML = getIt("rightWell").childElementCount > getIt("leftWell").childElementCount ? `Player Two Wins!! ${getIt("rightWell").childElementCount}-${getIt("leftWell").childElementCount}` : `Player One Wins!! ${getIt("leftWell").childElementCount}-${getIt("rightWell").childElementCount}`

      }

      player1 = getIt("leftWell").childElementCount
      player2 = getIt("rightWell").childElementCount
      document.querySelector(":root").style.setProperty("--position", `${100 * player1/(player1+player2)}%`)

      if (currentPlayer === "1") {
        currentPlayer = "2"
        getIt("player").innerHTML = versusComputer ? "Now Computer Turn" : "Now Player Two"
        getIt("player").className = "red"
      } else if (currentPlayer === "2"){
        currentPlayer = "1"
        getIt("player").innerHTML = versusComputer ? "Now Human Turn" : "Now Player One"
        getIt("player").className = "green"
      }
      playing = false

      if (computerRondo) {
        computerPlayer = currentPlayer
        setTimeout(computerMove, 1500)
        
        currentPlayer = 0
      } else if (versusComputer && currentPlayer === "2") {
        computerPlayer = currentPlayer
        setTimeout(computerMove, 1500)
        
        currentPlayer = 0
      }

      
      
    })
  }
}



// invert(100%) sepia(0%) saturate(0%) hue-rotate(128deg) brightness(102%) contrast(101%);




// const pocketObserver = new MutationObserver((mutations) => {
  
// });
// pocketObserver.observe(document.querySelector('.pocket'), { childList: true });


// 'touchend'













































// let board = {}
//   const spacesList = ['pocket2-1', 'pocket2-2', 'pocket2-3', 'pocket2-4', 'pocket2-5', 'pocket2-6', 'rightWell', 'pocket1-6', 'pocket1-5', 'pocket1-4', 'pocket1-3', 'pocket1-2', 'pocket1-1']
//   const savedBoard = board
//   const amounts = []
//   let currentAmount = 0
  
//   spacesList.forEach(element => {
//     board[element] = getIt(element).childElementCount
//   })
//   for (let i = 1; i < 7; i++) {
//     if (board[`pocket2-${i}`] === 0) {
//       amounts[i-1] = null
//     }
//   }

//   console.log(amounts)
//   console.log(board)
//   for (let i = 1; i < 7; i++) {
//     currentAmount = 0
//     moves = getMovesFromPosition(`pocket2-${i}`, board[`pocket2-${i}`], 2)
//     currentAmount+= countOccurrences(moves, "rightWell")
//     moves.forEach(element => {
//       board[element] += 1
//     })

//     while (board[moves[moves.length-1]] > 2 && !(moves[moves.length-1] === "rightWell" || moves[moves.length-1] === "leftWell")) {
//       // console.log("looping")
//       console.log(moves)
//       moves = getMovesFromPosition(moves[moves.length-1], board[moves[moves.length-1]], 2)
//       currentAmount+= countOccurrences(moves, "rightWell")
//       moves.forEach(element => {
//         board[element] += 1
//       })
//       board[moves[moves.length-1]] = 0

//     }

//     if (moves[moves.length-1] === 1 && moves[moves.length-1][6] === "2") {
//       currentAmount += 1 + board[`pocket1-${i}`]
//     }


//     amounts.push(currentAmount)
    
//     board = savedBoard
//   }
//   // await sleep(15000)
//   // // for (let k = 0; k < 2; k++) {
//   //   for (let i = 1; i < 7; i++) {
//   //     console.log(i)
//   //     console.log(amounts[i-1])
//   //     if (amounts[i-1] === null || board[`pocket2-${i}`] === 0) continue
//   //     let currentAmount = 0
//   //     pocket = board[`pocket2-${i}`]
//   //     if (pocket < 1) {amounts[i-1] = 0; continue;}
//   //     let moves = getMovesFromPosition(`pocket2-${i}`, pocket, "2")
//   //     currentAmount += countOccurrences(moves, "rightWell")

//   //     for (let i = 0; i < pocket; i++) {
//   //       board[moves[i]] += 1
//   //     }
//   //     board[`pocket2-${i}`] = 0

//   //     pocket = board[moves[moves.length-1]]

//   //     while (pocket > 0 && (moves[moves.length-1] != "rightWell" || moves[moves.length-1] != "leftWell")) {
//   //       moves = getMovesFromPosition(moves[moves.length-1], pocket,  "2")
//   //       currentAmount += countOccurrences(moves, "rightWell")
//   //       for (let i = 0; i < pocket; i++) {
//   //         board[moves[i]] += 1
//   //       }
//   //       board[moves[moves.length-1]] = 0
//   //       pocket = board[moves[moves.length-1]]
//   //     }

//   //     if (board[moves[moves.length-1]] === 1 && moves[moves.length-1][6] === "2") {
//   //       let opposite = board[`pocket1-${moves[moves.length-1][8]}`]
//   //       board["rightWell"] += opposite + 1
//   //       currentAmount += opposite + 1
//   //       board[`pocket1-${moves[moves.length-1][8]}`] = 0
//   //       board[moves[moves.length-1]] = 0
//   //     }
//   //     if (amounts[i-1] != null) amounts[i-1] = (currentAmount)
//   //     board = savedBoard
//   //   }
//   // }


//   currentPlayer = "2"
//   console.log(amounts)
//   getIt(`pocket2-${amounts.indexOf(Math.max(...amounts)) + 1}`).click()
  