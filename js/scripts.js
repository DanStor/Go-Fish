function buttonPress() {
  var element = document.getElementById("sven");
  var playDeck = new Deck();
  element.innerHTML = "That";

  playDeck.initialise();
  playDeck.printDeck();

  console.log(playDeck.getCard());
}

class Deck {
  constructor() {
    this.deck = [];
  }

  initialise() {
    const SUITS_QUANTITY = 4;
    const SUIT_SIZE = 13;

    var suits = ["S","H","C","D"];
    console.log(this.deck + " Length: " + this.deck.length);

    // Build a sorted deck in suits descending order - S,H,C,D
    for(var i = 0; i < SUITS_QUANTITY; i++) {
      for(var j = 0; j < SUIT_SIZE; j++) {

        /*
        Objects are passed by reference in JS, therefore editing a global variable 'card' edits ALL deriviatives of card.
        Thus creating a deck of cards that are ALL THE SAME!
        Therefore variable must be instantiated each time.
        */

        var card = {suit: "", value : 0};
        card.suit = suits[i];
        card.value = (j+1);

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

        console.log(this.deck.push(card));
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
      console.log("Deck size: " + this.deck.length);
  }

  getCard() {
    return this.deck.pop();
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
