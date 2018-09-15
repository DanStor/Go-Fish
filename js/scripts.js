function buttonPress() {
  var element = document.getElementById("sven");
  element.innerHTML = "That";
  initialiseDeck();
}

var card = {suit: "", value: 0}
var suits = ["S","H","D","C"];
var deck = [];

function initialiseDeck() {
  const SUITS_QUANTITY = 4;
  const SUIT_SIZE = 13;

  // Build a sorted deck in suits descending order - S,H,D,C
  for(var i = 0; i < SUITSQUANTITY; i++) {
    for(var j = 0; j < SUIT_SIZE; j++) {
      card.suit = suits[i];
      card.value = (j+1).toString();

      //   // SWITCH STATEMENT THAT NEVER PRODUCES A KING...
      //   // switch (j) {
      //   //   case 10:
      //   //     card.value = "J";
      //   //     break;
      //   //   case 11:
      //   //     card.value = "Q";
      //   //     console.log(j);
      //   //     break;
      //   //   case 12:
      //   //     card.vaue = "K";
      //   //     break;
      //   //   default:
      //   //     throw "invalidCardError";
      //   // }
      //
      //   if(j === 10) {
      //     card.value = "J";
      //   }
      //   else if(j === 11) {
      //     card.value = "Q";
      //   }
      //   else if(j === 12) {
      //     card.value = "K";
      //   }
      //   else {
      //     throw "invalidCardError";
      //   }

      console.log("Card: " + card.suit + card.value);
      deck.push(card);
    }
    console.log("Suit End");
  }
  console.log("Deck size: " + deck.length);
  console.log("Deck initialised");
}

// Could randomly grab a single card from the deck rather than suffle
// BUT a shuffled deck allows for reusable code in other card games
function shuffleDeck() {
  // TODO: Shuffle the deck
}

function dealCard(player) {
  // TODO: Give a single card to a designated player
}

//
function deleteFromDeck(c) {
  // TODO: Remove card from list of available cards
}

function dealHands(players) {
  // TODO: Deal out necessary number of cards to players (7 for 2/3 players, 5 for 4/5 players)
}
