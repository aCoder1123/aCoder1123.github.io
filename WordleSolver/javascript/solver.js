// let lettersDict = {
//   'a': 10,
//   'b': 5,
// }

// console.log(lettersDict['a'])
// document.getElementById('demo').innerHTML = lettersDict['a'];
// console.log('hi')

let buttonpressed = false;

// function waitForIt() {
//   if (!buttonpressed) {
//     setTimeout(2500, waitForIt())
//   }
// }

// const noMoreWords = () => {
//   document.getElementById('error').innerHTML = 'No Valid Words'
//   setTimeout(dissapear = () => {
//     document.getElementById('error').innerHTML = ''
//   }, 700)
//   console.log('gone')
// }

const sum = (list) => {
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i][1];
  }
  return sum;
};

const inArray = (list, value) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === value) {
      return true;
    }
  }
  return false;
};

const countOcurrences = (list, value) => {
  let toReturn = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] === value) {
      toReturn++;
    }
  }
  return toReturn;
};

const nextWord = () => {
  console.log("buttonpressed");
  buttonpressed = true;
};

const countDuplicates = (list) => {
  const originals = [];
  for (let i = 0; i < list.length; i++) {
    if (!inArray(originals, list[i])) {
      originals.push(list[i]);
    }
  }
  return originals.length;
};

const clean = (list) => {
  let toReturn = [];
  for (let i = 0; i < list.length; i++)
    if (list[i]) {
      toReturn.push(list[i]);
    }
  return toReturn;
};
// function startSomething() {
//  document.getElementById('info').value='';
//  waitForIt();
//  document.getElementById('info').value='waiting';
// }

const remove = (list, index) => {
  let toReturn = [];
  for (let i = 0; i < list.length; i++) {
    if (i != index) {
      toReturn.push(list[i]);
    } else {
      toReturn.push(null);
    }
  }
  return toReturn;
};

const iclusionToggle = (element) => {
  // document.getElementById(id).style.backgroundColor = rgba(32, 102, 49, 0)
  let position = element.id;

  if (element.className === "letter correct") {
    element.className = "letter incorrect";
    boardknoledge[position[2]] = "incorrect";
  } else if (element.className === "letter inWord") {
    element.className = "letter correct";
    boardknoledge[position[2]] = "correct";
  } else if (element.className === "letter incorrect") {
    element.className = "letter inWord";
    boardknoledge[position[2]] = "inWord";
  }
};

const scoreWords = (wordsList, newLettersBonus) => {
  let lettersDict = {};
  let wordsDict = {};
  let word;
  let letter;
  for (let i = 0; i < wordsList.length; i++) {
    word = wordsList[i];
    for (let j = 0; j < word.length; j++) {
      letter = word[j];
      if (lettersDict[letter]) {
        lettersDict[letter] += 1;
      } else {
        lettersDict[letter] = 1;
      }
    }
  }

  let wordsArray = [];

  for (let i = 0; i < wordsList.length; i++) {
    word = wordsList[i];
    let score = 0;
    for (let j = 0; j < word.length; j++) {
      letter = word[j];
      score += lettersDict[letter];
    }

    wordsArray.push([word, score]);
  }

  wordsArray.sort((a, b) => b[1] - a[1]);

  let bonus = Math.floor(
    (sum(wordsArray) / wordsList.length) * newLettersBonus
  );

  for (let i = 0; i < wordsArray.length; i++) {
    wordsArray[i][1] += bonus * countDuplicates(wordsArray[i][0]);
  }

  wordsArray.sort((a, b) => b[1] - a[1]);

  return wordsArray;
};

let viableWords = All_Words_list;
const boardWords = [[], [], [], [], [], []];
let boardknoledge = [
  "incorrect",
  "incorrect",
  "incorrect",
  "incorrect",
  "incorrect",
];

let wait = false;
let wordNumber = 0;



const newWords = ['', '', '', '', '']



