///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

export 
class cCard
{
	constructor( /*string*/ iName )
	{
		         /*number*/ this.mId = createjs.UID.get() * 7;
		         /*string*/ this.mName = iName;
		   /*cCard.eState*/ this.mState = cCard.eState.kHidden;
		/*createjs.Bitmap*/ this.mGFace = null;
		/*createjs.Bitmap*/ this.mGBack = null;
	}
	
// public
	static 
	get eState()
	{
		return { kHidden: 'hidden', kFound: 'found', kTry: 'try' };
	}
	
// public
	/*number*/
	GetId()
	{
		return this.mId;
	}
	/*string*/
	GetName()
	{
		return this.mName;
	}

	/*cCard.eState*/
	GetState()
	{
		return this.mState;
	}
	SetState( /*cCard.eState*/ iState )
	{
		switch( iState )
		{
			case cCard.eState.kFound:
				this.mGFace.filters = [new createjs.ColorFilter( 1, 1, 1, 1, 100, 100, 100, 0 )];
				let bounds = this.mGFace.getBounds();
				this.mGFace.cache( bounds.x, bounds.y, bounds.width, bounds.height );
				break;
		}
		
		this.mState = iState;
	}

	/*createjs.Bitmap*/
	GetImage()
	{
		return ( this.mState === cCard.eState.kHidden ) ? this.mGBack : this.mGFace;
	}
	SetImage( /*createjs.Bitmap*/ iGFace, /*createjs.Bitmap*/ iGBack )
	{
		this.mGFace = iGFace;
		this.mGBack = iGBack;
		
		this.mGBack.cursor = 'pointer';
	}
}

//---

export 
class cGame
{
	constructor()
	{
		        /*cCard[]*/ this.mCards = [];
		         /*string*/ this.mSFlip = '';

		   /*cGame.eState*/ this.mState = cGame.eState.kIdle;
	}
	
// public
	static 
	get eState()
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
	/*cCard[]*/
	GetCards()
	{
		return this.mCards;
	}

	/*cGame.eState*/
	GetState()
	{
		return this.mState;
	}
	SetState( /*cGame.eState*/ iState )
	{
		this.mState = iState;
		
		if( this.mState === cGame.eState.kTry || this.mState === cGame.eState.kTest )
			/*let instance =*/ createjs.Sound.play( this.mSFlip );
	}
	
	Init( /*cAssets*/ iAssets, /*number*/ iNumber )
	{
		this.mCards = [];
		this.mSFlip = iAssets.GetSFlip();
		
		let cards = Array.from( Array( iAssets.GetGCards().length ).keys() ); // Otherwise, splice() remove entry in Assets
		let number = Math.min( iNumber, iAssets.GetGCards().length );
		let number_of_total_cards = number * 2;
		while( this.mCards.length != number_of_total_cards )
		{
			// Get a random card ( mainly if iNumber < iCardsIds.length )
			let index = Math.floor( Math.random() * cards.length ); // https://www.w3schools.com/js/js_random.asp
			index = cards.splice( index, 1 )[0];

			let card = iAssets.GetGCards()[index];
			
			let card1 = new cCard( card.id );
			card1.SetImage( card.image.clone(), iAssets.GetGBack().clone() )
			this.mCards.push( card1 );

			let card2 = new cCard( card.id );
			card2.SetImage( card.image.clone(), iAssets.GetGBack().clone() )
			this.mCards.push( card2 );
		}

		this._Shuffle();
	}
	
	/*boolean*/
	Win()
	{
		return this.mCards.every( iCard => iCard.GetState() === cCard.eState.kFound );
	}
	
	/*boolean*/
	Check()
	{
		// Every cards to test
		let cards = this.mCards.filter( iCard => iCard.GetState() === cCard.eState.kTry );
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
		let new_state = this.Check() ? cCard.eState.kFound : cCard.eState.kHidden;
		
		// Update the state of the tested cards
		this.mCards.forEach( iCard =>
		{
			if( iCard.GetState() === cCard.eState.kTry )
				iCard.SetState( new_state );
		});
	}
	
// private
	_Shuffle()
	{
		for( let i = this.mCards.length - 1; i > 0; i-- )
		{
			let j = Math.floor( Math.random() * ( i + 1 ) );
			
			let x = this.mCards[i];
			this.mCards[i] = this.mCards[j];
			this.mCards[j] = x;
		}
	}
}
