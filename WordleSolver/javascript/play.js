let letterNumber = 0
let wordNumber = 0


const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']


const inArray = (list, value) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === value) {
        return true;
      }
    }
    return false;
};

let word = ''

document.addEventListener('keydown', addLetter = event => {
    console.log(letterNumber)
    console.log(event.key)
    if (inArray(alphabet, event.key))  {
        if (letterNumber < 5) {
        document.getElementById(wordNumber.toString()+'-'+letterNumber.toString()).innerHTML = event.key
        letterNumber++
        word+= event.key
    }}
    else if (event.key === 'Enter') {
        if (inArray(All_Words_list, word)){
        wordNumber++
        letterNumber = 0
    }
    }
    else if (event.key === 'Backspace') {
        if (letterNumber <= 0) return
        letterNumber--
        document.getElementById(wordNumber.toString()+'-'+letterNumber.toString()).innerHTML = ' '
        if (word === '') return
        word = word.slice(0, -1)
    }
})