const solver = () => {
  if (wordNumber > 5 || viableWords.length < 1) {
    return;
  }

  let wordsScored = scoreWords(viableWords, 0.45);
  //////////////////////////////////console.log(wordsScored);

  let occurences
  let boardknoledgeCopy = [
    "incorrect",
    "incorrect",
    "incorrect",
    "incorrect",
    "incorrect",
  ];
  const knownLetters = []


  if (wordNumber != 0) {
    let guess = wordsScored[0][0];
    let correctLetters = [];
    for (let i = 0; i < 5; i++) {
      if (boardknoledge[i] === "correct" || boardknoledge[i] === "inWord") {
        correctLetters.push(guess[i]);
      }
    }

    for (let i = 0; i < 5; i++) {
      let letter = guess[i];
      for (let j = 0; j < viableWords.length; j++) {
        if (!viableWords[j]) {
          continue;
        }
        if (boardknoledge[i] === "correct") {
          if (viableWords[j][i] != guess[i]) {
            viableWords = remove(viableWords, j);
          }
        } else if (boardknoledge[i] === "incorrect") {
          if (
            countOcurrences(correctLetters, guess[i]) <
            countOcurrences(viableWords[j], guess[i])
          ) {
            viableWords = remove(viableWords, j);
          }
        } else if (boardknoledge[i] === "inWord") {
          if (
            countOcurrences(viableWords[j], guess[i]) < 1 ||
            viableWords[j][i] === guess[i]
          ) {
            viableWords = remove(viableWords, j);
          }
        }
      }
    }

    viableWords = clean(viableWords);

    wordsScored = scoreWords(viableWords, 0.45);

    occurences = countOcurrences(boardknoledge, "correct");
    boardknoledgeCopy = boardknoledge
    

    for (let i = 0; i < wordsScored.length; i++) {
      if (boardknoledge[i] === 'correct') {
        knownLetters.push(guess[i])
      }
    }
    
    boardknoledgeCopy = boardknoledge
    boardknoledge = [
      "incorrect",
      "incorrect",
      "incorrect",
      "incorrect",
      "incorrect",
    ];
  }

  if (!wordsScored.length) {
    document.getElementById("error").innerHTML = "No Valid Words";
    document.getElementById("enter").disabled = true;
    return;
  }

  if (occurences > 2 && viableWords.length > 2) {
    testWordsList = []
    for (let i = 0; i < All_Words_list.length; i++) {
      let score = 0
      for (let j = 0; j< knownLetters.length; j++) {
        score += countOcurrences(All_Words_list[i], knownLetters[j])
      }
      testWordsList.push([All_Words_list[i], score])
    }
    testWordsList.sort((a, b) => b[1] - a[1]);
    if (testWordsList > 2) {
      boardWords[wordNumber] = testWordsList[0][0].split("");
    } else {
      boardWords[wordNumber] = wordsScored[0][0].split("");
    }
    
  } else {
    boardWords[wordNumber] = wordsScored[0][0].split("");
  }
  for (let i = 0; i < 5; i++) {
    document.getElementById(wordNumber.toString() + "-" + i).innerHTML =
      boardWords[wordNumber][i];
    document.getElementById(wordNumber.toString() + "-" + i).disabled = false;
    if (wordNumber) {
      document.getElementById(
        (wordNumber - 1).toString() + "-" + i
      ).disabled = true;
    }
  }
  
  
  if (wordNumber) {
    const toRemove = document.querySelectorAll(".possibleWord")
    toRemove.forEach(element => {
      element.remove()
    });
  }
  
  for (let i = 0; i < wordsScored.length; i++) {
    let newWord = document.createElement("div")
    for (let j = 0; j < 5; j++) {
      let letterDiv = document.createElement("div")
      let elementText = document.createTextNode(`${wordsScored[i][0][j].toUpperCase()}`)
      
      
      letterDiv.className = "perspectiveLetter incorrect"
      
      letterDiv.appendChild(elementText)
      
      newWord.appendChild(letterDiv)
    }
    let wordScore = document.createElement("span")
    let scoreNode = document.createTextNode(`: ${wordsScored[i][1]}`)
    wordScore.appendChild(scoreNode)
    newWord.appendChild(wordScore)

    
    newWord.className = 'possibleWord'

    div = document.getElementById('perspectiveWords')
    div.appendChild(newWord)
    
  }



  let lettersDict = {

  }
  let letters = []


  console.log(wordsScored)
  for (let i = 0; i < wordsScored.length; i++) {
    for (let j = 0; j < 5; j++){
      console.log(wordsScored[i][0][j])
      if (!lettersDict[wordsScored[i][0][j]]){
        lettersDict[wordsScored[i][0][j]] = 1
        letters.push(wordsScored[i][0][j])
        break
      }
      else {
        lettersDict[wordsScored[i][0][j]] += 1
        break
      }
    }
  }



  letters.sort()

  console.log(lettersDict)
  console.log(letters)
  for (let i = 0; i < letters.length; i++) {
    let newWord = document.createElement("p")
    let elementText = document.createTextNode(`${letters[i].toUpperCase()}: ${(Math.floor((lettersDict[letters[i]]/wordsScored.length)*10000)/100)}% of words`)

    newWord.appendChild(elementText)
    newWord.className = 'possibleLetter'

    div = document.getElementById('letters')
    div.appendChild(newWord)
  }



  wordNumber++;
};






