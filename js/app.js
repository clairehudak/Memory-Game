
// List of all cards
var cardList = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o",
"fa fa-paper-plane-o", "fa fa-bicycle", "fa fa-bicycle",
"fa fa-bomb", "fa fa-bomb", "fa fa-anchor", "fa fa-anchor",
"fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube",
"fa fa-leaf", "fa fa-leaf"];

//access the deck
var mainDeck = document.getElementById('deck');
var body = document.getElementsByTagName('BODY')[0];
var container = document.getElementsByClassName('container')[0];


const newContainer = document.createElement('div');
newContainer.setAttribute('class', 'wonContainer');

setBoard();

// initialize parameters
var firstCard = "";
var secondCard = false;
var matchCount = 0;
var start = -1;
var time = "";
var timerRun = false;
var moves = "";
var star = "";
var starsRemaining = "";
var restart = document.getElementById('restart');

//Event listener for when card is clicked
mainDeck.addEventListener('click',flipCard, false);

//Event listener to reset the game
restart.addEventListener('click',setBoard, false);

//-----------------------------------
//           Functions
//-----------------------------------

// createCard function
function createCard(cardName) {
  const newElementParent = document.createElement('li');
  const newElementChild = document.createElement('i');
  newElementParent.setAttribute('class', 'card');
  newElementChild.setAttribute('class', cardName);
  newElementParent.appendChild(newElementChild);
  return newElementParent;
}

//flipCard function
function flipCard(event) {

  const clickedCard = event.target;

  if (clickedCard.className === 'deck' || clickedCard.className === "card open show" ||
      clickedCard.className === "card match" || cardList.includes(clickedCard.className)){
  }
  else if (clickedCard.className === "card" && firstCard === ""){
    clickedCard.className = "card open show";
    firstCard = clickedCard;
  }

  // If the card clicked is not the first card
  else if(firstCard.children[0].className === clickedCard.children[0].className
          && secondCard == false) {

    //check if cards match
    firstCard.className = "card match";
    clickedCard.className = "card match";
    //reset card
    firstCard = "";
    document.getElementsByClassName("moves")[0].innerHTML++;
    matchCount++;
    if (matchCount === 8){
      moves = document.getElementsByClassName("moves")[0].innerHTML;
      gameWon();
    }
  }
  // If cards do not match
  else if (secondCard === false) {
    secondCard = true;
    clickedCard.className = "card open show wrong";
    firstCard.className = "card open show wrong";

    //animate cards
    rotateCard(0,-10,"left",10);
    setTimeout(function(){rotateCard(-10,10,"right",10)},100);
    setTimeout(function(){rotateCard(10,0,"left",10)},300);

    //Keep track of moves during game
    document.getElementsByClassName("moves")[0].innerHTML++;
    moves = document.getElementsByClassName("moves")[0].innerHTML;

    if( moves > 20){
      star = document.getElementById("star1");
      star.className = "fa fa-star-o";
    }
    if( moves > 25){
      star = document.getElementById("star2");
      star.className = "fa fa-star-o";
    }
    //delay the card flip
    setTimeout(hideCard,700);

    //hideCard function
    function hideCard(event){
      firstCard.className = "card";
      clickedCard.className = "card";
      firstCard = "";
      secondCard = false;
    }

    /**
    * rotate card function
    * @description Rotates the cards
    * @param {number} start //start position
    * @param {number} deg   // end position
    * @param {string} direction
    * @param {interval} interval //update interval
    */

    function rotateCard(start, deg, direction, interval){
      var count = start;
      var x = setInterval(rotate,interval);
      function rotate(){
        if(direction === "left"){
          count--;
          clickedCard.style.transform = "rotate(" + count + "deg)";
          firstCard.style.transform = "rotate(" + count + "deg)";
        }
        else if(direction === "right"){
          count++;
          clickedCard.style.transform = "rotate(" +count+ "deg)";
          firstCard.style.transform = "rotate(" +count+ "deg)";
        }
        if (count === deg){
          clearInterval(x);
        }
      }
    }
  }
}

//gameWon function
function gameWon(){
  timerRun = false;
  matchCount = 0;

  //hide the game board to show the winner's screen
  for(var i = 0; i < container.children.length; i++){
    container.children[i].setAttribute('style','display: none');
  }
  //count remaining stars
  if( moves > 20){
    starsRemaining = "2 stars";
  }
  else if( moves > 25){
    starsRemaining = "1 star";
  }
  else {
    starsRemaining = "3 stars";
  }

  // unhide winning screen content
  if(document.getElementsByClassName('wonContainer').length != 0){
    wonContainer = document.getElementsByClassName('wonContainer')[0];
    wonContainer.removeAttribute('style','display: none');
  }
  else{
    //Create the winning screen
    createAndAppendMyElement('span','won',"Congratulations! You won the game in " + moves + " moves!");
    createAndAppendMyElement('span','timeWon',"You cleared the board in " + time + ".");
    createAndAppendMyElement('span', 'starWon',"You finished with " + starsRemaining + ".");
    createAndAppendMyElement('button','replay', "Play again?");

    container.append(newContainer);

    var button = document.getElementsByClassName('replay')[0];
    button.addEventListener('click', setBoard, false);
  }

  // createAndAppendMyElement function
  function createAndAppendMyElement(elementType,elementClass, elementText) {
    const myElement = document.createElement(elementType);
    myElement.setAttribute('class', elementClass);
    myElement.append(elementText);
    newContainer.append(myElement);
  }
}

// setBoard function
function setBoard(){

  //reset the hidden objects
  for(var i = 0; i < container.children.length; i++){
    container.children[i].removeAttribute('style','display: none');
  }
  // hide winning screen content
  if(document.getElementsByClassName('wonContainer').length != 0){
    wonContainer = document.getElementsByClassName('wonContainer')[0];
    wonContainer.setAttribute('style','display: none');
  }

  //Event listener to start timer when first card is clicked
  mainDeck.addEventListener('click',timer,{once: true});

  //stop timer
  timerRun = false;
  time = document.getElementById("timer").innerHTML = "0h 0m 0s";

  // reset flags
  firstCard = "";
  secondCard = false;
  matchCount = 0;
  document.getElementsByClassName("moves")[0].innerHTML = 0;
  start = -1;
  time = "";

  //reset stars
  while(document.getElementsByClassName("fa fa-star-o").length > 0){
    document.getElementsByClassName("fa fa-star-o")[0].setAttribute('class',"fa fa-star");
  }

  //clear the board
  while(mainDeck.children.length > 0){
    mainDeck.removeChild(mainDeck.firstChild);
  }
  //shuffle the cards
  var shuffledCardList = cardList;//shuffle(cardList);

  //Loop through shuffledCardList and create html
  for (var i = 0; i < shuffledCardList.length; i++) {
    var card = createCard(shuffledCardList[i]);
    mainDeck.appendChild(card);
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Timer function based on https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_countdown
function timer() {
  // Start the timer //Needs to be on first click
  start = new Date().getTime();
  timerRun = true;

  // Update the timer every 1 second
  var x = setInterval(function() {
    if (!timerRun){
      return;
    }
    // Get the current time
    var now = new Date().getTime();

    // Find the distance between now an the start time
    var distance = now - start;

    // Time calculations for hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="timer"
    time = document.getElementById("timer").innerHTML = hours + "h "
    + minutes + "m " + seconds + "s ";
  }, 1000);
}
