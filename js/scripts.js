var gameActive = false;
var dealer;
var searchValue;
var searchPlayer;

$(document).ready(function () {
  $("#startButton").click(buttonPress);
  $("#makeCard").click(makeCard);
  $("#drawCard").click(drawCard);
  $("#continue").click(moveOn);
  $("#cardContainer").on("click", ".card", function () {
    cardPress(this);
  });
  $("#opponentContainer").on("click", ".opponent", function() {
    opponentPress(this);
  })
});

function moveOn() {
  if(gameActive) {
    playGame(searchValue, searchPlayer);
  }
}

function drawCard() {
  // TODO: Draw a card
  console.log("Card drawn");
}

function makeCard() {
  $("#cardContainer").append("<img class=\"card\" src=\"../images/cardsjpg/AC.jpg\" alt=\"A card\">");
}

function cardPress(press) {
  console.log("Card clicked");
  var value = $(press).attr('value');
  console.log("Value to search for: " + value);
  searchValue = value;
  $("#searchValue").html(searchValue);
}

function opponentPress(press) {
  console.log("Opponent clicked");
  var value = $(press).attr('number');
  console.log("Opponent to search for: " + value);
  searchPlayer = value;
  $("#searchPlayer").html(searchPlayer);
}

function buttonPress() {
  // var element = document.getElementById("sven");
  // var playDeck = new Deck();
  if(!gameActive) {
    dealer = new Dealer(requestPlayers());
    gameActive = true;
    alert("Hands dealt, ready to play.\n Click to begin.");
  }
}

// Gameplay cycle runs here after setup
function playGame(playerInputValue, playerInputOpponent) {
  // For each player:
  for (var i = 0; i < dealer.players.length; i++) {
    console.log("DECK SIZE AT TURN START: " + dealer.playDeck.deck.length);
    var playerTakingTurn = dealer.players[i];

    var canTakeTurn = playerTakingTurn.takeTurn();

    if (canTakeTurn === 2) {
      console.log("HUMAN TAKES A TURN");
      console.log("Search Value: " + playerInputValue);
      console.log("Search Player INDEX: " + playerInputOpponent);
      // Switch value to int (collected as string from image)
      var valueToSearch = parseInt(playerInputValue);
      var opponentToSearch = dealer.players[playerInputOpponent];
      instigateCall(valueToSearch, opponentToSearch, playerTakingTurn);
      continue;
      console.log("I AM NEVER CALLED! THIS IS A GOOD THING!");
    }

    // If the player has no cards, draw a card
    if(canTakeTurn === 0) {
      // If player cannot draw a card because deck is empty
      if(!dealer.dealCard(playerTakingTurn)) {
        // Skip player, there is nothing else they can do
        console.log("DECK EMPTY");
        continue;
      }
    // Else pick a card and player to fish
    } else {
      // An array containing:
      // [0] = direct reference to a card
      // [1] = index of a player
      var cardAndPlayerInt = playerTakingTurn.callCardAndPlayer(dealer.players.length);

      // Card value
      var cardToFind = cardAndPlayerInt[0].value;

      // Direct reference to a player (from index)
      var playerToFish = dealer.players[cardAndPlayerInt[1]];

      instigateCall(cardToFind, playerToFish, playerTakingTurn);

      console.log(playerTakingTurn.getHand());
    }
  }

  for (var i = 0; i < dealer.players.length; i++) {
    console.log("Player " + dealer.players[i].id + " hand: ");
    console.log(dealer.players[i].hand);
  }
  console.log(dealer.playDeck);
  playerInputValue = null;
  playerInputOpponent = null;

  if(!dealer.checkWinCondition()) {
    console.log("GAME OVER!");
    var winnersArray = [];
    var winValue = 0;
    for (var i = 0; i < dealer.players.length; i++) {
      if(dealer.players[i].getNumSets() > winValue) {
        winValue = dealer.players[i].getNumSets();
        winnersArray = [];
        winnersArray.push(i);
      }
      else if (dealer.players[i].getNumSets() === winValue) {
        winnersArray.push(i);
      }

      console.log("Player " + dealer.players[i].id + " has " + dealer.players[i].getNumSets() + " sets.");
    }

    for (var i = 0; i < winnersArray.length; i++) {
      console.log("PLAYER " + dealer.players[winnersArray[i]].id + " WINS!");
    }
    gameActive = false;
  }
}