solver()


















const testWithParams = (word, newWordsBonus) => {
  // const testknoledge = ['incorrect', 'incorrect','incorrect','incorrect','incorrect']
  let wordNumber = 0
  let solved = false

  let viableWords = All_Words_list
  let boardknoledge = [
    "incorrect",
    "incorrect",
    "incorrect",
    "incorrect",
    "incorrect",
  ];

  // console.log(`Word: ${word}`)
  while (!solved) {
    

    let wordsScored = scoreWords(viableWords, newWordsBonus);
    let occurences
    let boardknoledgeCopy
    const knownLetters = []

      let guess = wordsScored[0][0];
      let correctLetters = [];
    if (wordNumber) {
    
      for (let i = 0; i < 5; i++) {
        if (boardknoledge[i] === "correct" || boardknoledge[i] === "inWord") {
          correctLetters.push(guess[i]);
        }
      }

      for (let i = 0; i < 5; i++) {
        let letter = guess[i];
        for (let j = 0; j < viableWords.length; j++) {
          if (!viableWords[j]) {
            continue;
          }

          if (boardknoledge[i] === "correct") {
            if (viableWords[j][i] != guess[i]) {
              viableWords = remove(viableWords, j);
            }
          } else if (boardknoledge[i] === "incorrect") {
            if (
              countOcurrences(correctLetters, guess[i]) <
              countOcurrences(viableWords[j], guess[i])
            ) {
              viableWords = remove(viableWords, j);
            }
          } else if (boardknoledge[i] === "inWord") {
            if (
              countOcurrences(viableWords[j], guess[i]) < 1 ||
              viableWords[j][i] === guess[i]
            ) {
              viableWords = remove(viableWords, j);
            }
          }
        }
      }

      viableWords = clean(viableWords);

      wordsScored = scoreWords(viableWords, 0.45);

      occurences = countOcurrences(boardknoledge, "correct");
      boardknoledgeCopy = boardknoledge
      

      for (let i = 0; i < wordsScored.length; i++) {
        if (boardknoledge[i] === 'correct') {
          knownLetters.push(guess[i])
        }
      }
      
    }
      
    
    
    // if (!wordsScored.length) {
    //   document.getElementById("error").innerHTML = "No Valid Words";
    //   document.getElementById("enter").disabled = true;
    //   return;
    // }
    
    if (occurences > 2 && viableWords.length > 2) {
      testWordsList = []
      for (let i = 0; i < All_Words_list.length; i++) {
        let score = 0
        for (let j = 0; j< knownLetters.length; j++) {
          score += countOcurrences(All_Words_list[i], knownLetters[j])
        }
        testWordsList.push([All_Words_list[i], score])
      }
      testWordsList.sort((a, b) => b[1] - a[1]);

      
      if (testWordsList > 2) {
        boardWords[wordNumber] = testWordsList[0][0].split("");
      } else {
        boardWords[wordNumber] = wordsScored[0][0].split("");
      }
      
    } else {
      
      
      boardWords[wordNumber] = wordsScored[0][0].split("");


    }

    const timesOcurred = [0, 0, 0, 0, 0]
    
    for (let i = 0; i < 5; i++) {
     
      // console.log(` guess word = ${boardWords[wordNumber]}`)
      // console.log(` guess letter = ${boardWords[wordNumber][i]}`)
      // console.log(` word letter = ${word[i]}`)
      // console.log(boardWords[wordNumber][i] === word[i])
      
      //console.log(word[i])
      if (boardWords[wordNumber][i] === word[i]) {
        boardknoledge[i] = 'correct'
        // console.log('correct')
      } else if (countOcurrences(word, boardWords[wordNumber][i]) > 0 && timesOcurred[i] <  countOcurrences(word, boardWords[wordNumber][i])) {
        boardknoledge[i] = 'inWord'
        timesOcurred[i] ++
        // console.log('inWord')
      } else {
        boardknoledge[i] = 'incorrect'
        // console.log('incorrect')
      }
    }
    
    
    
    if (countOcurrences(boardknoledge, 'correct') === 5) {
      solved = true
    }
    
    wordNumber++;

  }
  return wordNumber
}


