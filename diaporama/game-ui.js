///
/// Copyright (c) 2018-19 m-ll. All Rights Reserved.
///
/// Licensed under the MIT License.
/// See LICENSE file in the project root for full license information.
///
/// 2b13c8312f53d4b9202b6c8c0f0e790d10044f9a00d8bab3edf3cd287457c979
/// 29c355784a3921aa290371da87bce9c1617b8584ca6ac6fb17fb37ba4a07d191
///

import { cUI } from '../core/ui.js';
import { cGame } from './game.js';

export 
class cGameUI extends cUI
{
	constructor( /*cGame*/ iGame, /*createjs.Stage*/ iStage, /*cAssets*/ iAssets, /*function*/ iNextCB, /*object*/ iNextCBData )
	{
		super( iStage, iAssets, iNextCB, iNextCBData );

		        /*cGame*/ this.mGame = iGame;
		/*createjs.Text*/ this.mGContinue = null;
		
			   /*object*/ this.mListener = null;
	}
	
// public
	Init()
	{
		super.Init();

		document.onkeydown = this._KeyHit.bind( this );
	}
	
	Build()
	{
		super.Build();

		this.Stage().addChild( this.mGame.GetBackground() );
		this.Stage().addChild( this.mGame.GetCurrentSprite() );
		
		this.mGContinue = new createjs.Text( 'Press a key to continue...', 'bold 20px Arial', '#000000' );
		this.mGContinue.textAlign = 'center';
		this.mGContinue.textBaseline = 'middle';
		this.mGContinue.x = this.Stage().canvas.width / 2;
		this.mGContinue.y = this.Stage().canvas.height / 2;
		this.Stage().addChild( this.mGContinue );
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
		// It's commented to keep all stuff displayed during the win screen
		// this.Stage().removeAllChildren();

		createjs.Ticker.off( 'tick', this.mListener );
		
		super._Stop();
	}
	
	_KeyHit( /*object*/ iEvent )
	{
		let event = iEvent;
		if( !event )
			event = window.event;
			
		// switch( event.keyCode ) {}

		if( this.mGame.GetState() === cGame.eState.kIdle )
			this.mGame.SetState( cGame.eState.kStartAnimation );
	}
	
	//---
	
	_StartAnimation()
	{
		this.Stage().removeChild( this.mGContinue );

		this.mGame.StartAnimation();
		
		this.Stage().addChild( this.mGame.GetCurrentSprite() );
	}

	_StopAnimation()
	{
		this.Stage().removeChild( this.mGame.GetCurrentSprite() );
		
		if( this.mGame.StopAnimation() )
		{
			this._Stop();
			return;
		}

		this.Stage().addChild( this.mGContinue );
	}

	_Tick( /*createjs.Event*/ iEvent, /*object*/ iData )
	{
		let that = iData.that;

		switch( that.mGame.GetState() )
		{
			case cGame.eState.kIdle:
				break;
			case cGame.eState.kStartAnimation:
				that._StartAnimation();
				that.mGame.SetState( cGame.eState.kAnimation );
				break;
			case cGame.eState.kAnimation:
				break;
			case cGame.eState.kStopAnimation:
				that._StopAnimation();
				that.mGame.SetState( cGame.eState.kIdle );
				break;
		}
		
		that.Stage().update( iEvent );
	}
}
