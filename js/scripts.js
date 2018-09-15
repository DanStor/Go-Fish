function buttonPress() {
  var element = document.getElementById("sven");
  element.innerHTML = "That";
  var playDeck = new Deck();
  playDeck.initialise();
}

class Deck {
  constructor() {
    this.card = {suit: "", value: 0}
    this.suits = ["S","H","D","C"];
    this.deck = [];
  }

  initialise() {
    const SUITS_QUANTITY = 4;
    const SUIT_SIZE = 13;

    // Build a sorted deck in suits descending order - S,H,D,C
    for(var i = 0; i < SUITS_QUANTITY; i++) {
      for(var j = 0; j < SUIT_SIZE; j++) {
        this.card.suit = this.suits[i];
        this.card.value = (j+1).toString();

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

        this.deck.push(this.card);
      }
    }
    console.log("Deck initialised");
    console.log("Deck size: " + this.deck.length);
  }

  // Could randomly grab a single card from the deck rather than suffle
  // BUT a shuffled deck allows for reusable code in other card games
  shuffleDeck() {
    // TODO: Shuffle the deck
  }

  getCard() {
    // TODO: Give a single card to a designated player
  }

  //
  deleteFromDeck(c) {
    // TODO: Remove card from list of available cards
  }

  // 'dealHands' will now be dealt with by 'Dealer' class
  // dealHands(players) {
  //   // TODO: Deal out necessary number of cards to players (7 for 2/3 players, 5 for 4/5 players)
  // }
}