// const averages = []

// const badWords = ['blimp', 'bloom', 'flood', 'which', 'gloom', 'blood', 'glyph', 'cliff', 'whiff', 'climb', 'quick']

// for (let i = 3; i < 10; i++) {
//   let testNum = Math.floor((i * .2) * 1000) / 1000
//   console.log(`This is test ${i}`)
//   let totalGuesses = 0
//   for (let j = 0; j < 2000; j++) {
//     let testWord = All_Words_list[Math.floor(Math.random()*All_Words_list.length)]
//     if (inArray(badWords, testWord)) {
//       continue
//     }
//     // if (inArray(badWords, testWord)) {
//     //   testWord = All_Words_list[Math.floor(Math.random()*All_Words_list.length)]
//     // }
//     totalGuesses += testWithParams(testWord, testNum)
//   }
//   averages.push([testNum, totalGuesses/2000])

// }

// averages.sort((a, b) => a[1] -b[1])
// console.log(averages)


/* 
test one 1000 words 

------------------------------
0: (2) [1.2, 3.642]
1: (2) [1.6, 3.647]
2: (2) [1.8, 3.668]
3: (2) [1.4, 3.671]
4: (2) [0.6, 3.681]
5: (2) [1, 3.684]
6: (2) [0.8, 3.697]

test two 1000 words 

------------------------------

0: (2) [1.4, 3.615]
1: (2) [1.8, 3.624]
2: (2) [1, 3.638]
3: (2) [1.6, 3.649]
4: (2) [0.6, 3.65]
5: (2) [0.8, 3.66]
6: (2) [1.2, 3.706]

test one 2000 words 

------------------------------
0: (2) [0.6, 3.627]
1: (2) [0.8, 3.6505]
2: (2) [1.2, 3.6615]
3: (2) [1.6, 3.662]
4: (2) [1.8, 3.672]
5: (2) [1, 3.6775]
6: (2) [1.4, 3.6865]

test two 2000 words 
0: (2) [1.4, 3.6455]
1: (2) [0.8, 3.6465]
2: (2) [0.6, 3.6525]
3: (2) [1.2, 3.6565]
4: (2) [1.8, 3.679]
5: (2) [1, 3.6875]
6: (2) [1.6, 3.708]
------------------------------
*/


