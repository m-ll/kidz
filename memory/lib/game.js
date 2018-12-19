///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

this.kidz = this.kidz||{};

(function() {
	"use strict";

// constructor
	function cGame( iStage, iAssets, iNextCB, iNextCBData )
	{
		this.mStage = iStage;
		this.mAssets = iAssets;
		this.mNextCB = iNextCB;
		this.mNextCBData = iNextCBData;

		this.mDeck = null;

		this.mStartWait = 0;
		this.mListener = null;
	}
	
	var p = cGame.prototype;
	
// public
	p.Init = function()
	{
	};
	
	p.Build = function( iNumberOfCards )
	{
		this.mDeck = new kidz.cDeck();
		this.mDeck.Init( this.mAssets, iNumberOfCards );

		this.mDeck.GetCards().forEach( iCard => 
		{
			iCard.GetImage().on( 'click', this._CardClicked, null, false, [this, iCard] );
		});

		this._Refresh();
	};
	
	p.Start = function()
	{
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, null, false, this );
	};
	
// private
	p._Stop = function()
	{
		// It's commented to keep all cards displayed during the win screen
		// this.mStage.removeAllChildren();

		createjs.Ticker.off( 'tick', this.mListener );
		this.mNextCB.call( this.mNextCBData );
	};
	
	p._Refresh = function()
	{
		this.mStage.removeAllChildren();

		this._PlaceCards();

		var cards = this.mDeck.GetCards();
		cards.forEach( iCard => this.mStage.addChild( iCard.GetImage() ) );
	};
	
	p._PlaceCards = function()
	{
		var cards = this.mDeck.GetCards();
		var img0 = cards[0].GetImage();
		var card_number_per_line = cards.length / 2;
		var cards_width_per_line = img0.getBounds().width * card_number_per_line;
		var cards_spaces_width_per_line = cards_width_per_line + ( card_number_per_line - 1 ) * 20;

		var start_x = this.mStage.canvas.width / 2 - cards_spaces_width_per_line / 2;
		var x = start_x;

		var half_height = this.mStage.canvas.height / 2;
		var y1 = half_height / 2 - img0.getBounds().height / 2;
		var y2 = half_height + y1;

		cards.forEach( ( iCard, iIndex ) => 
		{
			if( !( iIndex % card_number_per_line ) )
				x = start_x;
			
			var img = iCard.GetImage();
			
			img.x = x;
			img.y = ( iIndex < card_number_per_line ) ? y1 : y2;

			x += img.getBounds().width + 20;
		});
	};

	//---
	
	p._CardClicked = function( iEvent, iData )
	{
		var that = iData[0];
		var card = iData[1];

		switch( that.mDeck.GetState() )
		{
			case kidz.cDeck.eState.kIdle:
				if( card.GetState() !== kidz.cCard.eState.kHidden )
					break;

				card.SetState( kidz.cCard.eState.kTry );
				that.mDeck.SetState( kidz.cDeck.eState.kTry );
				that._Refresh();
				break;
			case kidz.cDeck.eState.kTry:
				if( card.GetState() !== kidz.cCard.eState.kHidden )
					break;
					
				that.mStartWait = Date.now();

				card.SetState( kidz.cCard.eState.kTry );
				that.mDeck.SetState( kidz.cDeck.eState.kTest );
				that._Refresh();
				break;
			// case kidz.cDeck.eState.kTest:
			// 	break;
			// To not wait between begin/end wait
			// case kidz.cDeck.eState.kBeginWait:
				// that.mDeck.Process();
				// that.mDeck.SetState( kidz.cDeck.eState.kIdle );
				// that._CardClicked( iEvent, iData );
				// break;
			// case kidz.cDeck.eState.kEndWait:
			// 	break;
		}
	};
	
	p._Tick = function( iEvent, iData )
	{
		var that = iData;

		switch( that.mDeck.GetState() )
		{
			case kidz.cDeck.eState.kIdle:
				if( that.mDeck.Win() )
				{
					iEvent.remove();
					that._Stop();
				}
				break;
			case kidz.cDeck.eState.kTest:
				if( that.mDeck.Check() )
				{
					that.mDeck.Process();
					that.mDeck.SetState( kidz.cDeck.eState.kIdle );
					that._Refresh();
				}
				else
				{
					that.mDeck.SetState( kidz.cDeck.eState.kBeginWait );
				}
				break;
			case kidz.cDeck.eState.kBeginWait:
				var delta = Date.now() - that.mStartWait;
				if( delta < 1 * 1000 )
					break;

				that.mDeck.SetState( kidz.cDeck.eState.kEndWait );
				that._Refresh();
				break;
			case kidz.cDeck.eState.kEndWait:
				that.mDeck.Process();
				that.mDeck.SetState( kidz.cDeck.eState.kIdle );
				that._Refresh();
				break;
		}
		
		that.mStage.update( iEvent );
	};
	
// 
	kidz.cGame = cGame;
}());