function instigateCall(cardToFind, playerToFish, playerTakingTurn) {
  console.log("Fishing from:");
  console.log(playerToFish);

  // Array of index values point to search matches
  var matchingValueIndicies = dealer.findCardInPlayer(cardToFind, playerToFish);

  console.log(matchingValueIndicies);
  console.log("Length of values array: " + matchingValueIndicies.length);

  // If no matches
  if(matchingValueIndicies.length < 1) {
    console.log("GO FISH!");
    alert("GO FISH!");
    // If player cannot draw a card because deck is empty
    if(!dealer.dealCard(playerTakingTurn)) {
      // Skip player, there is nothing else they can do
      console.log("DECK EMPTY");
    }
    // continue;
  }

  // Cards to pass to fishing player
  var cardsToPass = playerToFish.removeCards(matchingValueIndicies);
  for (var j = 0; j < cardsToPass.length; j++) {
    playerTakingTurn.addCard(cardsToPass[j]);
  }
}

// Get number of players
function requestPlayers() {
  do {
    var players = prompt("Choose a number of players, between 2 and 7!");
    players = parseInt(players);
  } while (players === NaN || players < 2 || players > 7);
  return players;
}

// Manages cards
class Deck {
  constructor() {
    this.deck = [];
    this.initialise();
    this.printDeck();
  }

  // Build and shuffle standard deck of 52 cards
  initialise() {
    const SUITS_QUANTITY = 4;
    const SUIT_SIZE = 13;

    var suits = [4,3,2,1];

    // Build a sorted deck in suits descending order - S,H,C,D
    for(var i = 0; i < SUITS_QUANTITY; i++) {
      for(var j = 0; j < SUIT_SIZE; j++) {

        /*
        Objects are passed by reference in JS, therefore duplicating the global variable 'card' and editing it edits ALL deriviatives of card.
        Thus creating a deck of cards that are ALL THE SAME!
        Therefore variable must be instantiated each time.
        CAN YOU TELL I SPENT A LONG TIME WORKING THIS OUT?!?
        */

        var card = {suit: 0, value: 0, image: ""};
        card.suit = suits[i];
        card.value = (j+1);
        // Apply reference to corresponding card image:
        // ../images/cardsjpg/card.image.jpg
        var imageRef = "";
        switch (card.value) {
          case 11:
            imageRef += "J";
            break;
          case 12:
            imageRef += "Q";
            break;
          case 13:
            imageRef += "K";
            break;
          case 1:
            imageRef += "A";
            break;
          default:
            imageRef += String(card.value);
        }

        switch (card.suit) {
          case 4:
            imageRef += "S";
            break;
          case 3:
            imageRef += "H";
            break;
          case 2:
            imageRef += "C";
            break;
          case 1:
            imageRef += "D";
            break;
          default:
            imageRef += "HELP I DON'T HAVE A SUIT!"
        }
        card.image = "../images/cardsjpg/" + imageRef + ".jpg";
        this.deck.push(card);
      }
    }
    this.shuffleDeck();
  }

  // Could randomly grab a single card from the deck rather than suffle
  // BUT a shuffled deck allows for reusable code in other card games
  shuffleDeck() {

    // Shuffles using the Fisher-Yates method, an 'in-place, O(n) algorithm'
    var m = this.deck.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = this.deck[m];
      this.deck[m] = this.deck[i];
      this.deck[i] = t;
    }
  }

  printDeck() {
      console.log(this.deck);
  }

  getCard() {
    return this.deck.pop();
  }

  // .pop in getCard does this job
  deleteFromDeck(c) {
    // TODO: Remove card from list of available cards
  }

  // 'dealHands' will now be dealt with by 'Dealer' class
  // dealHands(players) {
  //   // TODO: Deal out necessary number of cards to players (7 for 2/3 players, 5 for 4/5 players)
  // }
}

