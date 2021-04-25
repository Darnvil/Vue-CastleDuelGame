
new Vue(
{
	name: 'game',
	el: '#app',
	data: state,
	template: `<div id="app" :class="cssClass">
	 	<top-bar :turn="turn" :current-player-index="currentPlayerIndex" :players="players" />
	 	
	 	<div class="world">
	 		<div class="clouds">
	 			<cloud v-for="index in 10" :type="(index - 1) % 5 + 1" />
			</div>
	 		<castle v-for="(player, index) in players" :player="player" :index="index" />
	 		<div class="land"></div>
		</div>
	 	
	 	<transition name="hand" >	 		
	 		<hand v-if="!activeOverlay" :cards="currentHand" @card-play="handlePlayCard" @card-leave-end="handleCardLeaveEnd" />
		</transition>
		
		<transition name="fade">
			<div class="overlay-background" v-if="activeOverlay"></div>	
		</transition>
		
		<transition name="zoom">
			<overlay v-if="activeOverlay" :key="activeOverlay" @close="handleOverlayClose">
				<component :is="'overlay-content-' + activeOverlay"  :player="currentPlayer" :opponent="currentOpponent" :players="players" />
			</overlay>
		</transition>
		
	</div>`,

	methods: {
		testDrawCard()
		{
			const ids = Object.keys(cards);
			const randomId = ids[Math.floor(Math.random() * ids.length)];

			return {
				uid: cardUid++,
				id: randomId,
				def: cards[randomId]
			};
		},
		handlePlayCard(card)
		{
			playCard(card);
		},
		handleCardLeaveEnd()
		{
			applyCard();
		},
		handleOverlayClose()
		{
			closeOverlayHandlers[this.activeOverlay]();
		}
	},

	computed:
	{
		cssClass()
		{
			return {
				'css-class': this.canPlay
			}
		}
	},

	mounted()
	{
		beginGame();
	}
});

var closeOverlayHandlers =
{
	'player-turn'()
	{
		if (state.turn > 1)
		{
			state.activeOverlay = 'last-play';
		}
		else
		{
			newTurn();
		}
	},
	'last-play'()
	{
		newTurn();
	},
	'game-over'()
	{
		document.location.reload();
	}
};

window.addEventListener('resize', () =>
{
	state.worldRatio = getWorldRatio();
});


// TWEEN.js

requestAnimationFrame(animate);

function animate(time)
{
	requestAnimationFrame(animate);
	TWEEN.update(time);
}

// gameplay

state.activeOverlay = 'player-turn';

function beginGame()
{
	state.players.forEach(drawInitialHand);
}

function playCard(card)
{
	if(state.canPlay)
	{
		state.canPlay = false;
		currentPlayingCard = card;

		const index = state.currentPlayer.hand.indexOf(card);
		state.currentPlayer.hand.splice(index, 1);

		addCardToPile(state.discardPile, card.id);
	}
}

function applyCard()
{
	const card = currentPlayingCard;
	applyCardEffect(card);

	setTimeout(() =>
	{
		this.state.players.forEach(checkPlayerLost);

		if(isOnePlayerDead())
		{
			endGame();
		}
		else
		{
			nextTurn();
		}
	}, 700)
}

function endGame()
{
	state.activeOverlay = 'game-over';
}

function nextTurn()
{
	state.turn++;
	state.currentPlayerIndex = state.currentOpponentId;
	state.activeOverlay = 'player-turn';
}

function skipTurn()
{
	state.currentPlayer.skipTurn = false;
	state.currentPlayer.skippedTurn = true;
	nextTurn();
}

function startTurn()
{
	state.currentPlayer.skippedTurn = false;
	if(state.turn > 2)
	{
		setTimeout(() =>
		{
			state.currentPlayer.hand.push(drawCard());

		}, 800);
	}
	state.canPlay = true;
}

function newTurn()
{
	state.activeOverlay = null;
	if(state.currentPlayer.skipTurn)
	{
		skipTurn();
	}
	else
	{
		startTurn();
	}
}


