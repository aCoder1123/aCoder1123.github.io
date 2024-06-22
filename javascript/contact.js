elementsList = document.getElementById("imgCarouselWrap").childNodes;
console.log(elementsList)

for (i in elementsList) {

    elementsList[i].value = 1
    if (typeof elementsList[i] != typeof document.createElement("div")) {continue}
    elementsList[i].onclick = (el) => {
			console.log(el.srcElement);
            el.srcElement.value -= 1 
            console.log(el.srcElement.value);

			el.srcElement.style = `zIndex: ${el.srcElement.value};`;
            console.log(el.srcElement.style)
		}; 
    
}
