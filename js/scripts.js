function buttonPress() {
  var element = document.getElementById("sven");
  // var playDeck = new Deck();
  var dealer = new Dealer(requestPlayers());

  element.innerHTML = "That";
}

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
    console.log("Hands dealt, ready to play.");
  }

  createPlayers () {
    // TODO: Create player class for each player
    for (var i = 0; i < this.playerCount; i++) {
      var newPlayer = new Player();
      this.players.push(newPlayer);
    }
    console.log(this.players);
  }

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

  getCardFromDeck() {
    return this.playDeck.getCard();
  }

  dealCard (player) {
    // TODO: Give a single card to a single player
    player.addCard(this.getCardFromDeck());
  }

  checkHand (player) {
    // TODO: Gets the cards in a players hand and checks to see if it matches the called card
  }

  calledCard (player) {
    // TODO: The card a player is 'fishing' for
  }
}

class Player {
  constructor () {
    this.hand = [];
  }

  addCard (card) {
    // TODO: Receive card from Dealer
    this.hand.push(card);
  }

  getHand () {
    // TODO: Send hand to dealer
    return this.hand;
  }

  sortHand () {
    // TODO: Organise hand S,H,C,D, value ascending
  }

  takeTurn () {
    // TODO: If hand empty, get card ELSE call a card
  }
}
