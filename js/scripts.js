function buttonPress() {
  var element = document.getElementById("sven");
  var playDeck = new Deck();
  var playManager = new Dealer(requestPlayers());

  element.innerHTML = "That";

  playDeck.initialise();
  playDeck.printDeck();
  playManager.dealHands();

  console.log(playDeck.getCard());
}

function requestPlayers() {
  do {
    var players = prompt("Choose a number of players, between 2 and 7!");
    players = parseInt(players);
    console.log("No. of players: " + players);
  } while (players === NaN || players < 2 || players > 7);
  return players;
}

// Manages cards
class Deck {
  constructor() {
    this.deck = [];
  }

  initialise() {
    const SUITS_QUANTITY = 4;
    const SUIT_SIZE = 13;

    var suits = ["S","H","C","D"];

    // Build a sorted deck in suits descending order - S,H,C,D
    for(var i = 0; i < SUITS_QUANTITY; i++) {
      for(var j = 0; j < SUIT_SIZE; j++) {

        /*
        Objects are passed by reference in JS, therefore duplicating the global variable 'card' and editing it edits ALL deriviatives of card.
        Thus creating a deck of cards that are ALL THE SAME!
        Therefore variable must be instantiated each time.
        CAN YOU TELL I SPENT A LONG TIME WORKING THIS OUT?!?
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

// Manages interractions between cards and players
class Dealer {
  constructor(players) {
    // Number of players
    this.players = players;
    // Can't play by yourself
    this.MIN_PLAYERS = 2;
    // Number of players necessary for 5 cards rather than 7 to be dealt
    this.DEAL_THRESHOLD = 4
    // Max 7 players for now (technically 10 can play)
    this.MAX_PLAYERS = 7;
  }

  dealHands () {
    if (this.players >= this.MIN_PLAYERS && this.players < this.DEAL_THRESHOLD) {
      // TODO:  Deal 7 cards to each player
      console.log("7 cards dealt to each player");
    }
    else if (this.players >= this.DEAL_THRESHOLD && this.players <= this.MAX_PLAYERS) {
      // TODO: Deal 5 cards to each player
      console.log("5 cards dealt to each player");
    }
    else {
      throw "invalidPlayerNumberException";
    }
  }

  dealCard (player) {
    // TODO: Give a single card to a single player
  }

  getHand (player) {
    // TODO: Gets the cards in a players hand
  }
}
