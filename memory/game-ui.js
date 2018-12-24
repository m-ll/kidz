///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cGame, cCard } from './game.js';
import { cUI } from '../core/ui.js';

export 
class cGameUI extends cUI
{
	constructor( /*cGame*/ iGame, /*createjs.Stage*/ iStage, /*cAssets*/ iAssets, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		super( iStage, iAssets, iNextCB, iNextCBData );

		 /*cGame*/ this.mGame = iGame;

		/*number*/ this.mStartWait = 0;
		/*object*/ this.mListener = null;
	}
	
// public
	Init()
	{
		super.Init();
	}
	
	Build()
	{
		super.Build();

		this.mGame.GetCards().forEach( iCard => 
		{
			iCard.GetImage().on( 'click', this._CardClicked, null, false, { that: this, card: iCard } );
		});

		this._Refresh();
	}
	
	Start()
	{
		super.Start();

		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		this.mListener = createjs.Ticker.on( 'tick', this._Tick, null, false, { that: this } );
	}
	
// private
	_Stop()
	{
		// It's commented to keep all cards displayed during the win screen
		// this.Stage().removeAllChildren();

		createjs.Ticker.off( 'tick', this.mListener );
		
		super._Stop();
	}
	
	_Refresh()
	{
		this.Stage().removeAllChildren();

		this._PlaceCards();

		this.mGame.GetCards().forEach( iCard => this.Stage().addChild( iCard.GetImage() ) );
	}
	
	_PlaceCards()
	{
		let cards = this.mGame.GetCards();
		let img0 = cards[0].GetImage();
		let card_number_per_line = cards.length / 2;
		let cards_width_per_line = img0.getBounds().width * card_number_per_line;
		let cards_spaces_width_per_line = cards_width_per_line + ( card_number_per_line - 1 ) * 20;

		let start_x = this.Stage().canvas.width / 2 - cards_spaces_width_per_line / 2;
		let x = start_x;

		let half_height = this.Stage().canvas.height / 2;
		let y1 = half_height / 2 - img0.getBounds().height / 2;
		let y2 = half_height + y1;

		cards.forEach( ( iCard, iIndex ) => 
		{
			if( !( iIndex % card_number_per_line ) )
				x = start_x;
			
			let img = iCard.GetImage();
			
			img.x = x;
			img.y = ( iIndex < card_number_per_line ) ? y1 : y2;

			x += img.getBounds().width + 20;
		});
	}

	//---
	
	_CardClicked( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;
		let card = iData.card;

		switch( that.mGame.GetState() )
		{
			case cGame.eState.kIdle:
				if( card.GetState() !== cCard.eState.kHidden )
					break;

				card.SetState( cCard.eState.kTry );
				that.mGame.SetState( cGame.eState.kTry );
				that._Refresh();
				break;
			case cGame.eState.kTry:
				if( card.GetState() !== cCard.eState.kHidden )
					break;
					
				that.mStartWait = Date.now();

				card.SetState( cCard.eState.kTry );
				that.mGame.SetState( cGame.eState.kTest );
				that._Refresh();
				break;
			// case cGame.eState.kTest:
			// 	break;
			// To not wait between begin/end wait
			// case cGame.eState.kBeginWait:
				// that.mGame.Process();
				// that.mGame.SetState( cGame.eState.kIdle );
				// that._CardClicked( iEvent, iData );
				// break;
			// case cGame.eState.kEndWait:
			// 	break;
		}
	}
	
	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;

		switch( that.mGame.GetState() )
		{
			case cGame.eState.kIdle:
				if( that.mGame.Win() )
				{
					iEvent.remove();
					that._Stop();
				}
				break;
			case cGame.eState.kTest:
				if( that.mGame.Check() )
				{
					that.mGame.Process();
					that.mGame.SetState( cGame.eState.kIdle );
					that._Refresh();
				}
				else
				{
					that.mGame.SetState( cGame.eState.kBeginWait );
				}
				break;
			case cGame.eState.kBeginWait:
				let delta = Date.now() - that.mStartWait;
				if( delta < 1 * 1000 )
					break;

				that.mGame.SetState( cGame.eState.kEndWait );
				that._Refresh();
				break;
			case cGame.eState.kEndWait:
				that.mGame.Process();
				that.mGame.SetState( cGame.eState.kIdle );
				that._Refresh();
				break;
		}
		
		that.Stage().update( iEvent );
	}
}
