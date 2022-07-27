// index.js

const { State, StateMachine } = require('@edium/fsm');

const players = ['a','b','c','d','e','f']

const context = {
  currentPlayerPosition: 0,
  players: players,
  playerState: {},
  turnsPlayed: 0,
  turnsLimit: 6,
  randomize: randomize
};

const randomize = (options) => {
  return Math.floor( Math.random() * options );
}
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const createDeck = (templates, manifest) => {
  let deck = []

  for (const [key, value] of Object.entries(manifest)) {
    for (let count = value; count > 0; count--) {
      deck.push(templates[key]);
    }
  }
  shuffle(deck)

  return deck
}

const drawCards = (deck, cardsDrawn) => {
  return deck.splice(0, cardsDrawn)
}

const setupGameObjects = async (context) => {
  const deckConfig = await import('./encounter-deck.json', {
    assert: { type: "json" }
  })
  const cosmicDeck = createDeck(deckConfig.default.templates, deckConfig.default.manifest)

  context.cosmicDeck = encounterDeck
}

const setupPlayers = async (context) => {
  context.players.forEach( (player) => {
    let cosmicCardsDealt = drawCards(context.encounterDeck, 7)
    let playerState = {
      name: player,
      cosmicCardsInHand: cosmicCardsDealt,
      cards: {
        encounter: [],
        reinforcement: [],
        artifact: [],
        flare: []
      }
    }
    context.playerState[player] = playerState
  })
}

const entryAction = ( state, context ) => {
  console.log(`enter ${state._name}`)
  state.trigger( "next" );
};

const startGameAction = async ( state, context ) => {
  console.log("start game")

  await setupGameObjects(context)

  await setupPlayers(context)

  // choose first player
  context.currentPlayerPosition = randomize(context.players.length)
  context.currentPlayer = context.players[context.currentPlayerPosition]
  state.trigger( "next" );
}

const nextTurnAction = ( state, context ) => {
  context.currentPlayerPosition++;
  context.turnsPlayed++;

  if (context.currentPlayerPosition == context.players.length) {
    context.currentPlayerPosition = 0;
  }
  
  // end game after turn limit reached
  if (context.turnsPlayed == context.turnsLimit) {
    state.trigger( "endgame" );
  } else {
    context.currentPlayer = context.players[context.currentPlayerPosition]
    state.trigger( "next" );
  } 
}

const startTurnAction = ( state, context ) => {
  console.log(`current player ${context.currentPlayer}`)
  state.trigger( "next" );
}

const exitAction = ( state, context ) => {
  // Returning false will cancel the state transition
  return true;
};

const decideAction = ( state, context ) => {
  const index = context.randomize(2);
  if ( index === 0 ) {
      state.trigger( "gotoThree" );
  } else if ( index === 1 ) {
      state.trigger( "gotoFour" );
  }
};

const finalAction = ( state ) => {
  // Can perform some final actions, the state machine is finished running.
  console.log("finished")
};



const stateMachine = new StateMachine('CosmicEncounter', context);
const startGamePhase = stateMachine.createState( "startGame", false, startGameAction);
const startTurnPhase = stateMachine.createState( "startTurn", false, startTurnAction);
const regroupPhase = stateMachine.createState( "regroup", false, entryAction);
const destinyPhase = stateMachine.createState( "destiny", false, entryAction);
const launchPhase = stateMachine.createState( "launch", false, entryAction);
const alliancePhase = stateMachine.createState( "alliance", false, entryAction);
const planningPhase = stateMachine.createState( "planning", false, entryAction);
const revealPhase = stateMachine.createState( "reveal", false, entryAction);
const resolutionPhase = stateMachine.createState( "resolution", false, entryAction);
const nextTurnPhase = stateMachine.createState( "nextTurn", false, nextTurnAction);

// Notice true indicates completed state.
const endGamePhase = stateMachine.createState( "endgame", true, finalAction); 

// Define all state transitions
startGamePhase.addTransition( "next", startTurnPhase );

startTurnPhase.addTransition( "next", regroupPhase );
regroupPhase.addTransition( "next", destinyPhase );
destinyPhase.addTransition( "next", launchPhase );
launchPhase.addTransition( "next", alliancePhase );
alliancePhase.addTransition( "next", planningPhase );
planningPhase.addTransition( "next", revealPhase );
revealPhase.addTransition( "next", resolutionPhase );
resolutionPhase.addTransition( "next", nextTurnPhase );

nextTurnPhase.addTransition( "next", startTurnPhase );
nextTurnPhase.addTransition( "endgame", endGamePhase );

// Start the state machine
stateMachine.start( startGamePhase );