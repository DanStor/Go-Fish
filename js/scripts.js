function buttonPress() {
  var element = document.getElementById("sven");
  // var playDeck = new Deck();
  var dealer = new Dealer(requestPlayers());
  alert("Hands dealt, ready to play.\n Click to begin.");
  dealer.playGame();
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
        //   OTHER FAILURE
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

  // Gameplay cycle runs here after setup
  playGame() {
    do {
      // For each player:
      for (var i = 0; i < this.players.length; i++) {
        console.log("DECK SIZE AT TURN START: " + this.playDeck.deck.length);
        var playerTakingTurn = this.players[i];

        // If the player has no cards, draw a card
        if(!playerTakingTurn.takeTurn()) {
          // If player cannot draw a card because deck is empty
          if(!this.dealCard(playerTakingTurn)) {
            // Skip player, there is nothing else they can do
            console.log("DECK EMPTY");
            continue;
          }
        // Else pick a card and player to fish
        } else {
          // An array containing:
          // [0] = direct reference to a card
          // [1] = index of a player
          var cardAndPlayerInt = playerTakingTurn.callCardAndPlayer(this.players.length);

          // Direct reference to a card
          var cardToFind = cardAndPlayerInt[0];

          // Direct reference to a player (from index)
          var playerToFish = this.players[cardAndPlayerInt[1]];

          console.log("Fishing from:");
          console.log(playerToFish);

          // Array of index values point to search matches
          var matchingValueIndicies = this.findCardInPlayer(cardToFind, playerToFish);

          console.log(matchingValueIndicies);
          console.log("Length of values array: " + matchingValueIndicies.length);

          // If no matches
          if(matchingValueIndicies.length < 1) {
            console.log("GO FISH!");
            // If player cannot draw a card because deck is empty
            if(!this.dealCard(playerTakingTurn)) {
              // Skip player, there is nothing else they can do
              console.log("DECK EMPTY");
            }
            continue;
          }

          // Cards to pass to fishing player
          var cardsToPass = playerToFish.removeCards(matchingValueIndicies);
          for (var j = 0; j < cardsToPass.length; j++) {
            playerTakingTurn.addCard(cardsToPass[j]);
          }

          console.log(playerTakingTurn.getHand());

          // For each matching card value
          // for (var j = 0; j < matchingValueIndicies.length; j++) {
          //   // console.log(matchingValueIndicies[i]);
          //   // Pass the removed card to the calling player
          //   var removedCard = playerToFish.removeCard(matchingValueIndicies[j]);
          //   console.log("Removed card value: " + removedCard.value);
          // }
        }
      }

      for (var i = 0; i < this.players.length; i++) {
        console.log("Player " + this.players[i].id + " hand: ");
        console.log(this.players[i].hand);
      }
      console.log(this.playDeck);
    } while (this.checkWinCondition());

    console.log("GAME OVER!");
    var winnersArray = [];
    var winValue = 0;
    for (var i = 0; i < this.players.length; i++) {
      if(this.players[i].getNumSets() > winValue) {
        winValue = this.players[i].getNumSets();
        winnersArray = [];
        winnersArray.push(i);
      }
      else if (this.players[i].getNumSets() === winValue) {
        winnersArray.push(i);
      }

      console.log("Player " + this.players[i].id + " has " + this.players[i].getNumSets() + " sets.");
    }

    for (var i = 0; i < winnersArray.length; i++) {
      console.log("PLAYER " + this.players[winnersArray[i]].id + " WINS!");
    }

  }

  // TAKE a player's hand and searches for a specific card value.
  // RETURN array of matching cards
  findCardInPlayer(card, opponent) {
    console.log("Fishing value " + card.value + " from player " + opponent.id);
    var cardsOfMatchingValue = [];

    // For each card in oppenent's hand
    for (var i = 0; i < opponent.hand.length; i++) {
      // If card value matches value searched for
      if(opponent.hand[i].value === card.value) {
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
  }

  // Add card to hand
  addCard (card) {
    this.hand.push(card);
    this.sortHand();
  }

  // Returns player hand
  getHand () {
    return this.hand;
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
    return removedCards;
  }

  // If hand empty, get card ELSE call a card
  takeTurn () {
    // TODO: If hand empty, get card ELSE call a card
    console.log("Player " + this.id + " taking turn");
    if(this.hand.length < 1) {
      console.log("Empty hand");
      return false;
    } else {
      console.log(this.id + " has cards in hand");
      return true;
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
    this.checkHand();
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
