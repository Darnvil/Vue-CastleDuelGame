// Some usefull variables
var maxHealth = 10
var maxFood = 10
var handSize = 5
var cardUid = 0
var currentPlayingCard = null

// The consolidated state of our app
var state = {
  // World
  worldRatio: getWorldRatio(),
  turn: 1,
  players:
  [
    {
      name: 'Anne of Cleves',
      health: 10,
      food: 10,
      skipTurn: false,
      skippedTurn: false,
      hand: [],
      lastPlayedCardId: null,
      dead: false
    },
    {
      name: 'William the Bald',
      health: 10,
      food: 10,
      skipTurn: false,
      skippedTurn: false,
      hand: [],
      lastPlayedCardId: null,
      dead: false
    }
  ],
  currentPlayerIndex: Math.round(Math.random()),
  drawPile: pile,
  discardPile: {},
  testHand: [],
  canPlay: false,
  //UI
  activeOverlay: null,


  get currentPlayer()
  {
    return this.players[this.currentPlayerIndex];
  },
  get currentOpponentId()
  {
    return this.currentPlayerIndex === 0 ? 1 : 0;
  },
  get currentOpponent()
  {
    return this.players[this.currentOpponentId]
  },
  get currentHand()
  {
    return this.currentPlayer.hand;
  }

}