// Manages interractions between deck and players
class Dealer {
  constructor(players) {
    // Number of players
    this.playerCount = players;
    // Array of players
    this.players = [];

    // Can't play by yourself
    this.MIN_PLAYERS = 2;
    // Number of players necessary for 5 cards rather than 7 to be dealt
    this.DEAL_THRESHOLD = 4
    // Max 7 players for now (technically 10 can play)
    this.MAX_PLAYERS = 7;

    // The deck for this game
    this.playDeck = new Deck();

    this.createPlayers();
    this.dealHands();
  }

  // Create necessary number of player objects
  createPlayers () {
    // Create player class for each player
    for (var i = 0; i < this.playerCount; i++) {
      var newPlayer = new Player();
      newPlayer.id = i+1;
      if (i === 0) {
        newPlayer.setHuman();
      } else {
        var opponentNumber = i;
        $("#opponentContainer").append("<button class=\"opponent\" number=\"" + opponentNumber + "\" type=\"button\">Opponent " + opponentNumber + "</button>");
      }
      this.players.push(newPlayer);
      console.log(newPlayer);
    }
    this.playerNum = this.players.length;
    console.log(this.players);
  }

  // Deal hand of correct size to each player
  dealHands () {
    var toDeal = 0;
    if (this.playerCount >= this.MIN_PLAYERS && this.playerCount < this.DEAL_THRESHOLD) {
      toDeal = 7;
    }
    else if (this.playerCount >= this.DEAL_THRESHOLD && this.playerCount <= this.MAX_PLAYERS) {
      toDeal = 5;
    }
    else {
      throw "invalidPlayerNumberException";
    }

    for (var i = 0; i < toDeal; i++) {
      for (var j = 0; j < this.players.length; j++) {
        this.dealCard(this.players[j]);
      }
    }

    for (var i = 0; i < this.players.length; i++) {
      console.log(this.players[i].getHand());
    }
  }

  // Send a single card from the deck to a player
  dealCard (player) {
    if(this.playDeck.deck.length < 1) {
      return false
    } else {
      player.addCard(this.getCardFromDeck());
    }
    return true;
  }

  // TAKE a card value and a player
  // RETURN array of matching cards
  findCardInPlayer(card, opponent) {
    console.log("Fishing value " + card + " from player " + opponent.id);
    var cardsOfMatchingValue = [];
    console.log(typeof card);
    // For each card in oppenent's hand
    for (var i = 0; i < opponent.hand.length; i++) {
      // If card value matches value searched for
      console.log(typeof opponent.hand[i].value);
      if(opponent.hand[i].value === card) {
        console.log("Card found!");
        // Add index to cardsOfMatchingValue
        cardsOfMatchingValue.push(i);
      }
    }
    return cardsOfMatchingValue;
  }

  // Returns a card from the deck
  getCardFromDeck() {
    return this.playDeck.getCard();
  }

  // Checks if all cards have left deck
  // If true
  // Checks if all sets are down
  // If true
  // Player with most sets wins
  checkWinCondition () {
    var totalSets = 0;
    for (var i = 0; i < this.players.length; i++) {
      totalSets += this.players[i].getNumSets();
    }

    if(totalSets === 13) {
      return false;
    }
    return true;
    // If 13 sets played, stop
    // If deck is empty, stop
    // if(this.playDeck.deck.length < 1) {
    //   return false;
    // } else {
    //   return true;
    // }
  }

  // Takes array of cards and passes it to a player
  passCards (cards, player) {
    // TODO: Takes array of cards and passes it to a player
  }

  // Returns length of players array
  getPlayersLength() {
    return this.players.length;
  }
}

// The players
class Player {
  constructor () {
    // Player id (index 1)
    this.id = 0;
    // Array of cards in hand
    this.hand = [];
    // Is this player controlled by a human?
    this.human = false;
    // An array of the sets a player has
    this.sets = [];
    // Human controller
    this.humanController;
  }

  // Add card to hand
  addCard (card) {
    this.hand.push(card);
    this.sortHand();
    this.checkHand();
  }

