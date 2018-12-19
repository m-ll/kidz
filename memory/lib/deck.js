///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

this.kidz = this.kidz || {};

(function()
{
"use strict";

class cCard
{
	constructor( iName )
	{
		this.mId = createjs.UID.get() * 7;
		this.mName = iName;
		this.mState = cCard.eState.kHidden;
		this.mGFace = null;
		this.mGBack = null;
	}
	
// public
	static get eState()
	{
		return { kHidden: 'hidden', kFound: 'found', kTry: 'try' };
	}
	
// public
	GetId()
	{
		return this.mId;
	}
	GetName()
	{
		return this.mName;
	}

	GetState()
	{
		return this.mState;
	}
	SetState( iState )
	{
		switch( iState )
		{
			case cCard.eState.kFound:
				this.mGFace.filters = [new createjs.ColorFilter( 1, 1, 1, 1, 100, 100, 100, 0 )];
				var bounds = this.mGFace.getBounds();
				this.mGFace.cache( bounds.x, bounds.y, bounds.width, bounds.height );
				break;
		}
		
		this.mState = iState;
	}

	GetImage()
	{
		return ( this.mState === cCard.eState.kHidden ) ? this.mGBack : this.mGFace;
	}
	SetImage( iGFace, iGBack )
	{
		this.mGFace = iGFace;
		this.mGBack = iGBack;
		
		this.mGBack.cursor = 'pointer';
	}
}

// module
kidz.cCard = cCard;
}());

//---

this.kidz = this.kidz || {};

(function()
{
"use strict";

class cDeck
{
	constructor()
	{
		this.mCards = [];
		this.mGBack = null;

		this.mState = cDeck.eState.kIdle;
	}
	
// public
	static get eState()
	{
		return {
				kIdle: 'idle',
				kTry: 'try',
				kTest: 'test',
				kBeginWait: 'begin-wait',
				kEndWait: 'end-wait',
				kWin: 'win'
				};
	}

// public
	GetCards()
	{
		return this.mCards;
	}

	GetState()
	{
		return this.mState;
	}
	SetState( iState )
	{
		this.mState = iState;
	}
	
	Init( iAssets, iNumber )
	{
		var cards = Array.from( Array( iAssets.GetGCards().length ).keys() );
		// var cards = iAssets.GetGCards();
		var number = Math.min( iNumber, iAssets.GetGCards().length );
		var number_of_total_cards = number * 2;
		while( this.mCards.length != number_of_total_cards )
		{
			// Get a random card ( mainly if iNumber < iCardsIds.length )
			var index = Math.floor( Math.random() * cards.length ); // https://www.w3schools.com/js/js_random.asp
			index = cards.splice( index, 1 )[0];

			var card = iAssets.GetGCards()[index];
			
			var card1 = new kidz.cCard( card['id'] );
			card1.SetImage( card['image'].clone(), iAssets.GetGBack().clone() )
			this.mCards.push( card1 );

			var card2 = new kidz.cCard( card['id'] );
			card2.SetImage( card['image'].clone(), iAssets.GetGBack().clone() )
			this.mCards.push( card2 );
		}

		this._Shuffle();
	}
	
	Win()
	{
		return this.mCards.every( iCard => iCard.GetState() === kidz.cCard.eState.kFound );
	}
	
	Check()
	{
		// Every cards to test
		var cards = this.mCards.filter( iCard => iCard.GetState() === kidz.cCard.eState.kTry );
		if( cards.length !== 2 )
			return false;
		
		// New state of the tested cards
		// Ok: every tested cards have the same name
		// Bad: at least one tested card have not the same name
		if( cards.every( iCard => iCard.GetName() === cards[0].GetName() ) )
			return true
		
		return false;
	}
	
	Process()
	{
		var new_state = this.Check() ? kidz.cCard.eState.kFound : kidz.cCard.eState.kHidden;
		
		// Update the state of the tested cards
		this.mCards.forEach( iCard =>
		{
			if( iCard.GetState() === kidz.cCard.eState.kTry )
				iCard.SetState( new_state );
		});
	}
	
// private
	_Shuffle()
	{
		for( var i = this.mCards.length - 1; i > 0; i-- )
		{
			var j = Math.floor( Math.random() * ( i + 1 ) );
			
			var x = this.mCards[i];
			this.mCards[i] = this.mCards[j];
			this.mCards[j] = x;
		}
	}
}

// module
kidz.cDeck = cDeck;
}());