  // Returns player hand
  getHand () {
    return this.hand;
  }

  setHuman () {
    this.human = true;
    this.humanController = new Human(this);
  }

  // TAKES array of index values for cards to remove
  // Removes cards from hand by interating from end to beginning
  // This avoids incorrect references after splice
  // RETURN the removed cards
  removeCards (indexArray) {
    var removedCards = [];
    for (var i = (indexArray.length - 1); i >= 0; i--) {
      console.log("Removing card at index " + indexArray[i] + " from player " + this.id);

      // Capture card in singlecard variable
      var singleCard = this.hand[indexArray[i]];

      // Delete card from array
      this.hand.splice(indexArray[i], 1);
      console.log(singleCard);

      // Push singleCard to removedCards array
      removedCards.push(singleCard);
    }
    for (var i = 0; i < removedCards.length; i++) {
      console.log("Value of removed cards: " + removedCards[i].value);
    }
    console.log(this.hand);
    console.log(removedCards);
    if(this.human) {
      this.humanController.populateCardContainer(this.getHand());
    }
    return removedCards;
  }

  // If hand empty, get card ELSE call a card
  takeTurn () {
    if(this.human) {
      // TODO: REPLACE PLACEHOLDER WITH REAL HUMAN INTERRACTION
      console.log("HUMAN TURN!");
      console.log("Player " + this.id + " taking turn");
      if(this.hand.length < 1) {
        console.log("Empty hand");
        return 0;
      } else {
        console.log(this.id + " has cards in hand");
        return 2;
      }
    } else {
      console.log("Player " + this.id + " taking turn");
      if(this.hand.length < 1) {
        console.log("Empty hand");
        return 0;
      } else {
        console.log(this.id + " has cards in hand");
        return 1;
      }
    }
  }

  // Takes: total number of players from Dealer
  // Returns:
  // A card to find
  // An integer value for the player to 'fish' from
  callCardAndPlayer (playerTot) {
    // Randomly generated values for the player and card value being fished
    do {
      var rand1 = Math.floor(Math.random() * this.hand.length);
      var rand2 = Math.floor(Math.random() * playerTot);
    } while (rand2 === this.id-1);

    return [this.hand[rand1], rand2];
  }

  // Organise hand S,H,C,D, value ascending
  sortHand () {
    this.hand.sort(function (a,b) {return a.value - b.value});
    console.log(this.getHand());
    if(this.human) {
      this.humanController.populateCardContainer(this.getHand());
    }
  }

  checkHand() {
    var currentValue = 0;
    var valueCount = 1;

    for (var i = 0; i < this.hand.length; i++) {
      if (this.hand[i].value !== currentValue) {
        currentValue = this.hand[i].value;
        valueCount = 1;
      } else {
        valueCount++;
      }

      if(valueCount === 4) {
        console.log("FOUND SET, value: " + this.hand[i].value);
        var set = this.hand[i].value;
        this.playSet(set);

        // Remove set from hand
        this.removeCards([i-3, i-2, i-1, i]);
      }
    }
  }

  playSet(set) {
    // TODO: Adds set to sets and removes from hand
    this.sets.push(set);
    console.log("P1 num sets: " + this.sets.length);
  }

  getNumSets() {
    return this.sets.length;
  }

  getSets() {
    return this.sets;
  }
}

class Human {
  constructor() {
    this.cardContainer;
  }

  setCardContainer() {
    this.cardContainer = $("#cardContainer");
  }

  populateCardContainer(hand) {
    this.clearBoard();
    var cardCount = 0;
    for (var i = 0; i < hand.length; i++) {
      cardCount++;
      this.addCardToContainer(hand[i]);
    }
    console.log("Cards to display: " + cardCount);
    // alert("Cards added. Press to continue.");
  }

  clearBoard() {
    var cardContainer = $("#cardContainer").empty();
  }

  addCardToContainer(card) {
    $("#cardContainer").append("<img class=\"card\" src=\"" + card.image + "\" value=\"" + card.value + "\" alt=\"A card\">");
  }
}
